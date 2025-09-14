"use client";

import { BlogCarousel } from "@/components/home/blogs/BlogCarousel";
import HowDelivery from "@/components/sell/HowDelivery";
import ConsoleSelectorMobile from "@/components/sell/mobile/ConsoleSelectorMobile";
import FindOutConsole from "@/components/sell/mobile/FindOutConsole";
import MobileSellHero from "@/components/sell/mobile/MobileSellHero";
import ProductSection from "@/components/sell/ProductSection";
import SellHeroSection from "@/components/sell/SellHeroSection";
import ReviewCarousel from "@/components/share/review-carousel/ReviewCarousel";
import { useState } from "react";

const SellPage = () => {
  const [product_type, setProduct_type] = useState<string>("");

  return (
    <>
      {/* show only for desktop ddevice */}
      <div className="hidden md:block">
        <SellHeroSection
          product_type={product_type}
          setProduct_type={setProduct_type}
        />
        <HowDelivery />
        <ProductSection
          setProduct_type={setProduct_type}
          product_type={product_type}
        />
        <ReviewCarousel productName="" />
      </div>

      {/* show only for mobile ddevice */}
      <div className="md:hidden">
        <MobileSellHero />
        <FindOutConsole />

        <ConsoleSelectorMobile />
        <ReviewCarousel productName="" />
        <BlogCarousel />
      </div>
    </>
  );
};

export default SellPage;
