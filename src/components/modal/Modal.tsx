import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toggleModal } from "@/redux/features/modal/modalSlice";
import {
  useGetASingleProductQuery,
  useSellProductQuery,
} from "@/redux/features/sell/SellProductAPI";
import Image from "next/image";
import { showTradeInDescription } from "@/redux/features/tradeIn/showTradeInSlice";
import { Check } from "lucide-react";
import Loading from "@/app/loading";
import { useGetEstimateProductPriceMutation } from "@/redux/features/products/ProductAPI";
import { addModalTradeInData } from "@/redux/features/modalTradeInData/ModalTradeInData";

const ConsoleModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // set current option
  const [selectedOption, setSelectedOption] = useState<string>();

  const [selectedConsole, setSelectedConsole] = useState("");
  const [estimatePrice, setEstimatePrice] = useState<number>(0);

  const modalState = useSelector((state: RootState) => state.modal.modal);

  const dispatch = useDispatch();
  const [productId, setProductId] = useState<string | null>(null);
  const [questionsOptionsId, setQuestionsOptionsId] = useState<
    { quesId: string; optionId: string }[]
  >([]);

  const [
    getEstimateProductPrice,
    { data, isLoading: getPriceLoading, isError: getPriceError },
  ] = useGetEstimateProductPriceMutation();

  // Fetch product details
  const { data: productData, isLoading } = useGetASingleProductQuery(
    productId as string
  );

  // Choose your console
  const { data: consoleLists } = useSellProductQuery({
    limit: 10,
  });

  React.useEffect(() => {
    setIsModalOpen(modalState);
  }, [modalState]);

  const handleCancel = () => {
    setIsModalOpen(false);
    dispatch(toggleModal());
  };

  const handleChooseConsole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, name } = JSON.parse(e.target.value);

    setSelectedConsole(name);
    setProductId(id);
    setCurrentStep(1);
  };

  const handleOptionSelect = (
    quesId: string,
    optionId: string,
    option: string
  ) => {
    const newQuestionOption = { quesId, optionId };
    setQuestionsOptionsId((prev) => [...prev, newQuestionOption]);

    // setSelectedOptions((prev) => ({ ...prev, [questionName]: option }));
    setSelectedOption(option);

    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 250);
  };

  const getProductPrice = async () => {
    try {
      const response = await getEstimateProductPrice({
        id: productId as string,
        body: { questions: questionsOptionsId },
      });
      setEstimatePrice(response?.data?.data?.price || 0);
    } catch (error) {
      console.error("Error fetching estimated price:", error);
    }
  };

  const addTradeIn = async () => {
    const data = {
      productName: selectedConsole as string,
      productPrice: estimatePrice as number,
    };

    dispatch(addModalTradeInData(data));

    const tradeInData = { product: productId, questions: questionsOptionsId };

    localStorage.setItem("tradeInData", JSON.stringify(tradeInData));

    // console.log(ableTradeIn);
    dispatch(toggleModal());
    dispatch(showTradeInDescription());
  };

  const questions = productData?.data?.questions || [];

  useEffect(() => {
    if (currentStep === questions.length) {
      getProductPrice();
    }
  }, [currentStep, questionsOptionsId]);

  // TODO: Test COde
  console.log(productId, questionsOptionsId);

  const renderContent = () => {
    if (isLoading) return <Loading />;

    if (currentStep === 0) {
      return (
        <div className="w-full h-[500px]">
          <h2 className="text-[40px] font-semibold text-[#101010] mt-8">
            Great! Let’s started.
          </h2>
          <p className="text-[#6B6B6B] text-base leading-6 mt-4">
            The phone will have heavy signs of wear, such as deeper scratches,
            dents and other marks. The phone is unlocked, fully tested and works
            like new.
          </p>
          <p className="text-[#101010] text-base leading-6 mt-4">
            Please select your console to add product to cart
          </p>

          <div className="relative w-full">
            <select
              onChange={handleChooseConsole}
              name="console"
              id="console"
              value={selectedConsole || ""}
              className="
                w-full px-3 py-2 border rounded-3xl bg-white text-sm sm:text-base appearance-none"
            >
              <option value="" disabled>
                Choose your console
              </option>
              {consoleLists?.data?.products?.map((console: any) => (
                <option
                  key={console?._id}
                  value={JSON.stringify({
                    id: console?._id,
                    name: console?.name,
                  })}
                >
                  {console?.name}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center px-3">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep <= questions.length) {
      const question = questions[currentStep - 1];
      // console.log("question", question);
      return (
        <div className="min-h-[500px]">
          <div className="mb-5">
            <h2 className="text-[40px] font-semibold text-[#101010] mt-8">
              Great! Let’s started.
            </h2>
            <p className="text-[#6B6B6B] text-base leading-6 mt-4">
              The phone will have heavy signs of wear, such as deeper scratches,
              dents and other marks. The phone is unlocked, fully tested and
              works like new.
            </p>
          </div>

          <h2 className="font-semibold text-[24px] mb-5">
            {question.description}
          </h2>

          <div className="flex flex-wrap gap-2">
            {question?.options?.map((option: any) => (
              <button
                key={option._id}
                onClick={() =>
                  handleOptionSelect(question._id, option._id, option.option)
                }
                className={`min-w-[177px] min-h-[111px] ${
                  selectedOption === option.option ? "bg-[#E7E7E7]" : ""
                } flex flex-col items-center justify-center gap-2 border rounded text-lg text-[#101010] font-medium p-5`}
              >
                {option.option} (+${option.price})
                <Check />
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="w-full min-h-[500px]">
          <h2 className="flex items-center gap-5 text-lg font-semibold text-[#101010] mt-8">
            <Image
              src={"/modal/arrow-left.png"}
              width={20}
              height={20}
              alt="arrow"
            />{" "}
            Great! Let’s started.
          </h2>
          <p className="text-[#6B6B6B] text-base leading-6 mt-4">
            Your estimated trade-in your iPhone 8 Plus, 500GBis:
          </p>

          <div className="bg-[#D1FCEE] my-6 p-6 rounded-lg">
            <h2 className="text-[#007B52] text-center text-5xl font-semibold leading-[]">
              ${estimatePrice}
            </h2>

            <p className="text-base text-center max-w-80 mx-auto text-[#007B52] leading-6 mt-4">
              The estimated value is reimbursed after purchasing your new device
              and inspection of your old device
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-[#101010]">What Next?</h3>
            <ol className="space-y-3">
              <li className="flex gap-4">
                <div className="font-semibold text-[#007B52] text-xl">1</div>
                <div>
                  <h4 className="font-medium text-lg text-[#101010]">
                    Get your new phone
                  </h4>
                  <p className="text-base text-[#5F5F5F]">
                    You&apos;ll keep your old phone until your new one arrives.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="font-semibold text-[#007B52] text-xl">2</div>
                <div>
                  <h4 className="font-medium text-lg text-[#101010]">
                    Send your old phone for free
                  </h4>
                  <p className="text-base text-[#5F5F5F]">
                    You&apos;ll keep your old phone until your new one arrives.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="font-semibold text-[#007B52] text-xl">3</div>
                <div>
                  <h4 className="font-medium text-lg text-[#101010]">
                    Get paid
                  </h4>
                  <p className="text-base text-[#5F5F5F]">
                    We'll inspect the device and make the refund in 2-3 days
                    after we have receive your phone
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 my-2 rounded-lg flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-blue-600 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <p className="text-sm text-blue-600">
              We are not able to return any accessories or packaging sent with
              the device.
            </p>
          </div>

          <div className="flex gap-4 justify-end my-3">
            <button
              onClick={() => dispatch(toggleModal())}
              className="text-base font-medium text-[#222C9B]"
            >
              SKIP TRADE-IN
            </button>
            <button
              onClick={() => addTradeIn()}
              className="py-3 px-[30px] rounded-3xl text-base font-medium text-[#FDFDFD] bg-[#222C9B]"
            >
              ADD TRADE-IN
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
      {renderContent()}
    </Modal>
  );
};

export default ConsoleModal;
