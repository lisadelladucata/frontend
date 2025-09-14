"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Container from "@/components/common/Container";
import { Tabs } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useGetAllProductsForHomeQuery } from "@/redux/features/products/ProductAPI";
import ProductCard from "@/components/product/ProductCard";

export default function ConsoleSelector() {
	const [activeTab, setActiveTab] = useState("xbox");
	const pathname = usePathname();

	const { data: products } = useGetAllProductsForHomeQuery({
		product_type: activeTab,
		limit: 4,
	} as any);

	return (
		<div className="min-h-screen bg-[#F2F5F7]">
			<div className="flex items-center justify-center pt-14 space-x-7 lg:space-x-9">
				<hr className="flex-1 border-b-2 border-gray-300" />
				<h2
					className={`${
						pathname === "/"
							? ""
							: "bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md"
					} text-[#101010] text-2xl md:text-5xl font-semibold text-center whitespace-nowrap`}
				>
					Scegli la tua console
				</h2>
				<hr className="flex-1 border-b-2 border-gray-300" />
			</div>

			<div className="py-5">
				<Tabs
					activeKey={activeTab}
					onChange={setActiveTab}
					className="custom-tabs"
					items={[
						{
							key: "xbox",
							label: (
								<div className="group flex items-center justify-center">
									<div
										className={`w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center transition-all group-hover:bg-tab1-radial ${
											activeTab === "xbox"
												? "bg-tab1-radial"
												: // ? "bg-gradient-to-r from-[#1B9E31] to-[#0E7A22]"
												  "bg-gradient-to-r from-[#ABABAB] to-[#CCCCCC]"
										} bg-gradient-to-r from-gray-300 to-gray-400`}
									>
										<Image
											src="/tab/xbox.svg"
											alt="Xbox"
											width={55}
											height={55}
											className="text-white"
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
									<Container className="w-[98%] mx-auto">
										<div className="flex items-center py-3 space-x-4 lg:space-x-7">
											<h2 className="text-2xl lg:text-5xl font-bold text-[#FDFDFD] pt-4 mb-8">
												Xbox
											</h2>
											<hr className="flex-1 border-b-4 border-gray-100 -mt-4" />
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-8">
											{products?.data?.products?.length < 1 && (
												<p className="text-lg text-white">No Xbox found!</p>
											)}
											{products?.data?.products?.map((product: any) => (
												<ProductCard
													product={product}
													key={product._id}
													layout="new"
												/>
											))}
										</div>
									</Container>
								</div>
							),
						},
						{
							key: "playstation",
							label: (
								<div className="group flex items-center justify-center">
									<div
										className={`w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center transition-all group-hover:bg-tab2-radial ${
											activeTab === "playstation"
												? "bg-tab2-radial"
												: "bg-gradient-to-r from-[#ABABAB] to-[#CCCCCC]"
										} hover:bg-gradient-to-r hover:from-[#023993] hover:to-[#0050D4]`}
									>
										<Image
											src="/tab/playstation.svg"
											alt="PlayStation"
											width={60}
											height={60}
											className="text-white"
										/>
									</div>
								</div>
							),
							children: (
								<div className="p-3 pb-12 md:pb-20 bg-[#1761bf]">
									<Container className="w-[98%] mx-auto">
										<div className="flex items-center py-3 space-x-4 lg:space-x-7">
											<h2 className="text-2xl lg:text-5xl font-bold text-[#FDFDFD] pt-4 mb-8">
												Playstation
											</h2>
											<hr className="flex-1 border-b-4 border-gray-100 -mt-4" />
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-8">
											{products?.data?.products?.length < 1 && (
												<p className="text-lg text-white">
													No Playstation found!
												</p>
											)}
											{products?.data?.products?.map((product: any) => (
												<ProductCard
													product={product}
													key={product._id}
													layout="new"
												/>
											))}
										</div>
									</Container>
								</div>
							),
						},
						{
							key: "nintendo",
							label: (
								<div className="group flex items-center justify-center w-max mx-auto">
									<div
										className={`w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center transition-all group-hover:bg-tab3-radial ${
											activeTab === "nintendo"
												? "bg-tab3-radial"
												: "bg-gradient-to-r from-[#ABABAB] to-[#CCCCCC]"
										}`}
									>
										<Image
											src="/tab/nintendo2.svg"
											alt="Nintendo"
											width={75}
											height={160}
											className="text-white"
										/>
									</div>
								</div>
							),
							children: (
								<div className="p-3 pb-12 md:pb-20 bg-[#f34040]">
									<Container className="w-[98%] mx-auto">
										<div className="flex items-center py-3 space-x-4 lg:space-x-7">
											<h2 className="text-2xl lg:text-5xl font-bold text-[#FDFDFD] pt-4 mb-8">
												Nintendo
											</h2>
											<hr className="flex-1 border-b-4 border-gray-100 -mt-4" />
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-8">
											{products?.data?.products?.length < 1 && (
												<p className="text-lg text-white">No Nintendo found!</p>
											)}
											{products?.data?.products?.map((product: any) => (
												<ProductCard
													product={product}
													key={product._id}
													layout="new"
												/>
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
