/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toggleModal } from "@/redux/features/modal/modalSlice";
import {
  useGetSingleProductQuery,
  useGetAllProductsQuery,
  useGetEstimateProductPriceMutation,
} from "@/redux/features/products/ProductAPI";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toggleTradeIn } from "@/redux/features/tradeIn/showTradeInSlice";
import Loading from "@/app/loading";
import { addModalTradeInData } from "@/redux/features/modalTradeInData/ModalTradeInData";

// Variabili d'ambiente (IMPORTANTE: assicurati che sia configurata correttamente)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ======================================================================
// 1. DEFINIZIONI E MOCK
// ======================================================================

interface Question {
  id: string;
  text: string;
  description?: string;
  step: number;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1_condizione_estetica",
    text: "In che condizioni è la tua console?",
    step: 1,
    options: [
      { value: "brand_new", label: "Brand New" },
      { value: "good", label: "Good" },
      { value: "not_bad", label: "Not Bad" },
    ],
  },
  {
    id: "q2_difetti_tecnici",
    text: "La console è priva di difetti tecnici?",
    step: 1,
    options: [
      { value: "si_perfetta", label: "Sì" },
      { value: "no_difetti", label: "No" },
    ],
  },
  {
    id: "q3_accessori_originali",
    text: "Sono compresi gli accessori originali?",
    step: 2,
    options: [
      { value: "si_completi", label: "Sì" },
      { value: "no_mancano", label: "No" },
    ],
  },
  {
    id: "q4_numero_controller",
    text: "Quanti controller ci invierai?",
    step: 3,
    options: [
      { value: "zero", label: "0" },
      { value: "uno", label: "1" },
      { value: "due", label: "2" },
    ],
  },
  {
    id: "q5_memoria",
    text: "Memoria di archiviazione del dispositivo?",
    step: 4,
    options: [
      { value: "1tb", label: "1 Terabyte" },
      { value: "500gb", label: "500 Gigabyte" },
    ],
  },
  {
    id: "q6_scatola_originale",
    text: "Possiedi la scatola e l'imballo originale?",
    step: 5,
    options: [
      { value: "si_scatola", label: "Sì" },
      { value: "no_scatola", label: "No" },
    ],
  },
];

// ======================================================================
// 2. COMPONENTE CustomModal (Componente UI per la Modale)
// ======================================================================

interface CustomModalProps {
  open: boolean;
  onCancel: () => void;
  // Queste due props sono presenti per mantenere la compatibilità con il tipo
  onTradeInComplete: (tradeInData: any) => void;
  productType: string;
  productName: string;
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onCancel,
  children,
  // ... le altre prop non sono usate qui
}) => {
  // Gestisce la chiusura quando si clicca sullo sfondo scuro
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleBackdropClick}>
      <div
        className="relative w-full max-w-lg mx-4 bg-[#eae9ef] rounded-2xl shadow-2xl transition-transform duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
};

// ======================================================================
// 3. COMPONENTE ConsoleModal (Logica Principale Trade-In)
// ======================================================================

const ConsoleModal: React.FC = () => {
  // 🔥 Legge lo stato di apertura direttamente da Redux.
  const isModalOpen = useSelector((state: RootState) => state.modal.modal);
  const dispatch = useDispatch();

  // ----------------------- STATI INTERNI -----------------------
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConsoleImage, setSelectedConsoleImage] = useState<
    string | null
  >(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedPlatform, setSelectedPlatform] =
    useState<string>("Playstation");
  const [selectedConsole, setSelectedConsole] = useState("");
  const [estimatePrice, setEstimatePrice] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);

  const FINAL_STEP_INDEX = 6;
  const TOTAL_QUESTION_STEPS = 5;

  // ----------------------- HOOKS API -----------------------
  const params = useParams();
  const [slug] = useState(params.slug);

  const [getEstimateProductPrice] = useGetEstimateProductPriceMutation();

  const { data: productData, isLoading } = useGetSingleProductQuery(
    { slug: productId as string },
    { skip: !productId }
  );

  const { data: consoleLists } = useGetAllProductsQuery({ limit: 10 });

  // ----------------------- FUNZIONI DI GESTIONE MODALE -----------------------

  // 🔥 Funzione per chiudere la modale tramite Redux e resettare lo stato interno
  const handleCancel = () => {
    dispatch(toggleModal());
    // Resetta lo step e le risposte per la prossima apertura
    setCurrentStep(0);
    setAnswers({});
    setProductId(null);
  };

  // Funzione mock per soddisfare il tipo (non usata nella logica Redux)
  const mockTradeInComplete = (tradeInData: any) => {
    console.log("Trade-in completato (Mock)", tradeInData);
  };

  const getAnswerLabel = useCallback(
    (questionId: string, answerValue: string): string => {
      const question = MOCK_QUESTIONS.find((q) => q.id === questionId);
      const option = question?.options.find((opt) => opt.value === answerValue);

      if (questionId === "q1_condizione_estetica")
        return option?.label || answerValue;
      if (questionId === "q2_difetti_tecnici")
        return `Difetti tecnici: ${option?.label || answerValue}`;
      if (questionId === "q3_accessori_originali")
        return `Accessori originali: ${option?.label || answerValue}`;
      if (questionId === "q4_numero_controller")
        return `${option?.label || answerValue} Controller`;
      if (questionId === "q5_memoria") return `${option?.label || answerValue}`;
      if (questionId === "q6_scatola_originale")
        return `Scatola originale: ${option?.label || answerValue}`;

      return option?.label || answerValue;
    },
    []
  );

  const calculateTradeInValue = useCallback(
    (currentAnswers: Record<string, string>) => {
      // Logica per calcolare il prezzo (ora è un mock randomico)
      setEstimatePrice(Math.floor(Math.random() * (400 - 100 + 1) + 100));
    },
    []
  );

  const addTradeIn = async () => {
    const data = {
      productName: selectedConsole as string,
      productPrice: estimatePrice as number,
    };

    dispatch(addModalTradeInData(data));
    dispatch(toggleTradeIn());

    // 🔥 Chiude la modale tramite Redux
    dispatch(toggleModal());
    // Resetta lo step dopo la chiusura
    setCurrentStep(0);
  };

  // ----------------------- FUNZIONE DI RENDERING CONTENUTO -----------------------

  const renderContent = (): React.JSX.Element | null => {
    if (isLoading) return <Loading />;

    // Mappe Colori (Centralizzate)
    const cardBgColors: Record<string, string> = {
      playstation: "bg-blue-600",
      xbox: "bg-green-600",
      nintendo: "bg-red-600",
    };
    const buttonBgColors: Record<string, string> = {
      playstation: "bg-blue-600 hover:bg-blue-700",
      xbox: "bg-green-600 hover:bg-green-700",
      nintendo: "bg-red-600 hover:bg-red-700",
    };

    const targetProductType = selectedPlatform.toLowerCase();
    const buttonColorClass =
      buttonBgColors[targetProductType] || "bg-orange-500 hover:bg-orange-600";
    const selectionColorClass =
      cardBgColors[targetProductType] || "bg-blue-600";

    // ----------------------------------------------------------------------
    // --- STEP 0: Scelta Console ---
    // ----------------------------------------------------------------------
    if (currentStep === 0) {
      const isConsoleSelected = !!productId;

      const filteredConsoles =
        consoleLists?.data?.products?.filter(
          (consoleItem: any) => consoleItem?.product_type === targetProductType
        ) || [];

      return (
        <div className="w-full flex flex-col h-full max-h-[50vh] ">
          <div className="p-2 bg-white sticky top-0 z-10 border-b border-gray-100 rounded-lg ">
            <h2 className="text-lg font-semibold text-gray-800 text-left text-center">
              Quale console vuoi far valutare?
            </h2>
          </div>

          <div className="px-4 pt-4 flex flex-col flex-grow">
            {/* 1. FILTRI */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
              {["Playstation", "Xbox", "Nintendo"].map((platform) => (
                <button
                  key={platform}
                  onClick={() => {
                    setSelectedPlatform(platform);
                    setProductId(null);
                    setSelectedConsole("");
                  }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors duration-150 ${
                    selectedPlatform === platform
                      ? `${buttonColorClass} text-white`
                      : "text-gray-700"
                  }`}>
                  {platform}
                </button>
              ))}
            </div>

            {/* 2. LISTA DELLE CONSOLE */}
            <div className="flex flex-col gap-2 overflow-y-auto flex-grow pb-4 -mx-4 px-4 max-h-[250px]">
              {filteredConsoles.length > 0 ? (
                filteredConsoles.map((consoleItem: any) => {
                  const isSelected = productId === consoleItem._id;
                  const cardColor =
                    cardBgColors[consoleItem.product_type] || "bg-gray-700";
                  const consoleImageUrl = `${API_URL}${consoleItem?.images[0]}`;

                  return (
                    <div
                      key={consoleItem?._id}
                      onClick={() => {
                        if (productId !== consoleItem?._id) {
                          setSelectedConsole(consoleItem?.name);
                          setProductId(consoleItem?._id);
                          setSelectedConsoleImage(consoleImageUrl); // Aggiunto per riepilogo
                        } else {
                          setProductId(null);
                          setSelectedConsole("");
                          setSelectedConsoleImage(null);
                        }
                      }}
                      className={`
                        flex items-center gap-4 min-h-[100px] cursor-pointer rounded-lg transition-colors duration-200
                        ${
                          isSelected
                            ? `${cardColor} text-white`
                            : "bg-white border-b border-gray-100 hover:bg-gray-50"
                        }
                      `}>
                      <div className="relative w-[100px] h-[70px] flex items-center justify-center flex-shrink-0">
                        <Image
                          src={consoleImageUrl}
                          width={100}
                          height={70}
                          alt={consoleItem?.name}
                          className="object-contain flex-shrink-0"
                        />
                      </div>
                      <span
                        className={`text-xl font-bold leading-snug ${
                          isSelected ? "text-white" : "text-gray-800"
                        }`}>
                        {consoleItem?.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 pt-8">
                  Nessuna console {selectedPlatform} trovata.
                </p>
              )}
            </div>
          </div>

          {/* Footer Fisso con pulsante Continua */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-lg shadow-xl">
            <button
              onClick={() => {
                if (isConsoleSelected) {
                  setCurrentStep(1); // Vai al primo blocco di domande
                  setCurrentQuestionIndex(0); // Inizia dalla prima domanda
                }
              }}
              disabled={!isConsoleSelected}
              className={`
                w-full py-3 rounded-xl text-lg font-bold text-white transition-opacity duration-200
                ${
                  isConsoleSelected
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-400 cursor-not-allowed opacity-70"
                }
              `}>
              CONTINUA
            </button>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------------------------
    // --- STEP 1, 2, 3, 4, 5: Blocchi di Domande ---
    // ----------------------------------------------------------------------
    if (currentStep >= 1 && currentStep <= TOTAL_QUESTION_STEPS) {
      const allQuestions: Question[] =
        productData?.data?.questions || MOCK_QUESTIONS;
      const allQuestionsForStep = allQuestions.filter(
        (q) => q.step === currentStep
      );
      const currentQuestion = allQuestionsForStep[currentQuestionIndex];
      const isLastQuestionInStep =
        currentQuestionIndex === allQuestionsForStep.length - 1;

      if (!currentQuestion) {
        return null;
      }

      const handleAnswer = (answerValue: string) => {
        const questionId = currentQuestion.id || currentQuestion.text;
        setAnswers({
          ...answers,
          [questionId]: answerValue,
        });
      };

      const handleContinue = () => {
        if (isLastQuestionInStep) {
          if (currentStep < TOTAL_QUESTION_STEPS) {
            setCurrentStep(currentStep + 1);
            setCurrentQuestionIndex(0);
          } else {
            calculateTradeInValue(answers);
            setCurrentStep(FINAL_STEP_INDEX);
          }
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      };

      const selectedAnswerValue =
        answers[currentQuestion.id || currentQuestion.text];

      return (
        <div className="w-full flex flex-col h-full max-h-[70vh]">
          {/* Header: Titolo Domanda e Pulsante Indietro */}
          <div className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100 rounded-lg flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800 text-center w-full pr-10 text-center">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Corpo: Opzioni di Risposta (Scorrevole) */}
          <div className="px-4 pt-4 flex flex-col flex-grow overflow-y-auto">
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option: any) => {
                const isSelected = selectedAnswerValue === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`
                      py-5 px-4 border rounded-xl text-center text-3xl font-bold transition-all duration-150 shadow-md
                      ${
                        isSelected
                          ? `${selectionColorClass} text-white border-0`
                          : "bg-white border-gray-300 text-gray-800 hover:border-gray-500"
                      }
                    `}>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Fisso con Pulsante CONTINUA */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-4 rounded-lg shadow-xl ">
            <button
              onClick={handleContinue}
              disabled={!selectedAnswerValue}
              className={`
                w-full py-3 rounded-xl text-lg font-bold text-white transition-opacity duration-200
                ${
                  selectedAnswerValue
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-400 cursor-not-allowed opacity-70"
                }
              `}>
              {isLastQuestionInStep && currentStep === TOTAL_QUESTION_STEPS
                ? "VEDI VALORE"
                : "CONTINUA"}
            </button>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------------------------
    // --- 🟢 STEP 6: Riepilogo Finale ---
    // ----------------------------------------------------------------------
    if (currentStep === FINAL_STEP_INDEX) {
      const conditionAnswer = getAnswerLabel(
        "q1_condizione_estetica",
        answers["q1_condizione_estetica"] || ""
      );
      const controllerAnswer = getAnswerLabel(
        "q4_numero_controller",
        answers["q4_numero_controller"] || ""
      );
      const memoryAnswer = getAnswerLabel(
        "q5_memoria",
        answers["q5_memoria"] || ""
      );
      const technicalDefects = getAnswerLabel(
        "q2_difetti_tecnici",
        answers["q2_difetti_tecnici"] || ""
      );
      const accessories = getAnswerLabel(
        "q3_accessori_originali",
        answers["q3_accessori_originali"] || ""
      );
      const boxAnswer = getAnswerLabel(
        "q6_scatola_originale",
        answers["q6_scatola_originale"] || ""
      );

      const mainDetails = [memoryAnswer, controllerAnswer]
        .filter(Boolean)
        .join(" | ");

      return (
        <div className="w-full min-h-[500px] p-4 flex flex-col">
          <h2 className="flex items-center gap-5 text-lg font-semibold text-[#101010] mt-4">
            Il tuo prezzo Trade-in
          </h2>

          {/* Contenitore principale del riepilogo della console */}
          <div className="p-4 bg-white rounded-lg mt-4 flex flex-col shadow-md">
            <div className="flex gap-4 items-center">
              {/* Immagine Placehoder */}
              <div
                className={`relative w-[100px] h-[70px] bg-gray-200 rounded-lg flex-shrink-0`}>
                {selectedConsoleImage ? (
                  <Image
                    src={selectedConsoleImage}
                    width={100}
                    height={70}
                    alt={selectedConsole || "Console"}
                    className="object-contain"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-xs text-white ${
                      cardBgColors[targetProductType] || "bg-gray-500"
                    }`}>
                    {selectedPlatform.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Dettagli Console */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center pr-2">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {selectedConsole || "Console Selezionata"}
                  </h3>

                  {/* Riga Condizione Estetica + TOGGLE */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-gray-500 hover:text-gray-700 p-1 transition-transform duration-300 transform"
                    title={
                      showDetails ? "Nascondi dettagli" : "Mostra dettagli"
                    }>
                    <svg
                      className={`w-5 h-5 ${
                        showDetails ? "rotate-0" : "rotate-180"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Blocco Dettagli Risposte (Espandibile/Comprimibile) */}
            {showDetails && (
              <div className="border-t border-gray-200 mt-3 pt-3 text-sm space-y-1">
                <p className="text-sm text-gray-800 font-medium">
                  {conditionAnswer}
                </p>
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {mainDetails}
                </p>

                <p className="text-gray-600">{technicalDefects}</p>
                <p className="text-gray-600">{accessories}</p>
                <p className="text-gray-600">{boxAnswer}</p>
              </div>
            )}

            {/* Offerta Prezzo */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 GAP">
              <p className="text-lg font-semibold text-gray-800">
                La nostra offerta:
              </p>
              <h2 className="text-4xl font-semibold ">
                €{estimatePrice.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* Testo informativo in basso */}
          <p className="text-sm text-gray-500 leading-5 mt-4">
            Dopo aver inserito nel carrello il trade-in ti manderemo, nel giro
            di 1-3 giorni lavorativi, tutto l'occorrente per spedirci il tuo
            dispositivo gratuitamente. Quando riceveremo il tuo dispositivo ci
            riserveremo 2-3 giorni lavorativi per testarlo, dopodiché ti
            invieremo l'importo stimato.
          </p>

          {/* Bottoni finali */}
          <div className="flex gap-4 justify-end mt-10 bg-white">
            <button
              onClick={handleCancel}
              className="py-3 px-3 rounded-xl text-base font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
              SKIP TRADE-IN
            </button>
            <button
              onClick={() => addTradeIn()}
              className="py-3 px-6 rounded-xl text-base font-medium text-[#FDFDFD] bg-orange-500 hover:bg-orange-600 transition-colors">
              ADD TRADE-IN
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // ----------------------- COMPONENTE PRINCIPALE RETURN -----------------------

  return (
    <CustomModal
      open={isModalOpen} // Usa lo stato Redux DIRETTO
      onCancel={handleCancel} // Usa la funzione che chiude via Redux
      onTradeInComplete={mockTradeInComplete} // Funzione mock per il tipo
      productType={selectedPlatform.toLowerCase()}
      productName={selectedConsole || "Console"}>
      {renderContent()}
    </CustomModal>
  );
};

export default ConsoleModal;
