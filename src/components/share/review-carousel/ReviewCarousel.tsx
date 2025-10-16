"use client";

import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import ReviewCard from "./ReviewCard";
import Container from "@/components/common/Container";
import { useGetReviewsQuery } from "@/redux/features/review/ReviewAPI";
import { Spin } from "antd";
// Rimosso l'import di useRouter: non è più necessario per il toggle

interface IReview {
  comment: string;
  createdAt: string;
  customer: { name: string; avatar: string };
  product: string;
  rating: number;
  updatedAt: string;
  _id: string;
}

type CardTheme = "gray" | "white" | "playstation" | "xbox" | "nintendo";

interface ReviewCarouselProps {
  productName: string;
  theme: CardTheme;
}

export default function ReviewCarousel({
  productName,
  theme,
}: ReviewCarouselProps) {
  // STATO CHIAVE: Controlla se mostrare solo le prime 4 o tutte le caricate (max 9)
  const [isExpanded, setIsExpanded] = useState(false);

  const filterKey = productName || "";
  const INITIAL_LIMIT = 2; // Mostriamo 4 recensioni inizialmente

  const {
    data: reviews,
    isFetching,
    refetch,
    isError,
  } = useGetReviewsQuery({
    productName: filterKey,
    page: 1,
    limit: 9, // Carica 9 recensioni dal backend
  });

  // LOGICA CHIAVE: Mostra tutte se espanso, altrimenti solo le prime 4.
  const allReviews = reviews?.data?.reviews || [];
  const displayedReviews = isExpanded
    ? allReviews
    : allReviews.slice(0, INITIAL_LIMIT);

  const totalAvailableReviews = allReviews.length;

  // NUOVA FUNZIONE: Semplicemente inverte lo stato 'isExpanded' (toggle)
  const handleToggleReviews = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="lg:py-16 bg-transparent">
      <Container>
        {/* Gestione stati omessa */}

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
          // CONTENITORE GRIGLIA
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {displayedReviews.map((review: IReview) => (
              <ReviewCard key={review._id} {...review} theme={theme} />
            ))}
          </div>
        )}

        {/* Bottone "Visualizza/Nascondi recensioni" */}
        {/* Mostra il pulsante solo se ci sono più recensioni di quelle iniziali */}
        {totalAvailableReviews > INITIAL_LIMIT && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleToggleReviews} // Ora esegue il toggle
              className="w-full max-w-sm flex items-center justify-center gap-2 p-3 
                            bg-white text-gray-900 text-base font-semibold 
                            rounded-lg border border-gray-400 
                            transition-shadow">
              {/* Testo dinamico: Mostra "Nascondi" quando espanso */}
              {isExpanded
                ? "Nascondi recensioni"
                : "Visualizza tutte le recensioni"}

              {/* Icona dinamica: ruotata di 180 gradi (freccia in su) se espansa */}
              <DownOutlined
                className={`text-sm ${
                  isExpanded ? "rotate-180" : ""
                } transition-transform`}
              />
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
