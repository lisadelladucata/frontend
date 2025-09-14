"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Container from "@/components/common/Container";

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt: "Learn how to build modern web applications with Next.js",
    imageUrl: "/blogs/blog1.png",
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS",
    excerpt: "Discover the power of utility-first CSS with Tailwind",
    imageUrl: "/blogs/blog2.png",
  },
  {
    id: 3,
    title: "React Hooks Explained",
    excerpt: "Dive deep into React Hooks and improve your components",
    imageUrl: "/blogs/blog3.png",
  },
  {
    id: 4,
    title: "Building Responsive Layouts",
    excerpt: "Create beautiful, responsive designs that work on any device",
    imageUrl: "/blogs/blog4.png",
  },
  {
    id: 5,
    title: "State Management in React",
    excerpt:
      "Explore different state management solutions for React applications",
    imageUrl: "/blogs/blog1.png",
  },
  {
    id: 6,
    title: "Optimizing Next.js Performance",
    excerpt: "Learn techniques to improve the performance of your Next.js apps",
    imageUrl: "/blogs/blog2.png",
  },
  {
    id: 13,
    title: "Getting Started with Next.js",
    excerpt: "Learn how to build modern web applications with Next.js",
    imageUrl: "/blogs/blog3.png",
  },
  {
    id: 235,
    title: "Mastering Tailwind CSS",
    excerpt: "Discover the power of utility-first CSS with Tailwind",
    imageUrl: "/blogs/blog4.png",
  },
  {
    id: 34,
    title: "React Hooks Explained",
    excerpt: "Dive deep into React Hooks and improve your components",
    imageUrl: "/blogs/blog1.png",
  },
  {
    id: 43,
    title: "Building Responsive Layouts",
    excerpt: "Create beautiful, responsive designs that work on any device",
    imageUrl: "/blogs/blog2.png",
  },
  {
    id: 53,
    title: "State Management in React",
    excerpt:
      "Explore different state management solutions for React applications",
    imageUrl: "/blogs/blog3.png",
  },
  {
    id: 643,
    title: "Optimizing Next.js Performance",
    excerpt: "Learn techniques to improve the performance of your Next.js apps",
    imageUrl: "/blogs/blog4.png",
  },
];

const blogs = [
  {
    image: "/blogs/blog1.png",
    title: "Why It's Smarter To Buy A Refurbished iPhone Rather",
    excerpt:
      "I type and scrambled it to make a type specimen book. It has survived...",
    author: "Admin",
    date: "19Jun2024",
  },
  {
    image: "/blogs/blog2.png",
    title: "Why It's Smarter To Buy A Refurbished iPhone Rather",
    excerpt:
      "I type and scrambled it to make a type specimen book. It has survived...",
    author: "Admin",
    date: "19Jun2024",
  },
  {
    image: "/blogs/blog3.png",
    title: "Why It's Smarter To Buy A Refurbished iPhone Rather",
    excerpt:
      "I type and scrambled it to make a type specimen book. It has survived...",
    author: "Admin",
    date: "19Jun2024",
  },
  {
    image: "/blogs/blog4.png",
    title: "Why It's Smrter To Buy A Refurbished iPhone Rather",
    excerpt:
      "I type and scrambled it to make a type specimen book. It has survived...",
    author: "Admin",
    date: "19Jun2024",
  },
];

const NewBlogCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerView = {
    mobile: 1,
    desktop: 4,
  };

  const totalSlides = Math.ceil(blogPosts.length / slidesPerView.desktop);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getVisiblePosts = () => {
    const start = currentSlide * slidesPerView.desktop;
    const end = start + slidesPerView.desktop;
    return blogPosts.slice(start, end);
  };

  return (
    <div className="relative w-full pt-8 pb-8 mb-5">
      <Container>
        <div className="flex items-center justify-between">
          <h2 className="text-[#101010] text-2xl lg:text-[40px] font-semibold">
            Our Recent Blogs
          </h2>

          {/* control buttton - next / prev */}
          <div className="flex items-center gap-5">
            <button
              onClick={prevSlide}
              className={` bg-white p-2 rounded shadow-md focus:outline-none ${
                currentSlide === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              disabled={currentSlide === 0}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.0616 14.7071C9.67108 15.0976 9.03791 15.0976 8.64739 14.7071L4.64739 10.7071C4.25686 10.3166 4.25686 9.68342 4.64739 9.29289L8.64739 5.29289C9.03791 4.90237 9.67108 4.90237 10.0616 5.29289C10.4521 5.68342 10.4521 6.31658 10.0616 6.70711L7.76871 9L15.3545 9C15.9068 9 16.3545 9.44772 16.3545 10C16.3545 10.5523 15.9068 11 15.3545 11H7.76871L10.0616 13.2929C10.4521 13.6834 10.4521 14.3166 10.0616 14.7071Z"
                  fill="#101010"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className={`  bg-white p-2 rounded shadow-md focus:outline-none ${
                currentSlide === totalSlides - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              disabled={currentSlide === totalSlides - 1}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.6474 5.29289C11.0379 4.90237 11.6711 4.90237 12.0616 5.29289L16.0616 9.29289C16.4521 9.68342 16.4521 10.3166 16.0616 10.7071L12.0616 14.7071C11.6711 15.0976 11.0379 15.0976 10.6474 14.7071C10.2569 14.3166 10.2569 13.6834 10.6474 13.2929L12.9403 11L5.35449 11C4.80221 11 4.35449 10.5523 4.35449 10C4.35449 9.44772 4.80221 9 5.35449 9H12.9403L10.6474 6.70711C10.2569 6.31658 10.2569 5.68342 10.6474 5.29289Z"
                  fill="#101010"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {blogs.map((post, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 p-4"
              >
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="flex items-center gap-4 mx-4 border-b border-b-[#E6E6E6] py-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/users/user.png"
                        width={12}
                        height={12}
                        alt="User"
                      />
                      <p className="text[#101010] text-sm">Admin</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/calendar.png"
                        width={12}
                        height={12}
                        alt="Calendar"
                      />
                      <p className="text-[#101010] text-sm">17 june, 2024</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-[#101010] text-xl font-semibold mb-2.5">
                      {post.title}
                    </h2>
                    <p className="text-base text-[#2B2B2B] mb-2">
                      {post.excerpt}
                    </p>

                    <p className="text-[#222C9B] hover:text-[#2c3acf]">
                      Read More
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NewBlogCarousel;
