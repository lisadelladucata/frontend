import React from "react";
import { Star, Check } from "lucide-react";
import { useMemo } from "react"; // Manteniamo useMemo

// Manteniamo la tipizzazione corretta (IReview dal componente genitore)
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

// Funzione per determinare la classe di colore in base all'iniziale
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

const ProductReviewCard: React.FC<{ review: IReview }> = ({ review }) => {
  // CORREZIONE 1: Il codice JavaScript deve stare all'interno del corpo del componente,
  // prima del 'return'.
  // CORREZIONE 2: Utilizza 'review.customer.name' per accedere al nome.

  const name = review.customer.name;
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // CORREZIONE 3: Uso corretto di useMemo e della variabile 'initial'.
  const initialStyleClass = useMemo(
    () => getInitialColorClass(initial),
    [initial]
  );

  // L'avatar mostrato nell'ultima immagine è BIANCO con testo verde,
  // quindi commentiamo temporaneamente l'uso della logica dinamica,
  // ma la rendiamo disponibile in caso tu voglia usarla.
  // const avatarClass = initialStyleClass;
  const avatarClass = initialStyleClass;

  return (
    <div
      // Stili per replicare la prima immagine (verde scuro, testo bianco)
      className="w-full p-4 pt-6 pb-6 rounded-lg shadow-xl border-none 
                    bg-transparent text-white">
      {/* SEZIONE SUPERIORE: Avatar e Dettagli */}
      <div className="flex items-start mb-2">
        {/* Avatar Iniziale: Usa la classe dinamica o quella fissa per lo screenshot */}
        <div
          className={`h-10 w-10 flex-none mr-3 flex items-center justify-center 
                            font-bold text-lg rounded-md ${avatarClass}`}>
          {initial}
        </div>

        {/* CONTENUTO TESTUALE PRINCIPALE: Nome/Verificato A SINISTRA e Rating A DESTRA */}
        <div className="flex flex-grow justify-between items-start">
          {/* Colonna Sinistra (Nome e Acquisto Verificato) */}
          <div className="flex flex-col flex-grow">
            {/* Nome Utente */}
            <p className="text-lg font-bold text-white leading-tight">{name}</p>

            {/* Acquisto Verificato */}
            <div className="flex items-center text-sm text-green-200 mt-1">
              <Check className="h-4 w-4 mr-1 text-green-200" />
              <span>Acquisto verificato</span>
            </div>
          </div>

          {/* Colonna Destra (Punteggio e Stelle) */}
          <div className="flex items-center pt-1 space-x-2 flex-none ml-4">
            {/* Punteggio */}
            <p className="text-xl font-semibold text-white leading-none">
              {review.rating.toFixed(1)}
            </p>
            {/* Stelle di Valutazione */}
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < review.rating
                      ? "text-white fill-white"
                      : "text-white/50"
                  }`}
                  fill={i < review.rating ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Separatore sottile */}
      <div className="border-t border-green-500/50 pt-4 mt-4">
        {/* Commento */}
        <p className="text-base text-white mt-1">{review.comment}</p>

        {/* Data */}
        <div className="w-full text-right mt-4">
          <p className="text-sm font-light text-green-200">
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

export default ProductReviewCard;
