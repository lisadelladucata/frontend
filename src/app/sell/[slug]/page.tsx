"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HowToSellYourItem from "@/components/sell/HowToSellYourItem";
import { useTranslation } from "react-i18next";
import { useGetASingleProductQuery } from "@/redux/features/sell/SellProductAPI";
import Loading from "@/app/loading";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedQuestions } from "@/redux/features/questions/QuestionSlice";
import { RootState } from "@/redux/store/store";
import { useParams } from "next/navigation";
import Image from "next/image";

interface IQuestion {
  _id: string;
  name: string;
  option: string;
  description: string;
  price: number;
  quesId: string;
  optionId?: string;
  questionAnswer?: {
    questionTitle: string;
    questionAnswer: string;
  };
}

const productColors: Record<string, string> = {
  xbox: "#64B95E",
  playstation: "#1861C0",
  nintendo: "#F44041",
};

export type TQuesData = {
  quesId: string;
  optionId: string;
  questionAnswer: {
    questionAnswer: string;
    questionTitle: string;
  };
}[];

export default function ScreenCondition() {
  const [update, setUpdated] = useState(false);
  const [temOption, setTemOption] = useState<any>([]);
  const [quesData, setQuesData] = useState<TQuesData>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [answer, setAnswer] = useState({
    questionTitle: "",
    questionAnswer: "",
  });

  const userSelectedOptions = useSelector(
    (state: RootState) => state?.questionSlice?.questions
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    const lang = localStorage?.getItem("i18nextLng");
    if (lang) setSelectedLang(lang);
  }, []);

  useEffect(() => {
    localStorage?.setItem(
      "userSelectedOptions",
      JSON.stringify(userSelectedOptions)
    );
  }, [userSelectedOptions, userSelectedOptions.length]);

  const {
    data: question,
    isLoading,
    isError,
  } = useGetASingleProductQuery(params?.slug as string);

  useEffect(() => {
    if (question?.data?.questions) {
      const questions = question?.data?.questions;

      // Helper function to get the first option value for a given question name
      const getFirstOption = (name: string) => {
        return (
          questions.find((q: any) => q.name === name)?.options?.[0]?.option ||
          ""
        );
      };
    }
  }, [question?.data?.questions]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) return <div>Error Occured!</div>;

  const questionLength = question?.data?.questions.length - 1;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (questionLength === questionIndex) {
      if (selectedOptionId) {
        dispatch(
          addSelectedQuestions({
            quesId: question?.data?.questions[questionIndex]?._id,
            optionId: selectedOptionId,
            questionAnswer: {
              questionTitle: answer?.questionTitle,
              questionAnswer: answer?.questionAnswer,
            },
          })
        );
      }

      localStorage?.setItem(
        "getEstimateProductId",
        JSON.stringify(params?.slug)
      );

      router.push("/sell/estimate-product");
    } else {
      if (selectedOptionId) {
        dispatch(
          addSelectedQuestions({
            quesId: question?.data?.questions[questionIndex]?._id,
            optionId: selectedOptionId,
            questionAnswer: {
              questionTitle: answer?.questionTitle,
              questionAnswer: answer?.questionAnswer,
            },
          })
        );
      }
      setQuestionIndex((prev) => prev + 1);
      setSelectedCondition("");
    }
  };

  const handleChange = (option: IQuestion) => {
    setSelectedCondition(option._id);
    setSelectedOptionId(option._id);

    setAnswer({
      questionTitle: question?.data?.questions[questionIndex]?.name,
      questionAnswer: option?.option,
    });
  };

  const submitMobileForm = () => {
    localStorage?.setItem("userSelectedOptions", JSON.stringify(quesData));

    localStorage?.setItem("getEstimateProductId", JSON.stringify(params?.slug));

    router.push("/sell/estimate-product");
  };

  console.log(question?.data?.product_type, "product type");

  return (
    <div>
      {/* only for desktop view */}
      <div className='hidden md:block min-h-screen bg-[#F2F5F7] pb-20'>
        {/* Screen Condition Section */}
        <div className='max-w-[798px] mx-auto py-10'>
          <h1 className='text-[#101010] text-xl font-medium capitalize mb-2'>
            {question?.data?.questions[questionIndex]?.name}
          </h1>
          <h2 className='text-2xl text-[#101010] font-semibold mb-4'>
            {/* {t("quizTitle")} */}
            {question?.data?.questions[questionIndex]?.description}
          </h2>

          <form className='space-y-4 mb-6'>
            {question?.data?.questions[questionIndex]?.options?.map(
              (opt: IQuestion) => (
                <label
                  key={opt?._id}
                  className={`block w-full rounded-md p-4 cursor-pointer transition-colors ${
                    selectedCondition === opt?._id
                      ? "bg-[#DAEDF2]"
                      : "bg-[#FDFDFD] hover:border-gray-300"
                  }`}
                >
                  <div className='flex items-start gap-3'>
                    <div className='flex items-center h-5 mt-1'>
                      <input
                        type='radio'
                        name='condition'
                        value={opt?._id}
                        checked={selectedCondition === opt?._id}
                        onChange={() => handleChange(opt)}
                        className='h-6 w-6 border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </div>
                    {/* <b>{opt?._id}</b> */}
                    <div>
                      <p className='text-xl font-semibold text-[#101010]'>
                        {selectedLang === "en" ? opt?.option : opt?.option}
                      </p>
                      <p className='text-[#6B6B6B] text-lg mt-1'>
                        {selectedLang === "en"
                          ? opt?.description
                          : opt?.description}
                      </p>
                    </div>
                  </div>
                </label>
              )
            )}
            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={!selectedCondition}
                onClick={handleContinue}
                className={`px-6 py-2 border rounded-md text-base font-medium transition-colors
                  ${
                    selectedCondition
                      ? "bg-[#F2F5F7] text-[#101010] border-[#101010] font-semibold"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {t("continue")}
              </button>
            </div>
          </form>
        </div>

        {/* How to Sell Section */}
        <HowToSellYourItem />
      </div>

      {/* only for mobile */}
      <div
        className={`block md:hidden ${
          question?.data?.product_type === "xbox"
            ? "bg-[url(/sell/xbox.jpeg)]"
            : ""
        } ${
          question?.data?.product_type === "playstation"
            ? "bg-[url(/sell/playstation.jpeg)]"
            : ""
        } ${
          question?.data?.product_type === "nintendo"
            ? "bg-[url(/sell/nintendo.jpeg)]"
            : ""
        } bg-cover bg-no-repeat`} 
      >
        <div>
          <div className='w-full'>
            <Image
              src={`${API_URL}${question?.data?.image}`}
              className='w-full'
              width={700}
              height={800}
              alt='xbox'
            />
          </div>

          {/* Select the Xbox One model */}

          <div>
            {question?.data?.questions.map((ques: any) => (
              <div key={ques._id}>
                <div className='flex items-center justify-center pt-14 space-x-2.5'>
                  <hr className='flex-1 border-b-2 border-gray-300' />
                  <h2
                    className={
                      "bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md text-[#101010] text-xl font-semibold text-center"
                    }
                  >
                    {ques.description}
                  </h2>
                  <hr className='flex-1 border-b-2 border-gray-300' />
                </div>
                <div className='flex flex-col gap-4 px-5 py-5'>
                  {ques?.options.map(
                    (option: {
                      _id: string;
                      option: string;
                      price: number;
                      description: string;
                    }) => (
                      <div
                        key={option?._id}
                        onClick={() => {
                          setQuesData((data) => {
                            const idx = data.findIndex(
                              (item) => item.quesId === ques._id
                            );

                            if (idx !== -1) {
                              data[idx].optionId = option._id;
                              data[idx].questionAnswer = {
                                questionAnswer: option?.option,
                                questionTitle: ques?.name,
                              };
                            } else {
                              data.push({
                                quesId: ques._id,
                                optionId: option._id,
                                questionAnswer: {
                                  questionAnswer: option?.option,
                                  questionTitle: ques?.name,
                                },
                              });
                            }

                            return data;
                          });

                          setTemOption((opt: any) => {
                            opt[ques.name] = option._id;

                            return opt;
                          });

                          setUpdated(!update);
                        }}
                        className='h-16 text-white rounded-md flex items-center justify-center border border-[#919191] text-center text-2xl font-semibold leading-[36px]'
                        style={{
                          backgroundColor:
                            temOption[ques.name] === option._id
                              ? productColors[question?.data?.product_type]
                              : "#DDDEE3",
                        }}
                      >
                        {option?.option}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* submit button */}
          <div className='p-5 bg-[#FDFDFD]'>
            {/* <Link href={"/sell/summary"}> */}
            <button
              onClick={submitMobileForm}
              className={`w-full text-[#FDFDFD] font-semibold ${
                question?.data?.product_type === "xbox" ? "bg-[#64B95E]" : ""
              }
              ${
                question?.data?.product_type === "playstation"
                  ? "bg-[#1861C0]"
                  : ""
              }
              ${
                question?.data?.product_type === "nintendo"
                  ? "bg-[#D61D1E]"
                  : ""
              }
              h-14 rounded-lg`}
            >
              SUBMIT FORM
            </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
