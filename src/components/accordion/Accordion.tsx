// src/components/products/ProductAccordion.tsx
"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";

// Definisci le prop del componente
interface ProductAccordionProps {
  productName: string;
  productType: string; // Es. "playstation", "xbox", "nintendo"
  productSpecs: { label: string; value: string }[] | undefined;
  productDescription: string;
  // Campi descrittivi aggiunti
  modelDes: string | undefined;
  controllerDes: string | undefined;
  memoryDes: string | undefined;
  conditionDes: string | undefined;
}

// ------------------------------------------------------------------
// DATI FAQ
// ------------------------------------------------------------------
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

// Helper per determinare il colore del testo (Bianco per Dark, Nero per Light)
const isDarkMode = (productType: string) =>
  ["xbox", "playstation", "nintendo"].includes(productType);
const getTextColorClass = (isDark: boolean) =>
  isDark ? "text-[#FDFDFD]" : "text-black";

// ------------------------------------------------------------------
// Componente interno per le FAQ
// ------------------------------------------------------------------
const FaqAccordion: React.FC<{ productType: string }> = ({ productType }) => {
  const [openFaq, setOpenFaq] = useState(
    "Le console ricondizionate hanno garanzia?"
  );

  const isDark = isDarkMode(productType);

  // LOGICA DEI COLORI
  const { baseBg, activeHeaderBg, separatorClass } = useMemo(() => {
    let base = "bg-gray-700";
    let active = "bg-gray-800";
    let separator = "border-[#FDFDFD]";

    if (productType === "xbox") {
      base = "bg-[#72c470] ";
      active = "bg-[#3BAE3B]";
    } else if (productType === "playstation") {
      base = "bg-[#012b81]";
      active = "bg-[#003caa]";
    } else if (productType === "nintendo") {
      base = "bg-[#a41622]";
      active = "bg-[#db2220]";
    } else {
      base = "bg-gray-100";
      active = "bg-gray-300";
      separator = "border-gray-400 ";
    }

    return { baseBg: base, activeHeaderBg: active, separatorClass: separator };
  }, [productType]);

  const textColorClass = getTextColorClass(isDark);

  return (
    <div className={`space-y-4 max-w-xl ${baseBg}`}>
      {FAQ_ITEMS.map((item) => {
        const isOpen = openFaq === item.question;
        let roundedClasses = isOpen ? "rounded-t-lg" : "rounded-lg";

        return (
          <div key={item.question} className="pb-0 overflow-hidden shadow-lg">
            {/* Domanda (Header) */}
            <div
              className={`p-4 flex items-start justify-between cursor-pointer transition-colors duration-200 
                          ${activeHeaderBg} ${roundedClasses}`}
              onClick={() => setOpenFaq(isOpen ? "" : item.question)}>
              <h4 className={`font-medium text-base pr-4 ${textColorClass}`}>
                {item.question}
              </h4>
              {isOpen ? (
                <Minus
                  className={`h-6 w-6 text-[#FDFDFD] flex-shrink-0 ${textColorClass}`}
                />
              ) : (
                <Plus
                  className={`h-6 w-6 text-[#FDFDFD] flex-shrink-0 ${textColorClass}`}
                />
              )}
            </div>
            {/* Risposta (Contenuto) - usa il colore base del contenitore */}
            {isOpen && (
              <div
                className={`${activeHeaderBg} p-4 pt-2 border-t ${separatorClass} rounded-b-lg `}>
                <p className={`text-[#FDFDFD] text-sm ${textColorClass}`}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------
// Componente interno per il singolo elemento dell'Accordion (Descrizione/Garanzia)
// ------------------------------------------------------------------
const AccordionItem: React.FC<{
  title: string;
  content: React.ReactNode;
  openAccordion: string;
  setOpenAccordion: React.Dispatch<React.SetStateAction<string>>;
  productType: string;
}> = ({ title, content, openAccordion, setOpenAccordion, productType }) => {
  const isOpen = openAccordion === title;
  const isDark = isDarkMode(productType);

  // activeBgClass = colore di base della sezione (per l'Header)
  const activeBgClass = useMemo(() => {
    if (productType === "xbox") return "bg-[#46aa48]";
    if (productType === "playstation") return "bg-[#003caa]";
    if (productType === "nintendo") return "bg-[#db2220]";
    return "bg-transparent"; // FALLBACK: Header light
  }, [productType]);

  // darkBgClass = colore più scuro (per il Contenuto)
  const darkBgClass = useMemo(() => {
    if (productType === "xbox") return "bg-[#72c470]";
    if (productType === "playstation") return "bg-[#012b81]";
    if (productType === "nintendo") return "bg-[#a41622]";
    return "bg-white"; // FALLBACK: Contenuto light
  }, [productType]);

  const separatorClass = useMemo(() => {
    return isDark ? "border-[#FDFDFD]" : "border-gray-400";
  }, [isDark]);

  const textColorClass = getTextColorClass(isDark);

  return (
    <div
      className={`mb-0 ${isOpen ? "" : "pb-0"} border-t-2 ${separatorClass}`}>
      {/* Header - usa il colore principale */}
      <div
        className={`p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 
                        ${activeBgClass} border-b-2 ${separatorClass}`}
        onClick={() => setOpenAccordion(isOpen ? "" : title)}>
        <h3 className={`font-semibold text-lg ${textColorClass}`}>{title}</h3>
        {isOpen ? (
          <ChevronUp className={`h-6 w-6 ${textColorClass}`} />
        ) : (
          <ChevronDown className={`h-6 w-6 ${textColorClass}`} />
        )}
      </div>

      {/* Contenuto - usa il colore scuro/light */}
      {isOpen && (
        <div className={`${darkBgClass} p-4 pt-2`}>
          {/* Avvolge il contenuto per applicare il colore del testo corretto */}
          <div className={`${textColorClass}`}>{content}</div>
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------------------
// COMPONENTE PRINCIPALE EXPORTATO
// ------------------------------------------------------------------
const Accordion: React.FC<ProductAccordionProps> = ({
  productName,
  productType,
  productSpecs,
  productDescription,
  modelDes,
  controllerDes,
  memoryDes,
  conditionDes,
}) => {
  const [openAccordion, setOpenAccordion] = useState<string>(
    "Descrizione Prodotto"
  );

  const dynamicDescriptionContent = (
    // Il colore del testo viene gestito dal parent AccordionItem
    <div className="space-y-4">
      <p className="font-bold">{productName}</p>
      <p>
        {productDescription ||
          `La console ${productName} è la versione compatta e leggera della celebre console, pensata per il gioco esclusivamente portatile.`}
      </p>

      {/* NUOVI CAMPI DESCRITTIVI */}
      <div className="space-y-2 pt-2">
        {modelDes && (
          <p>
            <span className="font-bold">Modello:</span> {modelDes}
          </p>
        )}
        {memoryDes && (
          <p>
            <span className="font-bold">Memoria:</span> {memoryDes}
          </p>
        )}
        {controllerDes && (
          <p>
            <span className="font-bold">Controller:</span> {controllerDes}
          </p>
        )}
        {conditionDes && (
          <p>
            <span className="font-bold">Condizione:</span> {conditionDes}
          </p>
        )}
      </div>
      {/* FINE NUOVI CAMPI */}

      <p className="font-bold text-lg pt-2">Specifiche Tecniche</p>
      <ul className="list-none space-y-1 text-sm">
        {productSpecs?.map((spec, index: number) => (
          <li key={index}>
            <span className="font-bold">{spec.label}:</span> {spec.value}
          </li>
        )) || (
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
    </div>
  );

  const ACCORDION_ITEMS = [
    { title: "Descrizione Prodotto", content: dynamicDescriptionContent },
    {
      title: "Garanzia Console Locker",
      content: (
        <p>
          Le nostre console ricondizionate sono coperte da una garanzia completa
          di 12 mesi contro difetti di fabbricazione. Per maggiori dettagli,
          consulta la nostra sezione termini e condizioni.
        </p>
      ),
    },
    {
      title: "FAQ",
      content: <FaqAccordion productType={productType} />,
    },
  ];

  // LOGICA DEI COLORI per il DIV CONTENITORE esterno (colore di base)
  const containerBgClass = useMemo(() => {
    if (productType === "xbox") return "bg-[#46aa48]";
    if (productType === "playstation") return "bg-[#003caa]";
    if (productType === "nintendo") return "bg-[#db2220]";
    return "bg-transparent"; // FALLBACK: Sfondo light
  }, [productType]);

  return (
    <div className={`py-8 lg:py-16 ${containerBgClass}`}>
      {/* Centra il contenuto se necessario (usa il tuo componente Container qui) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {ACCORDION_ITEMS.map((item) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            content={item.content}
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
            productType={productType}
          />
        ))}
      </div>
    </div>
  );
};

export default Accordion;
