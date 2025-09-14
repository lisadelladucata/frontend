"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Container from "../common/Container";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function SellHeroSection({
  product_type,
  setProduct_type,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className='bg-[url(/sell/sell-hero.png)] bg-cover bg-no-repeat min-h-[calc(100vh-180px)] bg-left-bottom'>
      <Container>
        <div className='flex h-[700px]'>
          {/* Empty Div with 50% Width */}
          <div className='hidden lg:block w-1/2'></div>

          {/* Content Section */}
          <div className='w-full lg:w-1/2 lg:pl-32'>
            <div className='flex flex-col translate-y-1/2 lg:-translate-x-20 xl:-translate-x-0'>
              <h1 className='text-4xl md:text-5xl font-bold text-[#FDFDFD] lg:text-[#101010] mb-6 '>
                Vendi la tua console
              </h1>

              {/* Benefits Section */}
              <div className='space-y-4 mb-6'>
                <div className='flex items-start gap-3 text-[#FDFDFD] lg:text-[#101010]'>
                  <Image
                    src={"/sell/free-shipping-white.png"}
                    className='md:hidden'
                    width={18}
                    height={18}
                    alt='free shipping'
                  />
                  <Image
                    src={"/sell/free-shipping.png"}
                    className='hidden md:inline-block'
                    width={18}
                    height={18}
                    alt='free shipping'
                  />
                  <span className='text-lg text-[#FDFDFD] lg:text-[#101010]'>
                    Spedizione gratuita
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <Image
                    src={"/sell/free-return-white.png"}
                    className='md:hidden'
                    width={18}
                    height={18}
                    alt='free shipping'
                  />
                  <Image
                    src={"/sell/free-return.png"}
                    className='hidden md:inline-block'
                    width={18}
                    height={18}
                    alt='free shipping'
                  />
                  <span className='text-lg text-[#FDFDFD] lg:text-[#101010]'>
                    Reso gratuito
                  </span>
                </div>
                <div className='flex items-center gap-3 text-gray-700'>
                  <Image
                    src={"/sell/fast-payment-white.png"}
                    className='md:hidden'
                    width={20}
                    height={20}
                    alt='free shipping'
                  />
                  <Image
                    src={"/sell/fast-delivery.png"}
                    className='hidden md:inline-block'
                    width={18}
                    height={18}
                    alt='free shipping'
                  />
                  <span className='text-lg text-[#FDFDFD] lg:text-[#101010]'>
                    Consegna rapida entro 48 ore
                  </span>
                </div>
              </div>

              {/* Console Selection and Price Estimate */}
              <div className='flex flex-col space-y-4'>
                <div
                  className='relative w-full sm:w-1/2 md:w-9/12'
                  ref={selectRef}
                >
                  {/* Select Box */}
                  <div
                    className='flex justify-between items-center bg-transparent border border-[#FDFDFD] md:border-[#101010] rounded-md px-4 py-3 cursor-pointer'
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className='text-[#FDFDFD] md:text-gray-700'>
                      {/* {selectedConsole ? (
                        options.find((opt) => opt.value === selectedConsole)
                          ?.label
                      ) : (
                        <>{t("selectAConsole")}</>
                      )} */}
                      Seleziona una console
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#FDFDFD] md:text-gray-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className='z-50 absolute left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto'>
                      {["xbox", "playstation", "nintendo"].map((option) => (
                        <div
                          key={option}
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize'
                          onClick={() => {
                            setIsOpen(false);
                            setProduct_type(option);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Link href={`#products`}>
                  <button
                    className={`w-full sm:w-1/2 md:w-9/12 h-16 text-white rounded-sm ${
                      !product_type
                        ? "bg-[#101010] cursor-not-allowed"
                        : "bg-gray-700 hover:bg-gray-800"
                    }`}
                  >
                    Ottieni una stima del prezzo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
