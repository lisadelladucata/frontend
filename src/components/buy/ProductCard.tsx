import React from "react";
import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface ProductData {
  _id: string;
  name: string;
  images: string[];
  offer_price: number;
  price?: number;
  quantity: number;
  description_short?: string;
  condition: string;
  gift_text?: string;
  product_type: string;
  memory: string;
  controller: number;
  slug: any;
}

interface ProductCardProps {
  product: ProductData;
  layout?: "list" | "grid";
  handleAddToCart: (product: ProductData) => void;
}

const getConditionText = (condition: string) => {
  const normalizedcondition = condition.toLowerCase();

  switch (normalizedcondition) {
    case "new":
      return "Nuovo";
    case "accettabile":
      return "Accettabile";
    case "eccellente":
      return "Eccellente";
    case "ottimo":
      return "Ottime";
    default:
      return "Condizione non specificata";
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductCard: React.FC<ProductCardProps> = ({
  handleAddToCart,
  product,
}) => {
  const productUrl = `/buy/${product?.slug}`;
  const conditionText = getConditionText(product.condition);

  const { t } = useTranslation();

  const shortDesc = product.description_short?.split("|").map((d) => d.trim());

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.quantity && handleAddToCart) {
      handleAddToCart(product);
      console.log(`Aggiunto al carrello: ${product.name}`);
    } else if (product.quantity === 0) {
      console.log(`Richiesto avviso per: ${product.name}`);
    }
  };

  const cardClasses = `
    bg-white rounded-xl shadow-md p-3 flex 
    ${product.quantity === 0 ? "bg-black/50" : "opacity-70"}
  `;

  // Estrai il prezzo senza decimali
  const currentPrice = `€${product.offer_price.toFixed(2)}`;

  // Estrai il prezzo originale (barrato)
  const originalPrice = product.price ? `€${product.price.toFixed(2)}` : null;

  return (
    <Link href={productUrl} className={cardClasses}>
      {/* Blocco Immagine */}
      <div className="w-1/3 min-w-[100px] flex-shrink-0 relative overflow-hidden rounded-lg  mr-4 aspect-square">
        <img
          src={`${API_URL}${product?.images[0]}`}
          alt={product?.name}
          className="w-full aspect-square rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
          }}
        />
      </div>

      {/* Blocco Contenuto */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          {/* Nome Prodotto */}
          <h3 className="text-lg font-bold text-[#101010] mb-0.5">
            {product.name}
          </h3>
          {/* === BLOCCO CARATTERISTICHE (RIASSUNTO COMPATTO) === */}
          {(() => {
            const parts = [];

            // 1. Aggiungi la Memoria, se presente (solo il valore)
            if (product.memory) {
              if (product.memory === "-") {
                parts.push("");
              }
              if (product.memory !== "-") {
                parts.push(product.memory);
              }
            }
            // 2. Aggiungi il Controller, se presente (solo il valore, con 'Contr.' per chiarezza)
            if (product.controller) {
              if (product.controller === 0) {
                parts.push("");
              }
              if (product.controller !== 0) {
                parts.push(`${product.controller} Contr.`);
              }
              // Simula lo stile dell'immagine originale se vuoi una riga compatta
            }
            // 3. Aggiungi la Condizione, se presente (solo il valore)
            if (product.condition) {
              if (product.condition === "-") {
                parts.push("");
              }
              if (product.condition !== "-") {
                parts.push(`${conditionText}`);
              }
            }

            // Se non ci sono parti da mostrare, non renderizzare nulla
            if (parts.length === 0) {
              return null;
            }

            // Unisci le parti con un separatore (es. ' | ')
            const summary = parts.join(" | ");

            return (
              <p className="text-sm text-gray-700 leading-tight mb-2">
                {summary}
              </p>
            );
          })()}
          {/* === FINE BLOCCO CARATTERISTICHE (RIASSUNTO COMPATTO) === */}{" "}
          {/* Prezzo */}
          <div className="mb-3 flex items-center">
            {/* Solo se disponibile mostriamo i prezzi, altrimenti nulla */}
            {product.quantity > 0 ? (
              <>
                <span className="text-sm font-normal text-gray-800 mr-2">
                  {t("price")}:
                </span>
                <span className="text-xl font-bold text-[#101010] mr-2">
                  {currentPrice}
                </span>

                {/* Prezzo Barrato (Original Price) - Allineato all'immagine */}
                {originalPrice && product.price! > product.offer_price && (
                  <>
                    <p className="text-sm text-gray-400 line-through">
                      {originalPrice}
                    </p>
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Blocco Azione (Logica is_available) */}
        <div>
          {product.quantity > 0 ? (
            <>
              {/* === CASO DISPONIBILE: Add to Cart === */}
              <button
                onClick={handleAction}
                className="w-full bg-[#FF8C00] text-white font-semibold py-2 rounded-lg flex items-center justify-center transition hover:bg-orange-600 shadow-md">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t("addToCart")}
              </button>
              {/* Testo Omaggio */}
              {product.gift_text && (
                <p className="text-xs text-center text-gray-600 mt-1">
                  {product.gift_text}
                </p>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleAction}
                // Diamo un z-index superiore al pulsante per essere cliccabile sopra l'overlay
                className="w-full bg-[#FD9A34] text-white font-semibold h-10 rounded-lg flex items-center justify-center transition hover:bg-[#ff8a2d] shadow-md z-20 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.8 5.85a1 1 0 001.2 0L21 8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z"
                  />
                </svg>
                Avvisami
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
