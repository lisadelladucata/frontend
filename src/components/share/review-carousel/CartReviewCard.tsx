import React from "react";
import { Star } from "lucide-react";
import { CheckCircleFilled } from "@ant-design/icons";

import { useMemo } from "react";

interface IReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    name: string;
    avatar: string;
  };
}

const getInitialColorClass = (char: string) => {
  const upperChar = char.toUpperCase();

  if (upperChar.match(/[A-C]/)) return "bg-blue-300 text-blue-800";
  if (upperChar.match(/[D-F]/)) return "bg-yellow-300 text-yellow-800";
  if (upperChar.match(/[G-I]/)) return "bg-green-300 text-green-800";
  if (upperChar.match(/[J-L]/)) return "bg-purple-300 text-purple-800";
  if (upperChar.match(/[M-O]/)) return "bg-pink-300 text-pink-800";
  if (upperChar.match(/[P-R]/)) return "bg-red-300 text-red-800";
  if (upperChar.match(/[S-U]/)) return "bg-indigo-300 text-indigo-800"; // Ho aggiunto classi per il colore del testo per rendere l'iniziale visibile sul colore di sfondo
  return "bg-gray-400 text-gray-800";
};

const CartReviewCard: React.FC<{ review: IReview }> = ({ review }) => {
  const name = review.customer.name;
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const initialStyleClass = useMemo(
    () => getInitialColorClass(initial),
    [initial]
  );

  const avatarClass = initialStyleClass;

  return (
    <div
      // Stili della card (li manteniamo come erano: p-4 pt-6 pb-6, ecc.)
      className="w-full p-4 pt-6 pb-6 rounded-lg shadow-xl border-none 
          bg-white">
      {/* SEZIONE SUPERIORE: Avatar e Dettagli */}
      <div className="flex items-start mb-2">
        {/* Avatar Iniziale */}
        <div
          className={`h-10 w-10 flex-none mr-3 flex items-center justify-center 
              font-bold text-lg rounded-md ${avatarClass}`}>
          {initial}
        </div>

        {/* CONTENUTO TESTUALE PRINCIPALE: ORA IMPILLIAMO LE RIGHE */}
        <div className="flex flex-col flex-grow">
          {/* 💡 CONTENITORE PRINCIPALE: Flex in COLONNA */}
          {/* RIGA 1: Nome e Punteggio/Stelle affiancati (COME NELL'IMMAGINE) */}
          <div className="flex items-start justify-between w-full">
            {/* Colonna Sinistra (Nome) */}
            <p className="text-lg font-bold leading-tight pr-2">{name}</p>

            {/* Colonna Destra (Punteggio e Stelle) */}
            <div className="flex items-center space-x-2 flex-none pt-1">
              {/* Punteggio */}
              <p className="text-xl font-semibold leading-none">
                {review.rating.toFixed(1)}
              </p>
              {/* Stelle di Valutazione */}
              <div className="flex items-center space-x-0.5">
                {/* Manteniamo la logica delle stelle e dei colori originali */}
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < review.rating ? "fill-black" : "text-white/50"
                    }`}
                    fill={i < review.rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* RIGA 2: Acquisto Verificato (sotto il nome) */}
          <div className="flex items-center text-sm mt-1">
            <CheckCircleFilled className="h-4 w-4 mr-1 " />
            <span>Acquisto verificato</span>
          </div>
        </div>
      </div>

      {/* Separatore sottile */}
      <div className="border-t pt-4 mt-4">
        {/* Commento */}
        <p className="text-base mt-1">{review.comment}</p>

        {/* Data */}
        <div className="w-full text-right mt-4">
          <p className="text-sm font-light ">
            {new Date(review.createdAt).toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartReviewCard;
