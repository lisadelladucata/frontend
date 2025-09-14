/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

type Tab = "Specification" | "Description" | "Warranty";

export default function ProductSpecification({ product }: any) {
	const [activeTab, setActiveTab] = useState<Tab>("Specification");
	const [specifications, setSpecifications] = useState<
		{ key: string; value: string }[]
	>([]);

	useEffect(() => {
		try {
			if (product?.specifications)
				setSpecifications(
					Object.entries(JSON.parse(product?.specifications)).map(
						([key, value]) => ({ key, value })
					) as any
				);
		} catch (error) {
			console.log(error);
		}
	}, [product]);

	const tabs: Tab[] = ["Specification", "Description", "Warranty"];

	return (
		<div className="bg-[#F2F5F7] mt-20 mb-8 rounded-lg">
			{/* Tabs */}
			<div className="flex flex-wrap gap-6 mb-6 py-6 pl-4">
				{tabs.map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-6 py-2 rounded-md transition-colors duration-200 text-sm md:text-base
              ${
								activeTab === tab
									? "bg-black text-white"
									: "bg-transparent border-2 border-[#101010] text-[#101010]"
							}`}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Content */}
			<div className="bg-[#FDFDFD] rounded-lg shadow-sm">
				{activeTab === "Specification" && (
					<div className="p-6">
						<h2 className="text-xl text-[#101010] font-semibold mb-6">
							Specification
						</h2>

						<div className="overflow-x-auto rounded-[10px] border border-gray-300">
							<table className="min-w-full border border-gray-300 border-collapse rounded-lg">
								<tbody className="rounded-lg">
									{specifications.map(({ key, value }, idx) => (
										<tr key={idx} className="">
											<td className="border border-gray-300 px-6 py-4 text-base font-medium text-[#000000]">
												{key}
											</td>
											<td className="border border-gray-300 px-6 py-4 text-sm text-[#5F5F5F]">
												{value}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{activeTab === "Description" && (
					<div className="p-6">
						<h2 className="text-xl text-[#101010] font-semibold mb-4">
							Description
						</h2>
						<p className="text-gray-600">
							Product description content would go here.
						</p>
					</div>
				)}

				{activeTab === "Warranty" && (
					<div className="p-6">
						<h2 className="text-xl text-[#101010] font-semibold mb-4">
							Warranty
						</h2>
						<p className="text-gray-600">Warranty information would go here.</p>
					</div>
				)}
			</div>
		</div>
	);
}
