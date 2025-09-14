/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetReviewsQuery } from "@/redux/features/review/ReviewAPI";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Container from "@/components/common/Container";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const ReviewsPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const queries = useSearchParams();
  const [page, setPage] = useState<number>(Math.max(+queries.get("page")!, 1));

  const {
    data: reviews,
    isFetching,
    isError,
    refetch,
  } = useGetReviewsQuery({
    productName: queries.get("productName")?.toString() || "",
    page,
  });

  const totalPages = reviews?.data?.meta?.totalPage ?? 1;

  useEffect(() => {
    if (!reviews?.data?.meta?.totalPage) return;
    if (page > reviews?.data?.meta?.totalPage) setPage(totalPages);
  }, [reviews]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    query.set("page", page.toString());
    history.replaceState(null, "", `?${query.toString()}`);
  }, [page, queries.get("productName")]);

  return (
    <div className='bg-[#F2F5F7] pt-10 pb-4 md:pb-20'>
      <Container>
        <h2 className='text-[#101010] text-[24px] font-semibold mb-10 text-center md:text-[40px]'>
          Recensioni
        </h2>

        {isError && (
          <p className='text-red-500 text-2xl relative w-fit group'>
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
        )}

        {isFetching ? (
          <Spin size='large' />
        ) : (
          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {reviews?.data?.reviews?.length === 0 && (
              <p className='text-[#000000] text-2xl font-semibold text-center'>
                No review found.
              </p>
            )}
            {reviews?.data?.reviews?.map((review: any) => (
              <div
                key={review?._id}
                className='bg-[#FDFDFD] p-8 rounded-lg h-full flex flex-col'
              >
                {/* Review Comment */}
                <p className='text-[#000000] leading-7 text-lg mb-3 flex-grow overflow-hidden'>
                  {review?.comment?.split(0, 1) || "No review available."}
                </p>

                {/* Reviewer & Rating */}
                <div className='flex items-center justify-between mt-auto'>
                  {/* Reviewer Details */}
                  <div className='flex items-center gap-4'>
                    <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                      <Image
                        src={`${API_URL}${review?.customer?.avatar}`}
                        alt={review?.customer?.name || "Reviewer"}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {review?.customer?.name || "Anonymous"}
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        {review?.product || "Unknown Product"}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className='flex gap-1'>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`text-lg ${
                          index < (review?.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <div className='flex justify-center items-center gap-3 my-12'>
          <button
            title='Previous'
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className={`w-10 h-10 flex items-center justify-center bg-transparent ${
              page === 1 && "cursor-not-allowed"
            }`}
          >
            <ChevronLeft />
          </button>
          {isFetching ? (
            <Spin size='small' />
          ) : (
            Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md ${
                    page === pageNumber
                      ? "bg-black text-white"
                      : "bg-transparent border-2 border-[#101010]"
                  } ${page === pageNumber && "cursor-not-allowed"}`}
                >
                  {pageNumber}
                </button>
              )
            )
          )}

          <button
            title='Next'
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            className={`w-10 h-10 flex items-center justify-center bg-transparent ${
              page === reviews?.data?.meta?.totalPage && "cursor-not-allowed"
            }`}
          >
            <ChevronRight />
          </button>
        </div>
      </Container>
    </div>
  );
};

export default ReviewsPage;
