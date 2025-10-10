"use client";

import { StarFilled, StarOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useState, useMemo } from "react";

interface ReviewCardProps {
  comment: string;
  createdAt: string;
  customer: { name: string; avatar?: string };
  product: string;
  rating: number;
  updatedAt: string;
  _id: string;
}

// Funzione helper per i colori delle iniziali (mantenuta invariata)
const getInitialColorClass = (char: string) => {
  const upperChar = char.toUpperCase();

  if (upperChar.match(/[A-C]/)) return "bg-blue-300"; // A, B, C -> Blu chiaro
  if (upperChar.match(/[D-F]/)) return "bg-yellow-300"; // D, E, F -> Giallo chiaro
  if (upperChar.match(/[G-I]/)) return "bg-green-300"; // G, H, I -> Verde chiaro
  if (upperChar.match(/[J-L]/)) return "bg-purple-300"; // J, K, L -> Viola chiaro
  if (upperChar.match(/[M-O]/)) return "bg-pink-300"; // M, N, O -> Rosa (manteniamo come opzione)
  if (upperChar.match(/[P-R]/)) return "bg-red-300"; // P, Q, R -> Rosso chiaro
  if (upperChar.match(/[S-U]/)) return "bg-indigo-300"; // S, T, U -> Indaco chiaro

  // Per Z e numeri o caratteri speciali
  return "bg-gray-400";
};
export default function ReviewCard({
  comment,
  createdAt,
  customer: { name },
  rating,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 300;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("it-IT", options);
  };

  const isTooLong = comment.length > characterLimit;

  const truncatedComment = useMemo(() => {
    if (!isTooLong) return comment;
    const lastSpaceIndex = comment
      .substring(0, characterLimit)
      .lastIndexOf(" ");
    return lastSpaceIndex !== -1
      ? comment.substring(0, lastSpaceIndex) + "..."
      : comment.substring(0, characterLimit) + "...";
  }, [comment, isTooLong, characterLimit]);

  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const bgColorClass = useMemo(() => getInitialColorClass(initial), [initial]);

  return (
    // Contenitore della Card: Sfondo #dadde4
    <div
      className="rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 mb-4 overflow-hidden"
      style={{ backgroundColor: "#dadde4" }}>
      {/* SEZIONE 1: Intestazione e Rating */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start">
          {/* Blocco 1: Iniziale (Avatar Quadrato, COLORE TESTO NERO e NORMALE) */}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-gray-900 text-xl mr-4 flex-shrink-0 ${bgColorClass}`}>
            {initial}
          </div>

          {/* Blocco 2: Dettagli Utente e Rating */}
          <div className="flex-grow">
            {/* Riga 1: Nome e Rating */}
            <div className="flex justify-between items-center mb-0.5">
              <h3 className="font-semibold text-gray-900 capitalize text-lg leading-tight">
                {name}
              </h3>

              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold text-gray-800">
                  {rating.toFixed(1)}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, index) =>
                    index < rating ? (
                      <StarFilled
                        key={index}
                        className="text-[#000000] text-base"
                      />
                    ) : (
                      <StarOutlined
                        key={index}
                        className="text-gray-300 text-base"
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Riga 2: Acquisto Verificato */}
            <div className="flex items-center gap-1 text-sm">
              <CheckCircleFilled className="text-gray-900 text-base" />
              <span className="text-gray-700 font-medium">
                Acquisto verificato
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STICK/STRISCIA DIVISORIA: Colore esatto #8e9297 e larghezza ridotta. */}
      <div className="px-4 sm:px-5">
        <hr className="border-t-2" style={{ borderColor: "#8e9297" }} />
      </div>

      {/* SEZIONE 2: Commento e Data */}
      <div className="p-4 sm:p-5 pt-3">
        {/* Commento */}
        <p className="text-[#000000] leading-7 text-base mb-4">
          {isExpanded ? comment : truncatedComment}
          {isTooLong && (
            <div className="mt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#222C9B] hover:text-[#2c3acf] transition-colors duration-200">
                {isExpanded ? "Mostra meno" : "Continua a leggere"}
              </button>
            </div>
          )}
        </p>

        {/* Data della recensione (allineata a destra) */}
        <div className="text-right text-gray-500 text-sm">
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}
