/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toggleModal } from "@/redux/features/modal/modalSlice";
import {
  useGetSingleProductQuery,
  useGetAllProductsQuery,
} from "@/redux/features/products/ProductAPI";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import {
  addModalTradeInData,
  TradeInItem,
  TradeInDetails,
} from "@/redux/features/modalTradeInData/ModalTradeInData";
import { completeTradeInValuation } from "@/redux/features/tradeIn/showTradeInSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- INTERFACCE LOCALI ---
interface Question {
  id: string;
  text: string;
  description?: string;
  step: number;
  options: {
    value: string;
    label: string;
    description?: string;
    deduction?: number;
  }[];
}

interface CustomModalProps {
  open: boolean;
  onCancel: () => void;
  children?: React.ReactNode;
}

// --- DATI MOCK DELLE DOMANDE ---
const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1_condizione_estetica",
    text: "In che condizioni è la tua console?",
    step: 1,
    options: [
      { value: "brand_new", label: "New", deduction: 0 },
      { value: "good", label: "Good", deduction: -10 },
      { value: "not_bad", label: "Not Bad", deduction: -50 },
    ],
  },
  {
    id: "q2_difetti_tecnici",
    text: "La console è priva di difetti tecnici?",
    step: 1,
    options: [
      { value: "si_perfetta", label: "Sì", deduction: 0 },
      { value: "no_difetti", label: "No", deduction: -80 },
    ],
  },
  {
    id: "q3_accessori_originali",
    text: "Sono compresi gli accessori originali?",
    step: 2,
    options: [
      { value: "si_completi", label: "Sì", deduction: 0 },
      { value: "no_mancano", label: "No", deduction: -30 },
    ],
  },
  {
    id: "q4_numero_controller",
    text: "Quanti controller ci invierai?",
    step: 3,
    options: [
      { value: "zero", label: "0", deduction: -50 },
      { value: "uno", label: "1", deduction: 0 },
      { value: "due", label: "2", deduction: 30 },
    ],
  },
  {
    id: "q5_memoria",
    text: "Memoria di archiviazione del dispositivo?",
    step: 4,
    options: [
      { value: "1tb", label: "1 Terabyte", deduction: 0 },
      { value: "500gb", label: "500 Gigabyte", deduction: -20 },
    ],
  },
  {
    id: "q6_scatola_originale",
    text: "Possiedi la scatola e l'imballo originale?",
    step: 5,
    options: [
      { value: "si_scatola", label: "Sì", deduction: 0 },
      { value: "no_scatola", label: "No", deduction: -20 },
    ],
  },
];

// --- COMPONENTE CustomModal (Non modificato) ---
const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onCancel,
  children,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleBackdropClick}>
      <div
        className="w-full max-w-xl bg-[#eae9ef] rounded-t-2xl shadow-xl transition-all duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-400 rounded-full mx-auto mt-3 mb-2" />

        <div className="flex flex-col h-[calc(100%-16px)]">{children}</div>
      </div>
    </div>
  );
};

// --- COMPONENTE ConsoleModal ---
const ConsoleModal: React.FC = () => {
  const isModalOpen = useSelector((state: RootState) => state.modal.modal);
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState<number>(0);
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

  const params = useParams();

  const { data: productData, isLoading } = useGetSingleProductQuery(
    { slug: productId as string },
    { skip: !productId }
  );
  const { data: consoleLists } = useGetAllProductsQuery({ limit: 10 });

  const BASE_PRICE_DEFAULT = 400;
  const MIN_TRADE_IN_PRICE = 50;

  const calculateTradeInPrice = useCallback(
    (basePrice: number, currentAnswers: Record<string, string>): number => {
      let finalPrice = basePrice;

      // Usiamo le domande definite (sia mock che da API se productData le fornisce)
      const allQuestions: Question[] = MOCK_QUESTIONS; // Usiamo MOCK_QUESTIONS come fallback se l'API non ha 'questions'

      // Iteriamo su tutte le risposte
      for (const questionId in currentAnswers) {
        const selectedValue = currentAnswers[questionId];

        // Trova la domanda corrispondente
        const question = allQuestions.find((q) => q.id === questionId);

        if (question) {
          // Trova l'opzione selezionata
          const selectedOption = question.options.find(
            (opt) => opt.value === selectedValue
          );

          // Se l'opzione esiste e ha una deduzione, applicala.
          if (selectedOption && typeof selectedOption.deduction === "number") {
            finalPrice += selectedOption.deduction;
          }
        }
      }

      return Math.max(MIN_TRADE_IN_PRICE, finalPrice);
    },
    []
  );

  useEffect(() => {
    if (currentStep === FINAL_STEP_INDEX) {
      // 1. Definisci il prezzo base
      const productBasePrice =
        productData?.data?.product?.price ?? BASE_PRICE_DEFAULT;

      // 2. Calcola il prezzo finale in base alle risposte
      const calculatedVal = calculateTradeInPrice(productBasePrice, answers);

      // 3. Imposta il prezzo
      setEstimatePrice(calculatedVal);
    }
  }, [currentStep, answers, productData, calculateTradeInPrice]);

  const handleCancel = () => {
    dispatch(toggleModal());
    setCurrentStep(0);
    setAnswers({});
    setProductId(null);
  };

  const getAnswerLabel = useCallback(
    (questionId: string, answerValue: string): string => {
      const question = MOCK_QUESTIONS.find((q) => q.id === questionId);
      const option = question?.options.find((opt) => opt.value === answerValue);
      return option?.label || answerValue;
    },
    []
  );

  const addTradeIn = async () => {
    // 1. Mappa le risposte per la sezione Dettagli
    const details: TradeInDetails = {
      condition: getAnswerLabel(
        "q1_condizione_estetica",
        answers["q1_condizione_estetica"] || ""
      ),
      technicalDefects: getAnswerLabel(
        "q2_difetti_tecnici",
        answers["q2_difetti_tecnici"] || ""
      ),
      accessories: getAnswerLabel(
        "q3_accessori_originali",
        answers["q3_accessori_originali"] || ""
      ),
      memory: getAnswerLabel("q5_memoria", answers["q5_memoria"] || ""),
      controllerCount: answers["q4_numero_controller"]
        ? parseInt(answers["q4_numero_controller"])
        : 0,
      box: getAnswerLabel(
        "q6_scatola_originale",
        answers["q6_scatola_originale"] || ""
      ),
    };

    // 2. Crea l'oggetto TradeInItem completo
    const tradeInItemData: TradeInItem = {
      productName: selectedConsole,
      imagePath: selectedConsoleImage || "",
      details: details,
    };

    // 3. Dispatch: Salva i dettagli del Trade-In
    dispatch(addModalTradeInData(tradeInItemData));

    // 4. Dispatch: Salva il valore di permuta e attiva lo sconto
    dispatch(completeTradeInValuation(estimatePrice));

    // 5. Chiudi la modale e resetta lo stato
    dispatch(toggleModal());
    setCurrentStep(0);
  };

  const renderContent = (): React.JSX.Element | null => {
    if (isLoading) return <Loading />;

    const targetProductType = selectedPlatform.toLowerCase();

    const getSelectionColor = (platform: string): string => {
      switch (platform.toLowerCase()) {
        case "playstation":
          return "bg-[#003Caa]"; // Blu PS
        case "xbox":
          return "bg-[#46AA48]"; // Verde Xbox
        case "nintendo":
          return "bg-[#DB2220]"; // Rosso Nintendo
        default:
          return "bg-gray-500";
      }
    };
    if (currentStep === 0) {
      const isConsoleSelected = !!productId;
      const filteredConsoles =
        consoleLists?.data?.products?.filter(
          (item: any) => item.product_type === targetProductType
        ) || [];

      return (
        <div className="flex flex-col h-full bg-[#eae9ef]">
          {/* Sfondo modale */}
          {/* -------------------- CONTENUTO PRINCIPALE (Scorrevole) -------------------- */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Blocco 1: Domanda + Tab Piattaforma */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-base font-semibold text-gray-700 mb-4">
                Quale console vuoi far valutare?
              </h2>

              {/* Tab di Filtro Tipo Console (Stile dell'immagine) */}
              <div className="flex space-x-0 bg-gray-200 p-1 rounded-lg overflow-hidden">
                {["Playstation", "Xbox", "Nintendo"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      setSelectedPlatform(platform);
                      setProductId(null);
                      setSelectedConsole("");
                    }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                      selectedPlatform === platform
                        ? getSelectionColor(platform) + " text-white"
                        : "text-gray-700 bg-gray-200"
                    }`}>
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista delle Console (Layout verticale a blocco singolo) */}
            <div className="space-y-2">
              {filteredConsoles.map((item: any) => {
                const isSelected = productId === item.slug;
                const platformColor = getSelectionColor(item.product_type);

                return (
                  <button
                    key={item._id}
                    onClick={() => {
                      setProductId(item.slug);
                      setSelectedConsole(item.name);
                      setSelectedConsoleImage(`${API_URL}${item?.images[0]}`);
                    }}
                    className={`w-full flex items-center p-0 rounded-lg shadow-md cursor-pointer border-4 transition-all duration-200 
                      ${
                        isSelected
                          ? // SELEZIONATO: Sfondo colorato, bordo bianco
                            `border-white ${platformColor}`
                          : // NON SELEZIONATO: Sfondo bianco, bordo invisibile
                            "border-transparent bg-white hover:bg-gray-50"
                      }
                    `}>
                    {/* Contenitore Immagine (usiamo una piccola "cover" bianca per replicare il look) */}
                    <div
                      className={`w-24 h-24 flex-shrink-0 relative ${
                        isSelected ? "bg-white rounded-l-lg" : "bg-transparent"
                      }`}>
                      <img
                        src={`${API_URL}${item?.images[0]}`}
                        alt={item?.name}
                        className="w-full aspect-square rounded-t-lg bg-cover bg-center"
                        style={{
                          backgroundImage: `url('/sell/${item?.product_type}-sq.jpeg')`,
                        }}
                      />{" "}
                    </div>

                    {/* Nome Console */}
                    <span
                      className={`flex-1 text-left px-4 text-xl font-bold ${
                        isSelected ? "text-white" : "text-gray-800"
                      }`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
              {/* Spazio per la lista */}
              <div className="h-4" />
            </div>
          </div>
          {/* -------------------- FOOTER: Pulsante Continua -------------------- */}
          <div className="bg-white p-4 flex-shrink-0 shadow-2xl sticky bottom-0">
            <button
              onClick={() => setCurrentStep(1)}
              disabled={!isConsoleSelected}
              className={`w-full py-3 rounded-lg font-bold text-white text-lg transition ${
                isConsoleSelected
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}>
              CONTINUA
            </button>
          </div>
        </div>
      );
    }
    if (currentStep >= 1 && currentStep <= TOTAL_QUESTION_STEPS) {
      const allQuestions = productData?.data?.questions || MOCK_QUESTIONS;
      const stepQuestions = allQuestions.filter(
        (q: Question) => q.step === currentStep
      );
      const currentQuestion = stepQuestions[currentQuestionIndex];
      const selectedAnswer = answers[currentQuestion.id];

      const handleContinue = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < stepQuestions.length) {
          setCurrentQuestionIndex(nextIndex);
        } else {
          setCurrentQuestionIndex(0);
          setCurrentStep(currentStep + 1);
        }
      };

      return (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-white border-b flex-shrink-0 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map(
                (option: {
                  value: string;
                  label: string;
                  description?: string;
                }) => {
                  const isSelected = selectedAnswer === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers({
                          ...answers,
                          [currentQuestion.id]: option.value,
                        })
                      }
                      className={`py-5 px-4 border rounded-xl text-center text-xl font-bold shadow-md ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-800 hover:border-gray-500"
                      }`}>
                      {option.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="bg-white border-t p-4 flex-shrink-0">
            <button
              onClick={handleContinue}
              disabled={!selectedAnswer}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedAnswer
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}>
              CONTINUA
            </button>
          </div>
        </div>
      );
    } // --- STEP 6: riepilogo / offerta ---
    const selectedProduct = productData?.data?.product;
    if (currentStep === FINAL_STEP_INDEX) {
      // Le tue variabili di risposta...
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

      // Unisci i dettagli principali per la riga Sottotitolo (es. "Slim | 1TB | 2 Controller | New Condition")
      const mainDetailsLine = [
        selectedProduct?.model || "",
        memoryAnswer,
        `${controllerAnswer} Controller`,
        conditionAnswer,
      ]
        .filter((detail) => detail && detail !== "-")
        .join(" | ");

      // Estrai i difetti e gli accessori per la sezione dettagli (come nell'immagine)
      const technicalDefectsText =
        technicalDefects.toLowerCase() === "sì" ? "No" : "Sì";
      const accessoriesText = accessories.toLowerCase() === "sì" ? "Sì" : "No";

      return (
        <div className="flex flex-col h-full bg-[#eae9ef]">
          {/* -------------------- INTESTAZIONE (Titolo) -------------------- */}
          <div className="p-4 bg-white border-b text-center sticky top-0 z-10 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">
              Il tuo prezzo Trade-in
            </h2>
          </div>

          {/* -------------------- CONTENUTO PRINCIPALE (Scorrevole) -------------------- */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* BLOCCO RIEPILOGO CONSOLE (Come la card bianca nell'immagine) */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex gap-4">
                {/* Immagine */}
                {selectedConsoleImage && (
                  <div className="w-[100px] h-[70px] flex-shrink-0 relative">
                    <Image
                      src={selectedConsoleImage}
                      alt={selectedConsole}
                      width={100}
                      height={70}
                      style={{ objectFit: "contain" }}
                      className="rounded-lg"
                    />
                  </div>
                )}

                {/* Dettagli riepilogativi */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedConsole}
                  </h3>

                  {/* Riga Dettagli Principali */}
                  <p className="text-sm text-gray-600 mb-2">
                    {mainDetailsLine}
                  </p>

                  {/* Dettagli Aggiuntivi sotto i principali */}
                  <div className="text-sm text-gray-700">
                    {/* 💡 Nota: I dati visualizzati devono essere le RISPOSTE FINALI, non le domande */}
                    <p>
                      Difetti tecnici:{" "}
                      <span className="font-semibold">
                        {technicalDefectsText}
                      </span>
                    </p>
                    <p>
                      Accessori originali:{" "}
                      <span className="font-semibold">{accessoriesText}</span>
                    </p>
                  </div>

                  {/* Rimuovi completamente il blocco showDetails e il pulsante freccia */}
                </div>
              </div>
            </div>

            {/* BLOCCO OFFERTA (La nostra offerta: €X.XX) */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800">
                  La nostra offerta:
                </p>

                <h2 className="text-4xl font-semibold text-gray-900">
                  €{estimatePrice.toFixed(2)}
                </h2>
              </div>
            </div>

            {/* Testo informativo (Come nell'immagine) */}
            <p className="text-sm text-gray-600 px-2">
              Hai 7 giorni per goderti la nuova console. Poi, ci pensiamo noi:
              riceverai un'etichetta di spedizione gratuita e una guida video
              passo-passo per spedirci l'usato.
              <br />
              <br />
              Quando riceveremo la tua console ci riserveremo 2‑3 giorni
              lavorativi per testarlo, dopodiché ti invieremo l’importo stimato.
            </p>
          </div>

          {/* -------------------- FOOTER: Pulsanti (SKIP / ADD TRADE-IN) -------------------- */}
          <div className="bg-white border-t p-4 flex-shrink-0 shadow-2xl sticky bottom-0">
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-3 rounded-lg text-lg font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
                SKIP TRADE-IN
              </button>
              <button
                onClick={addTradeIn}
                className="flex-1 py-3 px-6 rounded-lg text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                ADD TRADE-IN
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <CustomModal open={isModalOpen} onCancel={handleCancel}>
      {renderContent()}
    </CustomModal>
  );
};

export default ConsoleModal;
