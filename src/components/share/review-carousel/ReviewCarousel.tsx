"use client";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ReviewCard from "./ReviewCard";
import Container from "@/components/common/Container";
import { useGetReviewsQuery } from "@/redux/features/review/ReviewAPI";
import { Spin } from "antd";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface IReview {
  comment: string;
  createdAt: string;
  customer: { name: string; avatar: string };
  product: string;
  rating: number;
  updatedAt: string;
  _id: string;
}

export default function ReviewCarousel({
  productName,
}: {
  productName: string;
}) {
  const [page, setPage] = useState<number>(1);
  const swiperRef = useRef<SwiperType>(null);

  const {
    data: reviews,
    isFetching,
    refetch,
    isError,
  } = useGetReviewsQuery({ productName, page, limit: 9 }); // Increased limit for better slider experience

  const totalPage = Math.max(reviews?.data?.meta?.totalPage, 1);

  const handlePrevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className={`mb-10 lg:py-24 bg-transparent`}>
      <div className='flex items-center justify-center py-8 space-x-4'>
        <hr className='flex-1 border-b border-gray-300' />
        <h2 className='w-max mx-auto text-[#101010] text-2xl md:text-5xl font-semibold text-center'>
          Recensioni dei nostri clienti
        </h2>
        <hr className='flex-1 border-b border-gray-300' />
      </div>

      <Container>
        <div className='hidden md:flex justify-between items-center mb-8'>
          <div className='flex gap-4 items-center ml-2 md:ml-0'>
            <button
              onClick={handlePrevSlide}
              className='w-12 h-12 flex items-center justify-center rounded-full bg-[#FDFDFD] hover:bg-gray-100 transition-colors shadow-md'
              aria-label='Previous review'
            >
              <ArrowLeftOutlined className='text-sm' />
            </button>
            <button
              onClick={handleNextSlide}
              className='w-12 h-12 flex items-center justify-center rounded-full bg-[#FDFDFD] hover:bg-gray-100 transition-colors shadow-md'
              aria-label='Next review'
            >
              <ArrowRightOutlined className='text-sm' />
            </button>
          </div>

          {page < totalPage && (
            <button
              onClick={handleLoadMore}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              disabled={isFetching}
            >
              {isFetching ? <Spin size='small' /> : "Load More Reviews"}
            </button>
          )}
        </div>

        {!reviews?.data?.reviews?.length && !isFetching && (
          <p className='text-2xl text-center py-8'>No reviews!</p>
        )}

        {isError && (
          <div className='text-center py-8'>
            <p className='text-red-500 text-2xl relative w-fit group mx-auto'>
              Failed to load reviews.{" "}
              <div className='inline-flex ml-2'>
                <button
                  onClick={refetch}
                  className='underline cursor-pointer font-bold text-black group-hover:scale-110 transition'
                >
                  Retry
                </button>
                <span className='relative flex size-3'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75'></span>
                  <span className='relative inline-flex size-3 rounded-full bg-sky-500'></span>
                </span>
              </div>
              <img
                src='/397056891_11541951.png'
                alt='mark arrow'
                className='absolute -top-16 right-10 w-20 rotate-[-80deg] select-none'
              />
            </p>
          </div>
        )}

        {isFetching && !reviews?.data?.reviews?.length ? (
          <div className='flex justify-center py-8'>
            <Spin size='large' />
          </div>
        ) : (
          reviews?.data?.reviews?.length > 0 && (
            <div className='relative'>
              <Swiper
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !bg-gray-300",
                  bulletActiveClass:
                    "swiper-pagination-bullet-active !bg-blue-500",
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                className='review-swiper pb-12'
              >
                {reviews?.data?.reviews?.map((review: IReview) => (
                  <SwiperSlide key={review._id}>
                    <div className='h-60'>
                      <ReviewCard {...review} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom styling for pagination */}
              <style jsx global>{`
                .review-swiper .swiper-pagination {
                  bottom: 0 !important;
                }
                .review-swiper .swiper-pagination-bullet {
                  width: 8px !important;
                  height: 8px !important;
                  margin: 0 6px !important;
                }
              `}</style>
            </div>
          )
        )}
      </Container>
    </div>
  );
}
