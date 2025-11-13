"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";

type AccordionSectionKey =
  | "Descrizione Prodotto"
  | "Garanzia Console Locker"
  | "FAQ";

interface ProductAccordionProps {
  productName: string;
  productType: string;
  productSpecs: { label: string; value: string }[] | undefined;
  productDescription: string;
  modelDes: string | undefined;
  controllerDes: string | undefined;
  memoryDes: string | undefined;
  conditionDes: string | undefined;

  visibleSections?: AccordionSectionKey[];
}

// ------------------------------------------------------------------
// DATI FAQ
// ------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    question: "Cosa significa ricondizionata?",
    answer:
      "Una console ricondizionata è una console che è stata precedentemente usata, ma che è stata riportata a una condizione pari al nuovo. Il nostro processo di ricondizionamento include test approfonditi, pulizia completa e, se necessario, la sostituzione dei componenti difettosi (come la ventola o la pasta termica) per garantire che funzioni in modo impeccabile, proprio come una console nuova.",
  },
  {
    question:
      "Qual è la differenza tra una console usata e una ricondizionata?",
    answer:
      "Una console usata viene venduta così com'è, senza alcun controllo o garanzia sulla sua funzionalità. Al contrario, una console ricondizionata passa attraverso un rigoroso processo di rigenerazione e viene testata in ogni sua parte. La nostra priorità è garantirti un prodotto perfettamente funzionante e affidabile, con il vantaggio di un prezzo più conveniente.",
  },
  {
    question: "Come fate a garantire la qualità delle console?",
    answer:
      "Ogni console che arriva nel nostro laboratorio viene sottoposta a una serie di oltre 30 test di controllo. Controlliamo ogni aspetto, dal corretto funzionamento di porte, lettore di dischi e connettività, fino alla stabilità delle prestazioni durante lunghe sessioni di gioco. Solo dopo aver superato tutti i test, la console viene approvata per la vendita.",
  },
  {
    question: "Posso restituire la console se non sono soddisfatto?",
    answer:
      "Assolutamente sì. Oltre alla garanzia, hai il diritto di recesso entro 14 giorni dalla ricezione del prodotto, senza dover fornire alcuna motivazione. Se la console non soddisfa le tue aspettative, puoi restituirla e riceverai il rimborso completo. Vogliamo che tu sia pienamente soddisfatto del tuo acquisto.",
  },
  {
    question: " I cavi sono inclusi?",
    answer:
      "Ogni console viene venduta completa di tutti gli accessori essenziali per iniziare a giocare subito, come i cavi di alimentazione e video e un controller. I controller e i cavi possono essere originali, sempre testati per garantire la stessa esperienza di gioco. Specifichiamo chiaramente nella descrizione del prodotto se un accessorio non è originale.",
  },
];

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
    <div className={`space-y-4 max-w-xl ${baseBg} z-100`}>
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

  const activeBgClass = useMemo(() => {
    if (productType === "xbox") return "bg-[#46aa48]";
    if (productType === "playstation") return "bg-[#003caa]";
    if (productType === "nintendo") return "bg-[#db2220]";
    return "bg-transparent";
  }, [productType]);

  const darkBgClass = useMemo(() => {
    if (productType === "xbox") return "bg-[#72c470]";
    if (productType === "playstation") return "bg-[#012b81]";
    if (productType === "nintendo") return "bg-[#a41622]";
    return "bg-white";
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
  visibleSections,
}) => {
  const [openAccordion, setOpenAccordion] = useState<string>(
    "Descrizione Prodotto"
  );

  const dynamicDescriptionContent = (
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

  const ALL_ACCORDION_ITEMS = [
    {
      title: "Descrizione Prodotto" as AccordionSectionKey,
      content: dynamicDescriptionContent,
    },
    {
      title: "Garanzia Console Locker" as AccordionSectionKey,
      content: (
        <p>
          Le nostre console ricondizionate sono coperte da una garanzia completa
          di 12 mesi contro difetti di fabbricazione. Per maggiori dettagli,
          consulta la nostra sezione termini e condizioni.
        </p>
      ),
    },
    {
      title: "FAQ" as AccordionSectionKey,
      content: <FaqAccordion productType={productType} />,
    },
  ];

  const ACCORDION_ITEMS = useMemo(() => {
    if (visibleSections && visibleSections.length > 0) {
      return ALL_ACCORDION_ITEMS.filter((item) =>
        visibleSections.includes(item.title)
      );
    }
    return ALL_ACCORDION_ITEMS;
  }, [visibleSections, ALL_ACCORDION_ITEMS]);

  const containerBgClass = useMemo(() => {
    if (productType === "xbox") return "bg-[#46aa48]";
    if (productType === "playstation") return "bg-[#003caa]";
    if (productType === "nintendo") return "bg-[#db2220]";
    return "bg-transparent";
  }, [productType]);

  React.useEffect(() => {
    if (
      ACCORDION_ITEMS.length > 0 &&
      !ACCORDION_ITEMS.find((item) => item.title === openAccordion)
    ) {
      setOpenAccordion(ACCORDION_ITEMS[0].title);
    }
    if (ACCORDION_ITEMS.length === 0) {
      setOpenAccordion("");
    }
  }, [ACCORDION_ITEMS, openAccordion]);

  return (
    <div className={`py-8 lg:py-16 ${containerBgClass}`}>
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
