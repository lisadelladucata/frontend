import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
// 🛑 NUOVE IMPORTAZIONI RADIX UI (per il Modal, che è ora Dialog) 🛑
import * as Dialog from "@radix-ui/react-dialog";

// Manteniamo Button e ButtonProps di Ant Design
import { Button, ButtonProps } from "antd";
import { CSSProperties } from "react";

import { useDispatch, useSelector } from "react-redux";
// Importazioni del tuo progetto
import { RootState } from "@/redux/store/store";
import { toggleModal } from "@/redux/features/modal/modalSlice";
import {
  useGetAllProductsQuery,
  useGetEstimateProductPriceMutation,
} from "@/redux/features/products/ProductAPI";
import { useParams } from "next/navigation";
import { toggleTradeIn } from "@/redux/features/tradeIn/showTradeInSlice";
import Loading from "@/app/loading";
import { addModalTradeInData } from "@/redux/features/modalTradeInData/ModalTradeInData";

interface StrictButtonProps extends ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "link" | "text" | "ghost" | "default" | "primary" | "dashed";
  size?: "large" | "middle" | "small";
  className?: string;
  key?: string;
  style?: React.CSSProperties;
}

const FixedButton = Button as React.ComponentType<StrictButtonProps>;

const continueButtonStyle: CSSProperties = {
  width: "100%",
  height: "60px",
  backgroundColor: "#f7931e",
  borderColor: "#f7931e",
  color: "#fff",
  borderRadius: "0",
};

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
    options: [{ value: "brand_new", label: "Brand New" }],
  },
  {
    id: "q2_difetti_tecnici",
    text: "La console è priva di difetti tecnici?",
    step: 1,
    options: [{ value: "si_perfetta", label: "Sì" }],
  },
  {
    id: "q4_numero_controller",
    text: "Quanti controller ci invierai?",
    step: 3,
    description: "Indica il numero di controller...",
    options: [{ value: "zero", label: "0" }],
  },
];

const ConsoleModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedPlatform] = useState<string>("Playstation");
  const [selectedConsole, setSelectedConsole] = useState("");
  const [estimatePrice, setEstimatePrice] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);

  const modalState = useSelector((state: RootState) => state.modal.modal);
  const dispatch = useDispatch();

  const FINAL_STEP_INDEX = 6;
  const TOTAL_QUESTION_STEPS = 5;

  const [getEstimateProductPrice] = useGetEstimateProductPriceMutation();
  const { data: consoleLists } = useGetAllProductsQuery({ limit: 10 });
  const isLoading = false;

  useEffect(() => {
    setIsModalOpen(modalState);
  }, [modalState]);

  const handleCancel = () => {
    setIsModalOpen(false);
    dispatch(toggleModal());
  };

  const calculateTradeInValue = useCallback(() => {
    setEstimatePrice(Math.floor(Math.random() * (400 - 100 + 1) + 100));
  }, []);

  const addTradeIn = async () => {
    const data = {
      productName: selectedConsole as string,
      productPrice: estimatePrice as number,
    };
    dispatch(addModalTradeInData(data));
    dispatch(toggleModal());
    dispatch(toggleTradeIn());
  };

  const getModalFooter = useMemo((): {
    element: ReactNode;
    hidden: boolean;
  } => {
    let buttonText = "CONTINUA";
    let isDisabled = true;
    let clickHandler = () => {};
    let hidden = false;

    if (currentStep === 0) {
      isDisabled = !productId;
      clickHandler = () => {
        if (productId) setCurrentStep(1);
      };
    } else if (currentStep >= 1 && currentStep <= TOTAL_QUESTION_STEPS) {
      const allQuestionsForStep = MOCK_QUESTIONS.filter(
        (q) => q.step === currentStep
      );
      const currentQuestion = allQuestionsForStep[currentQuestionIndex];
      const selectedAnswerValue = currentQuestion
        ? answers[currentQuestion.id || currentQuestion.text]
        : undefined;
      const isLastQuestionInStep =
        currentQuestionIndex === allQuestionsForStep.length - 1;

      isDisabled = !selectedAnswerValue;
      buttonText =
        isLastQuestionInStep && currentStep === TOTAL_QUESTION_STEPS
          ? "VEDI VALORE"
          : "CONTINUA";

      clickHandler = () => {
        if (selectedAnswerValue) {
          if (isLastQuestionInStep) {
            if (currentStep < TOTAL_QUESTION_STEPS) {
              setCurrentStep(currentStep + 1);
              setCurrentQuestionIndex(0);
            } else {
              calculateTradeInValue();
              setCurrentStep(FINAL_STEP_INDEX);
            }
          } else {
            setCurrentQuestionIndex((prev) => prev + 1);
          }
        }
      };
    } else if (currentStep === FINAL_STEP_INDEX) {
      hidden = true;
    }

    const element = (
      <div className="w-full">
        <FixedButton
          key="continue-action"
          type="primary"
          size="large"
          onClick={clickHandler}
          disabled={isDisabled}
          style={continueButtonStyle}
          className={isDisabled ? "opacity-70 cursor-not-allowed" : ""}>
          {buttonText}
        </FixedButton>
      </div>
    );

    return { element, hidden };
  }, [
    currentStep,
    currentQuestionIndex,
    productId,
    answers,
    calculateTradeInValue,
  ]);

  const renderContent = (): React.JSX.Element | null => {
    const selectionColorClass = "bg-blue-600";
    const targetProductType = selectedPlatform.toLowerCase();

    if (isLoading) return <Loading />;

    if (currentStep === 0) {
      const filteredConsoles = (
        useGetAllProductsQuery({ limit: 10 }).data?.data?.products || []
      ).filter((c: any) => c.product_type === targetProductType);

      return (
        <div className="w-full flex flex-col h-full max-h-[50vh]">
          <div className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100 rounded-t-lg">
            <h2 className="text-lg font-semibold text-gray-800 text-center">
              Quale console vuoi far valutare?
            </h2>
            <div className="flex bg-gray-100 p-1 rounded-lg mt-4">
              Filtri qui
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto flex-grow px-4 pb-4">
            <div className="text-gray-500 mt-4">
              {filteredConsoles.length > 0 ? (
                filteredConsoles.map((console: any) => (
                  <div
                    key={console.slug}
                    onClick={() => {
                      setProductId(console.slug);
                      setSelectedConsole(console.name);
                    }}
                    className={`p-3 border rounded-lg cursor-pointer my-2 transition-all 
                                 ${
                                   productId === console.slug
                                     ? "border-2 border-orange-500 bg-orange-50"
                                     : "border-gray-200 hover:border-gray-400"
                                 }`}>
                    <p className="font-semibold">{console.name}</p>
                  </div>
                ))
              ) : (
                <p>Nessuna console trovata.</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep >= 1 && currentStep <= TOTAL_QUESTION_STEPS) {
      const allQuestionsForStep = MOCK_QUESTIONS.filter(
        (q) => q.step === currentStep
      );
      const currentQuestion = allQuestionsForStep[currentQuestionIndex];
      if (!currentQuestion) return null;

      const handleAnswer = (answerValue: string) => {
        setAnswers({
          ...answers,
          [currentQuestion.id || currentQuestion.text]: answerValue,
        });
      };
      const selectedAnswerValue =
        answers[currentQuestion.id || currentQuestion.text];
      const descriptionText = currentQuestion.description;

      return (
        <div className="w-full flex flex-col h-full max-h-[70vh]">
          <div className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800 text-center w-full">
              {currentQuestion.text}
            </h2>
          </div>
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

          {descriptionText && (
            <div className="px-4 mt-4 pb-4 text-sm text-gray-500 leading-5">
              {descriptionText}
            </div>
          )}
        </div>
      );
    }

    if (currentStep === FINAL_STEP_INDEX) {
      return (
        <div className="w-full min-h-[500px] p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">La tua valutazione:</h2>
          <p className="text-xl text-green-600 font-semibold">
            € {estimatePrice}
          </p>

          <div className="flex gap-4 justify-end mt-10 p-4 border-t border-gray-100 -mx-4">
            <button
              onClick={handleCancel}
              className="py-3 px-3 rounded-xl text-base font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
              SKIP TRADE-IN
            </button>
            <button
              onClick={addTradeIn}
              className="py-3 px-6 rounded-xl text-base font-medium text-[#FDFDFD] bg-orange-500 hover:bg-orange-600 transition-colors">
              ADD TRADE-IN
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />

        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                           w-full max-w-sm rounded-xl shadow-lg bg-white overflow-hidden 
                           max-h-[90vh] flex flex-col transition-all duration-200 z-[51]"
          style={{ width: 400 }}>
          <div className="flex-grow overflow-y-auto">{renderContent()}</div>

          {!getModalFooter.hidden && (
            <div className="p-0 border-t-0 flex-shrink-0">
              {getModalFooter.element}
            </div>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center 
                                   rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none z-20"
              aria-label="Close"
              onClick={handleCancel}>
              &times;
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConsoleModal;
