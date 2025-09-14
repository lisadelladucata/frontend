"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function EmptyCart() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[700px] flex flex-col items-center justify-center p-4 bg-[#F2F5F7]">
      {/* Empty Cart Icon and Message */}
      <div className="text-center mb-8">
        {/* Cart Icon */}
        <svg
          className="w-24 h-24 mx-auto mb-6 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {t("yourCartIsStillEmpty")}
        </h1>
      </div>

      {/* Continue Shopping Button */}
      <Link
        href="/buy"
        className="w-full max-w-md bg-black text-white py-3 px-4 rounded text-center 
                   hover:bg-gray-800 transition-colors duration-200 mb-12"
      >
        {t("continueShopping")}
      </Link>

      {/* Features Section */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4 bg-[#FDFDFD] rounded-md">
        {/* Warranty Feature */}
        <div className="flex items-center justify-center space-x-3 p-4 rounded-lg shadow-sm">
          <Image
            src="/payments/warrent-protection.png"
            width={25}
            height={25}
            alt="Warranty"
          />
          <span className="text-base md:text-lg text-[#101010] font-medium leading-7">
            {t("monthsWarranty")}
          </span>
        </div>

        {/* Free Return Feature */}
        <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
          <Image
            src="/payments/free-return.png"
            width={25}
            height={25}
            alt="Warranty"
          />
          <span className="text-base md:text-lg text-[#101010] font-medium leading-7">
            {t("freeReturn")}
          </span>
        </div>

        {/* Performs Like New Feature */}
        <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
          <Image
            src="/payments/like-new.png"
            width={25}
            height={25}
            alt="Warranty"
          />
          <span className="text-base md:text-lg text-[#101010] font-medium leading-7">
            {t("performsLikeNewTitle")}
          </span>
        </div>
      </div>
    </div>
  );
}
