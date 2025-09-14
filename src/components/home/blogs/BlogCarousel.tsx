"use client";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { BlogCard } from "./BlogCard";
import Container from "@/components/common/Container";
import { useGetBlogsQuery } from "@/redux/features/blogs/BlogAPI";
import { Spin } from "antd";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface IBlog {
  _id: string;
  image: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
}

export function BlogCarousel() {
  const [page, setPage] = useState<number>(1);
  const swiperRef = useRef<SwiperType>(null);

  const {
    data: blogs,
    isFetching,
    isError,
    refetch,
  } = useGetBlogsQuery({ page, limit: 9 }); // Increased limit for better slider experience

  const totalPages = blogs?.data?.meta?.totalPages ?? 1;

  const handlePrevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className={`bg-transparent pt-8 pb-10 md:pb-28`}>
      <div className='flex items-center justify-center py-8 space-x-4'>
        <hr className='flex-1 border-b border-gray-300' />
        <h2 className='w-max mx-auto text-[#101010] text-2xl md:text-5xl font-semibold text-center'>
          I nostri blog recenti
        </h2>
        <hr className='flex-1 border-b border-gray-300' />
      </div>

      <Container>
        <div className='hidden md:flex justify-between items-center mb-8'>
          <div className='flex gap-4 items-center ml-2 md:ml-0'>
            <button
              onClick={handlePrevSlide}
              className='w-12 h-12 flex items-center justify-center rounded-full bg-[#FDFDFD] hover:bg-gray-100 transition-colors shadow-md'
              aria-label='Previous blog'
            >
              <ArrowLeftOutlined className='text-sm' />
            </button>
            <button
              onClick={handleNextSlide}
              className='w-12 h-12 flex items-center justify-center rounded-full bg-[#FDFDFD] hover:bg-gray-100 transition-colors shadow-md'
              aria-label='Next blog'
            >
              <ArrowRightOutlined className='text-sm' />
            </button>
          </div>

          {page < totalPages && (
            <button
              onClick={handleLoadMore}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              disabled={isFetching}
            >
              {isFetching ? <Spin size='small' /> : "Load More Blogs"}
            </button>
          )}
        </div>

        {!blogs?.data?.blogs?.length && !isFetching && (
          <p className='text-2xl text-center py-8'>No blogs available!</p>
        )}

        {isError && (
          <div className='text-center py-8'>
            <p className='text-red-500 text-2xl relative w-fit group mx-auto'>
              Failed to load blogs.{" "}
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

        {isFetching && !blogs?.data?.blogs?.length ? (
          <div className='flex justify-center py-8'>
            <Spin size='large' />
          </div>
        ) : (
          blogs?.data?.blogs?.length > 0 && (
            <div className='relative'>
              <Swiper
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                autoplay={{
                  delay: 6000,
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
                className='blog-swiper pb-12'
              >
                {blogs?.data?.blogs?.map((blog: IBlog) => (
                  <SwiperSlide key={blog._id}>
                    <div className='h-full'>
                      <BlogCard {...blog} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom styling for pagination */}
              <style jsx global>{`
                .blog-swiper .swiper-pagination {
                  bottom: 0 !important;
                }
                .blog-swiper .swiper-pagination-bullet {
                  width: 12px !important;
                  height: 12px !important;
                  margin: 0 6px !important;
                }
              `}</style>
            </div>
          )
        )}
      </Container>
    </section>
  );
}
