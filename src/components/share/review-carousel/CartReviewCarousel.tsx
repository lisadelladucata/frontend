"use client";

import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import CartReviewCard from "./CartReviewCard";
import Container from "@/components/common/Container";
import { useGetReviewsQuery } from "@/redux/features/review/ReviewAPI";
import { Spin } from "antd";

interface IReview {
  comment: string;
  createdAt: string;
  customer: { name: string; avatar: string };
  product: string;
  rating: number;
  updatedAt: string;
  _id: string;
}
export default function CartReviewGrid({
  productName,
}: {
  productName: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const INITIAL_LIMIT = 2;

  const {
    data: reviews,
    isFetching,
    isError,
  } = useGetReviewsQuery({
    page: 1,
    limit: 9,
  });
  const allReviews = reviews?.data?.reviews || [];
  const displayedReviews = isExpanded
    ? allReviews
    : allReviews.slice(0, INITIAL_LIMIT);

  const totalAvailableReviews = allReviews.length;

  const handleToggleReviews = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Container>
      {isFetching && !allReviews.length ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : isError || allReviews.length === 0 ? (
        <p className="text-2xl text-center py-8 text-gray-700">
          {isError
            ? "Errore nel caricamento"
            : "Nessuna recensione disponibile!"}
        </p>
      ) : (
        /* ======================================================= */
        /* CONTENITORE GRIGLIA / LAYOUT VERTICALE */
        /* ======================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {displayedReviews.map((review: IReview) => (
            <CartReviewCard review={review} key={review._id} />
          ))}
        </div>
      )}

      {/* Bottone "Visualizza/Nascondi recensioni" */}
      {totalAvailableReviews > INITIAL_LIMIT && (
        // Lo sfondo del bottone è stato modificato per assomigliare di più allo screenshot (Rosso scuro)
        <div className="mt-8 flex justify-center bg-white mb-8">
          <button
            onClick={handleToggleReviews}
            // CAMBIATO: Aumento la larghezza massima a 'max-w-lg' o 'max-w-xl'
            // Aumento il padding a 'p-4' e la dimensione del testo a 'text-lg'
            className="w-full max-w-lg flex items-center justify-center gap-2 p-4 
                   text-lg font-semibold 
                 rounded-lg shadow-xl border-transparent
                transition-colors">
            {isExpanded
              ? `Nascondi recensioni`
              : `Visualizza tutte le ${totalAvailableReviews} recensioni`}

            <DownOutlined
              className={`text-xl ${
                // Aumento la dimensione dell'icona
                isExpanded ? "rotate-180" : ""
              } transition-transform`}
            />
          </button>
        </div>
      )}
    </Container>
  );
}
