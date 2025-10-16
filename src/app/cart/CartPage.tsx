"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetProductsByIdsQuery } from "@/redux/features/products/GetProductByIds";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { modifiedCart } from "@/redux/features/cart/TrackCartItem";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import React from "react";

// Assicurati che il percorso sia corretto. Ho usato 'ProductReviewGrid' come nome più probabile
// dato il contesto dei problemi precedenti. Se usi il carosello, assicurati che la prop sia solo la stringa!
import ReviewCarousel from "@/components/share/review-carousel/ReviewCarousel";
import Accordion from "@/components/accordion/Accordion";

// IMPORTAZIONI DELLE ICONE
import { ShieldCheck, Truck, RefreshCw, Plus, Minus } from "lucide-react";

// Assumiamo che la struttura del prodotto sia la seguente
interface IProduct {
  _id: string;
  admin: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  offer_price: number;
  brand: string;
  model: string;
  condition: string;
  controller: string;
  memory: string;
  quantity: number;
  isVariant: boolean;
  product_type: string;
  slug: string;
  __v: number;
  technical_specs?: { label: string; value: string }[];
}

export default function CartPage() {
  // Ripristinato l'uso della variabile d'ambiente per l'URL API
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.consolelocker.it";
  const dispatch = useDispatch();
  const router = useRouter();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const getProductIds = () => {
    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const productIds: string[] = cart?.map(
      (item: { productId: string; tradeIn: any }) => item.productId
    );
    return productIds.join(",");
  };

  const {
    data: products,
    isLoading,
    refetch,
  } = useGetProductsByIdsQuery(getProductIds());

  // DATI DINAMICI DERIVATI DAL CARRELLO
  const product = { product: products?.data?.products?.[0] };
  // const productType = product.product?.product_type?.toLowerCase() || "default"; // Lascio commentato se non usato

  // ************************************************************
  // FUNZIONI DI CARRELLO COMPLETE
  // ************************************************************

  const getProductQuantity = (id: string) => {
    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const product = cart.find(
      (item: { productId: string }) => item.productId === id
    );

    return product ? product.quantity : 0;
  };

  const removeItem = (id: string) => {
    refetch();
    dispatch(modifiedCart({}));

    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const updatedCart = cart.filter(
      (item: { productId: string }) => item.productId !== id
    );

    localStorage?.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = products?.data?.products.reduce(
    (total: number, product: IProduct) => {
      const quantity = getProductQuantity(product?._id);

      // Usiamo il prezzo in offerta se esiste
      const price =
        product.offer_price > 0 ? product.offer_price : product.price;

      return total + quantity * price;
    },
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  const getTradeInDetails = () => {
    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const tradeInItem = cart.find(
      (item: any) => item.tradeIn && Object.keys(item.tradeIn).length > 0
    );

    if (!tradeInItem) return null;

    return {
      name: tradeInItem.tradeIn.name || "Prodotto Sconosciuto",
      condition: tradeInItem.tradeIn.condition || "N/D",
      memory: tradeInItem.tradeIn.memory || "N/D",
      controllerCount: tradeInItem.tradeIn.controllerCount || 0,
      technicalIssues: tradeInItem.tradeIn.technicalIssues || "No",
      originalAccessories: tradeInItem.tradeIn.originalAccessories || "Sì",
      tradeInValue: tradeInItem.tradeIn.value || 0,
      imagePath: tradeInItem.tradeIn.imagePath || "/placeholder.png",
      originalPrice: subtotal,
    };
  };

  const tradeInDetails = getTradeInDetails();
  const totalAfterTradeIn = tradeInDetails
    ? total - tradeInDetails.tradeInValue
    : total;

  const removeTradeIn = () => {
    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const updatedCart = cart.map((item: any) => {
      if (item.tradeIn) {
        // Rimuove la chiave tradeIn dall'oggetto
        const { tradeIn, ...rest } = item;
        return rest;
      }
      return item;
    });

    localStorage?.setItem("cart", JSON.stringify(updatedCart));
    refetch();
    dispatch(modifiedCart({}));
    router.refresh(); // Forza il re-render se necessario
  };

  // Funzioni per l'aumento/diminuzione della quantità (necessarie per la sezione "Potrebbe anche interessarti")

  const handleAddToCart = (id: string) => {
    refetch();
    dispatch(modifiedCart({}));

    const existingCart = JSON.parse(localStorage?.getItem("cart") || "[]");

    const newProduct = {
      productId: id,
      quantity: 1,
    };

    interface CartItem {
      productId: string;
      quantity: number;
    }

    const isDuplicate: boolean = existingCart.some(
      (item: CartItem) => item.productId === newProduct.productId
    );

    if (isDuplicate) {
      const updatedCart = existingCart?.map((item: CartItem) => {
        if (item.productId === newProduct.productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      localStorage?.setItem("cart", JSON.stringify(updatedCart));
    }

    if (!isDuplicate) {
      toast.success("Product added to cart successfully!");
      existingCart.push(newProduct);
      localStorage?.setItem("cart", JSON.stringify(existingCart));
    }
    router.refresh();
  };

  const increaseQuantity = (id: string) => {
    refetch();
    const cartData = JSON.parse(localStorage?.getItem("cart") || "[]");

    const itemExists = cartData.some((item: any) => item.productId === id);

    if (!itemExists) {
      toast.error("Please, add the product first!");
      return;
    }

    const updatedCart = cartData?.map((item: any) => {
      if (item.productId === id) {
        return { ...item, quantity: item.quantity + 1 };
      }

      return item;
    });

    localStorage?.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id: string) => {
    refetch();
    const cartData = JSON.parse(localStorage?.getItem("cart") || "[]");

    const itemExists = cartData.some((item: any) => item.productId === id);

    if (!itemExists) {
      toast.error("Please, add the product first!");
      return;
    }

    const updatedCart = cartData.map((item: any) => {
      if (item.productId === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    localStorage?.setItem("cart", JSON.stringify(updatedCart));
  };

  // Funzione di checkout
  const handleCheckout = () => {
    if (products?.data?.products?.length === 0) {
      toast.error("Please, add the product first!");
      router.push("/buy");
    } else {
      router.push("/checkout");
    }
  };

  // ************************************************************
  // FINE FUNZIONI DI CARRELLO COMPLETE
  // ************************************************************

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-[#eae9ef]">
      <div className="mx-5 py-4">
        {/* Intestazione del Carrello */}
        <div className="mb-5">
          <h2 className="text-[32px] font-semibold text-[#101010]">
            Il tuo carrello
          </h2>
        </div>
        <div className="mb-5">
          <p className="text-base text-[#101010] font-medium">
            {products?.data?.products.length} articoli nel tuo carrello:
          </p>
        </div>

        {/* Lista degli Elementi nel Carrello */}
        <div className="flex flex-col gap-3">
          {products?.data?.products?.map((product: IProduct) => {
            const imagePath = product?.images[0] || "";
            // Rimuoviamo il '/' iniziale se presente per non duplicarlo con l'API_URL
            const cleanImagePath = imagePath.startsWith("/")
              ? imagePath.substring(1)
              : imagePath;

            return (
              <div
                key={product?._id}
                className="bg-white flex gap-3 p-3 border border-gray-200 rounded-lg shadow-sm">
                {/* Dettagli Prodotto */}
                <div className="w-[120px] h-[120px] overflow-hidden rounded-md flex-shrink-0">
                  <Image
                    // Ora funziona grazie a next.config.js
                    src={`${API_URL}/${cleanImagePath}`}
                    className="w-full h-full object-cover"
                    width={300}
                    height={300}
                    alt={product?.name}
                    style={{
                      backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
                    }}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg text-[#101010] font-semibold">
                      {product?.name}
                    </h3>
                    <p className="text-sm font-normal text-gray-700">
                      {product?.memory} | {getProductQuantity(product?._id)}{" "}
                      Controller
                    </p>
                    <p className="text-sm font-normal text-gray-700 mb-2">
                      {product?.condition}
                    </p>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600">Prezzo:</p>
                      <h4 className="text-2xl font-bold text-[#FD9A34]">
                        &euro;
                        {(
                          product?.offer_price *
                          getProductQuantity(product?._id)
                        ).toFixed(2)}
                      </h4>
                    </div>

                    <div
                      onClick={() => removeItem(product?._id)}
                      className="flex items-center text-red-600 text-sm font-medium cursor-pointer hover:text-red-800 transition-colors">
                      Rimuovi
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1">
                        <path
                          d="M6 18L18 6M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SEZIONE: VALUTAZIONE TRADE-IN */}
        {/* ------------------------------------------------------------------ */}
        {tradeInDetails && (
          <div className=" mb-5 space-y-4">
            <h2 className="text-2xl font-semibold text-[#101010]">
              Valutazione trade-in
            </h2>
            <p className="text-base text-[#101010]">1 articolo in Trade-in</p>

            {/* Dettagli Articolo Trade-in */}
            <div className="bg-white flex gap-3 p-3 border border-gray-200 rounded-lg shadow-sm">
              <div className="w-[120px] h-[120px] overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src="/placeholder.png"
                  className="w-full h-full object-cover"
                  width={300}
                  height={300}
                  alt={tradeInDetails.name}
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg text-[#101010] font-semibold">
                    {tradeInDetails.name}
                  </h3>
                  <p className="text-sm font-normal text-gray-700">
                    {tradeInDetails.memory} | {tradeInDetails.controllerCount}{" "}
                    Controller
                  </p>
                  <p className="text-sm font-normal text-gray-700 mb-2">
                    {tradeInDetails.condition}
                  </p>
                  <p className="text-sm font-normal text-gray-700">
                    **Difetti tecnici:** {tradeInDetails.technicalIssues}
                  </p>
                  <p className="text-sm font-normal text-gray-700">
                    **Accessori originali:**{" "}
                    {tradeInDetails.originalAccessories}
                  </p>
                </div>
                <div className="flex items-end justify-end mt-auto">
                  <span
                    onClick={removeTradeIn}
                    className="text-red-600 text-sm font-medium cursor-pointer hover:text-red-800 transition-colors">
                    Rimuovi X
                  </span>
                </div>
              </div>
            </div>

            {/* Offerta Trade-in */}
            <div className="bg-[#FDFDFD] flex items-center justify-between rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-[#404040]">
                La nostra offerta
              </h3>
              <h2 className="text-[32px] font-bold text-[#FD9A34]">
                &euro;{tradeInDetails.tradeInValue.toFixed(2)}
              </h2>
            </div>

            {/* Totale dopo permuta */}
            <div className="bg-[#FDFDFD] flex flex-col items-end rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-[#404040]">Totale</h3>
                <span className="text-xl font-medium text-gray-500 line-through">
                  &euro;{tradeInDetails.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between w-full mt-1">
                <p className="text-base text-[#404040]">
                  Prezzo dopo la permuta
                </p>
                <h2 className="text-[40px] font-semibold text-[#FD9A34]">
                  &euro;{totalAfterTradeIn.toFixed(2)}
                </h2>
              </div>
            </div>

            {/* Testo informativo Trade-in */}
            <div className="text-base text-gray-700 space-y-3 pt-3">
              <p>
                Dopo aver inserito nel carrello il trade-in ti manderemo, nel
                giro di 1-3 giorni lavorativi, tutto l'occorrente per spedirci
                il tuo dispositivo gratuitamente!
              </p>
              <p>
                Quando riceveremo il tuo dispositivo ci riserveremo 2-3 giorni
                lavorativi per testarlo, dopodiché ti invieremo l'importo
                stimato.
              </p>
            </div>
          </div>
        )}
        {/* FINE TRADE-IN */}

        {/* Box Totale del Carrello */}
        <div className=" mt-5 mb-5 bg-[#FDFDFD] flex items-center justify-between rounded-lg p-4">
          <h3 className="text-2xl font-semibold text-[#404040]">Total</h3>
          <h2 className="text-[40px] font-semibold text-[#FD9A34]">
            &euro;{totalAfterTradeIn.toFixed(2)}
          </h2>
        </div>

        {/* Sezione 'You might also be interested in' */}
        <div className="w-full pb-9">
          <div className="mx-5 border-b-2 border-b-[#B8B8B8] space-x-4 pt-3 mb-6">
            <h2 className="text-[#101010] text-xl font-semibold pb-3">
              Potrebbe anche interessarti
            </h2>
          </div>

          <div className="mx-5 grid grid-cols-2 gap-x-2 gap-y-4">
            {products?.data?.variants?.map((product: IProduct) => {
              const imagePath = product?.images[0] || "";
              const cleanImagePath = imagePath.startsWith("/")
                ? imagePath.substring(1)
                : imagePath;

              // Verifica la quantità nel carrello per il controllo (+/-)
              const currentQuantity = getProductQuantity(product._id);

              return (
                <div key={product?._id} className="bg-[#FDFDFD] rounded-lg">
                  {/* Immagine */}
                  <div className="p-2">
                    <Image
                      src={`${API_URL}/${cleanImagePath}`}
                      className="w-full h-full"
                      width={600}
                      height={600}
                      alt={product.name}
                      style={{
                        backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
                      }}
                    />
                  </div>

                  {/* Dettagli Varianti e Controlli (LAYOUT CORRETTO E COMPLETO) */}
                  <div className="p-2 pt-0">
                    {/* Blocco Nome e Prezzo */}
                    <div className="border-b border-b-[#B5B5B5] pb-2 mb-2">
                      <div className="text-base font-semibold">
                        {product.brand}{" "}
                        <span className="font-normal block text-sm">
                          {product.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-start w-full mt-2">
                        <span className="text-xl font-bold text-[#101010]">
                          &euro;{product.offer_price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Logica Aggiungi/Controlli Quantità */}
                    {currentQuantity === 0 ? (
                      // Bottone Add to Cart per il primo inserimento (Larghezza completa)
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="w-full bg-[#FD9A34] text-white p-2 rounded-lg text-base font-semibold">
                        Aggiungi
                      </button>
                    ) : (
                      // Controlli Quantità (Mostrati se il prodotto è già nel carrello)
                      <div className="flex items-center justify-between gap-2.5">
                        <button
                          onClick={() => decreaseQuantity(product._id)}
                          className="bg-[#FD9A34] text-white p-2 rounded-lg">
                          <Minus size={16} />
                        </button>
                        <span className="p-2 border text-lg font-medium flex-1 text-center">
                          {currentQuantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(product._id)}
                          className="bg-[#FD9A34] text-white p-2 rounded-lg">
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* /* FINE 'You might also be interested in' */}

        {/* ------------------------------------------------------------------ */}
        {/* SEZIONE: Vantaggi e Pagamento a Rate */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-5 px-5 py-4 rounded-lg shadow-sm">
          {/* Blocco Pagamento a Rate */}
          <div className="p-4 mb-4 rounded-lg shadow-md bg-[#FDFDFD] border border-gray-300">
            <div className="flex items-center justify-center space-x-2">
              <p className="text-xl font-bold text-[#101010]">
                Paga in 3 rate con
              </p>
              <Image
                src="/payments/paypal2.svg"
                alt="PayPal"
                width={75}
                height={20}
                className="h-5 w-auto"
              />
              <p className="text-xl font-bold text-[#101010]">o</p>
              <Image
                src="/payments/klarna.png"
                alt="Klarna"
                width={40}
                height={20}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-base text-center text-gray-700 mt-1">
              senza interessi né costi aggiuntivi.
            </p>
          </div>

          {/* Blocchetto Vantaggi (Icone) */}
          <div className="bg-[#FDFDFD] p-4 rounded-lg shadow-md space-y-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-gray-600 flex-shrink-0" />
              <p className="text-lg text-[#101010] font-medium">
                Riconfezionato -{" "}
                <span className="font-bold">12 Mesi di garanzia.</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-gray-600 flex-shrink-0" />
              <p className="text-lg text-[#101010] font-medium">
                <span className="font-bold">Spedizione Veloce e Gratuita.</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 text-gray-600 flex-shrink-0" />
              <p className="text-lg text-[#101010] font-medium">
                Hai cambiato idea?{" "}
                <span className="font-bold">Il reso è gratuito.</span>
              </p>
            </div>
          </div>
        </div>
        {/* FINE Vantaggi e Pagamento a Rate */}

        {/* ------------------------------------------------------------------ */}
        {/* ACCORDION (Descrizione, Garanzia, FAQ) */}
        {/* ------------------------------------------------------------------ */}
        <Accordion
          productName={product.product?.name || ""}
          productType={""}
          productSpecs={product.product?.technical_specs}
          productDescription={
            product.product?.long_description ||
            product.product?.description ||
            ""
          }
          modelDes={product.product?.modelDes}
          controllerDes={product.product?.controllerDes}
          memoryDes={product.product?.memoryDes}
          conditionDes={product.product?.conditionDes}
        />
        {/* FINE ACCORDION */}

        {/* ------------------------------------------------------------------ */}
        {/* SEZIONE DELLE RECENSIONI */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-6 ">
          <ReviewCarousel productName={products} theme="white" />
        </div>
        {/* FINE SEZIONE RECENSIONI */}
        {/* Footer di Pagamento */}
      </div>
      <div className="sticky bottom-0 z-50 w-full bg-[#FDFDFD] shadow-2xl border-t border-gray-200 p-5">
        <button
          onClick={handleCheckout}
          className="w-full text-[#FDFDFD] font-semibold bg-[#FD9A34] h-14 rounded-lg">
          PAGA ORA
        </button>
      </div>
    </div>
  );
}
