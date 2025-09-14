"use client";

import * as React from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";

export default function ImageSlider() {
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1.3, // Show 2 full images and 10% of previous/next images
      spacing: 15, // Adjust spacing for smooth layout
    },
  });

  return (
    <div className="md:hidden w-full">
      <div className="flex items-center justify-center py-8 space-x-4">
        <hr className="flex-1 border-b border-gray-300" />
        <h2 className="max-w-[290px] mx-auto text-[#101010] text-2xl md:text-5xl font-semibold text-center">
          Confonta le recensioni dei nostri clienti
        </h2>
        <hr className="flex-1 border-b border-gray-300" />
      </div>
      <div ref={ref} className="keen-slider">
        <div className="keen-slider__slide">
          <Image
            src={"/home/slide.png"}
            width={300}
            height={600}
            alt="slider"
            className=""
          />
        </div>
        <div className="keen-slider__slide">
          <Image
            src={"/home/slide.png"}
            width={300}
            height={600}
            alt="slider"
            className=""
          />
        </div>
        <div className="keen-slider__slide">
          <Image
            src={"/home/slide.png"}
            width={300}
            height={600}
            alt="slider"
            className=""
          />
        </div>
        <div className="keen-slider__slide">
          <Image
            src={"/home/slide.png"}
            width={300}
            height={600}
            alt="slider"
            className=""
          />
        </div>
        <div className="keen-slider__slide">
          <Image
            src={"/home/slide.png"}
            width={300}
            height={600}
            alt="slider"
            className=""
          />
        </div>
        <div className="keen-slider__slide">
          <Image
            src={"/home/slide.png"}
            width={300}
            height={600}
            alt="slider"
            className=""
          />
        </div>
      </div>
    </div>
  );
}
