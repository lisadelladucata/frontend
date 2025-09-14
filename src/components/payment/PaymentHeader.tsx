"use client";

import { useState } from "react";
import { CartItem } from "./CardItem";
import Container from "../common/Container";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import toast from "react-hot-toast";

const INITIAL_ITEMS = [
  {
    id: "1",
    name: "Nintendo",
    price: 119,
    warranty: "12 months",
    storage: "128Gb",
    condition: "Good",
    delivery: "Jan 20 - Jan 22",
    isAvailable: false,
    hasAlternative: false,
  },
  {
    id: "2",
    name: "Nintendo Lite",
    price: 119,
    warranty: "12 months",
    storage: "128Gb",
    condition: "Good",
    delivery: "Jan 20 - Jan 22",
    isAvailable: true,
    hasAlternative: true,
  },
];

interface IProduct {
  _id: string;
  admin: string;
  images: string[];
  name: string;
  price: number;
  offer_price: number;
  model: string;
  brand: string;
  condition: string;
  quantity: number;
  memory: string;
  isVariant: boolean;
  product_type: string;
  slug: string;
  __v: number;
  [key: string]: any;
}

interface PaymentHeaderProps {
  variants: IProduct[];
}

interface CartItem {
  productId: string;
  quantity: number;
  tradeIn: any;
}

export default function PaymentHeader({ variants }: PaymentHeaderProps) {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleAddToCart = (id: string) => {
    console.log(id);
    const existingCart = JSON.parse(localStorage?.getItem("cart") || "[]");

    const newProduct = {
      productId: id,
      quantity: 1,
      tradeIn: null,
    };

    const isDuplicate: boolean = existingCart.some(
      (item: CartItem) => item.productId === newProduct.productId
    );

    if (isDuplicate) {
      const updatedCart = existingCart.map((item: CartItem) => {
        if (item.productId === newProduct.productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      localStorage?.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Product added to cart successfully!");
    }

    if (!isDuplicate) {
      toast.success("Product added to cart successfully!");
      existingCart.push(newProduct);
      localStorage?.setItem("cart", JSON.stringify(existingCart));
    }
  };

  // console.log("variants......", variants[0]?.images[0]);

  return (
    <div className="bg-[#F2F5F7]">
      <Container>
        <div className="px-2 sm:px-6">
          <h1 className="text-2xl font-bold text-center mb-8">{t("cart")}</h1>
          <div className="w-full flex justify-between gap-5 mb-8">
            <h3 className="flex-1 text-lg text-[#a8a8a8] font-medium mb-4 pb-2 border-t-2 border-t-[#a8a8a8]">
              {t("accessories")}
            </h3>
            <h3 className="flex-1 text-lg text-[#101010] font-medium mb-4 pb-2 border-t-2 border-t-[#101010]">
              {t("cart")}
            </h3>
            <h3 className="flex-1 text-lg text-[#a8a8a8] font-medium mb-4 pb-2 border-t-2 border-t-[#a8a8a8]">
              {t("checkout")}
            </h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-14">
            <div className="lg:col-span-2">
              <div className="flex flex-col lg:flex-row gap-8">
                {variants.map((product: IProduct) => (
                  <>
                    {/* for mobile */}
                    <div className="lg:hidden bg-white p-6 rounded-lg shadow-sm">
                      {/* {!product?.isAvailable && (
                        <span className="inline-block px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md mb-4">
                          Not available
                        </span>
                      )}
                      {product?.hasAlternative && (
                        <span className="inline-block px-3 py-1 text-sm bg-pink-100 text-pink-600 rounded-md mb-4">
                          Alternative option available
                        </span>
                      )} */}

                      <div className="flex flex-col gap-4">
                        <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
                          <Image
                            // src="/buy/p3.png"
                            src={`${API_URL}${product?.images[0]}`}
                            alt={product?.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                              {product?.name}
                            </h3>
                            <h2>{product?._id}</h2>
                            <p className="text-lg font-medium">
                              ${product?.price}
                            </p>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 mt-2">
                            <p>Storage: {product?.memory}</p>
                            <p>Condition: {product?.condition}</p>
                            {/* <p className="text-[#00B67A] text-sm font-medium">
                              Delivery: {product?.delivery}
                            </p> */}
                            <p>Sales & Shipping: Console & you</p>

                            <div className="flex items-center justify-between">
                              {/* <p>Warranty: {product?.warranty}</p> */}
                              <button
                                onClick={() => handleAddToCart(product?._id)}
                                className="text-sm font-medium text-[#222C9B]"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Image Section */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mx-auto md:mx-0">
                          <Image
                            src={`${API_URL}${product?.images[0]}`}
                            alt={product?.name}
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-center md:text-left">
                            {product?.name}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600 mt-2 text-center md:text-left">
                            <p className="text-xs  text-[#101010]">
                              Warranty: {product?.warranty} | {product?.storage}
                            </p>
                            <p className="text-xs text-[#2B2B2B]">
                              Condition: {product?.condition}
                            </p>
                            <p className="text-[#00B67A] font-medium text-sm">
                              Delivery: {product?.delivery}
                            </p>
                            <p className="text-xs text-[#101010]">
                              Sales & Shipping: Console & you
                            </p>
                            <p className="text-xs text-[#101010]">
                              Warranty: {product?.warranty}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end justify-between space-y-4 md:space-y-0">
                          <span className="text-lg font-medium">
                            ${product?.offer_price}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product._id)}
                            className="text-sm font-medium text-[#222C9B]"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>

            {variants.length > 0 && (
              <div className="hidden lg:col-span-1 lg:flex items-center justify-center">
                <button className="text-white bg-[#101010] py-3 px-9 rounded-md">
                  {t("addToCart")}
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
