import React from "react";
import { Star, Check } from "lucide-react";

// Assicurati che il tipo Review sia importato dal tuo file '@/types/review'
interface Review {
  id: string;
  user: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

const ProductReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div
    // Classe del contenitore principale:
    // **bg-transparent** assicura che lo sfondo sia completamente trasparente.
    className="flex-none w-72 md:w-80 p-4 pt-6 pb-6 rounded-lg 
               mr-4
               shadow-none border border-white 
               text-white 
               ">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-3">
        {/* Avatar Iniziale */}
        <div
          className="h-8 w-8 flex items-center justify-center 
                      text-gray-900 font-bold text-sm rounded-md">
          {review.user[0]}
        </div>

        <div>
          {/* Nome Utente */}
          <p className="text-sm font-semibold text-white">{review.user}</p>

          {/* Acquisto Verificato */}
          <div className="flex items-center text-xs text-white/80">
            <Check className="h-3 w-3 mr-1" />
            <span>Acquisto verificato</span>
          </div>
        </div>
      </div>

      {/* Punteggio e Stelle */}
      <div className="flex flex-col items-end">
        {/* Punteggio */}
        <p className="text-lg font-bold text-white leading-none">
          {review.rating.toFixed(1)}
        </p>

        {/* Stelle di Valutazione */}
        <div className="flex items-center space-x-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? "text-white fill-white" // Stelle piene BIANCHE
                  : "text-white/30" // Stelle vuote BIANCHE TRASPARENTI
              }`}
              // Importante: riempi le stelle piene con "currentColor"
              fill={i < review.rating ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Commento */}
    <p className="text-base text-white mt-1 line-clamp-none">
      {review.comment}
    </p>

    {/* Data */}
    <div className="w-full text-right mt-4">
      <p className="text-xs text-white/70">
        {new Date(review.date).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  </div>
);

export default ProductReviewCard;
