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
		<div>
			<div className="hidden md:block min-h-screen bg-[#F2F5F7] pt-16 pb-20">
				{/* <PaymentHeader variants={products?.data?.variants} /> */}

				{/* accessories */}
				<div className="bg-[#F2F5F7]">
					<Container>
						<div className="px-2 sm:px-6">
							<h1 className="text-2xl font-bold text-center mb-8">
								{t("cart")}
							</h1>
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
										{products?.data?.variants?.map((product: IProduct) => (
											<div key={product?._id}>
												{/* for mobile */}
												<div className="lg:hidden bg-white p-6 rounded-lg shadow-sm">
													<div className="flex flex-col gap-4">
														<div className="relative w-32 h-32 flex items-center justify-center mx-auto">
															<img
																// src="/buy/p3.png"
																src={`${API_URL}${product?.images[0]}`}
																alt={product?.name}
																width={100}
																height={100}
																className="object-contain"
																style={{
																	backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
																}}
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
																<p>Storage: {product?.memory} bvbc</p>
																<p>Condition: {product?.condition}</p>
																<p className="text-[#00B67A] text-sm font-medium">
																	Controller: {product?.controller}
																</p>
																<p>Sales & Shipping: Console & you</p>

																<div className="flex items-center justify-between">
																	{/* <p>Warranty: {product?.warranty}</p> */}
																	<button
																		onClick={() =>
																			handleAddToCart(product?._id)
																		}
																		className="text-sm font-medium text-[#222C9B]"
																	>
																		Add to Cart
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>

												{/* for desktop */}
												<div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm">
													<div className="flex flex-col md:flex-row gap-4">
														{/* Image Section */}
														<div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mx-auto md:mx-0">
															<Image
																src={`${API_URL}${product?.images[0]}`}
																alt={product?.name}
																fill
																className="object-contain rounded-md"
																style={{
																	backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
																}}
															/>
														</div>

														<div className="flex-grow">
															<h3 className="text-xl font-semibold text-center md:text-left">
																{product?.name}
															</h3>
															<div className="space-y-1 text-sm text-gray-600 mt-2 text-center md:text-left">
																<p className="text-xs  text-[#101010]">
																	Brand: {product?.brand}
																</p>
																<p className="text-xs text-[#2B2B2B]">
																	Memory: {product?.memory}
																</p>
																<p className="text-[#00B67A] font-medium text-sm">
																	Condition: {product?.condition}
																</p>
																<p className="text-xs text-[#101010]">
																	Controller: {product?.controller}
																</p>
																<p className="text-xs text-[#101010]">
																	Sales & Shipping: Console & you
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
											</div>
										))}
									</div>
								</div>

								{products?.data?.variants.length > 0 && (
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

				<Container>
					{/* only for desktop view */}
					<div className="flex flex-col lg:flex-row gap-12">
						{/* Cart Items */}
						<div className="bg-[#FDFDFD] rounded-lg flex-grow space-y-4">
							<div className="pt-6 pl-6">
								<h1 className="text-2xl font-bold text-[#101010]">
									{t("cart")}
								</h1>
							</div>

							{products?.data?.products?.length === 0 && (
								<div className="h-full flex flex-col items-center justify-center">
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
								</div>
							)}

							{products?.data?.products?.map((product: IProduct) => (
								<div key={product?._id} className="bg-[#FDFDFD] rounded-lg p-6">
									<div className="flex flex-wrap items-center justify-between space-x-4">
										<div className="w-[120px] h-[120px] relative flex-shrink-0">
											<Image
												src={`${API_URL}/${product?.images[0]}`}
												alt={product?.name}
												width={120}
												height={120}
												className="object-cover rounded-lg"
												style={{
													backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
												}}
											/>
										</div>

										<div className="flex-1 flex flex-wrap gap-3">
											<div className="flex-grow flex flex-col justify-between space-y-2.5 h-inherit">
												<h3 className="text-xl font-semibold text-[#101010]">
													{product.name}
												</h3>
												<p className="text-xs md:text-base text-[#353232] capitalize">
													Brand: {product?.brand}
												</p>
												<p className="text-xs md:text-base text-[#5F5F5F] mb-1 capitalize">
													{product?.model} | Controller: {product?.controller} |{" "}
													{product?.memory} | {product?.condition}
												</p>
												<p className="text-xs md:text-sm text-[#5F5F5F]">
													{t("salesAndShipping")}:{" "}
													<span className="underline">Console & you</span>
												</p>
											</div>

											<div className="text-right">
												<p className="text-lg font-medium text-[#FD9A34]">
													{t("price")}: $
													{(
														product?.offer_price *
														getProductQuantity(product?._id)
													).toFixed(2)}
												</p>
												<div className="flex items-center space-x-2 mt-2">
													<button
														onClick={() => decreaseQuantity(product?._id)}
														className={`${
															getProductQuantity(product?._id) === 1 &&
															"cursor-not-allowed"
														} w-7 h-7 bg-transparent flex items-center justify-center text-lg border border-[#E6E6E6] rounded-md px-1 py-1 text-[#101010] hover:text-gray-700`}
													>
														-
													</button>
													<span className="text-gray-700 px-1">
														{getProductQuantity(product?._id)}
													</span>
													<button
														onClick={() => increaseQuantity(product?._id)}
														className="w-7 h-7 bg-transparent flex items-center justify-center text-lg border border-[#E6E6E6] rounded-md px-1 py-1 text-[#101010] hover:text-gray-700"
													>
														+
													</button>
												</div>
												<button
													onClick={() => removeItem(product?._id)}
													className="text-sm text-[#F04848] font-medium hover:text-[#ed3d3d] mt-2 underline"
												>
													{t("remove")}
												</button>
											</div>
										</div>
									</div>

									{!product.quantity && (
										<>
											<div className="bg-[#F5CECE] text-[#F04848] text-xs px-3 py-2 rounded-md my-4">
												2/3 Not available
											</div>
											<p className="text-[#5F5F5F]">
												Unfortunately this item is no longer available. You can
												complete your order without or purchase alternative
												products.
											</p>
										</>
									)}
									{/*  */}
									<div className="flex items-center justify-center py-8 space-x-3">
										<hr className="flex-1 border-b border-[#D6D6D6]" />
										<h2 className="text-[#FD9A34] text-base font-semibold text-center whitespace-nowrap">
											+ {t("discoverTheAccessories")}
										</h2>
										<hr className="flex-1 border-b border-[#D6D6D6]" />
									</div>
								</div>
							))}
						</div>

						{/* Summary */}
						<div className="w-full lg:w-[550px]">
							<div className="bg-[#FDFDFD] rounded-lg p-6">
								<h2 className="text-2xl font-semibold text-[#101010] mb-4">
									{t("summary")}
								</h2>
								<div>
									<div className="rounded-md bg-[#DAEDF2]">
										<div className="p-4">
											<div className="flex justify-between">
												<span className="text-[#101010] font-semibold">
													Total
												</span>
												<span className="text-[#FD9A34]">
													${subtotal.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-[#101010] font-medium">
													{t("shipping")}
												</span>
												<span className="text[#101010] font-medium">
													{t("included")}
												</span>
											</div>
										</div>
										<div className="border-t border-[#cccbcb] p-4">
											<div className="flex justify-between">
												<span className="font-semibold text-xl text-[#101010]">
													{t("grandTotal")}
												</span>
												<span className="font-semibold text-xl text-[#FD9A34]">
													${total.toFixed(2)}
												</span>
											</div>
											<p className="text-base text-[#101010] mt-1">
												{t("thePriceIncludesVAT")}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-5 py-3">
										<input
											type="text"
											name="coupon"
											value={coupon}
											onChange={(e) => setCoupon(e.target.value)}
											placeholder="Enter your code"
											className="w-full px-4 py-2.5 border rounded-lg"
										/>
										<button
											onClick={handleCoupon}
											className="bg-[#FD9A34] text-white px-4 py-2.5 rounded-lg hover:bg-gray-700"
										>
											{t("apply")}
										</button>
									</div>

									<div className="space-y-4 mt-6 pb-2.5">
										<div className="flex items-center space-x-3">
											<div className="w-6 h-6">
												<Image
													src={"/payments/warrent-protection.png"}
													width={30}
													height={30}
													alt="warrent-protection"
												/>
											</div>
											<span className="text-[#101010]">
												{"12 Months Warranty"}
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-6 h-6">
												<Image
													src={"/payments/free-return.png"}
													width={30}
													height={30}
													alt="warrent-protection"
												/>
											</div>
											<span className="text-[#101010]">{t("freeReturn")}</span>
										</div>
										<div className="flex items-center space-x-3">
											<div className="w-6 h-6">
												<Image
													src={"/payments/like-new.png"}
													width={30}
													height={30}
													alt="warrent-protection"
												/>
											</div>
											<span className="text-[#101010]">
												{t("performsLikeNewTitle")}
											</span>
										</div>
									</div>

									<div className="flex justify-center space-x-4 mt-4">
										<div className="w-[70px] h-12 bg-[#F4B6C7] rounded flex items-center justify-center">
											<span className="text-[#17120F] font-medium">Klarna</span>
										</div>
										<div className="w-[70px] h-12 bg-blue-100 rounded flex items-center justify-center">
											<Image
												src={"/payments/paypal.png"}
												className="w-[74px] h-[48px] object-contain"
												width={60}
												height={30}
												alt="paypal"
											/>
										</div>
									</div>

									<div className="py-2">
										<p className="text-sm text-[#5F5F5F]">
											{t("applicableTaxLaw")}
										</p>
									</div>

									{/* <Link href={"/checkout"}> */}
									<button
										onClick={handleCheckout}
										className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 mt-6"
									>
										{t("goAhead")}
									</button>
									{/* </Link> */}
								</div>
							</div>
						</div>
					</div>
				</Container>
			</div>

			{/* only for mobile view */}
			<div className="md:hidden bg-[#EAE9EF]">
				<div className="mx-5">
					<h2 className="pt-3 mb-5 text-[32px] font-semibold text-[#101010] border-b-2 border-b-[#B8B8B8]">
						Your Cart
					</h2>
				</div>

				<div className="mx-5">
					<p className="text-lg text-[#101010] mb-5">
						{products?.data?.products.length} items in your cart:
					</p>

					{products?.data?.products?.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center">
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
						</div>
					)}
					<div className="flex flex-col gap-4">
						{products?.data?.products?.map((product: IProduct) => (
							<div
								key={product?._id}
								className="bg-[#FDFDFD] flex gap-3 rounded-lg p-3"
							>
								<div className="w-[120px] h-[130px]">
									<Image
										src={`${API_URL}/${product?.images[0]}`}
										className="w-full h-full rounded-md"
										width={300}
										height={300}
										alt="console"
										style={{
											backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
										}}
									/>
								</div>

								<div className="flex-1">
									<div className="">
										<h2 className="text-lg text-[#404040] font-medium">
											{product?.name}
										</h2>
										<p className="text-xs font-medium text-[#404040]">
											{product?.brand}
										</p>

										<p className="text-xs font-medium text-[#404040]">
											{product?.model} | {product?.controller} |{" "}
											{product?.memory} | {product?.condition}
										</p>
									</div>

									<div className="flex items-center justify-between border-y border-y-[#B5B5B5] py-1.5">
										<h3 className="text-lg font-medium text-[#404040]">
											Price:
										</h3>
										<h3 className="text-2xl font-semibold text-[#FD9A34]">
											&euro;
											{(
												product?.offer_price * getProductQuantity(product?._id)
											).toFixed(2)}
										</h3>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2 mt-2">
											<button
												onClick={() => decreaseQuantity(product?._id)}
												className={`${
													getProductQuantity(product?._id) === 1 &&
													"cursor-not-allowed"
												} w-7 h-7 bg-transparent flex items-center justify-center text-lg border border-[#E6E6E6] rounded-md px-1 py-1 text-[#101010] hover:text-gray-700`}
											>
												-
											</button>
											<span className="text-gray-700 px-1">
												{getProductQuantity(product?._id)}
											</span>
											<button
												onClick={() => increaseQuantity(product?._id)}
												className="w-7 h-7 bg-transparent flex items-center justify-center text-lg border border-[#E6E6E6] rounded-md px-1 py-1 text-[#101010] hover:text-gray-700"
											>
												+
											</button>
										</div>
										<div
											onClick={() => removeItem(product?._id)}
											className="flex justify-end py-1"
										>
											<p>Remove</p>
											<svg
												width="25"
												height="24"
												viewBox="0 0 25 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M7.5 7L17.5 17M7.5 17L17.5 7"
													stroke="#D61D1E"
													strokeWidth="2"
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
				</div>

				<div className="mx-5 mt-5 mb-5 bg-[#FDFDFD] flex items-center justify-between  rounded-lg p-4">
					<h3 className="text-2xl font-semibold text-[#404040]">Total</h3>
					<h2 className="text-[40px] font-semibold text-[#FD9A34]">
						${subtotal.toFixed(2)}
					</h2>
				</div>

				<div className="md:hidden w-full pb-9">
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
											className="px-3 py-1 flex items-center gap-1"
										>
											Add
											<svg
												width="19"
												height="17"
												viewBox="0 0 19 17"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
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
										className="bg-[#FD9A34] h-6 w-[32px] text-[#FDFDFD] rounded-md"
									>
										-
									</button>
									<p className="h-6 w-6 text-xs text-[#000000] border border-[#B5B5B5] rounded-md flex items-center justify-center">
										{getProductQuantity(product?._id)}
									</p>
									<button
										onClick={() => increaseQuantity(product?._id)}
										className="bg-[#FD9A34] h-6 w-[32px] text-[#FDFDFD] rounded-md"
									>
										+
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="p-5 bg-[#FDFDFD]">
					{/* <Link href={"/checkout"}> */}
					<button
						onClick={handleCheckout}
						className="w-full text-[#FDFDFD] font-semibold bg-[#FD9A34] h-14 rounded-lg"
					>
						PAY NOW
					</button>
					{/* </Link> */}
				</div>
			</div>
		</div>
	);
}
