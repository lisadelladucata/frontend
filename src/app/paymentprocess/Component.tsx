"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useGetProductsByIdsQuery } from "@/redux/features/products/GetProductByIds";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCreateOrderMutation } from "@/redux/features/order/OrderAPI";
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

export default function Checkout() {
	const [orderIndex, setOrderIndex] = useState(0);
	const [selectedPayment, setSelectedPayment] = useState<
		"card" | "paypal" | "klarna"
	>("card");
	const [cartData, setCartData] = useState([]);
	const [customerIdOnlocalStorage, setCustomerIdOnlocalStorage] = useState<
		string | number
	>("");
	const [secondaryPhone, setSecondaryPhone] = useState<string | number>("");

	const { t } = useTranslation();
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [createOrder] = useCreateOrderMutation();
	const router = useRouter();

	const getProductIds = () => {
		const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
		const productIds: string[] = cart.map(
			(item: { productId: string; tradeIn: any }) => item.productId
		);
		return productIds.join(",");
	};

	const { data: products, refetch } = useGetProductsByIdsQuery(getProductIds());

	// get the cart data from localStorage?
	useEffect(() => {
		const cart = localStorage?.getItem("cart");

		if (cart) {
			try {
				setCartData(JSON.parse(cart));
			} catch {
				setCartData([]);
			}
		}
	}, []);

	// get the secondary phone from localStorage?
	useEffect(() => {
		const phone = localStorage?.getItem("secondary_phone");

		if (phone) {
			try {
				setSecondaryPhone(JSON.parse(phone));
			} catch {
				setSecondaryPhone("");
			}
		}
	}, []);

	// get the customer id from localStorage?
	useEffect(() => {
		const customer = JSON.parse(localStorage?.getItem("customer") || "null");

		if (customer) {
			try {
				setCustomerIdOnlocalStorage(customer?._id);
			} catch {
				setCustomerIdOnlocalStorage("");
			}
		}
	}, []);

	const getProductQuantity = (id: string) => {
		const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
		const product = cart.find(
			(item: { productId: string }) => item.productId === id
		);

		return product ? product.quantity : 0;
	};

	const subtotal = products?.data?.products.reduce(
		(total: number, product: IProduct) => {
			const quantity = getProductQuantity(product?._id);

			// Multiply the quantity by the offer price of the product
			return total + quantity * product.offer_price;
		},
		0
	);

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
		const updatedCart = cartData.map((item: any) => {
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

	const removeItem = (id: string) => {
		refetch();
		setOrderIndex(0);
		const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
		const updatedCart = cart.filter(
			(item: { productId: string }) => item.productId !== id
		);

		localStorage?.setItem("cart", JSON.stringify(updatedCart));

		if (products?.data?.products?.length === 0) {
			toast.error("Please, add the product first!");

			router.push("/buy");
		}
	};

	const handlePrevious = () => {
		if (orderIndex === products?.data?.products.length - 1) {
			setOrderIndex(0);
			return;
		}
		setOrderIndex((prev) => prev + 1);
	};

	const handleNext = () => {
		if (orderIndex === products?.data?.products.length - 1) {
			setOrderIndex(0);
			return;
		}
		setOrderIndex((prev) => prev + 1);
	};

	const formattedCartData = cartData.map((item: any) => ({
		product: item.productId,
		quantity: item.quantity,
	}));

	const handlePayment = async () => {
		const orderInformation = {
			productDetails: formattedCartData,
			customer: customerIdOnlocalStorage,
			secondary_phone: secondaryPhone,
			method: selectedPayment,
		};

		if (products?.data?.products?.length === 0) {
			toast.error("Please, add the product first!");

			router.push("/buy");
			return;
		}

		const response = await createOrder(orderInformation).unwrap();

		if (response?.success) {
			toast.success(response?.message);

			window.location.href = response?.data?.checkout_url;

			// do empty cart after payment success
			// localStorage?.removeItem("cart");
		} else if (response?.error) {
			toast.error(response?.error);
			return;
		}
	};

	return (
		<div className="min-h-screen bg-[#F2F5F7] pt-8 pb-16">
			{/* Progress Steps */}
			<Container>
				<div>
					<h1 className="text-2xl font-bold text-center mb-8">
						{t("checkout")}
					</h1>
					<div className="w-full flex justify-between gap-5 mb-8">
						<h3 className="flex-1 text-lg text-[#101010] font-medium mb-4 pb-2 border-t-2 border-t-[#101010]">
							Accessories
						</h3>
						<h3 className="flex-1 text-lg text-[#101010] font-medium mb-4 pb-2 border-t-2 border-t-[#101010]">
							Cart
						</h3>
						<h3 className="flex-1 text-lg text-[#101010] font-medium mb-4 pb-2 border-t-2 border-t-[#101010]">
							Checkout
						</h3>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#F2F5F7]">
					{/* Left Column - Payment Form */}
					<div className="lg:col-span-2 space-y-6 bg-[#FDFDFD] rounded-xl p-6">
						{/* Delivery Details */}
						<div className="bg-[#FBFBFB] border p-5 rounded-lg shadow-sm">
							<h2 className="text-2xl font-semibold text-[#101010]">
								1. {t("deliveryDetails")}
							</h2>
							{/* Add delivery form fields here */}
						</div>

						{/* Payment Section */}
						<div className="bg-transparent rounded-lg shadow-sm">
							<div className="border p-5 rounded-lg shadow-sm">
								<h2 className="text-2xl font-semibold text-[#101010] capitalize">
									2. {"pay"}
								</h2>
							</div>

							<div className="lg:p-7 pt-6">
								<div className="space-y-6">
									<h3 className="font-semibold text-2xl text-[#404040] capitalize">
										{t("payNow")}:
									</h3>

									{/* Pay Now */}
									<div className="flex flex-col lg:flex-row items-center lg:justify-between gap-6">
										{/* Credit Card Option */}
										<div
											className={`flex items-center justify-between space-x-4 p-2.5 lg:p-5 border rounded-md ${
												selectedPayment === "card"
													? "border-emerald-950"
													: "border-[#FDFDFD]"
											}`}
										>
											<input
												type="radio"
												id="card"
												name="payment"
												checked={selectedPayment === "card"}
												onChange={() => setSelectedPayment("card")}
												// className="h-4 w-4 text-blue-600"
												className="mr-2 scale-150 accent-black text-lg text-[#101010] font-medium"
											/>
											<label
												htmlFor="card"
												className="flex items-center space-x-2 cursor-pointer"
											>
												<p className="flex flex-col mr-3">
													<span className="text-base lg:text-lg font-medium text-[#101010]">
														{t("creditDebitCard")}
													</span>
													<span className="text-[#5F5F5F] text-xs md:text-base">
														{t("instantPaymentByCreditCard")}
													</span>
												</p>
												<div className="flex space-x-2">
													<Image
														src="/payments/visa-mastercard.svg"
														alt="Visa"
														width={32}
														height={20}
														className="h-5 w-auto"
													/>
												</div>
											</label>
										</div>

										{/* PayPal Option */}
										<div
											className={`flex items-center space-x-4 p-5 border rounded-md ${
												selectedPayment === "paypal"
													? "border-emerald-950"
													: "border-[#FDFDFD]"
											}`}
										>
											<input
												type="radio"
												id="paypal"
												name="payment"
												checked={selectedPayment === "paypal"}
												onChange={() => setSelectedPayment("paypal")}
												// className="h-4 w-4 text-blue-600"
												className="mr-2 scale-150 accent-black text-lg text-[#101010] font-medium"
											/>
											<label
												htmlFor="paypal"
												className="flex items-center space-x-2 cursor-pointer"
											>
												<p className="flex flex-col mr-3">
													<span className="text-base lg:text-lg font-medium text-[#101010]">
														{t("payNow")}
													</span>
													<span className="text-[#5F5F5F] text-xs md:text-base">
														{t("payNowWithYouPayPalAccount")}
													</span>
												</p>
												<div className="flex space-x-2">
													<Image
														src="/payments/paypal2.svg"
														alt="Visa"
														width={32}
														height={20}
														className="h-5 w-auto"
													/>
												</div>
											</label>
										</div>
									</div>

									<h3 className="text-2xl font-semibold text-[#404040] pt-4">
										{t("payInInstallments")}:
									</h3>
									{/* PayPal Installments */}
									<div className="flex flex-col lg:flex-row items-center lg:justify-between gap-6">
										{/* <div
                      className={`flex items-center space-x-4 p-5 border rounded-md ${
                        selectedPayment === "paypal2"
                          ? "border-emerald-950"
                          : "border-[#FDFDFD]"
                      }`}
                    >
                      <input
                        type="radio"
                        id="paypal2"
                        name="payment"
                        checked={selectedPayment === "paypal2"}
                        onChange={() => setSelectedPayment("paypal2")}
                        // className="h-4 w-4 text-blue-600"
                        className="mr-2 scale-150 accent-black text-lg text-[#101010] font-medium"
                      />
                      <label
                        htmlFor="paypal2"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <p className="flex flex-col mr-3">
                          <span className="text-base lg:text-lg font-medium text-[#101010]">
                            {t("payInInstallments")}:
                          </span>
                          <span className="text-[#5F5F5F] text-xs md:text-base">
                            {t("payIn3InterestFreeInstallments")}
                          </span>
                        </p>
                        <div className="flex space-x-2">
                          <Image
                            src="/payments/paypal2.svg"
                            alt="Visa"
                            width={32}
                            height={20}
                            className="h-5 w-auto"
                          />
                        </div>
                      </label>
                    </div> */}

										<div
											className={`flex items-center space-x-4 p-5 border rounded-md ${
												selectedPayment === "klarna"
													? "border-emerald-950"
													: "border-[#FDFDFD]"
											}`}
										>
											<input
												type="radio"
												id="klarna"
												name="payment"
												checked={selectedPayment === "klarna"}
												onChange={() => setSelectedPayment("klarna")}
												className="mr-2 scale-150 accent-black text-lg text-[#101010] font-medium"
											/>
											<label
												htmlFor="klarna"
												className="flex items-center space-x-2 cursor-pointer"
											>
												<p className="flex flex-col mr-3">
													<span className="text-base lg:text-lg font-medium text-[#101010]">
														{t("payInInstallments")}:
													</span>
													<span className="text-[#5F5F5F] text-xs md:text-base">
														{t("payIn3InterestFreeInstallments")}
													</span>
												</p>
												<div className="flex space-x-2">
													<Image
														src="/payments/klarna.png"
														alt="Visa"
														width={60}
														height={60}
														className="h-10 w-auto"
													/>
												</div>
											</label>
										</div>
									</div>
								</div>

								{/* Error Message */}
								<div className="mt-6">
									<p className="text-xl font-semibold text-[#F04848]">
										{t("didYouMissAField")}
									</p>
									<p className="text-base text-[#F04848]">
										{t("pleaseReEnterYourDetailsBelow")}
									</p>
								</div>

								{/* Proceed Button */}
								{/* <Link href={"/empty"}> */}
								<button
									onClick={handlePayment}
									className="w-full bg-black text-white py-3 rounded mt-6 hover:bg-gray-800 transition-colors"
								>
									{t("proceedToPurchase")}
								</button>
								{/* </Link> */}

								{/* Terms and Privacy */}
								<p className="mt-4 text-lg text-[#2B2B2B]">
									{t("paymentProcessT1")}{" "}
									<Link href="#" className="text-blue-600 hover:underline">
										{t("paymentProcessT2")}
									</Link>{" "}
									{t("paymentProcessT3")}{" "}
									<Link href="#" className="text-blue-600 hover:underline">
										{t("paymentProcessT4")}
									</Link>
									.
								</p>
							</div>
						</div>
					</div>

					{/* Right Column - Order Summary */}
					<div className="bg-[#FDFDFD] p-6 rounded-lg shadow-sm">
						{/* <h2 className="text-2xl font-semibold text-[#101010] mb-6">
              {t("yourOrder")}
            </h2> */}

						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-[#101010] mb-4">
								{t("yourOrder")} ({products?.data?.products.length})
							</h2>
							<div className="flex gap-4">
								<button
									onClick={handlePrevious}
									className="w-8 h-8 border flex items-center justify-center rounded bg-[#FDFDFD] hover:bg-[#FDFDFD] transition-colors"
									aria-label="Previous review"
								>
									<ChevronLeft className="text-black" />
								</button>
								<button
									onClick={handleNext}
									className="w-8 h-8 border flex items-center justify-center rounded bg-[#FDFDFD] hover:bg-[#FDFDFD] transition-colors"
									aria-label="Next review"
								>
									<ChevronRight className="text-black" />
								</button>
							</div>
						</div>

						<div className="border-b pb-4 mb-4">
							{products?.data?.products?.length > 0 && (
								<div className="flex gap-4">
									<div className="relative w-[120px] h-[120px]">
										<Image
											src={
												products?.data?.products?.[orderIndex]?.images?.[0]
													? `${API_URL}/${products.data.products[orderIndex].images[0]}`
													: ""
											}
											alt="Product Image"
											width={120}
											height={120}
											className="w-[120px] h-[120px] object-cover"
										/>
									</div>
									<div className="flex-grow space-y-1">
										<h3 className="font-medium">
											{products?.data?.products[orderIndex].name}
										</h3>
										<p className="text-sm text-gray-600">
											{t("warranty")}:{" "}
											{products?.data?.products[orderIndex]?.model} |{" "}
											{products?.data?.products[orderIndex]?.memory}
										</p>
										<p className="text-sm text-gray-600">
											{t("condition")}:{" "}
											{products?.data?.products[orderIndex]?.controller}
										</p>
										{/*
										 */}
										<p className="text-sm text-gray-600">
											{t("salesAndShipping")}: Console & you
										</p>
									</div>

									<div className="text-right">
										<p className="font-medium">
											&euro;
											{(
												products?.data?.products[orderIndex]?.offer_price *
												getProductQuantity(
													products?.data?.products[orderIndex]?._id
												)
											).toFixed(2)}
										</p>
										<div className="flex items-center gap-2 mt-2">
											<button
												onClick={() =>
													decreaseQuantity(
														products?.data?.products[orderIndex]?._id
													)
												}
												className="w-6 h-6 flex items-center justify-center border rounded"
											>
												-
											</button>
											<span>
												{getProductQuantity(
													products?.data?.products[orderIndex]?._id
												)}
											</span>
											<button
												onClick={() =>
													increaseQuantity(
														products?.data?.products[orderIndex]?._id
													)
												}
												className="w-6 h-6 flex items-center justify-center border rounded"
											>
												+
											</button>
										</div>
										<button
											onClick={() =>
												removeItem(products?.data?.products[orderIndex]?._id)
											}
											className="text-sm text-red-600 mt-2"
										>
											Remove
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Price Summary */}
						<div className="bg-[#DAEDF2] mb-6 p-4 rounded-lg space-y-2">
							<div className="flex justify-between">
								<span className="text-gray-600 font-semibold">Xbox One</span>
								<span>${subtotal}</span>
							</div>
							<div className="flex justify-between">
								<span>{t("shipping")}</span>
								<span className="text-gray-500">{t("included")}</span>
							</div>
							<div className="flex justify-between font-medium pt-2 border-t">
								<span>{t("grandTotal")}</span>
								<span>${subtotal}</span>
							</div>
							<p className="text-xs text-gray-500">
								{t("thePriceIncludesVAT")}
							</p>
						</div>

						{/* Features */}
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Image
									src="/payments/warrent-protection.png"
									width={25}
									height={25}
									alt="Warranty"
								/>
								<span className="text-lg text-[#101010] font-medium">
									{t("monthsWarranty")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Image
									src="/payments/free-return.png"
									width={25}
									height={25}
									alt="Warranty"
								/>
								<span className="text-lg text-[#101010] font-medium">
									{t("freeReturn")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Image
									src="/payments/like-new.png"
									width={25}
									height={25}
									alt="Warranty"
								/>
								<span className="text-lg text-[#101010] font-medium">
									{t("performsLikeNewTitle")}
								</span>
							</div>
						</div>

						{/* Payment Methods */}
						<div className="mt-6 flex items-center space-x-2">
							{/* <Image
                src="/placeholder.svg"
                alt="Klarna"
                width={60}
                height={20}
                className="h-6 w-auto"
              />
              <Image
                src="/placeholder.svg"
                alt="PayPal"
                width={60}
                height={20}
                className="h-6 w-auto"
              /> */}
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
