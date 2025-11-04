/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import ConsoleModal from "@/components/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  useFindSlugProductQuery,
  useGetSingleProductQuery,
} from "@/redux/features/products/ProductAPI";
import Loading from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { modifiedCart } from "@/redux/features/cart/TrackCartItem";
import ReviewCarousel from "@/components/share/review-carousel/ReviewCarousel";
import TrustSection from "@/components/buy/TrustSection";
import Accordion from "@/components/accordion/Accordion";
import { toggleModal, openModal } from "@/redux/features/modal/modalSlice";
import {
  TradeInItem as ModalTradeInData,
  clearTradeInItemDetails,
} from "@/redux/features/modalTradeInData/ModalTradeInData";
import { resetTradeInValuation } from "@/redux/features/tradeIn/showTradeInSlice";

// --- INTERFACCE ---
interface ProductData {
  product: {
    _id: string;
    name: string;
    offer_price: number;
    images: string[];
    product_type: string;
    slug: string;
    model: string;
    controller: string;
    memory: string;
    condition: string;
    long_description?: string;
    description: string;
    technical_specs?: { label: string; value: string }[];
    modelDes?: string;
    controllerDes?: string;
    memoryDes?: string;
    conditionDes?: string;
    ratings?: number;
  };
  meta: {
    models?: { model: string; price: number }[];
    memoryOptions?: { capacity: string; price: number }[];
  };
}

// ===================================================================
// 1. FUNZIONI DI UTILITÀ PER CLASSI DINAMICHE
//    Necessarie per la logica UI dinamica basata su productType.
// ===================================================================

/**
 * Determina il tema del prodotto (colore principale)
 */
const getProductTheme = (productType: string | undefined): string => {
  if (!productType) return "white";
  const lowerType = productType.toLowerCase();
  if (lowerType.includes("playstation")) return "playstation";
  if (lowerType.includes("xbox")) return "xbox";
  if (lowerType.includes("nintendo")) return "nintendo";
  return "white";
};

/**
 * Restituisce le classi per il colore (tipicamente testo o bordo) degli elementi selezionati.
 * @param productType Tipo di console
 * @param baseClasses Classi di base (es. "bg-white border-transparent" per lo sfondo attivo)
 * @param activeClasses (Non usato nel tuo JSX, lasciato per completezza)
 * @param inactiveClasses (Non usato nel tuo JSX, lasciato per completezza)
 * @param nintendoContrastClasses (Usato solo nel check Trade-In)
 */
const getConsoleColorClasses = (
  productType: string,
  baseClasses: string,
  activeClasses: string,
  inactiveClasses: string,
  nintendoContrastClasses: string = ""
): string => {
  const isSelectedStyle =
    productType === "xbox"
      ? "text-[#3BAE3B] border-transparent" // Verde Xbox
      : productType === "playstation"
      ? "text-[#1861C0] border-transparent" // Blu Playstation
      : productType === "nintendo"
      ? "text-[#DB2220] border-transparent" // Rosso Nintendo
      : "";

  return `${baseClasses} ${isSelectedStyle} ${nintendoContrastClasses}`;
};

/**
 * Restituisce le classi per lo sfondo/bordo degli elementi NON selezionati
 * e le classi di sfondo per il banner sticky.
 * @param productType Tipo di console
 * @param baseClasses Classi di base (es. "text-[#FDFDFD] bg-transparent")
 * @param activeClasses Classi da applicare se SELEZIONATO (vuoto nel tuo JSX)
 * @param inactiveClasses Classi da applicare se NON SELEZIONATO (es. "border-[#FDFDFD]")
 */
const getConsoleBgClasses = (
  productType: string,
  baseClasses: string,
  activeClasses: string,
  inactiveClasses: string
): string => {
  const bgColor =
    productType === "xbox"
      ? "bg-[#46aa48]"
      : productType === "playstation"
      ? "bg-[#003caa]"
      : productType === "nintendo"
      ? "bg-[#db2220]"
      : "bg-gray-500"; // Fallback

  // Questa funzione è usata anche per gli sfondi del banner sticky, dove `activeClasses` e `inactiveClasses` non servono
  if (activeClasses === "bg-opacity-100" && inactiveClasses === "") {
    return bgColor;
  }

  // Stili per pulsanti NON selezionati (testo e bordo bianco su sfondo colore console)
  return `${baseClasses} ${inactiveClasses} ${
    activeClasses && inactiveClasses === "border-[#FDFDFD]"
      ? `${bgColor} border-transparent` // Attivo (quando riceve baseClasses="text-white" in Desktop)
      : baseClasses // Non Attivo (nel mobile viene passato "text-[#FDFDFD] border-[#FDFDFD] bg-transparent")
  }`;
};

const ProductDetailsPage: React.FC = () => {
  // ===================================================================
  // 2. STATI LOCALI E SELETTORI REDUX
  // ===================================================================
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedController, setSelectedController] = useState<string>("0");
  const [selectedMemory, setSelectedMemory] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");

  const dispatch = useDispatch();
  const params = useParams();
  const slug = params.slug as string | undefined;
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Selettori Redux
  const modalTradeInData: ModalTradeInData | null = useSelector(
    (state: RootState) =>
      state?.modalTradeInDataSlice?.modalTradeInData as ModalTradeInData | null
  );
  const isTradeInActive: boolean = useSelector(
    (state: RootState) => state.showTradeInData.isTradeInActive
  );
  const tradeInDiscount: number = useSelector(
    (state: RootState) => state.showTradeInData.tradeInFinalValue
  );
  const isModalOpen: boolean = useSelector(
    (state: RootState) => state.modal.modal
  );

  // ===================================================================
  // 3. DATI E HOOK DI RTK QUERY
  // ===================================================================

  const {
    data: singleProduct,
    isLoading,
    isError,
  } = useGetSingleProductQuery({ slug });

  const { data: slugRes } = useFindSlugProductQuery(
    {
      productName: singleProduct?.data?.product?.name,
      condition: selectedCondition,
      controller: selectedController,
      memory: selectedMemory,
      model: selectedModel,
    },
    { skip: !singleProduct?.data?.product?.name }
  );

  // ===================================================================
  // 4. EFFECT E INIZIALIZZAZIONE
  // ===================================================================

  useEffect(() => {
    // Reindirizzamento se la configurazione selezionata porta a uno slug diverso
    if (!singleProduct?.data?.product?.slug || !slugRes?.data?.slug) return;

    if (singleProduct?.data?.product?.slug !== slugRes?.data?.slug) {
      router.replace(`/buy/${slugRes.data.slug}`);
    }
  }, [slugRes?.data?.slug, router, singleProduct?.data?.product?.slug]);

  useEffect(() => {
    // Inizializza gli stati locali con i valori del prodotto corrente
    if (singleProduct?.data?.product) {
      setSelectedModel(singleProduct.data.product.model || "");
      setSelectedController(singleProduct.data.product.controller || "0");
      setSelectedMemory(singleProduct.data.product.memory || "");
      setSelectedCondition(singleProduct.data.product.condition || "");
    }
  }, [singleProduct]);

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (isError || !singleProduct?.data)
    return <div>Errore: Prodotto non trovato!</div>;

  const product = singleProduct.data as ProductData;
  const productType = product.product?.product_type as string;

  // ===================================================================
  // 5. LOGICA BUSINESS (COSTANTI E FUNZIONI)
  // ===================================================================

  // --- Costanti per le opzioni ---
  const baseControllerCost =
    productType === "xbox" ? 30 : productType === "playstation" ? 40 : 0;

  const CONTROLLER_OPTIONS = [
    { count: 0, extraCost: 0 },
    { count: 1, extraCost: baseControllerCost * 1 },
    { count: 2, extraCost: baseControllerCost * 2 },
  ];

  const CONDITION_OPTIONS = [
    {
      label: "NOT BAD",
      value: "accettabile",
      price: 0,
      description:
        "La console presenta segni di usura, ma è perfettamente funzionante.",
    },
    {
      label: "GOOD",
      value: "eccellente",
      price: 30,
      description:
        "La console è in ottime condizioni, con minimi segni di utilizzo.",
    },
    {
      label: "NEW",
      value: "new",
      price: 70,
      description: "Come nuova, con scatola originale e accessori intatti.",
    },
  ];

  const TRADE_IN_OPTIONS = [
    { label: "SI", value: "SI" },
    { label: "NO", value: "NO" },
  ];

  /**
   * Calcola il prezzo base del prodotto più tutti gli extra selezionati.
   */
  const calculateTotalPrice = () => {
    let total = Number(product.product?.offer_price) || 0;

    const model = product.meta?.models?.find(
      (m: any) => m.model === selectedModel
    );
    total += Number(model?.price ?? 0);

    const memory = product.meta?.memoryOptions?.find(
      (m: any) => m.capacity === selectedMemory
    );
    total += Number(memory?.price ?? 0);

    const controller = CONTROLLER_OPTIONS.find(
      (c) => String(c.count) === selectedController
    );
    total += Number(controller?.extraCost ?? 0);

    const condition = CONDITION_OPTIONS.find(
      (c) => c.value === selectedCondition
    );
    total += Number(condition?.price ?? 0);

    return total;
  };

  const currentTotalPrice = calculateTotalPrice();

  // Calcolo del prezzo finale DOPO la permuta
  const finalPriceAfterTrade =
    isTradeInActive && tradeInDiscount > 0
      ? currentTotalPrice - tradeInDiscount
      : currentTotalPrice;

  /**
   * Gestisce la selezione "SI" o "NO" per l'opzione Permuta.
   */
  const handleTradeInSelection = (value: "SI" | "NO") => {
    if (value === "SI") {
      dispatch(openModal());
    } else {
      dispatch(resetTradeInValuation());
      dispatch(clearTradeInItemDetails());
      if (isModalOpen) {
        dispatch(toggleModal());
      }
      toast.success("Offerta Trade-In rimossa.");
    }
  };

  /**
   * Aggiunge il prodotto corrente (con la sua configurazione e trade-in) al carrello.
   */
  const handleAddToCart = () => {
    dispatch(modifiedCart({})); // Traccia l'aggiornamento del carrello

    const existingCart = JSON.parse(localStorage?.getItem("cart") || "[]");

    const newProduct = {
      productId: product.product?._id,
      quantity: 1,
      tradeIn: isTradeInActive
        ? {
            productName: modalTradeInData?.productName,
            productPrice: tradeInDiscount,
          }
        : null,
      model: selectedModel,
      controller: selectedController,
      memory: selectedMemory,
      condition: selectedCondition,
    };

    interface CartItem {
      productId: string;
      quantity: number;
      tradeIn: any;
      model: string;
      controller: string;
      memory: string;
      condition: string;
    }

    // Controlla se esiste già nel carrello un prodotto con la STESSA CONFIGURAZIONE
    const isDuplicate: boolean = existingCart.some(
      (item: CartItem) =>
        item.productId === newProduct.productId &&
        item.model === newProduct.model &&
        item.controller === newProduct.controller &&
        item.memory === newProduct.memory &&
        item.condition === newProduct.condition &&
        // Controlla anche se lo stato Trade-In è lo stesso
        isTradeInActive === !!item.tradeIn
    );

    if (isDuplicate) {
      const updatedCart = existingCart.map((item: CartItem) => {
        if (
          item.productId === newProduct.productId &&
          item.model === newProduct.model &&
          item.controller === newProduct.controller &&
          item.memory === newProduct.memory &&
          item.condition === newProduct.condition &&
          isTradeInActive === !!item.tradeIn
        ) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      localStorage?.setItem("cart", JSON.stringify(updatedCart));
    } else {
      toast.success("Prodotto aggiunto al carrello!");
      existingCart.push(newProduct);
      localStorage?.setItem("cart", JSON.stringify(existingCart));
    }

    router.push("/cart");
  };

  // ===================================================================
  // 6. RENDERIZZAZIONE DEL COMPONENTE (Mobile UI)
  // ===================================================================

  const mainImage = product.product?.images?.[0];
  const cleanImagePath = mainImage?.startsWith("/")
    ? mainImage.substring(1)
    : mainImage;
  const productTheme = getProductTheme(productType);

  // NOTA: La vista Desktop (md:block) è omessa qui per rispettare
  // l'ambito della tua richiesta, che ha fornito solo la vista mobile.

  return (
    <div>
      {/* --------------------- only for mobile ---------------- */}

      <div
        className={`md:hidden ${
          productType === "xbox" && "bg-[url(/sell/xbox.jpeg)]"
        } ${
          productType === "playstation" && "bg-[url(/sell/playstation.jpeg)]"
        } ${
          productType === "nintendo" && "bg-[url(/sell/nintendo.jpeg)]"
        } bg-cover bg-no-repeat`}>
        <div className="w-full h-[426px]">
          {mainImage && (
            <Image
              src={`${API_URL}/${cleanImagePath}`}
              alt={product.product?.name || "Prodotto"}
              className="w-full h-[426px] aspect-square"
              width={800}
              height={800}
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <div>
          {/* Blocchetto Recensioni */}
          <div className="pt-6 mx-5 pb-2.5 border-b-2 border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <p className="text-[#FDFDFD] text-lg font-medium">Recensioni</p>
                <p className="flex items-center gap-1">
                  {[...Array(Math.floor(product.product?.ratings || 0))].map(
                    (v, idx) => (
                      <svg
                        key={`filled-star-${idx}`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#FDFDFD"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#FDFDFD"
                        strokeWidth="1.5">
                        <path d="M11.2392 7.14165C11.4787 6.4046 12.5214 6.40461 12.7609 7.14165L13.6166 9.77509C13.7237 10.1047 14.0309 10.3279 14.3774 10.3279H17.1464C17.9214 10.3279 18.2436 11.3196 17.6166 11.7751L15.3765 13.4026C15.0961 13.6064 14.9788 13.9675 15.0859 14.2971L15.9415 16.9305C16.181 17.6676 15.3374 18.2805 14.7104 17.8249L12.4703 16.1974C12.1899 15.9937 11.8102 15.9937 11.5299 16.1974L9.28972 17.8249C8.66275 18.2805 7.81917 17.6676 8.05865 16.9305L8.9143 14.2971C9.0214 13.9675 8.90408 13.6064 8.62369 13.4026L6.38355 11.7751C5.75658 11.3196 6.0788 10.3279 6.85378 10.3279H9.62274C9.96932 10.3279 10.2765 10.1047 10.3836 9.77509L11.2392 7.14165Z" />
                      </svg>
                    )
                  )}
                  {[
                    ...Array(5 - Math.floor(product.product?.ratings || 0)),
                  ].map((v, idx) => (
                    <svg
                      key={`empty-star-${idx}`}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#FDFDFD"
                      strokeWidth="1.5">
                      <path d="M11.2392 7.14165C11.4787 6.4046 12.5214 6.40461 12.7609 7.14165L13.6166 9.77509C13.7237 10.1047 14.0309 10.3279 14.3774 10.3279H17.1464C17.9214 10.3279 18.2436 11.3196 17.6166 11.7751L15.3765 13.4026C15.0961 13.6064 14.9788 13.9675 15.0859 14.2971L15.9415 16.9305C16.181 17.6676 15.3374 18.2805 14.7104 17.8249L12.4703 16.1974C12.1899 15.9937 11.8102 15.9937 11.5299 16.1974L9.28972 17.8249C8.66275 18.2805 7.81917 17.6676 8.05865 16.9305L8.9143 14.2971C9.0214 13.9675 8.90408 13.6064 8.62369 13.4026L6.38355 11.7751C5.75658 11.3196 6.0788 10.3279 6.85378 10.3279H9.62274C9.96932 10.3279 10.2765 10.1047 10.3836 9.77509L11.2392 7.14165Z" />
                    </svg>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div
            // Stile del banner sticky: colore di sfondo dinamico
            className={`pt-6 px-5 sticky -top-10 left-0 right-0 z-10 
              ${productType === "xbox" && "bg-[#46aa48]"}
              ${productType === "playstation" && "bg-[#003caa]"}
              ${productType === "nintendo" && "bg-[#db2220]"}
            `}>
            <div className="pt-5 pb-2 border-b-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-semibold text-[#FDFDFD]">
                    {product.product?.name}
                  </h2>
                  <h3 className="text-base text-[#FDFDFD]">
                    {(() => {
                      const mobileParts = [];
                      if (selectedModel && selectedModel !== "-") {
                        mobileParts.push(selectedModel);
                      }
                      if (
                        selectedController &&
                        selectedController !== "0" &&
                        selectedController !== "-"
                      ) {
                        mobileParts.push(`${selectedController} Contr.`);
                      }
                      if (selectedMemory && selectedMemory !== "-") {
                        mobileParts.push(selectedMemory);
                      }
                      if (selectedCondition && selectedCondition !== "-") {
                        mobileParts.push(selectedCondition);
                      }
                      return mobileParts.join(" | ");
                    })()}
                  </h3>
                </div>

                <h2 className="text-[36px] font-semibold text-[#FDFDFD]">
                  &euro;
                  {/* Prezzo base totale (senza sconto Trade-In mostrato nel banner iniziale) */}
                  {(calculateTotalPrice() || 0).toFixed(2)}
                </h2>
              </div>
            </div>
          </div>

          {/* SEZIONE XBOX: Selezione del Modello */}
          {productType === "xbox" &&
            product.meta?.models &&
            product.meta.models.length > 1 && (
              <div className="px-5">
                <div className="flex items-center justify-center pt-8 space-x-2.5">
                  <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
                  <h2
                    className={
                      "bg-[#FDFDFD] py-2 px-6 rounded-lg shadow-md text-[#101010] text-base font-medium text-center whitespace-nowrap"
                    }>
                    Seleziona il modello di {product.product?.name}
                  </h2>
                  <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
                </div>

                <div className="grid grid-cols-1 gap-4 px-5 py-4">
                  {product.meta.models?.map(
                    ({ model, price }: Record<string, any>) => (
                      <div
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                        }}
                        className={`
                        text-lg border-4 font-semibold py-3 text-center 
                        flex items-center justify-center rounded-md cursor-pointer
                        ${
                          selectedModel === model
                            ? // Selezionato: sfondo bianco, testo colore console
                              getConsoleColorClasses(
                                productType,
                                "bg-[#FDFDFD] border-transparent",
                                "",
                                "",
                                ""
                              )
                            : "text-[#FDFDFD] bg-transparent border-[#FDFDFD]" // Non selezionato: testo/bordo bianco, sfondo trasparente
                        }
                    `}>
                        <span className="overflow-hidden">{model}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="px-5 pb-4">
                  <p className="text-[#FDFDFD] text-sm">
                    {singleProduct?.data?.product?.modelDes}
                  </p>
                </div>
              </div>
            )}

          {/* SEZIONE PLAYSTATION: Selezione della Versione */}
          {productType === "playstation" &&
            product.meta?.models &&
            product.meta.models.length > 1 && (
              <div className="px-5">
                <div className="flex items-center justify-center pt-8 space-x-2.5">
                  <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
                  <h2
                    className={
                      "bg-[#FDFDFD] py-2 px-6 rounded-lg shadow-md text-[#101010] text-base font-medium text-center whitespace-nowrap"
                    }>
                    Seleziona la versione della {product.product?.name}
                  </h2>
                  <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
                </div>

                <div className="grid grid-cols-2 gap-5 py-4">
                  {product.meta.models?.map(
                    ({ model, price }: Record<string, any>) => (
                      <div
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                        }}
                        className={`
                          text-xl border-4 font-bold py-12 text-center 
                          flex flex-col items-center justify-center rounded-lg cursor-pointer
                          ${
                            selectedModel === model
                              ? // Selezionato: sfondo bianco, testo colore console
                                getConsoleColorClasses(
                                  productType,
                                  "bg-[#FDFDFD] border-transparent",
                                  "",
                                  "",
                                  ""
                                )
                              : "text-[#FDFDFD] bg-transparent border-[#FDFDFD]" // Non selezionato: testo/bordo bianco, sfondo trasparente
                          }
                      `}>
                        <span className="overflow-hidden">{model}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="px-5 pb-4">
                  <p className="text-[#FDFDFD] text-sm">
                    {singleProduct?.data?.product?.modelDes}
                  </p>
                </div>
              </div>
            )}

          {/* SEZIONE CONTROLLER (Quantità) */}
          {(productType === "playstation" || productType === "xbox") && (
            <div className="px-5">
              <div className="flex items-center justify-center pt-8 space-x-2.5">
                <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
                <h2
                  className={
                    "bg-[#FDFDFD] py-2 px-6 rounded-lg shadow-md text-[#101010] text-base font-medium text-center whitespace-nowrap"
                  }>
                  Controller
                </h2>
                <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
              </div>

              <div className="grid grid-cols-3 gap-5 py-4">
                {CONTROLLER_OPTIONS.map(({ count, extraCost }) => {
                  const isSelected = selectedController === String(count);
                  return (
                    <div
                      key={count}
                      onClick={() => {
                        setSelectedController(String(count));
                      }}
                      className={`
                        text-xl border-4 font-bold py-10 text-center flex flex-col items-center justify-center rounded-lg cursor-pointer
                        ${
                          isSelected
                            ? getConsoleColorClasses(
                                productType,
                                "bg-white border-transparent", // Base: sfondo bianco
                                "",
                                "",
                                ""
                              )
                            : getConsoleColorClasses(
                                productType,
                                "text-[#FDFDFD] bg-transparent", // Base: testo bianco, sfondo trasparente
                                "",
                                "",
                                "border-white" // Bordo bianco per i non selezionati
                              )
                        }
                    `}>
                      <span className="text-3xl overflow-hidden">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 pb-4">
                <p className="text-[#FDFDFD] text-sm">
                  <span className="font-bold">Controller:</span> con la console
                  arriveranno esclusivamente controller prodotti dalla casa
                  madre.
                </p>
              </div>
            </div>
          )}

          {/* SEZIONE MEMORIA / GB (Capacità) */}
          {product.meta?.memoryOptions &&
            product.meta.memoryOptions.length > 1 && (
              <div className="px-5">
                <div className="flex items-center justify-center pt-8 space-x-2.5">
                  <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
                  <h2
                    className={
                      "bg-[#FDFDFD] py-2 px-6 rounded-lg shadow-md text-[#101010] text-base font-medium text-center whitespace-wrap"
                    }>
                    Memoria di archiviazione
                  </h2>
                  <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
                </div>

                <div className="grid grid-cols-2 gap-5 py-4">
                  {product.meta.memoryOptions.map(
                    ({ capacity, price }: Record<string, any>) => {
                      const isSelected = selectedMemory === capacity;
                      return (
                        <div
                          key={capacity}
                          onClick={() => {
                            setSelectedMemory(capacity);
                          }}
                          className={`
                          text-xl border-4 font-bold py-12 text-center 
                          flex flex-col items-center justify-center rounded-lg cursor-pointer
                          ${
                            isSelected
                              ? getConsoleColorClasses(
                                  productType,
                                  "bg-white border-transparent",
                                  "",
                                  "",
                                  ""
                                )
                              : getConsoleColorClasses(
                                  productType,
                                  "text-[#FDFDFD] bg-transparent",
                                  "",
                                  "",
                                  "border-[#FDFDFD]" // Bordo bianco per i non selezionati
                                )
                          }
                      `}>
                          {isSelected ? (
                            <Check className={`h-8 w-8`} />
                          ) : (
                            <>
                              <span className="text-2xl overflow-hidden">
                                {capacity}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="px-5 pb-4">
                  <p className="text-[#FDFDFD] text-sm">
                    <span className="font-bold">
                      {productType === "xbox" ? "Xbox One:" : "Memoria:"}
                    </span>
                    La capacità di archiviazione determina quanti giochi e dati
                    possono essere salvati sulla console.
                  </p>
                </div>
              </div>
            )}

          {/* SEZIONE CONDIZIONI (Stato del Prodotto) */}
          <div className="px-5">
            <div className="flex items-center justify-center pt-8 space-x-2.5">
              <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
              <h2
                className={
                  "bg-[#FDFDFD] py-2 px-6 rounded-lg shadow-md text-[#101010] text-base font-medium text-center whitespace-wrap"
                }>
                Condizioni
              </h2>
              <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
            </div>

            <div className="grid grid-cols-3 gap-5 py-4">
              {CONDITION_OPTIONS.map(({ label, value, price, description }) => {
                const isSelected = selectedCondition === value;
                return (
                  <div
                    key={value}
                    onClick={() => {
                      setSelectedCondition(value);
                    }}
                    className={`
                      text-xl border-4 font-bold py-10 text-center flex flex-col items-center justify-center rounded-lg cursor-pointer
                      ${
                        isSelected
                          ? getConsoleColorClasses(
                              productType,
                              "bg-white border-transparent",
                              "",
                              "",
                              ""
                            )
                          : getConsoleBgClasses(
                              productType,
                              "text-[#FDFDFD] border-[#FDFDFD] bg-transparent", // Non selezionato: testo bianco, bordo bianco
                              "",
                              ""
                            )
                      }
                  `}>
                    <span className="text-lg overflow-hidden whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-4">
              <p className="text-[#FDFDFD] text-sm">
                <span className="font-bold">
                  {
                    CONDITION_OPTIONS.find(
                      (opt) => opt.value === selectedCondition
                    )?.label
                  }
                </span>
                {
                  CONDITION_OPTIONS.find(
                    (opt) => opt.value === selectedCondition
                  )?.description
                }
              </p>
            </div>
          </div>

          {/* SEZIONE PERMUTA (Trade-In) */}
          <div className="mb-6 px-5 pt-5">
            <div className="flex items-center justify-center pt-8 space-x-2.5">
              <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
              <h2
                className={
                  "bg-[#FDFDFD] py-2 px-6 rounded-lg shadow-md text-[#101010] text-base font-medium text-center whitespace-wrap"
                }>
                Permuta
              </h2>
              <hr className="flex-1 border-b-2 border-[#B5B5B5]" />
            </div>
            <div className="grid grid-cols-2 gap-5 py-4">
              {TRADE_IN_OPTIONS.map(({ label, value }) => {
                const isSelected =
                  (value === "SI" && isTradeInActive) ||
                  (value === "NO" && !isTradeInActive);

                return (
                  <div
                    key={value}
                    onClick={() => handleTradeInSelection(value as "SI" | "NO")}
                    className={`
                      text-3xl border-4 font-bold py-12 text-center 
                      flex flex-col items-center justify-center rounded-lg cursor-pointer
                      ${
                        isSelected
                          ? getConsoleColorClasses(
                              productType,
                              "bg-white border-transparent",
                              "",
                              "",
                              ""
                            )
                          : getConsoleBgClasses(
                              productType,
                              "text-[#FDFDFD] border-[#FDFDFD] bg-transparent",
                              "",
                              ""
                            )
                      }
                  `}>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* SEZIONE: Prezzo Dopo Permuta (Visibile solo se permuta attiva E sconto presente) */}
            {isTradeInActive && tradeInDiscount > 0 && (
              <div className="p-4 rounded-lg space-y-4">
                <h3 className="text-[#FDFDFD] text-lg font-semibold">
                  Prezzo dopo permuta
                </h3>

                <div className="flex items-center justify-between p-4 bg-[#FDFDFD] rounded-lg shadow-md">
                  <p className="text-[#101010] font-medium">
                    Abbiamo valutato il tuo dispositivo:
                  </p>
                  <p className="text-[#101010] font-bold">
                    &euro;{tradeInDiscount.toFixed(2)}
                  </p>
                </div>

                <div className="p-4 rounded-lg shadow-xl bg-[#FDFDFD]">
                  <div className="flex items-start justify-between">
                    <p className="text-[#101010] text-xl font-bold">
                      {product.product?.name}
                    </p>
                    <div className="text-right">
                      <p className="text-[#101010] text-lg line-through opacity-70">
                        &euro;{calculateTotalPrice().toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[#101010] text-base">
                      {selectedModel} | {selectedCondition}
                    </p>

                    <p className="text-orange-500 text-[36px] font-extrabold leading-none">
                      &euro;{finalPriceAfterTrade.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isModalOpen && <ConsoleModal />}
          </div>
        </div>
        {/* submit button */}
        <div className="sticky bottom-0 z-10 p-2.5 ">
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 w-full text-[#FDFDFD] font-semibold h-12 rounded-lg">
            Aggiungi al carrello
          </button>
        </div>
        {/* NUOVA SEZIONE: Vantaggi e Pagamento a Rate */}
        <TrustSection className="px-5 py-4" innerBlockBgClass="bg-[#FDFDFD]" />
        {/* ACCORDION (Descrizione, Garanzia, FAQ) */}
        <div className="px-5 pb-8 mt-6">
          <Accordion
            productName={product.product?.name || ""}
            productType={productType}
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
        </div>
        <div className="mt-6">
          <ReviewCarousel productName={product.product.name} theme="white" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
