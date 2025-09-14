"use client";

import { useState } from "react";
import Image from "next/image";

interface RepairOption {
	id: string;
	title: string;
	price: number;
	duration: string;
	description: string;
}

export default function RepairPage() {
	const [selectedDevice, setSelectedDevice] = useState<string>("");
	const [selectedIssue, setSelectedIssue] = useState<string>("");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		description: "",
		terms: false,
	});

	const devices = [
		{ id: "nintendo", name: "Nintendo Switch", image: "/products/a1.png" },
		{ id: "xbox", name: "Xbox One", image: "/products/a2.png" },
		{ id: "playstation", name: "PlayStation 5", image: "/products/a4.png" },
	];

	const repairOptions: Record<string, RepairOption[]> = {
		nintendo: [
			{
				id: "screen",
				title: "Screen Replacement",
				price: 89,
				duration: "2-3 days",
				description: "Replace damaged or cracked screen with a new one",
			},
			{
				id: "battery",
				title: "Battery Replacement",
				price: 49,
				duration: "1-2 days",
				description: "Replace old or faulty battery with a new one",
			},
			{
				id: "joycon",
				title: "Joy-Con Repair",
				price: 39,
				duration: "1-2 days",
				description: "Fix drift issues or replace broken Joy-Cons",
			},
		],
		xbox: [
			{
				id: "hdmi",
				title: "HDMI Port Repair",
				price: 79,
				duration: "2-3 days",
				description: "Fix or replace damaged HDMI port",
			},
			{
				id: "drive",
				title: "Disc Drive Repair",
				price: 89,
				duration: "2-3 days",
				description: "Repair or replace faulty disc drive",
			},
		],
		playstation: [
			{
				id: "fan",
				title: "Cooling Fan Replacement",
				price: 69,
				duration: "1-2 days",
				description: "Replace noisy or faulty cooling fan",
			},
			{
				id: "power",
				title: "Power Supply Repair",
				price: 89,
				duration: "2-3 days",
				description: "Fix power issues or replace faulty PSU",
			},
		],
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		// console.log({ selectedDevice, selectedIssue, formData });
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-3xl font-bold text-gray-900">
						Game Console Repair Service
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Professional repair service for your gaming devices
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left Column - Device Selection and Form */}
					<div className="space-y-8">
						{/* Device Selection */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-xl font-semibold mb-4">
								1. Select Your Device
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{devices.map((device) => (
									<button
										key={device.id}
										onClick={() => setSelectedDevice(device.id)}
										className={`p-4 rounded-lg border-2 transition-all ${
											selectedDevice === device.id
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="relative w-32 h-32 mx-auto mb-2">
											<Image
												src={device.image || "/placeholder.svg"}
												alt={device.name}
												fill
												className="object-contain"
											/>
										</div>
										<p className="text-center font-medium">{device.name}</p>
									</button>
								))}
							</div>
						</div>

						{/* Repair Options */}
						{selectedDevice && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-semibold mb-4">
									2. Select Repair Type
								</h2>
								<div className="space-y-4">
									{repairOptions[selectedDevice].map((option) => (
										<button
											key={option.id}
											onClick={() => setSelectedIssue(option.id)}
											className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
												selectedIssue === option.id
													? "border-blue-500 bg-blue-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
										>
											<div className="flex justify-between items-start">
												<div>
													<h3 className="font-medium">{option.title}</h3>
													<p className="text-sm text-gray-600 mt-1">
														{option.description}
													</p>
													<p className="text-sm text-gray-600 mt-1">
														Duration: {option.duration}
													</p>
												</div>
												<span className="font-medium">${option.price}</span>
											</div>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Contact Form */}
						{selectedIssue && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-semibold mb-4">
									3. Your Information
								</h2>
								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Full Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											required
											value={formData.name}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Email Address
										</label>
										<input
											type="email"
											id="email"
											name="email"
											required
											value={formData.email}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div>
										<label
											htmlFor="phone"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Phone Number
										</label>
										<input
											type="tel"
											id="phone"
											name="phone"
											required
											value={formData.phone}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div>
										<label
											htmlFor="description"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Additional Details
										</label>
										<textarea
											id="description"
											name="description"
											rows={4}
											value={formData.description}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div className="flex items-start">
										<input
											type="checkbox"
											id="terms"
											name="terms"
											required
											checked={formData.terms}
											onChange={handleInputChange}
											className="mt-1 mr-2"
										/>
										<label htmlFor="terms" className="text-sm text-gray-600">
											I agree to the terms and conditions and understand that my
											device will be diagnosed and repaired according to the
											selected service
										</label>
									</div>

									<button
										type="submit"
										className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
									>
										Submit Repair Request
									</button>
								</form>
							</div>
						)}
					</div>

					{/* Right Column - Summary and Information */}
					<div className="space-y-8">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-xl font-semibold mb-4">Repair Summary</h2>
							{selectedDevice && selectedIssue && (
								<div className="space-y-4">
									<div className="flex justify-between pb-4 border-b">
										<div>
											<p className="font-medium">
												{devices.find((d) => d.id === selectedDevice)?.name}
											</p>
											<p className="text-sm text-gray-600">
												{
													repairOptions[selectedDevice].find(
														(o) => o.id === selectedIssue
													)?.title
												}
											</p>
										</div>
										<p className="font-medium">
											&euro;
											{
												repairOptions[selectedDevice].find(
													(o) => o.id === selectedIssue
												)?.price
											}
										</p>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-gray-600">Service Fee</span>
											<span>
												&euro;
												{
													repairOptions[selectedDevice].find(
														(o) => o.id === selectedIssue
													)?.price
												}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Diagnostic Fee</span>
											<span>Included</span>
										</div>
										<div className="flex justify-between font-medium pt-2 border-t">
											<span>Total</span>
											<span>
												&euro;
												{
													repairOptions[selectedDevice].find(
														(o) => o.id === selectedIssue
													)?.price
												}
											</span>
										</div>
									</div>
								</div>
							)}

							{(!selectedDevice || !selectedIssue) && (
								<p className="text-gray-600">
									Please select your device and repair type to see the summary
								</p>
							)}
						</div>

						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-xl font-semibold mb-4">Why Choose Us?</h2>
							<div className="space-y-4">
								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0 w-5 h-5 mt-1">
										<svg
											className="text-blue-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<div>
										<h3 className="font-medium">Expert Technicians</h3>
										<p className="text-sm text-gray-600">
											Our certified technicians have years of experience in
											console repair
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0 w-5 h-5 mt-1">
										<svg
											className="text-blue-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="font-medium">Quick Turnaround</h3>
										<p className="text-sm text-gray-600">
											Most repairs are completed within 1-3 business days
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0 w-5 h-5 mt-1">
										<svg
											className="text-blue-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="font-medium">Warranty Included</h3>
										<p className="text-sm text-gray-600">
											All repairs come with a 90-day warranty
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
