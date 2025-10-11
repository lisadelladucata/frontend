"use client";

import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
// Assicurati che ReviewCard sia stilizzato per la griglia (non ha bisogno di flex-none/mr-4)
import ProductReviewCard from "./ProductReviewCard";
import Container from "@/components/common/Container";
import { useGetReviewsQuery } from "@/redux/features/review/ReviewAPI";
import { Spin } from "antd";

interface IReview {
  comment: string;
  createdAt: string; // La data è qui
  customer: { name: string; avatar: string }; // L'utente è qui
  product: string;
  rating: number;
  updatedAt: string;
  _id: string; // L'ID è qui
}
export default function ProductReviewGrid({
  // Rinominato per riflettere il layout a griglia
  productName,
}: {
  productName: string;
}) {
  // STATO CHIAVE: Controlla se mostrare solo le prime recensioni o tutte
  const [isExpanded, setIsExpanded] = useState(false);

  const filterKey = productName || "";
  const INITIAL_LIMIT = 2; // Numero di recensioni da mostrare inizialmente

  const {
    data: reviews,
    isFetching,
    isError,
  } = useGetReviewsQuery({
    productName: filterKey,
    page: 1,
    limit: 9, // Carica 9 recensioni dal backend
  });

  const allReviews = reviews?.data?.reviews || [];
  // LOGICA CHIAVE: Mostra tutte se espanso, altrimenti solo le prime 'INITIAL_LIMIT'
  const displayedReviews = isExpanded
    ? allReviews
    : allReviews.slice(0, INITIAL_LIMIT);

  const totalAvailableReviews = allReviews.length;

  // NUOVA FUNZIONE: Semplicemente inverte lo stato 'isExpanded' (toggle)
  const handleToggleReviews = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    // Ho rimosso le classi di padding verticale extra e background per lasciare più controllo al genitore
    <div>
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
          // Griglia che mostra 1 colonna su mobile e 2 su desktop.
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {displayedReviews.map((review: IReview) => (
              // Le ReviewCard sono disposte una sotto l'altra o su due colonne
              <ProductReviewCard review={review} key={review._id} />
            ))}
          </div>
        )}

        {/* Bottone "Visualizza/Nascondi recensioni" */}
        {/* Mostra il pulsante solo se ci sono più recensioni di quelle iniziali */}
        {totalAvailableReviews > INITIAL_LIMIT && (
          // Lo sfondo del bottone è stato modificato per assomigliare di più allo screenshot (Rosso scuro)
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleToggleReviews} // Toggle
              className="w-full max-w-sm flex items-center justify-center gap-2 p-3 
                         text-white text-base font-semibold 
                        rounded-lg shadow-md  border-transparent
                        transition-colors">
              {isExpanded
                ? `Nascondi recensioni`
                : `Visualizza tutte le ${totalAvailableReviews} recensioni`}

              <DownOutlined
                // Icona bianca e rotazione
                className={`text-white text-sm ${
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
