"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TestNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-blue-500">
              About
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-blue-500">
              Services
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-blue-500">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TestNav;
