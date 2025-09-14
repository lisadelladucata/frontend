/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FacebookIcon, TwitterIcon, LinkedinIcon, Share2 } from "lucide-react";
import Container from "@/components/common/Container";
import { useGetBlogQuery } from "@/redux/features/blogs/BlogAPI";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";

export default function BlogDetail() {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const params = useParams();

	const { slug } = params;

	const { data: blog, isLoading, isError } = useGetBlogQuery(slug as string);

	if (isLoading)
		return (
			<div>
				<Loading />
			</div>
		);

	if (isError) return <div>Error Occured! {isError.valueOf()}</div>;

	const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

	return (
		<div className="min-h-screen pb-12">
			<Container className="max-w-4xl mx-auto">
				{/* Title */}
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 my-6">
					{blog?.data?.blog?.title}
				</h1>

				{/* Hero Section */}
				<div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative">
					<Image
						src={`${BASE_API_URL}${blog?.data?.blog?.image}`}
						alt="Gaming Console"
						fill
						className="w-1/2 mx-auto object-cover"
						priority
					/>
				</div>

				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative">
					{/* Article Card */}
					<article className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8">
						{/* Meta Information */}
						<div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
							<div className="flex items-center gap-2">
								<img
									src={
										new URL(
											blog?.data?.blog?.admin?.avatar,
											process.env.NEXT_PUBLIC_API_URL
										).href
									}
									width={30}
									height={30}
									className="w-8 h-8 bg-gray-200 rounded-full"
									alt="admin"
								/>
								<span>{blog?.data?.blog?.admin?.name}</span>
							</div>
							<span>
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
									className="lucide lucide-calendar-days"
								>
									<path d="M8 2v4" />
									<path d="M16 2v4" />
									<rect width="18" height="18" x="3" y="4" rx="2" />
									<path d="M3 10h18" />
									<path d="M8 14h.01" />
									<path d="M12 14h.01" />
									<path d="M16 14h.01" />
									<path d="M8 18h.01" />
									<path d="M12 18h.01" />
									<path d="M16 18h.01" />
								</svg>
							</span>
							<time>{blog?.data?.blog?.updatedAt?.split("T")[0]}</time>
						</div>

						{/* Share buttons */}
						<div className="flex items-center gap-4 mb-8 flex-wrap">
							<a
								href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
								target="_blank"
								className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
							>
								<FacebookIcon size={18} />
								<span className="hidden sm:inline">Share</span>
							</a>
							<a
								href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
								target="_blank"
								className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
							>
								<TwitterIcon size={18} />
								<span className="hidden sm:inline">Tweet</span>
							</a>
							<a
								href={`https://www.linkedin.com/shareArticle?url=${window.location.href}`}
								target="_blank"
								className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
							>
								<LinkedinIcon size={18} />
								<span className="hidden sm:inline">Share</span>
							</a>
							<button
								onClick={copyToClipboard}
								className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors ml-auto"
							>
								<Share2 size={18} />
								<span>{copied ? "Copied!" : "Copy Link"}</span>
							</button>
						</div>

						{/* Content */}
						<div className="prose prose-lg max-w-none whitespace-pre-line">
							{blog?.data?.blog?.description}
						</div>
					</article>

					{/* Related Posts */}
					{blog?.data?.relatedBlogs?.length > 0 && (
						<section>
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Related Posts
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{blog?.data?.relatedBlogs.map((blog: any) => (
									<Link
										href={`/blog/${blog.slug}`}
										key={blog._id}
										className="group"
									>
										<div className="bg-[#FDFDFD] h-full rounded-lg shadow-md overflow-hidden">
											<div className="relative h-48">
												<Image
													src={process.env.NEXT_PUBLIC_API_URL + blog.image}
													alt="Related post thumbnail"
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>
											<div className="p-4">
												<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
													{blog?.title}
												</h3>
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<span>{blog?.admin?.name}</span>
													<span>•</span>
													<time>{blog?.updatedAt?.split("T")[0]}</time>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}
				</main>
			</Container>
		</div>
	);
}
