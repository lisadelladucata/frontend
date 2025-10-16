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
}

interface ProductCardProps {
  product: ProductData;
  layout?: "list" | "grid";
  handleAddToCart: (product: ProductData) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductCard: React.FC<ProductCardProps> = ({
  handleAddToCart,
  product,
}) => {
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

  const imageUrl =
    product.images && product.images.length > 0
      ? `${API_URL}${product.images[0]}`
      : "/placeholder-default.svg";

  const cardClasses = `
    bg-white rounded-xl shadow-md p-3 flex 
    ${product.quantity === 0 ? "opacity-100" : "opacity-70"}
  `;

  // Estrai il prezzo senza decimali
  const currentPrice = `€${product.offer_price.toFixed(2)}`;

  // Estrai il prezzo originale (barrato)
  const originalPrice = product.price ? `€${product.price.toFixed(2)}` : null;

  return (
    <Link href={`/product/${product._id}`} className={cardClasses}>
      {/* Blocco Immagine */}
      <div className="w-1/3 min-w-[100px] flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-100 mr-4 aspect-square">
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

          {/* Descrizione Breve (Split) */}
          {shortDesc?.length && (
            <p className="text-sm text-gray-700 leading-tight">
              {shortDesc.join(" | ")}
            </p>
          )}

          {/* Condizione */}
          <p className="text-xs text-gray-500 mb-2">
            {product.condition}
            {/* Aggiunto spazio per separare dal testo "nuovo" nell'immagine */}
          </p>

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
              {/* === CASO NON DISPONIBILE: Avvisami === */}
              <p className="text-sm text-center text-gray-600 font-medium mb-2">
                {t("notAvailable")} {/* Mostra "Non disponibile" */}
              </p>
              <button
                onClick={handleAction}
                className="w-full bg-[#FF8C00] text-white font-semibold py-2 rounded-lg transition hover:bg-orange-600 shadow-md">
                {t("notifyMe")} {/* Mostra "Avvisami" */}
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
