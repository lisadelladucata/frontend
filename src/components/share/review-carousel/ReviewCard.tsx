"use client";

import { StarFilled, StarOutlined, CheckCircleFilled } from "@ant-design/icons";
import React, { useState, useMemo } from "react";

// Definisci i temi possibili
type CardTheme = "gray" | "white" | "playstation" | "xbox" | "nintendo";

interface ReviewCardProps {
  comment: string;
  createdAt: string;
  customer: { name: string; avatar?: string };
  product: string;
  rating: number;
  updatedAt: string;
  _id: string;
  theme: CardTheme;
}

// Mappa i temi alle classi e agli stili specifici della card
const getCardThemeClasses = (theme: CardTheme) => {
  // Stili comuni per le recensioni su sfondo colorato (usano 'bg-white' come classe Tailwind)
  const SECTION_BASE_STYLES = {
    starColor: "text-white",
    hrColor: "#E5E7EB",
    textColor: "text-white",
  };

  switch (theme) {
    case "gray":
      return {
        cardBg: "#dadde4", // Sfondo Grigio (ESADECIMALE -> usa style)
        hrColor: "#8e9297",
        textColor: "text-gray-900",
        starColor: "text-[#000000]",
      };
    case "playstation":
      return {
        ...SECTION_BASE_STYLES,
        cardBg: "bg-[#012b81]",
      };
    case "xbox":
      return {
        ...SECTION_BASE_STYLES,
        cardBg: "bg-[#72c470]",
      };
    case "nintendo":
      return {
        ...SECTION_BASE_STYLES,
        cardBg: "bg-[#be1818]",
      };
    case "white":
    default:
      return {
        cardBg: "bg-white",
        hrColor: "#D1D5DB",
        textColor: "text-gray-800",
        starColor: "text-black",
      };
  }
};

// Funzione helper per i colori delle iniziali (invariata)
const getInitialColorClass = (char: string) => {
  const upperChar = char.toUpperCase();
  if (upperChar.match(/[A-C]/)) return "bg-blue-300";
  if (upperChar.match(/[D-F]/)) return "bg-yellow-300";
  if (upperChar.match(/[G-I]/)) return "bg-green-300";
  if (upperChar.match(/[J-L]/)) return "bg-purple-300";
  if (upperChar.match(/[M-O]/)) return "bg-pink-300";
  if (upperChar.match(/[P-R]/)) return "bg-red-300";
  if (upperChar.match(/[S-U]/)) return "bg-indigo-300";
  return "bg-gray-400";
};

export default function ReviewCard({
  comment,
  createdAt,
  customer: { name },
  rating,
  theme,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 300;

  const { cardBg, hrColor, textColor, starColor } = getCardThemeClasses(theme);

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

  // LOGICA IMPORTANTE: Prepara per l'uso di 'style' se il colore è esadecimale
  const isHexColor = cardBg.startsWith("#");
  const cardStyle = isHexColor ? { backgroundColor: cardBg } : {};
  const cardClassName = isHexColor ? "" : cardBg;

  return (
    // Contenitore della Card: Applicazione dinamica di style o className
    <div
      className={`rounded-lg shadow-sm hover:shadow-md transition-shadow  mb-4 overflow-hidden ${cardClassName}`}
      style={cardStyle}>
      {/* SEZIONE 1: Intestazione e Rating */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start">
          {/* Blocco 1: Iniziale */}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-gray-900 text-xl mr-4 flex-shrink-0 ${bgColorClass}`}>
            {initial}
          </div>

          {/* Blocco 2: Dettagli Utente e Rating */}
          <div className="flex-grow">
            {/* Riga 1: Nome e Rating */}
            <div className="flex justify-between items-center mb-0.5">
              <h3
                className={`font-semibold text-gray-900 capitalize text-lg leading-tight ${textColor}`}>
                {name}
              </h3>

              <div className="flex items-center gap-1 text-sm">
                <span className={`font-bold ${textColor}`}>
                  {rating.toFixed(1)}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, index) =>
                    index < rating ? (
                      <StarFilled
                        key={index}
                        // Colore stelle dinamico
                        className={`${starColor} text-base`}
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
            <div className="flex items-center gap-1 text-sm ">
              <CheckCircleFilled className={`text-gray-900 ${textColor}`} />
              <span className={`text-gray-700 font-medium ${textColor}`}>
                Acquisto verificato
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STICK/STRISCIA DIVISORIA: Colore dinamico (sempre style per hrColor esadecimale) */}
      <div className="px-4 sm:px-5">
        <hr className="border-t-2" style={{ borderColor: hrColor }} />
      </div>

      {/* SEZIONE 2: Commento e Data */}
      <div className="p-4 sm:p-5 pt-3">
        {/* Commento: Colore testo dinamico */}
        <p className={`${textColor} leading-7 text-base mb-4`}>
          {isExpanded ? comment : truncatedComment}
          {isTooLong && (
            <div className="mt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                // Bottone espandi: usa il colore della sezione (starColor)
                className={`inline-flex items-center gap-1 text-sm font-medium ${starColor} hover:opacity-80 transition-colors duration-200`}>
                {isExpanded ? "Mostra meno" : "Continua a leggere"}
              </button>
            </div>
          )}
        </p>

        {/* Data della recensione (invariata) */}
        <div className={`text-right  text-sm ${textColor}`}>
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}
