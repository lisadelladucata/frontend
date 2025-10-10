/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
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
import ProductReviewCarousel from "@/components/share/review-carousel/ProductReviewCarousel";

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
  const modalState = useSelector((state: RootState) => state?.modal?.modal);
  const isOpenTradeIn = useSelector(
    (state: RootState) => state?.showTradeInData?.isOpenTradeIn
  );

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

  const product = singleProduct.data;
  const productType = product.product?.product_type as string;
  const basePrice = product.product?.offer_price || 0;

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

  const handleTrade = () => {
    dispatch(toggleModal());
  };

  // const startOver = () => {
  //   dispatch(toggleModal());
  // };

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

  // All'interno di ProductDetailsPage, vicino ad ACCORDION_ITEMS
  const FAQ_ITEMS = [
    {
      question: "Le console sono nuove o ricondizionate?",
      answer:
        "Tutte le console che vendiamo sono ricondizionate (refurbished) e certificate dal nostro team di tecnici specializzati. Garantiamo standard di qualità elevatissimi.",
    },
    {
      question: "Le console ricondizionate hanno garanzia?",
      answer:
        "Sì. Ogni console ricondizionata è coperta da garanzia come da normativa vigente. Offriamo 12 mesi di garanzia diretta su tutti i componenti hardware.",
    },
    {
      question: "Quanto dura la garanzia e cosa copre?",
      answer:
        "La garanzia standard dura 12 mesi e copre qualsiasi difetto hardware non dovuto a uso improprio o danni accidentali. Per i dettagli completi, consultare i Termini e Condizioni.",
    },
    {
      question: "Le console includono tutti i cavi per il funzionamento?",
      answer:
        "Sì, ogni console include un controller, il cavo di alimentazione e il cavo HDMI necessari per iniziare subito a giocare.",
    },
  ];

  // Contenuto dinamico per l'accordion (Descrizione Prodotto)
  const dynamicDescriptionContent = (
    <div className="text-[#FDFDFD] space-y-4">
      <p className="font-bold">{product.product?.name} - Console Portatile</p>
      <p>
        {/* Assumiamo che qui vada la descrizione lunga (long_description) */}
        La console è la versione compatta e leggera della celebre console{" "}
        {product.product?.name}, pensata per il gioco esclusivamente portatile.
        Con il suo design elegante e i comandi integrati, è perfetta per
        divertirsi ovunque.
      </p>

      <p className="font-bold text-lg pt-2">Specifiche Tecniche</p>
      <ul className="list-none space-y-1 text-sm">
        {/* Mappa le specifiche se esistono */}
        {product.product?.technical_specs?.map(
          (spec: { label: string; value: string }, index: number) => (
            <li key={index}>
              <span className="font-bold">{spec.label}:</span> {spec.value}
            </li>
          )
        ) || (
          // Dati di fallback/esempio se la prop non è definita
          <>
            <li>
              <span className="font-bold">Schermo:</span> Dati non disponibili.
            </li>
            <li>
              <span className="font-bold">Memoria:</span> Dati non disponibili.
            </li>
          </>
        )}
      </ul>

      <p className="pt-2">
        La console {product.product?.name} è la scelta ideale per chi cerca una
        console maneggevole, leggera e dedicata al gioco in mobilità.
      </p>
    </div>
  );

  // Componente per le singole domande e risposte delle FAQ
  const FaqAccordion = () => {
    // Stato per tenere traccia di quale domanda è aperta
    const [openFaq, setOpenFaq] = useState(
      "Le console ricondizionate hanno garanzia?"
    );
    // Ho preimpostato la seconda domanda come aperta per replicare l'immagine

    // Replicazione degli stili di sfondo per l'accordion principale
    const baseAccordionBg =
      productType === "xbox"
        ? "bg-[#3BAE3B]" // Verde di base per Xbox
        : productType === "playstation"
        ? "bg-[#1861C0]"
        : productType === "nintendo"
        ? "bg-[#D61D1E]"
        : "bg-gray-700";

    const activeHeaderBg =
      productType === "xbox"
        ? "bg-green-700" // Verde scuro per l'header attivo
        : productType === "playstation"
        ? "bg-blue-800"
        : productType === "nintendo"
        ? "bg-red-800"
        : "bg-gray-800";

    // Colore del separatore (bianco/grigio molto chiaro)
    const separatorClass = "border-[#FDFDFD]";

    return (
      // CAMBIAMENTO: Aggiunto spazio verticale tra i blocchi FAQ (es. space-y-4)
      <div className="space-y-4 max-w-xl">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openFaq === item.question;
          const currentBgClass = isOpen ? activeHeaderBg : baseAccordionBg;

          // CAMBIAMENTO: Classi per arrotondare gli angoli in base alla posizione e allo stato
          let roundedClasses = "";
          if (isOpen) {
            // Se è aperto, gli angoli in alto sono arrotondati, quelli in basso no (per far attaccare il contenuto)
            roundedClasses = "rounded-t-lg";
          } else {
            // Se è chiuso, l'intero blocco è arrotondato (tutti e quattro gli angoli)
            roundedClasses = "rounded-lg";
          }

          return (
            // Rimosso il vecchio topBorder, ora ogni blocco è separato da space-y-4
            <div key={item.question} className="pb-0 overflow-hidden shadow-lg">
              {" "}
              {/* Aggiunto overflow-hidden e un'ombra opzionale */}
              {/* Domanda (Header) */}
              <div
                className={`p-4 flex items-start justify-between cursor-pointer transition-colors duration-200 
                          ${currentBgClass} ${roundedClasses}`}
                onClick={() => setOpenFaq(isOpen ? "" : item.question)}>
                <h4 className="font-medium text-base text-[#FDFDFD] pr-4">
                  {item.question}
                </h4>

                {/* Icona Plus/Minus */}
                {isOpen ? (
                  <Minus className="h-6 w-6 text-[#FDFDFD] flex-shrink-0" />
                ) : (
                  <Plus className="h-6 w-6 text-[#FDFDFD] flex-shrink-0" />
                )}
              </div>
              {/* Risposta (Contenuto) */}
              {isOpen && (
                <div
                  // Arrotonda gli angoli in basso solo quando è aperto.
                  // Manteniamo la linea di separazione interna col border-t.
                  className={`${baseAccordionBg} p-4 pt-2 border-t ${separatorClass} rounded-b-lg`}>
                  <p className="text-[#FDFDFD] text-sm">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  const ACCORDION_ITEMS = [
    { title: "Descrizione Prodotto", content: dynamicDescriptionContent },
    {
      title: "Garanzia Console Locker",
      content: (
        <p className="text-[#FDFDFD]">
          Le nostre console ricondizionate sono coperte da una garanzia completa
          di 12 mesi contro difetti di fabbricazione. Per maggiori dettagli,
          consulta la nostra sezione termini e condizioni.
        </p>
      ),
    },
    {
      title: "FAQ",
      // Ora usiamo il nuovo componente FAQ annidato
      content: <FaqAccordion />,
    },
  ];

  // ===================================================================
  // 6. COMPONENTE INTERNO (Accordion Item)
  // ===================================================================
  const AccordionItem = ({
    title,
    content,
  }: {
    title: string;
    content: React.ReactNode;
  }) => {
    const isOpen = openAccordion === title;

    const activeBgClass =
      productType === "xbox"
        ? "bg-[#46aa48]"
        : productType === "playstation"
        ? "bg-[#003caa]"
        : productType === "nintendo"
        ? "bg-[#db2220]"
        : "bg-gray-700";

    const darkBgClass =
      productType === "xbox"
        ? "bg-[#72c470]" // Leggermente più scuro di #46aa48
        : productType === "playstation"
        ? "bg-[#012b81]" // Leggermente più scuro di #003caa
        : productType === "nintendo"
        ? "bg-[#a41622]"
        : "bg-gray-800"; // Leggermente più scuro di #db2220

    const separatorClass = "border-[#FDFDFD]";

    return (
      // Contenitore principale, ora con il bordo superiore dinamico
      <div
        className={`mb-0 ${isOpen ? "" : "pb-0"} border-t-2 ${separatorClass}`}>
        {/* Header (Sempre colore console, testo bianco) */}
        <div
          // Colore condizionale: usa darkBgClass se APERTO, usa activeBgClass se CHIUSO
          // Aggiunto border-b-2 e separatorClass (bianco)
          className={`p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 
                            ${activeBgClass} border-b-2 ${separatorClass}`}
          onClick={() => setOpenAccordion(isOpen ? "" : title)}>
          {/* Testo Bianco */}
          <h3 className="font-semibold text-lg text-[#FDFDFD]">{title}</h3>
          {/* Icona Bianca */}
          {isOpen ? (
            <ChevronUp className="h-6 w-6 text-[#FDFDFD]" />
          ) : (
            <ChevronDown className="h-6 w-6 text-[#FDFDFD]" />
          )}
        </div>

        {/* Contenuto (Espandibile) */}
        {isOpen && (
          <div className={`${isOpen ? darkBgClass : activeBgClass} p-4 pt-2`}>
            {content}
          </div>
        )}
      </div>
    );
  };
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
                    {selectedModel} | {selectedController} | {selectedMemory} |
                    {selectedCondition}
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
                        handleTrade(); // Apre/Chiude il modale
                      } else if (isOpenTradeIn) {
                        // Selezionando NO, chiudi e resetta se era attivo
                        handleTrade();
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

            {modalState && <ConsoleModal />}
          </div>
        </div>
        {/* submit button */}
        <div className="p-2.5  sticky bottom-0 left-0 right-0 z-10">
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 w-full text-[#FDFDFD] font-semibold h-12 rounded-lg">
            Aggiungi al carrello
          </button>
        </div>
        {/* ------------------------------------------------------------------ */}
        {/* NUOVA SEZIONE: Vantaggi e Pagamento a Rate */}
        {/* ------------------------------------------------------------------ */}
        <div className="px-5 py-4">
          {/* 1. Blocchetto Pagamento a Rate */}
          <div
            className={`p-4 mb-4 rounded-lg shadow-md bg-[#FDFDFD] border 
                      ${
                        productType === "xbox"
                          ? "border-[#3BAE3B]"
                          : productType === "playstation"
                          ? "border-[#1861C0]"
                          : productType === "nintendo"
                          ? "border-[#D61D1E]"
                          : "border-gray-300"
                      }`}>
            <div className="flex items-center justify-center space-x-2">
              <p className="text-xl font-bold text-[#101010]">
                Paga in 3 rate con
              </p>
              <Image
                src="/payments/paypal2.svg" // Assicurati che il percorso sia corretto
                alt="PayPal"
                width={75} // Riduci la larghezza per renderla più simile a Klarna
                height={20}
                className="h-5 w-auto"
              />
              <p className="text-xl font-bold text-[#101010]">o</p>
              <Image
                src="/payments/klarna.png" // Assicurati che il percorso sia corretto
                alt="Klarna"
                width={40} // Riduci la larghezza per proporzione
                height={20}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-base text-center text-gray-700 mt-1">
              senza interessi ne costi aggiuntivi.
            </p>
          </div>

          {/* 2. Blocchetto Vantaggi (Garanzia, Spedizione, Reso) */}
          <div className="bg-[#FDFDFD] p-4 rounded-lg shadow-md space-y-4">
            {/* Vantaggio 1: Garanzia */}
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-gray-600 flex-shrink-0" />
              <p className="text-lg text-[#101010] font-medium">
                Riconfezionato -{" "}
                <span className="font-bold">12 Mesi di garanzia.</span>
              </p>
            </div>

            {/* Vantaggio 2: Spedizione */}
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-gray-600 flex-shrink-0" />
              <p className="text-lg text-[#101010] font-medium">
                <span className="font-bold">Spedizione Veloce e Gratuita.</span>
              </p>
            </div>

            {/* Vantaggio 3: Reso */}
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 text-gray-600 flex-shrink-0" />
              <p className="text-lg text-[#101010] font-medium">
                Hai cambiato idea?
                <span className="font-bold">Il reso è gratuito.</span>
              </p>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------------------ */}
        {/* ACCORDION (Descrizione, Garanzia, FAQ) */}
        <div className="px-5 pb-8 mt-6">
          {ACCORDION_ITEMS.map((item) => (
            <AccordionItem
              key={item.title}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
        <div className="mt-6">
          <ProductReviewCarousel productName={product.name} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
