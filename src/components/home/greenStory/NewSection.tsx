"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function GreenStory() {
  const [selectedLang, setSelectedLang] = useState("it");

  useEffect(() => {
    const lang = localStorage?.getItem("i18nextLng");
    setSelectedLang(lang || "");
  }, []);

  return (
    <div className='md:h-[864px] bg-[#F2F5F7] flex flex-col md:flex-row md:mb-10'>
      {/* Image Section */}

      {/* for mobile */}
      <div className='md:hidden relative w-full md:w-1/2 h-full -mb-1'>
        <div className='absolute top-0 left-0 w-full h-full bg-[#0d0e0d4f] z-10'></div>

        <div className='absolute top-6 left-6 z-20 text-white border-b-2 border-white pb-4'>
          <h2 className='text-3xl'>LA STORIA VERDE DI</h2>
          <h2 className='text-3xl'>CONSOLE LOCKER</h2>
        </div>
        <Image
          src='/home/eco1.png'
          alt='PlayStation 5 on green moss'
          width={900}
          height={900}
          className='object-contain w-full h-full'
          priority
        />
      </div>

      {/* for desktop */}
      <div className='hidden md:block relative w-full md:w-1/2 h-full'>
        <Image
          src='/home/eco1.png'
          alt='PlayStation 5 on green moss'
          width={700}
          height={700}
          className='object-cover w-full h-full'
          priority
        />
      </div>

      {/* Content Section */}
      <div className='flex flex-col justify-center w-full md:w-1/2 bg-[#63B95E] p-4 md:p-12 h-full'>
        <div>
          {/* Heading */}
          <h1 className='hidden md:block uppercase text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4'>
            {/* <Trans i18nKey='greenHistroy' components={{ br: <br /> }} /> */}
            La Storia Green di Console Locker.
          </h1>

          <div className='hidden md:block w-full h-2 border-b-2 border-white mb-10'></div>

          <div
            className={`${
              selectedLang === "en"
                ? "max-w-[760px] space-y-5"
                : "max-w-[920px] space-y-4"
            }`}
          >
            <div
              className='bg-[#209C54] backdrop-blur-sm p-6 rounded-lg 
              transform transition-all duration-300 hover:translate-x-2
              cursor-pointer'
            >
              <p
                className={`${
                  selectedLang === "en" ? "max-w-[440px]" : "max-w-[690px]"
                } mx-auto text-center text-[#FFFFFF] text-xs sm:text-base md:text-xl leading-6`}
              >
                Acquistare o vendere una console usata aiuta a ridurre i rifiuti
                elettronici.
              </p>
            </div>
            <div
              className='bg-[#209C54] backdrop-blur-sm p-6 rounded-lg 
              transform transition-all duration-300 hover:translate-x-2
              cursor-pointer'
            >
              <p
                className={`${
                  selectedLang === "en" ? "max-w-[440px]" : "max-w-[690px]"
                } mx-auto text-center text-[#FFFFFF] text-xs sm:text-base md:text-xl leading-6`}
              >
                Dare nuova vita a una console è una scelta intelligente ed
                ecologica.
              </p>
            </div>
            <div
              className='bg-[#209C54] backdrop-blur-sm p-6 rounded-lg 
              transform transition-all duration-300 hover:translate-x-2
              cursor-pointer'
            >
              <p
                className={`${
                  selectedLang === "en" ? "max-w-[440px]" : "max-w-[690px]"
                } mx-auto text-center text-[#FFFFFF] text-xs sm:text-base md:text-xl leading-6`}
              >
                Scegliere l’usato significa risparmiare e salvaguardare
                l’ambiente.
              </p>
            </div>
            <div
              className='bg-[#209C54] backdrop-blur-sm p-6 rounded-lg 
              transform transition-all duration-300 hover:translate-x-2
              cursor-pointer'
            >
              <p
                className={`${
                  selectedLang === "en" ? "max-w-[440px]" : "max-w-[690px]"
                } mx-auto text-center text-[#FFFFFF] text-xs sm:text-base md:text-xl leading-6`}
              >
                Una console usata ha ancora tanto da offrire: risparmia e
                rispetta il pianeta.
              </p>
            </div>
            <div
              className='bg-[#209C54] backdrop-blur-sm p-6 rounded-lg 
              transform transition-all duration-300 hover:translate-x-2
              cursor-pointer'
            >
              <p
                className={`${
                  selectedLang === "en" ? "max-w-[440px]" : "max-w-[690px]"
                } mx-auto text-center text-[#FFFFFF] text-xs sm:text-base md:text-xl leading-6`}
              >
                Console Locker promuove un consumo responsabile e sostenibile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
