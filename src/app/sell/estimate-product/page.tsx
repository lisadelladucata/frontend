"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { useTranslation } from "react-i18next";
import { useGetEstimateProductPriceMutation } from "@/redux/features/products/ProductAPI";
import { useGetASingleProductQuery } from "@/redux/features/sell/SellProductAPI";

export default function PlayStationOffer() {
	const [isOpen, setIsOpen] = useState(false);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const { t } = useTranslation();

	const [priceEstimate, setPriceEstimate] = useState(null);
	const [productId, setProductId] = useState<string | null>(null);
	const [userSelectedOptions, setUserSelectedOptions] = useState<
		{
			questionAnswer: {
				questionName: string;
				questionTitle: string;
				questionAnswer: string;
			};
		}[]
	>([]);

	const [getEstimateProductPrice] = useGetEstimateProductPriceMutation();

	const { data: product } = useGetASingleProductQuery(productId as string);

	useEffect(() => {
		const data = JSON.parse(
			localStorage?.getItem("userSelectedOptions") || "null"
		);
		setUserSelectedOptions(data);
	}, [window.location.reload]);

	// get product id from locaStorage
	useEffect(() => {
		const productId = localStorage?.getItem("getEstimateProductId");
		setProductId(JSON.parse(productId as string));
	}, [window.location.reload]);

	// get product price from locaStorage
	useEffect(() => {
		const productPrice = localStorage?.getItem("getEstimatePrice");
		setPriceEstimate(JSON.parse(productPrice as string));
	}, [window.location.reload]);

	// fetch price estimate
	useEffect(() => {
		const fetchPriceEstimate = async () => {
			try {
				const response = await getEstimateProductPrice({
					id: productId as string,
					body: { questions: userSelectedOptions },
				}).unwrap();

				localStorage?.setItem(
					"getEstimatePrice",
					JSON.stringify(response?.data?.price)
				);

				setPriceEstimate(response?.data?.price);
			} catch (error) {
				console.error("Error fetching price estimate:", error);
			}
		};

		if (productId) {
			fetchPriceEstimate();
		}
	}, [
		productId,
		getEstimateProductPrice,
		userSelectedOptions,
		window.location.reload,
	]);

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<>
			<div className="hidden md:block bg-[#F2F5F7] p-6 md:p-12">
				<Container>
					<h1 className="text-3xl font-bold mb-6">{t("ourCurrentOffer")}</h1>

					<div className="grid items-center lg:grid-cols-4 gap-8 py-10">
						<div className="lg:col-span-2">
							<div className="h-max flex flex-col lg:flex-row lg:items-center gap-5 bg-[#F7F7F7] border p-6 rounded-lg mb-12">
								<div>
									<div className="flex items-center gap-2">
										<Image
											src="/products/money-dollar.png"
											width={24}
											height={24}
											alt="money"
										/>
										<p className="text-2xl text-[#404040]">
											{t("directPayout")}
										</p>
									</div>
									<h2 className="text-[40px] text-[#404040] font-semibold">
										${(priceEstimate && priceEstimate) || "00"}
									</h2>
									<p className="text-lg text-[#404040] max-w-[350px]">
										{t("transferVaiPayPal")}
									</p>
								</div>

								<div className="lg:hidden w-full border-t border-gray-500"></div>
								<div className="hidden lg:block w-[2px] h-36 bg-gray-500 mx-4"></div>

								<div>
									<div className="flex items-center gap-2">
										<Image
											src="/products/gift.png"
											width={24}
											height={24}
											alt="money"
										/>
										<p className="text-2xl text-[#404040]">{t("basePrice")}</p>
									</div>
									<h2 className="text-[40px] text-[#404040] font-semibold">
										${priceEstimate ? (priceEstimate * 1.1).toFixed(2) : "00"}
									</h2>
									<p className="text-lg font-medium bg-[#DBDDFA] w-max text-[#404040] max-w-[350px] rounded-sm p-1">
										10% extra
									</p>
								</div>
							</div>

							<Link href={"/sell/personal-information"}>
								<button className="w-full bg-black text-white py-3 rounded-md mb-5">
									{t("continue")}
								</button>
							</Link>

							<div className="flex items-start gap-2 text-[#404040] text-2xl font-medium">
								<Image
									src={"/sell/goon.svg"}
									width={20}
									height={20}
									className="pt-1"
									alt="goon"
								/>
								<p>
									{t("whenYouCompleteYourTransaction1")}{" "}
									<span className="text-[#101010]">
										{t("whenYouCompleteYourTransaction2")}
									</span>
								</p>
							</div>
						</div>

						{/* Product Details */}
						<div className="lg:col-span-2 flex flex-col items-center justify-center">
							<div className="flex flex-col items-center justify-center">
								<div className="aspect-square relative mb-2">
									<Image
										src={`${API_URL}/${product?.data?.image}`}
										alt="PlayStation 4 Console"
										width={320}
										height={300}
										className="object-contain"
										priority
									/>
								</div>

								<h2 className="text-2xl font-bold mb-2">
									{product?.data?.name}
								</h2>

								<div className="grid grid-cols-2 gap-6">
									{userSelectedOptions?.map((option: any, index: number) => (
										<div key={index} className="flex gap-2">
											<p className="text-[#2B2B2B] text-lg capitalize">
												{option?.questionAnswer?.questionTitle}:
											</p>
											<p className="text-[#2B2B2B] text-lg">
												{option?.questionAnswer?.questionAnswer}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</Container>
			</div>

			{/* only for mobile */}
			<div className="md:hidden">
				<div className="z-20 min-h-screen relative bg-[url('/sell/back_sell.png')] bg-cover bg-center overflow-hidden">
					{/* product with togglable detail */}
					<div className="p-5">
						<div className="bg-[#FDFDFD] p-4 rounded-lg">
							<div className="w-full">
								<Image
									src={`${API_URL}${
										product?.data?.image ? product?.data?.image : ""
									}`}
									className="w-full"
									width={700}
									height={700}
									alt="product-detail"
								/>
							</div>

							<div
								onClick={handleToggle}
								className="flex items-center justify-end gap-3 z-10 relative border-b border-b-[#DAEDF2] py-3 mb-3"
							>
								<h2 className="text-sm text-[#101010]">
									{isOpen ? "Reduce" : "View the summary in detail"}
								</h2>

								{isOpen ? (
									<svg
										width="20"
										height="21"
										viewBox="0 0 20 21"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3.75 13.5195L10 7.26953L16.25 13.5195"
											stroke="#737163"
											strokeWidth="1.66667"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								) : (
									<svg
										width="20"
										height="21"
										viewBox="0 0 20 21"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M16.25 7.26953L10 13.5195L3.75 7.26953"
											stroke="#737163"
											strokeWidth="1.66667"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</div>

							{/* togglable description */}

							{isOpen && (
								<div className="">
									<div className="grid grid-cols-3 gap-6 mb-6 p-2.5">
										{userSelectedOptions?.map((option, index) => (
											<div
												key={index}
												className="flex-1 max-w-max flex flex-col items-center justify-center gap-3"
											>
												<h2 className="text-sm font-bold text-[#101010] text-center capitalize">
													{/* {
                            userSelectedOptions[index]?.questionAnswer
                              ?.questionName
                          } */}

													{option?.questionAnswer?.questionTitle}
												</h2>

												<div className="min-w-[98px] h-[106px] bg-[#64B95E] text-[#FDFDFD] leading-[30px] text-xl font-semibold rounded-md text-center flex items-center justify-center p-2">
													{/* {
                            userSelectedOptions[index]?.questionAnswer
                              ?.questionTitle
                          } */}

													{option?.questionAnswer?.questionAnswer}
												</div>
											</div>
										))}
									</div>

									{/* Note */}

									<div>
										<h2 className="text-lg font-semibold text-[#101010] text-center mb-3">
											Note
										</h2>

										<div className="h-[104px] text-[10px] leading-4 text-center border border-[#5F5F5F] rounded-lg p-3">
											<p>La playstation ha a accumulato un po’ di polvere</p>

											<div className="h-[1px] border-b border-dashed border-[#919191] mt-4 mb-8"></div>
											<div className="h-[1px] border-b border-dashed border-[#919191]"></div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Direct Payment */}

					<div className="relative p-5">
						<div className="bg-[#FDFDFD] h-[209px] rounded-lg flex items-center">
							<div className="w-[40%]"></div>
							<div className="w-[60%]">
								<h2 className="text-lg font-semibold leading-[27px] text-[#101010] pb-2 border-b border-b-[#D6D6D6]">
									Direct Payment
								</h2>
								<h3 className="text-[41px] text-[#FF9934] font-bold pb-1 border-b border-b-[#D6D6D6]">
									${priceEstimate}
								</h3>
								<p className="text-base text-[#404040] leading-6">
									Trasferimento Paypal o sul tuo conto bancario
								</p>
							</div>
						</div>

						<div className="py-5 max-w-[250px] ml-auto text-right">
							<p className="text-xs text-[#FDFDFD] PL-2">
								Quando completi la tua transazione, il tou prezzo sara riservato
								per 14 giorni
							</p>
						</div>

						<div className="absolute -bottom-2.5 -left-9 rounded-lg p-2">
							<Image
								src={"/products/owy-man.png"}
								className="max-w-[187px] max-h-[291px]"
								width={500}
								height={500}
								alt="man"
							/>
						</div>
					</div>

					{/* Continue Button */}
					<div className="bg-[#FDFDFD] p-6">
						<Link href={"/sell/personal-information"}>
							<button className="w-full h-14 bg-[#FF9934] rounded-lg text-[#FDFDFD] text-base font-semibold">
								CONTINUA
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
