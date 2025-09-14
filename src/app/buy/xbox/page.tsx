/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Container from "@/components/common/Container";
import { useTranslation } from "react-i18next";
import { useGetAllProductsQuery } from "@/redux/features/products/ProductAPI";
import Loading from "@/app/loading";
import ProductCard from "@/components/product/ProductCard";

const ProductPage: React.FC = () => {
	const [view, setView] = useState<"grid" | "list">("grid");
	const [filterView, setFilterView] = useState(false);
	const { t } = useTranslation();

	const [searchProduct, setSearchProduct] = useState<string>("xbox");
	const [brandSearch, setBrandSearch] = useState<string>("");
	const [priceRange, setPriceRange] = useState<
		[number | string, number | string]
	>(["", ""]);
	const [condition, setCondition] = useState<string>("");

	const [currentPage, setCurrentPage] = useState(1);

	const [sortBy, setSortBy] = useState<string>("");

	const isFirstRender = useRef(true);
	const isMaxPriceSet = useRef(true);

	const { data: products, isLoading } = useGetAllProductsQuery({
		product_type: searchProduct,
		brand: brandSearch,
		price: priceRange.length ? priceRange : undefined,
		condition: condition,
		sortBy: sortBy,
		limit: 9,
		page: currentPage,
	} as any);

	const totalPages = Number(products?.data?.meta?.pagination?.total_pages);

	useEffect(() => {
		if (isFirstRender.current && products?.data?.products?.length > 0) {
			isFirstRender.current = false;
		}
	}, [products]);

	const getPrice =
		products?.data?.products
			?.map((product: any) => Number(product?.offer_price))
			?.filter((price: number) => !isNaN(price) && price > 0) || [];

	const maxPrice = getPrice.length > 0 ? Math.max(...getPrice) : 0;

	useEffect(() => {
		if (isMaxPriceSet.current && maxPrice > 0) {
			isMaxPriceSet.current = false;
		}
	}, [maxPrice]);

	if (isLoading) {
		return (
			<div>
				<Loading />
			</div>
		);
	}

	const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;

		let min = null;
		let max = null;

		switch (value) {
			case "below100":
				min = 0;
				max = 100;
				break;
			case "100to300":
				min = 100;
				max = 300;
				break;
			case "300to500":
				min = 300;
				max = 500;
				break;
			case "up500":
				min = 500;
				break;
			default:
				min = null;
				max = null;
		}

		setPriceRange([min ?? 0, max ?? 9000000]);
	};

	return (
		<div className="relative bg-[#F2F5F7] flex flex-col lg:flex-row py-8">
			<Container>
				{/* Sidebar */}
				<div className="flex">
					<div className={`w-0 h-screen lg:w-1/4 bg-white rounded-md lg:mb-5`}>
						<h3 className="hidden lg:flex text-[32px] text-[#101010] px-5 pt-4 pb-3 border-b font-semibold mb-4">
							{t("filter")}
						</h3>

						{/* filter for mobile */}
						{filterView && (
							<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-lg p-5">
								<div className="mb-4">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-semibold mb-2">Prodotti</h4>
										<p>
											<X onClick={() => setFilterView(false)} />
										</p>
									</div>

									<select
										onChange={(e) => setSearchProduct(e.target.value)}
										className="w-[80%] text-[#6B6B6B] appearance-none border-none outline-none px-1.5"
									>
										{/* "All" option to reset search */}
										<option value="">Tutti</option>

										{/* Dynamically rendered options */}
										{products?.data?.meta?.product_meta?.product_types?.map(
											(product: string, ind: number) => (
												<option key={ind} value={product as string}>
													{product as string}
												</option>
											)
										)}
									</select>
								</div>
								<div className="mb-4">
									<h4 className="text-[#101010] text-xl font-semibold mb-2">
										Marca
									</h4>

									<select
										onChange={(e) => setBrandSearch(e.target.value)}
										className="w-[80%] text-[#6B6B6B] appearance-none border-none outline-none p-1.5"
									>
										<option value="">Tutti</option>
										{products?.data?.meta?.product_meta?.brands?.map(
											(brand: string, ind: number) => (
												<option key={ind} value={brand as string}>
													{brand as string}
												</option>
											)
										)}
									</select>
								</div>
								<div className="mb-4">
									<h4 className="text-[#101010] text-xl font-semibold mb-2">
										Fascia di prezzo
									</h4>
									<select
										onChange={handlePriceChange}
										className="w-[80%] text-[#6B6B6B] appearance-none border-none outline-none p-1.5"
									>
										<option value="">Tutti</option>

										<option value="below100">Sotto €100</option>
										<option value="100to300">100€ - 300€</option>
										<option value="300to500">300€ - 500€</option>
										<option value="up500">500€+</option>
									</select>
								</div>
								<div className="mb-4">
									<h4 className="text-[#101010] text-xl font-semibold mb-2">
										Condizione
									</h4>
									<select
										onChange={(e) => setCondition(e.target.value)}
										className="w-[80%] text-[#6B6B6B] appearance-none border-none outline-none p-1.5"
									>
										<option value="">Tutti</option>
										{products?.data?.meta?.product_meta?.conditions?.map(
											(condition: string, ind: number) => (
												<option key={ind}>{condition as string}</option>
											)
										)}
									</select>
								</div>
								<button
									onClick={() => setFilterView(!filterView)}
									className="bg-black text-white text-lg w-full rounded-xl py-3"
								>
									Filter
								</button>
							</div>
						)}

						{/* filter for desktop */}
						<div className="hidden lg:block pb-3 mx-4 pt-2">
							<div className="relative mb-5 border-b-[.75px] border-[#969696]">
								<h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
									Prodotti
								</h4>

								<select
									onChange={(e) => setSearchProduct(e.target.value)}
									className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4"
								>
									{/* "All" option to reset search */}
									<option value="">Tutti</option>

									{/* Dynamically rendered options */}
									{products?.data?.meta?.product_meta?.product_types?.map(
										(productType: string, ind: number) => (
											<option key={ind} value={productType as string}>
												{productType as string}
											</option>
										)
									)}
								</select>

								<div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
									{/* <!-- Large Chevron Icon --> */}
									<svg
										className="w-6 h-6 text-[#101010]"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>

							<div className="relative mb-5 border-b-[.75px] border-[#969696]">
								<h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
									Marca
								</h4>
								<select
									onChange={(e) => setBrandSearch(e.target.value)}
									className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4"
								>
									<option value="">Tutti</option>
									{products?.data?.meta?.product_meta?.brands?.map(
										(brand: string, ind: number) => (
											<option key={ind} value={brand as string}>
												{brand as string}
											</option>
										)
									)}
								</select>
								<div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
									{/* <!-- Large Chevron Icon --> */}
									<svg
										className="w-6 h-6 text-[#101010]"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>

							<div className="relative mb-5 border-b-[.75px] border-[#969696]">
								<h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
									Fascia di prezzo
								</h4>
								<select
									onChange={handlePriceChange}
									className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4"
								>
									<option value="">Tutti</option>

									<option value="below100">Sotto €100</option>
									<option value="100to300">100€ - 300€</option>
									<option value="300to500">300€ - 500€</option>
									<option value="up500">500€+</option>
								</select>

								<div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
									{/* <!-- Large Chevron Icon --> */}
									<svg
										className="w-6 h-6 text-[#101010]"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>

							<div className="relative mb-5 border-b-[.75px] border-[#969696]">
								<h4 className="text-[#101010] text-xl font-semibold mb-2 px-4">
									Condizione
								</h4>
								<select
									onChange={(e) => setCondition(e.target.value)}
									className="w-full text-[#6B6B6B] appearance-none border-none outline-none p-4"
								>
									<option value="">Tutti</option>
									{products?.data?.meta?.product_meta?.conditions?.map(
										(condition: string, ind: number) => (
											<option key={ind}>{condition as string}</option>
										)
									)}
								</select>

								<div className="absolute bottom-4 right-0 flex items-center pr-3 pointer-events-none">
									{/* <!-- Large Chevron Icon --> */}
									<svg
										className="w-6 h-6 text-[#101010]"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* Product Grid */}
					<div className="w-full lg:w-3/4 lg:ml-6">
						{/* View Toggle */}
						<div className="lg:bg-[#FDFDFD] flex justify-between items-center p-2.5 rounded-md mb-4">
							{/* filter icon for mobile */}
							<div
								onClick={() => setFilterView(!filterView)}
								className={`flex h-10 lg:hidden items-center gap-2 border ${
									filterView && "bg-gray-200"
								} rounded-lg w-max p-2`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-filter"
								>
									<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
								</svg>
								<h3 className="text-sm font-medium">Filtro</h3>
							</div>

							{/* view - grid / list */}
							<div className="hidden lg:flex gap-2 items-center cursor-pointer">
								<div
									onClick={() => setView("grid")}
									className={`hover:bg-[#DAEDF2] p-3 rounded-lg ${
										view === "grid" ? "bg-[#DAEDF2]" : ""
									}`}
								>
									{/* <LayoutGrid /> */}
									<Image
										src="/sell/grid.svg"
										width={20}
										height={20}
										alt="grid"
									/>
								</div>
								<div
									onClick={() => setView("list")}
									className={`hover:bg-[#DAEDF2] p-3 rounded-lg ${
										view === "list" ? "bg-[#DAEDF2]" : ""
									}`}
								>
									{/* <LayoutList /> */}
									<Image
										src="/sell/list.svg"
										width={20}
										height={20}
										alt="grid"
									/>
								</div>
							</div>

							{/* sorting */}
							<div className="h-10 relative flex gap-3">
								<select
									onChange={(e) => setSortBy(e.target.value)}
									className="appearance-none w-44 md:w-56 px-2.5 py-2 border border-[#101010] rounded-md font-medium text-sm bg-transparent lg:bg-[#FDFDFD] text-[#101010] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
								>
									<option
										defaultValue={"Sort By"}
										value={""}
										className="text-[#101010]"
										// disabled
									>
										Sort by
										<span className="text-xs"> (Default)</span>
									</option>
									<option value="max_price">High to Low</option>
									<option value="min_price">Low to High</option>
								</select>

								<div className="absolute inset-y-0 -right-2 flex items-center pr-3 pointer-events-none">
									{/* <!-- Large Chevron Icon --> */}
									<svg
										className="w-6 h-6 text-[#101010]"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>

						{products?.data?.products?.length < 1 ? (
							<div className="flex items-center justify-center h-[calc(100vh-200px)] text-2xl font-medium">
								No, Xbox found!
							</div>
						) : null}

						{/* Products */}
						{view === "grid" ? (
							<div
								className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}
							>
								{products?.data?.products?.map((product: any) => (
									<ProductCard product={product} key={product._id} />
								))}
							</div>
						) : null}

						{view === "list" ? (
							<div className={`grid grid-cols-1 lg:grid-cols-2 gap-12`}>
								{products?.data?.products?.map((product: any) => (
									<ProductCard
										product={product}
										key={product._id}
										type="list"
									/>
								))}
							</div>
						) : null}

						{/* Pagination */}
						{
							<div className="flex justify-center items-center gap-3 my-12">
								<button
									onClick={() => {
										setCurrentPage((prev) => Math.max(prev - 1, 1));
									}}
									className="w-10 h-10 flex items-center justify-center bg-transparent mr-2"
								>
									<ChevronLeft />
								</button>

								{Array.from(
									{ length: totalPages },
									(_, index) => index + 1
								).map((pageNumber) => (
									<button
										key={pageNumber}
										onClick={() => setCurrentPage(pageNumber)}
										className={`w-10 h-10 flex items-center justify-center rounded-md ${
											currentPage === pageNumber
												? "bg-black text-white"
												: "bg-transparent border-2 border-[#101010]"
										}`}
									>
										{pageNumber}
									</button>
								))}

								<button
									onClick={() =>
										setCurrentPage((prev) => Math.min(prev + 1, totalPages))
									}
									className="w-10 h-10 flex items-center justify-center bg-transparent ml-2"
								>
									<ChevronRight />
								</button>
							</div>
						}
					</div>
				</div>
			</Container>
		</div>
	);
};

export default ProductPage;
