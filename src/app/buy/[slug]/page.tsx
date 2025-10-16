/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";
import ConsoleModal from "@/components/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@/redux/features/modal/modalSlice";
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

interface ModalTradeInData {
  productName: string;
  productPrice: number;
}

const ProductDetailsPage: React.FC = () => {
  // ===================================================================
  // 1. STATI E SELETTORI REDUX
  // ===================================================================
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedController, setSelectedController] = useState<string>("0");
  const [selectedMemory, setSelectedMemory] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<string>("");

  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenTradeIn, setIsOpenTradeIn] = useState(false);

  const modalTradeInData: ModalTradeInData | null = useSelector(
    (state: RootState) =>
      state?.modalTradeInDataSlice?.modalTradeInData as ModalTradeInData | null
  );

  // ===================================================================
  // 2. DATI E HOOK DI NEXT.JS/RTK QUERY
  // ===================================================================

  const params = useParams();
  const [slug, setSlug] = useState(params.slug);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const {
    data: singleProduct,
    isLoading,
    isError,
  } = useGetSingleProductQuery({
    slug: slug as string | undefined,
  });

  const { data: slugRes } = useFindSlugProductQuery({
    productName: singleProduct?.data?.product?.name,
    condition: selectedCondition,
    controller: selectedController,
    memory: selectedMemory,
    model: selectedModel,
  });

  // ===================================================================
  // 3. EFFECT E INIZIALIZZAZIONE
  // ===================================================================

  useEffect(() => {
    if (!singleProduct?.data?.product?.slug || !slugRes?.data?.slug) return;

    // Rimosso { shallow: true } come richiesto per l'App Router
    if (singleProduct?.data?.product?.slug !== slugRes?.data?.slug) {
      setSlug(slugRes?.data?.slug);
      router.replace(slugRes?.data?.slug);
    }
  }, [slugRes, router, singleProduct?.data?.product?.slug]);

  useEffect(() => {
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
  // ===================================================================
  // 4. FUNZIONI DI UTILITY E BUSINESS LOGIC
  // ===================================================================

  type CardTheme = "gray" | "white" | "playstation" | "xbox" | "nintendo";

  const getProductTheme = (productType: string | undefined): CardTheme => {
    if (!productType) return "white";

    const lowerType = productType.toLowerCase();

    if (lowerType.includes("playstation")) {
      return "playstation";
    }
    if (lowerType.includes("xbox")) {
      return "xbox";
    }
    if (lowerType.includes("nintendo")) {
      return "nintendo";
    }

    return "white";
  };

  const product = singleProduct.data;
  const productType = product.product?.product_type as string;
  const basePrice = product.product?.offer_price || 0;

  const productTheme = getProductTheme(productType);

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
      description: "Dispositivo in condizioni accettabili.",
    },
    {
      label: "GOOD",
      value: "eccellente",
      price: 30,
      description: "Dispositivo in ottime condizioni.",
    },
    {
      label: "BRAND NEW",
      value: "new",
      price: 70,
      description: "Dispositivo pari al nuovo, nessun segno di usura.",
    },
  ];

  const TRADE_IN_OPTIONS = [
    { label: "SI", value: "SI" },
    { label: "NO", value: "NO" },
  ];

  const handleOpenModal = () => {
    dispatch(toggleModal()); // Usa Redux per aprire la modale
    setIsModalOpen(true); // (opzionale: puoi rimuovere questo stato locale se non serve altrove)
  };
  const handleCloseModal = () => {
    dispatch(toggleModal()); // Chiudi la modale Redux
    setIsModalOpen(false);
  };

  const handleCompleteTradeIn = (tradeInData: any) => {
    // Salva i dati se serve
    setIsModalOpen(false);
    setIsOpenTradeIn(true);
  };

  const handleAddToCart = () => {
    dispatch(modifiedCart({}));

    const existingCart = JSON.parse(localStorage?.getItem("cart") || "[]");

    const newProduct = {
      productId: product?.product?._id,
      quantity: 1,
      tradeIn: modalTradeInData || null,
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

    // Controlla se il prodotto esiste già con la *stessa configurazione*
    const isDuplicate: boolean = existingCart.some(
      (item: CartItem) =>
        item.productId === newProduct.productId &&
        item.model === newProduct.model &&
        item.controller === newProduct.controller &&
        item.memory === newProduct.memory &&
        item.condition === newProduct.condition
    );

    if (isDuplicate) {
      const updatedCart = existingCart.map((item: CartItem) => {
        if (
          item.productId === newProduct.productId &&
          item.model === newProduct.model &&
          item.controller === newProduct.controller &&
          item.memory === newProduct.memory &&
          item.condition === newProduct.condition
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

  // FUNZIONE DI UTILITY PER GENERARE CLASSI DINAMICHE
  const getConsoleColorClasses = (
    baseClasses: string,
    activeClasses: string,
    inactiveClasses: string,
    nintendoContrastClasses: string = ""
  ) => {
    let activeColorClass = "";
    let inactiveColorClass = "";

    if (productType === "xbox") {
      activeColorClass = "text-[#3BAE3B]";
      inactiveColorClass = "border-[#3BAE3B]";
    } else if (productType === "playstation") {
      activeColorClass = "text-[#1861C0]";
      inactiveColorClass = "border-[#1861C0]";
    } else if (productType === "nintendo") {
      activeColorClass = "text-[#D61D1E]";
      inactiveColorClass = nintendoContrastClasses || "border-[#D61D1E]";
    } else {
      // Fallback
      activeColorClass = "text-gray-900";
      inactiveColorClass = "border-gray-500";
    }

    return `${baseClasses} ${activeClasses} ${activeColorClass} ${inactiveClasses} ${inactiveColorClass}`;
  };

  // FUNZIONE DI UTILITY PER OTTENERE LE CLASSI PER LO SFONDO (es. Trade-In NO)
  const getConsoleBgClasses = (
    baseClasses: string,
    activeClasses: string,
    inactiveClasses: string
  ) => {
    let activeBgClass = "";
    let inactiveBgClass = "";

    if (productType === "xbox") {
      activeBgClass = "bg-[#3BAE3B]";
    } else if (productType === "playstation") {
      activeBgClass = "bg-[#1861C0]";
    } else if (productType === "nintendo") {
      activeBgClass = "bg-[#D61D1E]";
    } else {
      activeBgClass = "bg-gray-500";
    }

    return `${baseClasses} ${activeClasses} ${activeBgClass} ${inactiveClasses} ${inactiveBgClass}`;
  };

  // ------------------------------------------------------------------
  // LOGICA PER IL PREZZO FINALE DOPO LA PERMUTA
  // ------------------------------------------------------------------
  const tradeInValue = modalTradeInData?.productPrice || 0;
  const finalPriceAfterTrade = Math.max(0, basePrice - tradeInValue);

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
          <Image
            src={`${API_URL}${product.product?.images[0]}`}
            className="w-full h-[426px] aspect-square"
            width={800}
            height={800}
            alt={product.product?.name || "Prodotto"}
          />
        </div>
        <div>
          {/* Blocchetto Recensioni */}
          <div className="pt-6 mx-5 pb-2.5 border-b-2 border-gray-300">
            {/* ... codice recensioni invariato ... */}
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
            // Usando productType per il colore dinamico dello sfondo
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

                      // Modello (Presumiamo che selectedModel non sia mai vuoto/brutto, ma lo filtriamo per sicurezza)
                      if (selectedModel && selectedModel !== "-") {
                        mobileParts.push(selectedModel);
                      }

                      // Controller
                      if (
                        selectedController &&
                        selectedController !== "0" &&
                        selectedController !== "-"
                      ) {
                        mobileParts.push(`${selectedController} Contr.`);
                      }

                      // Memoria
                      if (selectedMemory && selectedMemory !== "-") {
                        mobileParts.push(selectedMemory);
                      }

                      // Condizione
                      if (selectedCondition && selectedCondition !== "-") {
                        mobileParts.push(selectedCondition);
                      }

                      return mobileParts.join(" | ");
                    })()}
                  </h3>
                </div>

                <h2 className="text-[36px] font-semibold text-[#FDFDFD]">
                  &euro;
                  {/* Nota: è necessario implementare la logica per calcolare il prezzo totale (prezzo base + extraCost) */}
                  {product.product?.offer_price}
                </h2>
              </div>
            </div>
          </div>

          {/*
          // SEZIONE NINTENDO COLORE - Commentata nel codice originale, lasciata così.
          */}

          {/*
          // SEZIONE XBOX: Selezione del Modello
          */}
          {productType === "xbox" && product.meta?.models?.length > 1 && (
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
                            ? `text-[#3BAE3B] bg-[#FDFDFD] border-transparent`
                            : "text-[#FDFDFD] bg-transparent border-[#FDFDFD]"
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
          {/*
          // SEZIONE PLAYSTATION: Selezione della Versione
          */}
          {productType === "playstation" &&
            product.meta?.models?.length > 1 && (
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
                              ? `text-[#1861C0] bg-[#FDFDFD] border-transparent`
                              : "text-[#FDFDFD] bg-transparent border-[#FDFDFD]"
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

          {/*
          // SEZIONE CONTROLLER (Quantità) - RIUSO DI getConsoleColorClasses
          */}
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
                                "bg-white border-transparent",
                                "",
                                ""
                              )
                            : getConsoleColorClasses(
                                "text-[#FDFDFD] bg-transparent",
                                "border-white",
                                ""
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
          {/*
          // SEZIONE MEMORIA / GB (Capacità) - RIUSO DI getConsoleColorClasses
          */}
          {product.meta?.memoryOptions?.length > 1 && ( // Modificato da 'memory' a 'memoryOptions' per coerenza
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
                                  "bg-white border-transparent",
                                  "",
                                  ""
                                )
                              : getConsoleColorClasses(
                                  "text-[#FDFDFD] bg-transparent",
                                  "border-[#FDFDFD]", // Bordo bianco per le non selezionate
                                  ""
                                )
                          }
                        `}>
                        {isSelected ? (
                          <Check className={isSelected ? `h-8 w-8` : ""} />
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
          {/*
          // SEZIONE CONDIZIONI (Stato del Prodotto) - RIUSO DI getConsoleBgClasses
          */}
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
                              "bg-white border-transparent",
                              "",
                              ""
                            )
                          : getConsoleBgClasses(
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

          {/*
          // SEZIONE PERMUTA (Trade-In)
          */}
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
                // Lo stato selezionato è true se 'SI' è selezionato E la permuta è aperta (o dati presenti)
                // O se 'NO' è selezionato E la permuta è chiusa (o dati non presenti).
                const isSelected =
                  (value === "SI" && isOpenTradeIn) ||
                  (value === "NO" && !isOpenTradeIn);

                return (
                  <div
                    key={value}
                    onClick={() => {
                      if (value === "SI") {
                        handleOpenModal(); // Apre/Chiude il modale
                      } else if (isOpenTradeIn) {
                        // Selezionando NO, chiudi e resetta se era attivo
                        handleCloseModal();
                        // Se necessario, aggiungi qui l'azione per resettare il valore della permuta
                      }
                    }}
                    className={`
                      text-3xl border-4 font-bold py-12 text-center 
                      flex flex-col items-center justify-center rounded-lg cursor-pointer
                      ${
                        isSelected
                          ? getConsoleColorClasses(
                              "bg-white border-transparent",
                              "",
                              ""
                            )
                          : getConsoleBgClasses(
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

            <div className="px-5 pb-4">
              <p className="text-[#FDFDFD] text-sm">
                <span className="font-bold">Trade-in price:</span> Il prezzo
                trade-in mette in evidenza quanto risparmierai se con l'acquisto
                di una console ci invierai il tuo vecchio dispositivo.
              </p>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* NUOVA SEZIONE: Prezzo Dopo Permuta (Visibile solo se permuta attiva E dati presenti) */}
            {/* ------------------------------------------------------------------ */}
            {isOpenTradeIn && modalTradeInData && (
              <div
                // Il contenitore del contenuto Trade-In deve avere il colore della console come sfondo.
                className="p-4 rounded-lg  space-y-4 ">
                <h3 className="text-[#FDFDFD] text-lg font-semibold">
                  After trade-in price
                </h3>

                {/* 1. Valore del dispositivo valutato (SFONDO BIANCO) */}
                <div className="flex items-center justify-between p-4 bg-[#FDFDFD] rounded-lg shadow-md">
                  <p className="text-[#101010] font-medium">
                    Abbiamo valutato il tuo dispositivo:
                  </p>
                  <p className="text-[#101010] font-bold">
                    &euro;{tradeInValue.toFixed(2)}
                  </p>
                </div>

                {/* 2. Prezzo Finale del Prodotto (SFONDO BIANCO) */}
                <div className="p-4 rounded-lg shadow-xl bg-[#FDFDFD]">
                  <div className="flex items-start justify-between">
                    <p className="text-[#101010] text-xl font-bold">
                      {modalTradeInData.productName}
                    </p>
                    <div className="text-right">
                      {/* Prezzo Originale Barrato */}
                      <p className="text-[#101010] text-lg line-through opacity-70">
                        &euro;{basePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[#101010] text-base">
                      {/* Qui dovrai inserire i dettagli del prodotto in permuta, se li hai salvati nello stato. */}
                      {/* Esempio nello screenshot: "Lite | Turchese" */}
                      {/* Assumendo che 'product' sia il prodotto *acquistato*, non quello permutato: */}
                      {selectedModel} | {selectedCondition}
                    </p>

                    {/* Prezzo Finale in Arancione */}
                    <p className="text-orange-500 text-[36px] font-extrabold leading-none">
                      &euro;{finalPriceAfterTrade.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Il bottone Aggiungi al Carrello fa parte del layout principale, ma se volessi includerlo qui con lo sfondo colorato: */}
                {/* <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 w-full text-[#FDFDFD] font-semibold h-12 rounded-lg mt-4">
              AGGIUNGI AL CARRELLO
            </button> */}
              </div>
            )}
            {/* ------------------------------------------------------------------ */}

            {isModalOpen && <ConsoleModal />}
          </div>
        </div>
        {/* submit button */}
        <div className="sticky bottom-0 z-50 p-2.5 ">
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 w-full text-[#FDFDFD] font-semibold h-12 rounded-lg">
            Aggiungi al carrello
          </button>
        </div>
        {/* ------------------------------------------------------------------ */}
        {/* NUOVA SEZIONE: Vantaggi e Pagamento a Rate */}
        {/* ------------------------------------------------------------------ */}
        <TrustSection className="px-5 py-4" innerBlockBgClass="bg-[#FDFDFD]" />{" "}
        {/* ------------------------------------------------------------------ */}
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
          <ReviewCarousel productName={product.name} theme={productTheme} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
