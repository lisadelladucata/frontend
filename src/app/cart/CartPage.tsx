"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetProductsByIdsQuery } from "@/redux/features/products/GetProductByIds";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { modifiedCart } from "@/redux/features/cart/TrackCartItem";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import React from "react";

// 🚀 IMPORT DELLE AZIONI TRADE-IN (Corretto l'import da ModalTradeInData)
import { resetTradeInValuation } from "@/redux/features/tradeIn/showTradeInSlice";
import { clearTradeInItemDetails } from "@/redux/features/modalTradeInData/ModalTradeInData";
import ReviewCarousel from "@/components/share/review-carousel/ReviewCarousel";
import TrustSection from "@/components/buy/TrustSection";
import Accordion from "@/components/accordion/Accordion";
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
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.consolelocker.it";
  const dispatch = useDispatch();
  const router = useRouter();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // ************************************************************
  // 🚀 LETTURA DATI TRADE-IN DA REDUX
  // ************************************************************
  const tradeInFinalValue = useSelector(
    (state: RootState) => state.showTradeInData.tradeInFinalValue
  );
  const tradeInIsActive = useSelector(
    (state: RootState) => state.showTradeInData.isTradeInActive
  );
  const tradeInDetailsFromRedux = useSelector(
    (state: RootState) => state.modalTradeInDataSlice.modalTradeInData
  );
  // ************************************************************
  // FINE LETTURA DATI TRADE-IN DA REDUX
  // ************************************************************

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

  // ************************************************************
  // FUNZIONI DEL CARRELLO
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
      const price =
        product.offer_price > 0 ? product.offer_price : product.price;
      return total + quantity * price;
    },
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  // 🚀 LOGICA DI RECUPERO DETTAGLI TRADE-IN
  const getTradeInDetails = () => {
    if (!tradeInIsActive || tradeInFinalValue <= 0) return null;

    const details = tradeInDetailsFromRedux;

    if (!details || !details.productName || !details.details) return null;

    return {
      name: details.productName || "Prodotto Sconosciuto",

      condition: details.details.condition || "N/D",
      memory: (details.details as any).memory || "N/D",
      controllerCount: (details.details as any).controllerCount || 0,

      technicalIssues: details.details.technicalDefects || "No",
      originalAccessories: details.details.accessories || "Sì",
      box: (details.details as any).box || "N/D",

      tradeInValue: tradeInFinalValue,
      imagePath: details.imagePath || "/placeholder.png",
      originalPrice: total,
    };
  };

  const tradeInDetails = getTradeInDetails();
  const totalAfterTradeIn = tradeInDetails
    ? total - tradeInDetails.tradeInValue
    : total;

  // 🚀 FUNZIONE removeTradeIn (Usa le azioni Redux)
  const removeTradeIn = () => {
    dispatch(resetTradeInValuation());
    dispatch(clearTradeInItemDetails());

    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const updatedCart = cart.filter((item: any) => !item.isTradeIn);
    localStorage?.setItem("cart", JSON.stringify(updatedCart));

    dispatch(modifiedCart({}));
    router.refresh();
  };

  // 🚀 FUNZIONE handleCheckout
  const handleCheckout = () => {
    if (products?.data?.products?.length === 0) {
      toast.error("Please, add the product first!");
      router.push("/buy");
    } else {
      router.push("/checkout");
    }
  };

  // Funzioni per l'aumento/diminuzione della quantità (lasciate inalterate)
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

    const updatedCart = cartData.map((item: any) => {
      if (item.productId === id && item.quantity > 1) {
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
  // ************************************************************
  // FINE FUNZIONI DEL CARRELLO
  // ************************************************************

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-[#eae9ef]">
      <div className="mx-5 py-4">
        {/* Intestazione del Carrello e Lista Prodotti */}
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
        <div className="flex flex-col gap-3">
          {products?.data?.products?.map((product: IProduct) => {
            const imagePath = product?.images[0] || "";
            const cleanImagePath = imagePath.startsWith("/")
              ? imagePath.substring(1)
              : imagePath;

            return (
              <div
                key={product?._id}
                className="bg-white flex gap-3 p-3 border border-gray-200 rounded-lg shadow-sm">
                <div className="w-[120px] h-[120px] overflow-hidden rounded-md flex-shrink-0">
                  <Image
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
          <div className=" mt-5 mb-5 space-y-4">
            <h2 className="text-2xl font-semibold text-[#101010]">
              Valutazione trade-in
            </h2>
            <p className="text-base text-[#101010]">1 articolo in Trade-in</p>

            {/* Dettagli Articolo Trade-in */}
            <div className="bg-white flex gap-3 p-3 border border-gray-200 rounded-lg shadow-sm">
              <div className="w-[120px] h-[120px] overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={tradeInDetails.imagePath}
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
                    Condizione: {tradeInDetails.condition}
                  </p>
                  <p className="text-sm font-normal text-gray-700">
                    Difetti tecnici: {tradeInDetails.technicalIssues}
                  </p>
                  <p className="text-sm font-normal text-gray-700">
                    Accessori originali:
                    {tradeInDetails.originalAccessories}
                  </p>
                  <p className="text-sm font-normal text-gray-700">
                    Scatola originale: {tradeInDetails.box}
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

            <div className="text-base text-gray-700 space-y-3 pt-3">
              <p>
                Hai 7 giorni per goderti la nuova console. Poi, ci pensiamo noi:
                riceverai un'etichetta di spedizione gratuita e una guida video
                passo-passo per spedirci l'usato.
              </p>
              <p>
                Quando riceveremo la tua console ci riserveremo 2‑3 giorni
                lavorativi per testarlo, dopodiché ti invieremo l’importo
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

        {/* ------------------------------------------------------------------ */}
        {/* NUOVA SEZIONE: Vantaggi e Pagamento a Rate */}
        {/* ------------------------------------------------------------------ */}
        <TrustSection className="px-5 py-4" innerBlockBgClass="bg-[#FDFDFD]" />
        {/* ------------------------------------------------------------------ */}
        {/* ACCORDION (Descrizione, Garanzia, FAQ) */}
        <div className="px-5 pb-8 mt-6">
          <Accordion
            productName={products.name}
            productType={products.type}
            productDescription={products.description}
            productSpecs={undefined}
            modelDes={undefined}
            controllerDes={undefined}
            memoryDes={undefined}
            conditionDes={undefined}
            visibleSections={["Garanzia Console Locker", "FAQ"]}
          />
        </div>
        <div className="mt-6">
          <ReviewCarousel productName={products.name} theme="white" />
        </div>
      </div>
      {/* FOOTER FISSO */}
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
