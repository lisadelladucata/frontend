"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 text-center">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute text-[180px] font-bold text-blue-100 sm:text-[220px]">
          404
        </div>
        <div
          className={`relative z-10 transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <svg
            className="h-40 w-40 sm:h-52 sm:w-52"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="96" stroke="#3B82F6" strokeWidth="8" />
            <path
              d="M74 130L126 70"
              stroke="#3B82F6"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M126 130L74 70"
              stroke="#3B82F6"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <h1
        className={`mb-4 text-4xl font-bold text-gray-800 transition-all duration-700 sm:text-5xl ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        Page Not Found
      </h1>

      <p
        className={`mb-8 max-w-md text-lg text-gray-600 transition-all delay-300 duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <Link
        href="/"
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-500 px-8 py-3 font-medium text-white transition-all duration-300 ease-out hover:bg-blue-600 hover:shadow-md ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
        <span className="relative flex items-center">
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Return Home
        </span>
      </Link>

      {/* <div
        className={`mt-16 text-sm text-gray-500 transition-all delay-500 duration-1000 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div> */}
    </div>
  );
}
