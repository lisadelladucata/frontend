"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/components/common/Container";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useCreateCustomerMutation } from "@/redux/features/customer/CustomerAPI";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetProductsByIdsQuery } from "@/redux/features/products/GetProductByIds";

interface OrderItem {
	id: string;
	name: string;
	price: number;
	warranty: string;
	storage: string;
	condition: string;
	delivery: string;
	quantity: number;
}

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

export default function CheckoutPage() {
	const [formData, setFormData] = useState({
		title: "Mr",
		firstName: "",
		surname: "",
		address: "",
		zipCode: "",
		city: "",
		country: "",
		email: "",
		phone: "",
		phoneCode: "+39",
		furtherContactInformation: "",
		sameAddress: false,
	});
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const { t } = useTranslation();
	const router = useRouter();
	const [orderIndex, setOrderIndex] = useState(0);
	const [customerEmailOnlocalStorage, setCustomerEmailOnlocalStorage] =
		useState<string | null>(null);

	const [createCustomer] = useCreateCustomerMutation();

	const [orderItem] = useState<OrderItem>({
		id: "1",
		name: "Xbox One",
		price: 119,
		warranty: "12 months",
		storage: "128Gb",
		condition: "Good",
		delivery: "Jan 20 - Jan 22",
		quantity: 1,
	});

	const getProductIds = () => {
		const cart = JSON.parse(localStorage?.getItem("cart") || "[]");
		const productIds: string[] = cart.map(
			(item: { productId: string; tradeIn: any }) => item.productId
		);
		return productIds.join(",");
	};

	// If have customer data, Get the customer data from localStorage?
	useEffect(() => {
		const customerData = JSON.parse(
			localStorage?.getItem("customer") || "null"
		);

		if (customerData) {
			setFormData((prev) => ({
				...prev,
				firstName: customerData.name.split(" ")[0],
				surname: customerData.name.split(" ")[1] || "",
				address: customerData.address.address,
				zipCode: customerData.address.zip_code,
				city: customerData.address.city,
				country: customerData.address.country,
				email: customerData.email,
				phone: customerData.phone,
			}));

			setCustomerEmailOnlocalStorage(customerData.email);
		}
	}, []);

	useEffect(() => {
		const storedPhone = localStorage?.getItem("secondary_phone");

		let secondary_phone;
		try {
			secondary_phone = storedPhone ? JSON.parse(storedPhone) : null;
		} catch (error) {
			console.error("Error parsing secondary_phone from localStorage:", error);
			secondary_phone = null;
		}

		if (secondary_phone) {
			setFormData((prev) => ({
				...prev,
				furtherContactInformation: secondary_phone,
			}));
		}
	}, []);

	const { data: products, refetch } = useGetProductsByIdsQuery(getProductIds());

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;

		// Narrow the type for `checked`
		const checked =
			type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (products?.data?.products?.length === 0) {
			toast.error("Please, add the product first!");

			router.push("/buy");
		}
		// Handle form submission
		const customer = {
			name: formData.firstName + " " + formData.surname,
			email: formData.email,
			address: {
				address: formData.address,
				zip_code: formData.zipCode,
				city: formData.city,
				country: formData.country,
			},
			phone: formData.phone,
		};

		localStorage?.setItem(
			"secondary_phone",
			JSON.stringify(formData.furtherContactInformation)
		);

		if (customerEmailOnlocalStorage !== formData.email) {
			const response = await createCustomer(customer).unwrap();

			if (response?.success) {
				toast.success(response?.message);
			} else if (response?.error) {
				toast.error(response?.error);
				return;
			}

			localStorage?.setItem("customer", JSON.stringify(response?.data));

			router.push("/paymentprocess");
		}

		router.push("/paymentprocess");
	};

	const removeItem = (id: string) => {
		refetch();
		setOrderIndex(0);
		const cart = JSON.parse(localStorage?.getItem("cart") || "[]");

		const updatedCart = cart.filter(
			(item: { productId: string }) => item.productId !== id
		);

		console.log("checkout", cart);

		localStorage?.setItem("cart", JSON.stringify(updatedCart));

		if (products?.data?.products?.length === 0) {
			toast.error("Please, add the product first!");

			router.push("/buy");
		}
	};

	useEffect(() => {
		if (products?.data?.products?.length === 0) {
			toast.error("Please, add the product first!");

			router.push("/buy");
		}
	}, [products]);

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

	return (
		<div className="min-h-screen bg-[#F2F5F7] py-10">
			<Container>
				<h1 className="text-3xl md:text-[40px] font-semibold text-center mb-8">
					{t("checkout")}
				</h1>
				<div className="w-full flex justify-between gap-5 mb-5">
					<h3 className="flex-1 text-lg text-[#a8a8a8] font-medium mb-4 pb-2 border-t-2 border-t-[#a8a8a8]">
						{t("accessories")}
					</h3>
					<h3 className="flex-1 text-lg text-[#a8a8a8] font-medium mb-4 pb-2 border-t-2 border-t-[#a8a8a8]">
						{"cart"}
					</h3>
					<h3 className="flex-1 text-lg text-[#101010] font-medium mb-4 pb-2 border-t-2 border-t-[#101010]">
						{t("checkout")}
					</h3>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Form */}
					<div className="lg:col-span-2 flex-grow">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="mb-6">
								<div className="flex items-center justify-center py-8 space-x-3">
									<hr className="flex-1 border-b border-[#D6D6D6]" />
									<h2 className="text-[#101010] text-lg text-center whitespace-nowrap">
										{t("payFaster")}
									</h2>
									<hr className="flex-1 border-b border-[#D6D6D6]" />
								</div>
								<div className="flex flex-col md:flex-row gap-4 mb-4">
									<button className="flex-1 bg-[#ffc439] text-[#101010] py-2.5 px-4 rounded font-medium hover:bg-[#f4b800] transition-colors">
										<span className="text-xl text-[#003087] font-bold">
											Pay
										</span>
										<span className="text-xl text-[#009CDE] font-bold">
											Pal
										</span>{" "}
										Checkout
									</button>
									<button className="flex-1 bg-black text-white py-2.5 px-4 rounded font-medium hover:bg-gray-800 transition-colors">
										Page.com{" "}
										<span
											className="bg-[#F4B6C7] text-[#17120F] rounded-md border border-white 
                    px-2 py-1.5"
										>
											Klarna
										</span>
									</button>
								</div>
								<p className="text-sm lg:text-lg text-gray-600">
									{t("checkout1")}{" "}
									<Link
										href="#"
										className="underline text-blue-400 font-medium"
									>
										{t("checkout2")}
									</Link>
									,{" "}
									<Link
										href="#"
										className="underline text-blue-400 font-medium"
									>
										{t("checkout3")}
									</Link>{" "}
									and our{" "}
									<Link
										href="#"
										className="underline text-blue-400 font-medium"
									>
										{t("checkout4")}
									</Link>
									.
								</p>

								<div className="flex items-center justify-center py-4 space-x-3">
									<hr className="flex-1 border-b border-[#D6D6D6]" />
									<h2 className="text-[#101010] text-lg text-center whitespace-nowrap">
										{t("proceedWithoutRegistration")}
									</h2>
									<hr className="flex-1 border-b border-[#D6D6D6]" />
								</div>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="space-y-6">
									<div>
										<h2 className="text-[32px] text-[#101010] font-semibold mb-4">
											1. {t("deliveryDetails")}
										</h2>

										<div className="mb-5">
											<p className="mb-4 text-2xl text-[#404040] font-semibold">
												{t("yourName")}
											</p>
											<div className="flex gap-5 mb-5">
												<label className="flex items-center">
													<input
														type="radio"
														name="title"
														value="Mr"
														checked={formData.title === "Mr"}
														onChange={handleInputChange}
														className="mr-2 scale-150 accent-black text-lg text-[#101010] font-medium"
													/>
													{t("mr")}
												</label>
												<label className="flex items-center">
													<input
														type="radio"
														name="title"
														value="Mrs"
														checked={formData.title === "Mrs"}
														onChange={handleInputChange}
														className="mr-2 scale-150 accent-black text-lg text-[#101010] font-medium"
													/>
													{t("mrs")}
												</label>
												<label className="flex items-center">
													<input
														type="radio"
														name="title"
														value="Agency"
														checked={formData.title === "Agency"}
														onChange={handleInputChange}
														className="mr-2 scale-150 accent-black text-lg text-[#101010] font-medium"
													/>
													{t("agency")}
												</label>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block mb-1 text-lg font-medium leading-7">
														{t("firstName")}
														<span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														name="firstName"
														value={formData.firstName}
														onChange={handleInputChange}
														required
														className="w-full px-3 py-2 border rounded-md"
														placeholder="Jhon"
													/>
												</div>
												<div>
													<label className="block mb-1 text-lg font-medium leading-7">
														{t("surname")}
														<span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														name="surname"
														value={formData.surname}
														onChange={handleInputChange}
														required
														className="w-full px-3 py-2 border rounded-md"
														placeholder="Doe"
													/>
												</div>
											</div>
										</div>

										<div className="mb-4">
											<h3 className="text-2xl font-semibold text-[#404040] my-3">
												{t("shippingInformation")}{" "}
												<span className="text-[#5F5F5F] text-base font-normal">
													({"noParcelDeliveryStation"})
												</span>
											</h3>
											<div className="space-y-4">
												<div>
													<label className="block text-lg text-[#101010] font-medium mb-1.5">
														{t("address")}
														<span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														name="address"
														value={formData.address}
														onChange={handleInputChange}
														required
														className="w-full px-3 py-2 border rounded-md"
													/>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<label className="block text-lg text-[#101010] font-medium mb-1.5">
															{t("zipCode")}
															<span className="text-red-500">*</span>
														</label>
														<input
															type="text"
															name="zipCode"
															value={formData.zipCode}
															onChange={handleInputChange}
															required
															className="w-full px-3 py-2 border rounded-md"
														/>
													</div>
													<div>
														<label className="block text-lg text-[#101010] font-medium mb-1.5">
															{t("city")}
															<span className="text-red-500">*</span>
														</label>
														<input
															type="text"
															name="city"
															value={formData.city}
															onChange={handleInputChange}
															required
															className="w-full px-3 py-2 border rounded-md"
														/>
													</div>
												</div>
											</div>
										</div>

										<div className="mb-6">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-lg text-[#101010] font-medium mb-1.5">
														{t("nation")}
														<span className="text-red-500">*</span>
													</label>
													<select
														name="country"
														value={formData.country}
														onChange={(e) => handleInputChange(e as any)}
														required
														className="w-full px-3 py-2 border rounded-md"
													>
														<option value="">Select country</option>
														<option value="Italy">Italy</option>
														<option value="Germany">Germany</option>
														<option value="France">France</option>
													</select>
												</div>
												<div>
													<label className="block text-lg text-[#101010] font-medium mb-1.5">
														{t("furtherContactInformation")}

														<span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														className="w-full px-3 py-2 border rounded-md"
														placeholder="+39456647012345"
														name="furtherContactInformation"
														required
														value={formData.furtherContactInformation}
														onChange={handleInputChange}
													/>
												</div>
											</div>
										</div>

										<div className="mb-4">
											<h3 className="block text-2xl font-semibold text-[#101010] mb-1">
												{t("contactInformation")}
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-lg text-[#101010] font-medium mb-1.5">
														{t("email")}
													</label>
													<input
														type="email"
														name="email"
														value={formData.email}
														onChange={handleInputChange}
														className="w-full px-3 py-2 border rounded-md"
														placeholder="yourname@example.com"
													/>
												</div>
												<div>
													<label className="block text-lg text-[#101010] font-medium mb-1.5">
														{t("phone")}
													</label>

													<div className="flex w-full">
														<select
															name="phoneCode"
															value={formData.phoneCode}
															onChange={(e) => handleInputChange(e as any)}
															className="px-3 py-2 border rounded-l-md bg-white text-sm sm:text-base"
														>
															<option value="+32">+39</option>
															<option value="+33">+49</option>
															<option value="+34">+37</option>
														</select>
														<input
															type="tel"
															name="phone"
															value={formData.phone}
															onChange={handleInputChange}
															className="flex-1 px-3 py-2 border-y border-r rounded-r-md text-sm sm:text-base"
															placeholder="470123456"
														/>
													</div>
												</div>
											</div>
										</div>

										<div className="mb-4">
											<label className="flex items-center text-sm md:text-lg">
												<input
													type="checkbox"
													name="sameAddress"
													checked={formData.sameAddress}
													onChange={handleInputChange}
													className="mr-2 w-4 h-4"
												/>
												{t("billingAddress")}
											</label>
										</div>

										<p className="text-lg text-[#2B2B2B] mb-4">
											<span className="text-red-500 text-lg"> * </span>{" "}
											{t("fieldsMarked")}
										</p>
										{/* <Link href={"/paymentprocess"}> */}
										<button
											type="submit"
											className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
										>
											{t("continue")}
										</button>
										{/* </Link> */}
									</div>

									<div className="border p-5 rounded">
										<h2 className="text-xl font-semibold">2. {t("pay")}</h2>
									</div>
								</div>
							</form>
						</div>
					</div>

					{/* Right Column - Order Summary */}
					<div className="col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6">
							{/* Your Order */}
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

							{/* ordered product carousel */}
							<div className="border-b pb-4 mb-4">
								{products?.data?.products?.length > 0 && (
									<div className="flex gap-4">
										<div className="relative w-[120px] h-[120px]">
											<Image
												src={`${API_URL}/${products?.data?.products[orderIndex].images[0]}`}
												alt={orderItem.name}
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
											<p className="text-sm text-green-600">
												{t("delivery")}: {orderItem.delivery}
											</p>
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

							<div className="space-y-2 mb-6">
								<div className="flex justify-between">
									<span className="text-gray-600 font-semibold">Total</span>
									<span>${subtotal}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">{t("shipping")}</span>
									<span>{t("included")}</span>
								</div>
								<div className="flex justify-between font-medium pt-2 border-t">
									<span>{t("grandTotal")}</span>
									<span>${subtotal}</span>
								</div>
								<p className="text-sm text-gray-600">
									{t("thePriceIncludesVAT")}
								</p>
							</div>
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
							<div className="flex justify-center space-x-4 my-5">
								<div className="w-[70px] h-[48px] bg-[#F4B6C7] rounded flex items-center justify-center">
									<span className="text-[#17120F] font-medium">Klarna</span>
								</div>
								<div className="w-[70px] h-12 bg-blue-100 rounded flex items-center justify-center">
									<Image
										src={"/payments/paypal.svg"}
										className="w-[70px] h-[48px] object-fill"
										width={70}
										height={48}
										alt="paypal"
									/>
								</div>
							</div>
							<p className="text-sm text-gray-600 mt-4">
								{t("applicableTaxLaw")}
							</p>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
