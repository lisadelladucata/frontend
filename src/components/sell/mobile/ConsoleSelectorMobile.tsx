"use client";

import Container from "@/components/common/Container";
import { Tabs } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSellProductQuery } from "@/redux/features/sell/SellProductAPI";

interface IConsole {
  admin: string;
  brand: string;
  condition: string;
  controller: string;
  description: string;
  image: string;
  isVariant: boolean;
  memory: string;
  model: string;
  name: string;
  offer_price: number;
  price: number;
  product_type: string;
  quantity: number;
  slug: string;
  _id: string;
  base_price: number;
}

export default function ConsoleSelectorMobile() {
  const [activeTab, setActiveTab] = useState("xbox");
  const { t } = useTranslation();
  const pathname = usePathname();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const { data: products } = useSellProductQuery({
    product_type: activeTab,
    limit: 6,
  });

  return (
    <div className='min-h-screen bg-[#F2F5F7]'>
      <div className='flex items-center justify-center pt-14 space-x-7 lg:space-x-9'>
        <hr className='flex-1 border-b-2 border-gray-300' />
        <h2
          className={`${
            pathname === "/"
              ? ""
              : "bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md"
          } text-[#101010] text-2xl md:text-5xl font-semibold text-center whitespace-nowrap`}
        >
          {t("consoleHeaderTitle")}
        </h2>
        <hr className='flex-1 border-b-2 border-gray-300' />
      </div>

      <div className='py-5'>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className='custom-tabs'
          items={[
            {
              key: "xbox",
              label: (
                <div className='group flex items-center justify-center'>
                  <div
                    className={`w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center transition-all group-hover:bg-tab1-radial ${
                      activeTab === "xbox"
                        ? "bg-tab1-radial"
                        : // ? "bg-gradient-to-r from-[#1B9E31] to-[#0E7A22]"
                          "bg-gradient-to-r from-[#ABABAB] to-[#CCCCCC]"
                    } bg-gradient-to-r from-gray-300 to-gray-400`}
                  >
                    <Image
                      src='/tab/xbox.svg'
                      alt='Xbox'
                      width={55}
                      height={55}
                      className='text-white'
                    />
                  </div>
                </div>
              ),
              children: (
                <div
                  className={`p-3 pb-12 md:pb-20 ${
                    activeTab === "xbox" ? "bg-[#63b95d]" : ""
                  }`}
                >
                  <Container className='w-full mx-auto'>
                    <div className='flex items-center py-3 space-x-4 lg:space-x-7'>
                      <h2 className='text-2xl lg:text-5xl font-bold text-[#FDFDFD] pt-4 mb-8'>
                        Xbox
                      </h2>
                      <hr className='flex-1 border-b-4 border-gray-100 -mt-4' />
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-[15px] gap-y-6'>
                      {products?.data?.products?.length < 1 && (
                        <p className='text-lg text-white'>No Xbox found!</p>
                      )}
                      {products?.data?.products?.map((console: IConsole) => (
                        <Link
                          href={`/sell/${console?._id}`}
                          key={console._id}
                          className='bg-white rounded-lg overflow-hidden shadow-sm'
                        >
                          <div className='relative w-full h-[153px] lg:h-[387px]'>
                            <Image
                              src={`${API_URL}${console.image}`}
                              alt={`${console.name} ${console.model}`}
                              width={700}
                              height={500}
                              className='min-w-full max-w-full h-full'
                            />
                          </div>
                          <div className='p-2.5 md:p-4'>
                            <div className='flex justify-between items-center mb-2'>
                              <div className='flex flex-col gap-1'>
                                <h3 className='font-semibold text-[#101010] text-xs leading-[24px]'>
                                  {console?.name}
                                </h3>
                                <p className='text-[#2B2B2B] text-[10px]'>
                                  Series X
                                </p>
                              </div>
                              <p className='text-[#2B2B2B] font-semibold text-sm space-x-1'>
                                ${console?.base_price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Container>
                </div>
              ),
            },
            {
              key: "playstation",
              label: (
                <div className='group flex items-center justify-center'>
                  <div
                    className={`w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center transition-all group-hover:bg-tab2-radial ${
                      activeTab === "playstation"
                        ? "bg-tab2-radial"
                        : "bg-gradient-to-r from-[#ABABAB] to-[#CCCCCC]"
                    } hover:bg-gradient-to-r hover:from-[#023993] hover:to-[#0050D4]`}
                  >
                    <Image
                      src='/tab/playstation.svg'
                      alt='PlayStation'
                      width={60}
                      height={60}
                      className='text-white'
                    />
                  </div>
                </div>
              ),
              children: (
                <div className='p-3 pb-12 md:pb-20 bg-[#1761bf]'>
                  <Container className='w-[98%] mx-auto'>
                    <div className='flex items-center py-3 space-x-4 lg:space-x-7'>
                      <h2 className='text-2xl lg:text-5xl font-bold text-[#FDFDFD] pt-4 mb-8'>
                        Playstation
                      </h2>
                      <hr className='flex-1 border-b-4 border-gray-100 -mt-4' />
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-[15px] gap-y-6'>
                      {products?.data?.products?.length < 1 && (
                        <p className='text-lg text-white'>
                          No Playstation found!
                        </p>
                      )}
                      {products?.data?.products?.map((console: IConsole) => (
                        <Link
                          href={`/sell/${console?._id}`}
                          key={console._id}
                          className='bg-white rounded-lg overflow-hidden shadow-sm'
                        >
                          <div className='relative w-full h-[153px] lg:h-[387px]'>
                            <Image
                              src={`${API_URL}${console.image}`}
                              alt={`${console.name} ${console.model}`}
                              width={700}
                              height={500}
                              className='w-full h-full'
                            />
                          </div>
                          <div className='p-2.5 md:p-4'>
                            <div className='flex justify-between items-center mb-2'>
                              <div className='flex flex-col gap-1'>
                                <h3 className='font-semibold text-[#101010] text-xs leading-[24px]'>
                                  {console?.name}
                                </h3>
                                <p className='text-[#2B2B2B] text-[10px]'>
                                  Series X
                                </p>
                              </div>
                              <p className='text-[#2B2B2B] font-semibold text-sm space-x-1'>
                                ${console?.base_price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Container>
                </div>
              ),
            },
            {
              key: "nintendo",
              label: (
                <div className='group flex items-center justify-center w-max mx-auto'>
                  <div
                    className={`w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center transition-all group-hover:bg-tab3-radial ${
                      activeTab === "nintendo"
                        ? "bg-tab3-radial"
                        : "bg-gradient-to-r from-[#ABABAB] to-[#CCCCCC]"
                    }`}
                  >
                    <Image
                      src='/tab/nintendo2.svg'
                      alt='Nintendo'
                      width={75}
                      height={160}
                      className='text-white'
                    />
                  </div>
                </div>
              ),
              children: (
                <div className='p-3 pb-12 md:pb-20 bg-[#f34040]'>
                  <Container className='w-[98%] mx-auto'>
                    <div className='flex items-center py-3 space-x-4 lg:space-x-7'>
                      <h2 className='text-2xl lg:text-5xl font-bold text-[#FDFDFD] pt-4 mb-8'>
                        Nintendo
                      </h2>
                      <hr className='flex-1 border-b-4 border-gray-100 -mt-4' />
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-[15px] gap-y-6'>
                      {products?.data?.products?.length < 1 && (
                        <p className='text-lg text-white'>No Nintendo found!</p>
                      )}
                      {products?.data?.products?.map((console: IConsole) => (
                        <Link
                          href={`/sell/${console?._id}`}
                          key={console._id}
                          className='bg-white rounded-lg overflow-hidden shadow-sm'
                        >
                          <div className='relative w-full h-[153px] lg:h-[387px]'>
                            <Image
                              src={`${API_URL}${console.image}`}
                              alt={`${console.name} ${console.model}`}
                              width={700}
                              height={500}
                              className='w-full h-full'
                            />
                          </div>
                          <div className='p-2.5 md:p-4'>
                            <div className='flex justify-between items-center mb-2'>
                              <div className='flex flex-col gap-1'>
                                <h3 className='font-semibold text-[#101010] text-xs leading-[24px]'>
                                  {console?.name}
                                </h3>
                                <p className='text-[#2B2B2B] text-[10px]'>
                                  Series X
                                </p>
                              </div>
                              <p className='text-[#2B2B2B] font-semibold text-sm space-x-1'>
                                ${console?.base_price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Container>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
