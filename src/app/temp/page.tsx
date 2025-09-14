"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as React from "react";
import "keen-slider/keen-slider.min.css";

const models = [
	{ id: 1, title: "ONE" },
	{ id: 2, title: "ONE S" },
	{ id: 3, title: "ONE S - DIGITAL" },
	{ id: 4, title: "ONE X" },
];

const storages = [
	{
		id: 1,
		title: "500 GB",
	},
	{
		id: 2,
		title: "1 TB",
	},
];

const conditions = [
	{
		id: 1,
		title: "NOT BAD",
	},
	{
		id: 2,
		title: "GOOD",
	},
	{
		id: 3,
		title: "BRAND NEW",
	},
];

const functionals = [
	{ id: 1, title: "SI" },
	{ id: 2, title: "NO" },
];

const controllers = [
	{ id: 1, title: "+0" },
	{ id: 2, title: "+1" },
	{ id: 3, title: "+2" },
];

const accessories = [
	{ id: 1, title: "SL" },
	{ id: 2, title: "NO" },
];

const MobileProductDetails = () => {
	const { t } = useTranslation();
	const [storage, setStorage] = useState("");
	const [modal, setModal] = useState("");
	const [condition, setCondition] = useState("");
	const [functional, setFunctional] = useState("");
	const [controller, setController] = useState("");
	const [accessory, setAccessory] = useState("");

	return (
		<div className="bg-[#EAE9EF]">
			{/* product details */}
			<div className="">
				<div className="w-full">
					<Image
						src={"/sell/product-detail.png"}
						className="w-full"
						width={700}
						height={800}
						alt="xbox"
					/>
				</div>

				<div className="bg-[#49A947] -mt-1">
					{/* product into */}
					<div className="pt-8 mx-5">
						<div className="pt-10 pb-3 border-b-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<h3 className="text-lg text-[#FDFDFD]">Review</h3>

									<div className="flex items-center">
										<p className="flex items-center gap-1">
											{[1, 2, 3, 4].map((i) => (
												<svg
													key={i}
													width="20"
													height="21"
													viewBox="0 0 20 21"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<g clipPath="url(#clip0_2122_18709)">
														<path
															d="M11.0202 2.50976L12.5488 5.27412C12.7583 5.65357 13.2839 6.01403 13.7162 6.06276L16.2893 6.3862C17.9368 6.58972 18.3617 7.75894 17.2405 8.98361L15.3303 11.0584C15.0114 11.406 14.8458 12.0693 14.974 12.5246L15.6433 14.9672C16.1697 16.8957 15.1686 17.695 13.4093 16.7478L10.9516 15.4243C10.504 15.1823 9.79299 15.2175 9.37248 15.4892L7.03288 17.0035C5.35804 18.086 4.2923 17.3734 4.6598 15.4099L5.1304 12.925C5.21826 12.4605 5.00762 11.8124 4.65993 11.4935L2.57381 9.58021C1.35634 8.45484 1.68383 7.2554 3.30616 6.91534L5.8393 6.38621C6.26681 6.29335 6.76225 5.90146 6.93619 5.50274L8.23399 2.61726C8.94337 1.06262 10.1949 1.01363 11.0202 2.50976Z"
															fill="#FDFDFD"
														/>
													</g>
													<defs>
														<clipPath id="clip0_2122_18709">
															<rect
																width="20"
																height="20"
																fill="white"
																transform="translate(0 0.0507812)"
															/>
														</clipPath>
													</defs>
												</svg>
											))}
											<svg
												width="20"
												height="21"
												viewBox="0 0 20 21"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M11.4421 2.975L12.9087 5.90833C13.1087 6.31667 13.6421 6.70833 14.0921 6.78333L16.7504 7.225C18.4504 7.50833 18.8504 8.74167 17.6254 9.95833L15.5587 12.025C15.2087 12.375 15.0171 13.05 15.1254 13.5333L15.7171 16.0917C16.1837 18.1167 15.1087 18.9 13.3171 17.8417L10.8254 16.3667C10.3754 16.1 9.63375 16.1 9.17541 16.3667L6.68375 17.8417C4.90041 18.9 3.81708 18.1083 4.28375 16.0917L4.87541 13.5333C4.98375 13.05 4.79208 12.375 4.44208 12.025L2.37541 9.95833C1.15875 8.74167 1.55041 7.50833 3.25041 7.225L5.90875 6.78333C6.35041 6.70833 6.88375 6.31667 7.08375 5.90833L8.55041 2.975C9.35041 1.38333 10.6504 1.38333 11.4421 2.975Z"
													stroke="#FDFDFD"
													strokeWidth="1.25"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</p>
									</div>
								</div>

								<div>
									<button className="bg-[#FDFDFD] flex items-center gap-1 h-10 px-5 rounded-lg">
										<span>Add</span>
										<svg
											width="24"
											height="24"
											viewBox="0 0 19 18"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5.5 14.5508C5.77614 14.5508 6 14.3269 6 14.0508C6 13.7746 5.77614 13.5508 5.5 13.5508C5.22386 13.5508 5 13.7746 5 14.0508C5 14.3269 5.22386 14.5508 5.5 14.5508Z"
												stroke="#404040"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M12.5 14.5508C12.7761 14.5508 13 14.3269 13 14.0508C13 13.7746 12.7761 13.5508 12.5 13.5508C12.2239 13.5508 12 13.7746 12 14.0508C12 14.3269 12.2239 14.5508 12.5 14.5508Z"
												stroke="#404040"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M1.5 3.55078H3.5L5 12.0508H13"
												stroke="#404040"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M5 10.0508H12.795C12.8528 10.0508 12.9089 10.0308 12.9536 9.99418C12.9983 9.95755 13.029 9.90654 13.0403 9.84984L13.9403 5.34984C13.9476 5.31356 13.9467 5.27611 13.9377 5.24021C13.9288 5.20431 13.9119 5.17084 13.8885 5.14223C13.865 5.11362 13.8355 5.09057 13.802 5.07476C13.7686 5.05895 13.732 5.05076 13.695 5.05078H4"
												stroke="#404040"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<rect
												x="10"
												y="1.05078"
												width="8"
												height="8"
												rx="4"
												fill="#FDFDFD"
											/>
											<path
												d="M14 9.05078C16.2 9.05078 18 7.25078 18 5.05078C18 2.85078 16.2 1.05078 14 1.05078C11.8 1.05078 10 2.85078 10 5.05078C10 7.25078 11.8 9.05078 14 9.05078Z"
												stroke="#FD9A34"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M12.667 5.05078H15.3337"
												stroke="#FD9A34"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M14 6.38444V3.71777"
												stroke="#FD9A34"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>

						<div className="pt-10 pb-3 border-b-2">
							<div className="flex items-center justify-between">
								<div className="flex flex-col gap-3">
									<h2 className="text-2xl font-semibold text-[#FDFDFD]">
										Xbox One
									</h2>
									<h3 className="text-lg text-[#FDFDFD]">Model X | 1TB</h3>
								</div>

								<h2 className="text-[40px] font-semibold text-[#FDFDFD]">
									$300
								</h2>
							</div>
						</div>
					</div>

					{/* Select the Xbox One model */}
					<div>
						<div className="flex items-center justify-center pt-14 space-x-2.5">
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
							<h2
								className={
									"bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md text-[#101010] text-xl font-semibold text-center whitespace-nowrap"
								}
							>
								{t("consoleHeaderTitle")}
							</h2>
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
						</div>

						{/* Select the Xbox One model */}

						<div className="flex flex-col gap-4 px-5 py-5">
							{models?.map((mod) => (
								<div
									key={mod?.id}
									onClick={() => setModal(mod.title)}
									className={`h-16 rounded-md flex items-center justify-center border-4 border-[#FDFDFD] ${
										mod.title === modal
											? "bg-[#FDFDFD] text-[#64B95E]"
											: "bg-transparent"
									} border border-[#919191] text-center text-2xl font-semibold leading-[36px]`}
								>
									{mod?.title}
								</div>
							))}
						</div>
					</div>

					{/* What is the storage capacity? (Not applicable for Xbox One X) */}
					<div>
						<div className="flex items-center justify-center pt-14 space-x-2.5">
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
							<h2
								className={
									"bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
								}
							>
								{t("storageCapacity")}
							</h2>
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
						</div>

						<div className="p-5 flex items-center gap-4">
							{storages?.map((storg: { id: number; title: string }) => (
								<div
									key={storg.id}
									onClick={() => setStorage(storg.title)}
									className={`${
										storg.title === storage
											? "bg-[#FDFDFD] text-[#64B95E]"
											: "bg-transparent"
									} text-xl text-[#101010] border-4 border-[#FDFDFD] font-semibold w-[98px] h-[106px] text-center flex items-center justify-center rounded-md`}
								>
									{storg.title}
								</div>
							))}
						</div>
					</div>

					{/* What is the condition of your console? */}
					<div>
						<div className="flex items-center justify-center pt-14 space-x-2.5">
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
							<h2
								className={
									"bg-[#FDFDFD] py-4 px-8 rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
								}
							>
								{t("consoleCondition")}
							</h2>
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
						</div>

						<div className="p-5 flex items-center gap-4">
							{conditions?.map((cond: { id: number; title: string }) => (
								<div
									key={cond.id}
									onClick={() => setCondition(cond.title)}
									className={`${
										cond.title === condition
											? "bg-[#FDFDFD] text-[#64B95E]"
											: "bg-transparent"
									} text-xl text-[#101010] border-4 border-[#FDFDFD] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}
								>
									{cond.title}
								</div>
							))}
						</div>
					</div>

					{/* TODO: do it later */}
					{/* BRAND */}
					<div className="p-5">
						<p className="text-[#FDFDFD]">
							<span className="font-medium">BRAND NEW:</span> The device is in
							perfect condition and has no signs of wear or scratches. Its
							functionality is equivalent to a factory- fresh item,
							responsiveness to commands is instantaneous, and it does not have
							any overheating issues.
						</p>
					</div>

					{/* Is the console fully functional and free of technical defects? */}
					<div>
						<div className="flex items-center justify-center pt-14 space-x-2.5">
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
							<h2
								className={
									"bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
								}
							>
								{t("consoleFullyFunctional")}
							</h2>
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
						</div>

						<div className="p-5 flex items-center gap-4">
							{functionals?.map((func: { id: number; title: string }) => (
								<div
									key={func.id}
									onClick={() => setFunctional(func.title)}
									className={`${
										func.title === functional
											? "bg-[#FDFDFD] text-[#64B95E]"
											: "bg-transparent"
									} text-xl text-[#101010] border-4 border-[#FDFDFD] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}
								>
									{func.title}
								</div>
							))}
						</div>
					</div>

					{/* How many controllers will you send us? */}
					<div>
						<div className="flex items-center justify-center pt-14 space-x-2.5">
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
							<h2
								className={
									"bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
								}
							>
								{t("consoleControllers")}
							</h2>
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
						</div>

						<div className="p-5 flex items-center gap-4">
							{controllers?.map((cont: { id: number; title: string }) => (
								<div
									key={cont.id}
									onClick={() => setController(cont.title)}
									className={`${
										cont.title === controller
											? "bg-[#FDFDFD] text-[#64B95E]"
											: "bg-transparent"
									} text-xl text-[#101010] border-4 border-[#FDFDFD] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}
								>
									{cont.title}
								</div>
							))}
						</div>
					</div>

					{/* How many controllers will you send us? */}
					<div>
						<div className="flex items-center justify-center pt-14 space-x-2.5">
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
							<h2
								className={
									"bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
								}
							>
								{t("originalAccessories")}
							</h2>
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
						</div>

						<div className="p-5 flex items-center gap-4">
							{accessories?.map((access: { id: number; title: string }) => (
								<div
									key={access.id}
									onClick={() => setAccessory(access.title)}
									className={`${
										access.title === accessory
											? "bg-[#FDFDFD] text-[#64B95E]"
											: "bg-transparent"
									} text-xl text-[#101010] border-4 border-[#FDFDFD] font-semibold w-[198px] h-[106px] text-center flex items-center justify-center rounded-md p-4`}
								>
									{access.title}
								</div>
							))}
						</div>
					</div>

					{/* How many controllers will you send us? */}
					<div>
						<div className="flex items-center justify-center pt-14 space-x-2.5">
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
							<h2
								className={
									"bg-[#FDFDFD] py-4 px-[14px] rounded-lg shadow-md text-[#101010] text-lg font-medium text-center whitespace-wrap"
								}
							>
								{t("leaveUsANote")}
							</h2>
							<hr className="flex-1 border-b-2 border-[#B5B5B5]" />
						</div>

						<div className="p-5">
							<p className="text-[#FDFDFD]">
								<span className="font-medium">BRAND NEW:</span> The device is in
								perfect condition and has no signs of wear or scratches. Its
								functionality is equivalent to a factory- fresh item,
								responsiveness to commands is instantaneous, and it does not
								have any overheating issues.
							</p>
						</div>
					</div>
				</div>

				{/* submit button */}

				<div className="p-5 bg-[#FDFDFD]">
					<Link href={"/sell/summary"}>
						<button className="w-full text-[#FDFDFD] font-semibold bg-[#64B95E] h-14 rounded-lg">
							ADD TO CART
						</button>
					</Link>
				</div>
			</div>

			{/* cart page - design */}
			<div className="hidden bg-[#EAE9EF]">
				<div className="mx-5">
					<h2 className="pt-3 mb-5 text-[32px] font-semibold text-[#101010] border-b-2 border-b-[#B8B8B8]">
						Your Cart
					</h2>
				</div>

				<div className="mx-5">
					<p className="text-lg text-[#101010] mb-5">3 items in your cart:</p>

					<div className="flex flex-col gap-4">
						{[1, 2, 3].map(() => (
							<div className="bg-[#FDFDFD] flex gap-3 rounded-lg p-3">
								<div className="w-[123px] h-[137px]">
									<Image
										src={"/cart/product.png"}
										className="w-full h-full rounded-md"
										width={300}
										height={300}
										alt="console"
									/>
								</div>

								<div className="flex-1">
									<div className="">
										<h2 className="text-lg text-[#404040] font-medium">
											Nintendo Switch
										</h2>
										<p className="text-xs font-medium text-[#404040]">
											Lite | Turchese
										</p>

										<p className="text-xs font-medium text-[#404040]">
											Brand New Condition
										</p>
									</div>

									<div className="flex items-center justify-between border-y border-y-[#B5B5B5] py-1.5">
										<h3 className="text-lg font-medium text-[#404040]">
											Price:
										</h3>
										<h3 className="text-2xl font-semibold text-[#FD9A34]">
											$300
										</h3>
									</div>

									<div className="flex justify-end py-1">
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
						))}
					</div>
				</div>

				<div className="mx-5 mt-5 mb-5 bg-[#FDFDFD] flex items-center justify-between  rounded-lg p-4">
					<h3 className="text-2xl font-semibold text-[#404040]">Total</h3>
					<h2 className="text-[40px] font-semibold text-[#FD9A34]">$200</h2>
				</div>

				<div className="md:hidden w-full pb-9">
					<div className="mx-5 border-b-2 border-b-[#B8B8B8] space-x-4 pt-3 mb-6">
						<h2 className="text-[#101010] text-xl font-semibold pb-3">
							You might also be interested in
						</h2>
					</div>

					<div className="mx-5 grid grid-cols-2 gap-x-2 gap-y-4">
						{[1, 2, 3, 4, 5, 6].map(() => (
							<div className="bg-[#FDFDFD] rounded-lg">
								<div className="p-2">
									<Image
										src={"/buy/mobile.png"}
										className="w-full h-full"
										width={600}
										height={700}
										alt=""
									/>
								</div>

								<div className="relative flex items-center justify-between border-b border-b-[#B5B5B5] p-2">
									{/* Add to cart */}
									<div className="absolute bg-[#FDFDFD] rounded-md -top-6 right-2 shadow-md">
										<button className="px-3 py-1 flex items-center gap-1">
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
											{/* <svg
                        width="89"
                        height="48"
                        viewBox="0 0 89 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g filter="url(#filter0_d_2184_5756)">
                          <rect
                            x="8.5"
                            y="6"
                            width="72"
                            height="32"
                            rx="4"
                            fill="#FDFDFD"
                            shape-rendering="crispEdges"
                          />
                          <path
                            d="M27.868 24.14H24.22L23.548 26H22.396L25.42 17.684H26.68L29.692 26H28.54L27.868 24.14ZM27.556 23.252L26.044 19.028L24.532 23.252H27.556ZM30.6019 22.688C30.6019 22.016 30.7379 21.428 31.0099 20.924C31.2819 20.412 31.6539 20.016 32.1259 19.736C32.6059 19.456 33.1419 19.316 33.7339 19.316C34.2459 19.316 34.7219 19.436 35.1619 19.676C35.6019 19.908 35.9379 20.216 36.1699 20.6V17.12H37.2739V26H36.1699V24.764C35.9539 25.156 35.6339 25.48 35.2099 25.736C34.7859 25.984 34.2899 26.108 33.7219 26.108C33.1379 26.108 32.6059 25.964 32.1259 25.676C31.6539 25.388 31.2819 24.984 31.0099 24.464C30.7379 23.944 30.6019 23.352 30.6019 22.688ZM36.1699 22.7C36.1699 22.204 36.0699 21.772 35.8699 21.404C35.6699 21.036 35.3979 20.756 35.0539 20.564C34.7179 20.364 34.3459 20.264 33.9379 20.264C33.5299 20.264 33.1579 20.36 32.8219 20.552C32.4859 20.744 32.2179 21.024 32.0179 21.392C31.8179 21.76 31.7179 22.192 31.7179 22.688C31.7179 23.192 31.8179 23.632 32.0179 24.008C32.2179 24.376 32.4859 24.66 32.8219 24.86C33.1579 25.052 33.5299 25.148 33.9379 25.148C34.3459 25.148 34.7179 25.052 35.0539 24.86C35.3979 24.66 35.6699 24.376 35.8699 24.008C36.0699 23.632 36.1699 23.196 36.1699 22.7ZM38.7113 22.688C38.7113 22.016 38.8473 21.428 39.1193 20.924C39.3913 20.412 39.7633 20.016 40.2353 19.736C40.7153 19.456 41.2513 19.316 41.8433 19.316C42.3553 19.316 42.8313 19.436 43.2713 19.676C43.7113 19.908 44.0473 20.216 44.2793 20.6V17.12H45.3833V26H44.2793V24.764C44.0633 25.156 43.7433 25.48 43.3193 25.736C42.8953 25.984 42.3993 26.108 41.8313 26.108C41.2473 26.108 40.7153 25.964 40.2353 25.676C39.7633 25.388 39.3913 24.984 39.1193 24.464C38.8473 23.944 38.7113 23.352 38.7113 22.688ZM44.2793 22.7C44.2793 22.204 44.1793 21.772 43.9793 21.404C43.7793 21.036 43.5073 20.756 43.1633 20.564C42.8273 20.364 42.4553 20.264 42.0473 20.264C41.6393 20.264 41.2673 20.36 40.9313 20.552C40.5953 20.744 40.3273 21.024 40.1273 21.392C39.9273 21.76 39.8273 22.192 39.8273 22.688C39.8273 23.192 39.9273 23.632 40.1273 24.008C40.3273 24.376 40.5953 24.66 40.9313 24.86C41.2673 25.052 41.6393 25.148 42.0473 25.148C42.4553 25.148 42.8273 25.052 43.1633 24.86C43.5073 24.66 43.7793 24.376 43.9793 24.008C44.1793 23.632 44.2793 23.196 44.2793 22.7Z"
                            fill="#404040"
                          />
                          <path
                            d="M56.5 27.5C56.7761 27.5 57 27.2761 57 27C57 26.7239 56.7761 26.5 56.5 26.5C56.2239 26.5 56 26.7239 56 27C56 27.2761 56.2239 27.5 56.5 27.5Z"
                            stroke="#404040"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M63.5 27.5C63.7761 27.5 64 27.2761 64 27C64 26.7239 63.7761 26.5 63.5 26.5C63.2239 26.5 63 26.7239 63 27C63 27.2761 63.2239 27.5 63.5 27.5Z"
                            stroke="#404040"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M52.5 16.5H54.5L56 25H64"
                            stroke="#404040"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M56 23H63.795C63.8528 23 63.9089 22.98 63.9536 22.9434C63.9983 22.9068 64.029 22.8558 64.0403 22.7991L64.9403 18.2991C64.9476 18.2628 64.9467 18.2253 64.9377 18.1894C64.9288 18.1535 64.9119 18.1201 64.8885 18.0914C64.865 18.0628 64.8355 18.0398 64.802 18.024C64.7686 18.0082 64.732 18 64.695 18H55"
                            stroke="#404040"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="61"
                            y="14"
                            width="8"
                            height="8"
                            rx="4"
                            fill="#FDFDFD"
                          />
                          <path
                            d="M65 22C67.2 22 69 20.2 69 18C69 15.8 67.2 14 65 14C62.8 14 61 15.8 61 18C61 20.2 62.8 22 65 22Z"
                            stroke="#FD9A34"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M63.667 18H66.3337"
                            stroke="#FD9A34"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M65 19.3337V16.667"
                            stroke="#FD9A34"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_2184_5756"
                            x="0.5"
                            y="0"
                            width="88"
                            height="48"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2" />
                            <feGaussianBlur stdDeviation="4" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_2184_5756"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_2184_5756"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg> */}
										</button>
									</div>

									<div>
										<h2 className="text-[#101010] font-medium">HP</h2>
										<p className="text-[#101010] text-[10px] ">
											Hyper X Cloud III
										</p>
									</div>

									<h2 className="text-base text-[#101010] ">$19</h2>
								</div>

								<div className="flex items-center justify-between gap-2.5 py-4 mx-4">
									<button className="bg-[#FD9A34] h-6 w-[32px] text-[#FDFDFD] rounded-md">
										-
									</button>
									<p className="h-6 w-6 text-xs text-[#000000] border border-[#B5B5B5] rounded-md flex items-center justify-center">
										10
									</p>
									<button className="bg-[#FD9A34] h-6 w-[32px] text-[#FDFDFD] rounded-md">
										+
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="p-5 bg-[#FDFDFD]">
					<Link href={"/sell/summary"}>
						<button className="w-full text-[#FDFDFD] font-semibold bg-[#FD9A34] h-14 rounded-lg">
							PAY NOW
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MobileProductDetails;
