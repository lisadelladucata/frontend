"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Container from "@/components/common/Container";
import { useGetProductsByIdsQuery } from "@/redux/features/products/GetProductByIds";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../loading";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { modifiedCart } from "@/redux/features/cart/TrackCartItem";
import { useRouter } from "next/navigation";

interface IProduct {
  _id: string;
  admin: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  offer_price: number;
  brand: string;
  model: string;
  condition: string;
  controller: string;
  memory: string;
  quantity: number;
  isVariant: boolean;
  product_type: string;
  slug: string;
  __v: number;
}

export default function CartPage() {
  const [coupon, setCoupon] = useState<string>("");
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();

  const getProductIds = () => {
    const cart = JSON.parse(localStorage?.getItem("cart") || "[]"); // Retrieve cart data
    const productIds: string[] = cart?.map(
      (item: { productId: string; tradeIn: any }) => item.productId
    );
    return productIds.join(",");
  };
  const router = useRouter();

  const {
    data: products,
    isLoading,
    refetch,
  } = useGetProductsByIdsQuery(getProductIds());

  const getProductQuantity = (id: string) => {
    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const product = cart.find(
      (item: { productId: string }) => item.productId === id
    );

    return product ? product.quantity : 0;
  };

  const removeItem = (id: string) => {
    refetch();
    dispatch(modifiedCart({}));

    const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
    const updatedCart = cart.filter(
      (item: { productId: string }) => item.productId !== id
    );

    localStorage?.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = products?.data?.products.reduce(
    (total: number, product: IProduct) => {
      const quantity = getProductQuantity(product?._id);

      // Multiply the quantity by the offer price of the product
      return total + quantity * product.offer_price;
    },
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return <Loading />;
  }

  const handleAddToCart = (id: string) => {
    refetch();
    dispatch(modifiedCart({}));

    const existingCart = JSON.parse(localStorage?.getItem("cart") || "[]");

    const newProduct = {
      productId: id,
      quantity: 1,
    };

    // Check if the productId already exists to prevent duplicates
    interface CartItem {
      productId: string;
      quantity: number;
    }

    const isDuplicate: boolean = existingCart.some(
      (item: CartItem) => item.productId === newProduct.productId
    );

    if (isDuplicate) {
      const updatedCart = existingCart?.map((item: CartItem) => {
        if (item.productId === newProduct.productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      localStorage?.setItem("cart", JSON.stringify(updatedCart));
    }

    if (!isDuplicate) {
      toast.success("Product added to cart successfully!");
      existingCart.push(newProduct); // Add new product
      localStorage?.setItem("cart", JSON.stringify(existingCart)); // Save updated cart
    }

    // router.push("/cart");
  };

  const increaseQuantity = (id: string) => {
    // Get the cart data from localStorage?
    refetch();
    const cartData = JSON.parse(localStorage?.getItem("cart") || "[]");

    const itemExists = cartData.some((item: any) => item.productId === id);

    if (!itemExists) {
      toast.error("Please, add the product first!");
      return;
    }

    // Check if the product exists in the cart
    const updatedCart = cartData?.map((item: any) => {
      if (item.productId === id) {
        return { ...item, quantity: item.quantity + 1 }; // Increase quantity
      }

      return item;
    });

    // Store the updated cart back into localStorage?
    localStorage?.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id: string) => {
    refetch();
    // Get the cart data from localStorage?
    const cartData = JSON.parse(localStorage?.getItem("cart") || "[]");

    const itemExists = cartData.some((item: any) => item.productId === id);

    if (!itemExists) {
      toast.error("Please, add the product first!");
      return;
    }

    // Check if the product exists in the cart
    const updatedCart = cartData.map((item: any) => {
      if (item.productId === id && item.quantity > 1) {
        // Decrease quantity only if it's greater than 1
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    // Store the updated cart back into localStorage?
    localStorage?.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCoupon = () => {
    if (coupon.length > 0) {
      toast.error("Coupon isn't available at the moment!");
      setCoupon("");
    }
  };

  const handleCheckout = () => {
    if (products?.data?.products?.length === 0) {
      toast.error("Please, add the product first!");

      router.push("/buy");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Contenitore principale, impostato su bianco per riflettere lo screenshot */}

      <div className="mx-5 py-4">
        {/* Container per margini laterali e padding verticale per il titolo */}

        {/* Intestazione del Carrello (Basato su Screenshot 2025-10-11 004910.png) */}
        <div className="mb-5">
          <h2 className="text-[32px] font-semibold text-[#101010]">
            Il tuo carrello
          </h2>
        </div>

        <div className="mb-5">
          <p className="text-base text-[#101010] font-medium">
            {products?.data?.products.length} articoli nel tuo carrello:
          </p>
        </div>

        {/* Lista degli Elementi nel Carrello */}
        <div className="flex flex-col gap-3">
          {products?.data?.products?.map((product: IProduct) => (
            <div
              key={product?._id}
              className="bg-white flex gap-3 p-3 border border-gray-200 rounded-lg shadow-sm" // Aggiungo un leggero bordo/ombra per separare gli elementi
            >
              {/* Immagine a Sinistra */}
              <div className="w-[120px] h-[120px] overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={`${API_URL}/${product?.images[0]}`}
                  className="w-full h-full object-cover"
                  width={300}
                  height={300}
                  alt={product?.name}
                  style={{
                    backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
                  }}
                />
              </div>

              {/* Dettagli del Prodotto e Prezzo a Destra */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg text-[#101010] font-semibold">
                    {product?.name}
                  </h3>
                  {/* Dettagli più specifici (adattati dallo screenshot) */}
                  <p className="text-sm font-normal text-gray-700">
                    {product?.memory} | {getProductQuantity(product?._id)}{" "}
                    Controller
                  </p>
                  <p className="text-sm font-normal text-gray-700 mb-2">
                    {product?.condition}
                  </p>
                </div>

                {/* Prezzo e Rimuovi (in linea) */}
                <div className="flex items-end justify-between mt-auto">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-600">Prezzo:</p>
                    <h4 className="text-2xl font-bold text-[#FD9A34]">
                      &euro;
                      {product?.offer_price * getProductQuantity(product?._id)}
                    </h4>
                  </div>

                  {/* Pulsante Rimuovi (stile minimalista dello screenshot) */}
                  <div
                    onClick={() => removeItem(product?._id)}
                    className="flex items-center text-red-600 text-sm font-medium cursor-pointer hover:text-red-800 transition-colors">
                    Rimuovi
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1">
                      <path
                        d="M6 18L18 6M6 6L18 18"
                        stroke="currentColor" // Usa il colore del testo (red-600)
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Box Totale */}
        <div className="mx-5 mt-5 mb-5 bg-[#FDFDFD] flex items-center justify-between rounded-lg p-4">
          <h3 className="text-2xl font-semibold text-[#404040]">Total</h3>
          <h2 className="text-[40px] font-semibold text-[#FD9A34]">
            ${subtotal}
          </h2>
        </div>

        {/* Sezione 'You might also be interested in' */}
        <div className="w-full pb-9">
          <div className="mx-5 border-b-2 border-b-[#B8B8B8] space-x-4 pt-3 mb-6">
            <h2 className="text-[#101010] text-xl font-semibold pb-3">
              You might also be interested in
            </h2>
          </div>

          <div className="mx-5 grid grid-cols-2 gap-x-2 gap-y-4">
            {products?.data?.variants?.map((product: IProduct) => (
              <div key={product?._id} className="bg-[#FDFDFD] rounded-lg">
                <div className="p-2">
                  <Image
                    src={`${API_URL}/${product?.images[0]}`}
                    className="w-full h-full"
                    width={600}
                    height={600}
                    alt=""
                    style={{
                      backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
                    }}
                  />
                </div>

                <div className="relative flex items-center justify-between border-b border-b-[#B5B5B5] p-2">
                  {/* Add to cart */}
                  <div className="absolute bg-[#FDFDFD] rounded-md -top-6 right-2 shadow-md">
                    <button
                      onClick={() => handleAddToCart(product?._id)}
                      className="px-3 py-1 flex items-center gap-1">
                      Add
                      <svg
                        width="19"
                        height="17"
                        viewBox="0 0 19 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5.5 14.5C5.77614 14.5 6 14.2761 6 14C6 13.7239 5.77614 13.5 5.5 13.5C5.22386 13.5 5 13.7239 5 14C5 14.2761 5.22386 14.5 5.5 14.5Z"
                          stroke="#404040"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.5 14.5C12.7761 14.5 13 14.2761 13 14C13 13.7239 12.7761 13.5 12.5 13.5C12.2239 13.5 12 13.7239 12 14C12 14.2761 12.2239 14.5 12.5 14.5Z"
                          stroke="#404040"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.5 3.5H3.5L5 12H13"
                          stroke="#404040"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 10H12.795C12.8528 10 12.9089 9.98004 12.9536 9.9434C12.9983 9.90676 13.029 9.85576 13.0403 9.79906L13.9403 5.29906C13.9476 5.26278 13.9467 5.22533 13.9377 5.18943C13.9288 5.15352 13.9119 5.12006 13.8885 5.09145C13.865 5.06284 13.8355 5.03979 13.802 5.02398C13.7686 5.00816 13.732 4.99997 13.695 5H4"
                          stroke="#404040"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="10"
                          y="1"
                          width="8"
                          height="8"
                          rx="4"
                          fill="#FDFDFD"
                        />
                        <path
                          d="M14 9C16.2 9 18 7.2 18 5C18 2.8 16.2 1 14 1C11.8 1 10 2.8 10 5C10 7.2 11.8 9 14 9Z"
                          stroke="#FD9A34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.667 5H15.3337"
                          stroke="#FD9A34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 6.33366V3.66699"
                          stroke="#FD9A34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <h2 className="text-[#101010] font-medium">
                      {product?.name}
                    </h2>
                    <p className="text-[#101010] text-[10px] ">
                      {product?.brand} | {product?.condition}
                    </p>
                  </div>

                  <h2 className="text-base text-[#101010] ">
                    ${product?.offer_price}
                  </h2>
                </div>

                <div className="flex items-center justify-between gap-2.5 py-4 mx-4">
                  <button
                    onClick={() => decreaseQuantity(product?._id)}
                    className="bg-[#FD9A34] h-6 w-[32px] text-[#FDFDFD] rounded-md">
                    -
                  </button>
                  <p className="h-6 w-6 text-xs text-[#000000] border border-[#B5B5B5] rounded-md flex items-center justify-center">
                    {getProductQuantity(product?._id)}
                  </p>
                  <button
                    onClick={() => increaseQuantity(product?._id)}
                    className="bg-[#FD9A34] h-6 w-[32px] text-[#FDFDFD] rounded-md">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer di Pagamento */}
        <div className="p-5 bg-[#FDFDFD]">
          <button
            onClick={handleCheckout}
            className="w-full text-[#FDFDFD] font-semibold bg-[#FD9A34] h-14 rounded-lg">
            PAY NOW
          </button>
        </div>
      </div>
    </div>
  );
}
