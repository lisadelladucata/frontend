"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Trans, useTranslation } from "react-i18next";
import Link from "next/link";
import { useSellProductQuery } from "@/redux/features/sell/SellProductAPI";

export default function MobileSellHero() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number>();

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError,
  } = useSellProductQuery({
    limit: 100,
  });
  const [selectedConsole, setSelectedConsole] = useState("");
  const { t } = useTranslation();

  const handleNext = () => {
    console.log("first");
  };

  if (isLoadingProducts) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  const handleSelect = (id: string | number, name: string) => {
    setSelectedConsole(name);
    setSelectedId(id);

    // dispatch(addSelectedSellProduct({ id, selectedConsole: value }));
    setIsOpen(false);
  };

  return (
    <main className="z-10 min-h-[796px] relative bg-[url('/sell/back_sell.png')] bg-cover bg-center overflow-hidden">
      {/* Diagonal lines background */}

      <div className='py-6 flex flex-col items-center'>
        {/* Main heading */}
        <h1
          className='text-[100px] font-extrabold text-white tracking-wider'
          style={{
            WebkitTextStroke: "5px white",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("SELL")}
        </h1>
        <h2 className='text-[40px] text-white font-bold -mt-4'>
          {t("YOURCONSOLE")}
        </h2>

        <div className='border-b-2 border-white my-5 w-[96%] h-1 ml-5'></div>

        {/* Shipping info */}
        <p className='w-full text-white text-left text-2xl font-semibold leading-7 px-5 mb-8'>
          <Trans
            i18nKey='freeshippingAndFastDelivery'
            components={{ br: <br /> }}
          />
        </p>

        {/* Console selector dropdown */}
        <div className='w-full h-14 mb-4 relative px-5'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='w-full h-14 bg-white text-[#E95D00] py-3 px-4 rounded-lg flex items-center justify-between font-medium'
          >
            {selectedConsole || "CHOOSE YOUR CONSOLE"}
            <ChevronDown
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className='absolute w-[90%] mt-2 bg-white rounded-lg shadow-lg z-10'>
              {products?.data?.products?.map(
                (console: { _id: string; name: string }) => (
                  <button
                    key={console?.name}
                    className='w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700'
                    onClick={() => handleSelect(console?._id, console?.name)}
                  >
                    {console?.name}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Estimate button */}
        <div className='w-full h-14 px-5 relative'>
          <Link href={`/sell/${selectedId}`}>
            <button
              onClick={handleNext}
              className='w-full h-14 bg-white text-[#E95D00] py-3 px-4 rounded-lg font-medium'
            >
              {t("GETAPRICEESTIMATE")}
            </button>
          </Link>
        </div>

        {/* Floating currency symbols */}
        <div className='absolute -bottom-0 h-64 w-full mt-8 flex justify-center'>
          <Image
            src={"/sell/sell-mobile-hero.png"}
            className='max-w-[250px] max-h-[330px]'
            width={600}
            height={700}
            alt='hero'
          />
        </div>
      </div>
    </main>
  );
}
