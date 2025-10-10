// src/components/product/ProductCard.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

interface ProductCardProps {
  product: any;
  layout: "new" | "default" | "photo";
}

const getConditionText = (condition: string) => {
  const normalizedcondition = condition.toLowerCase();

  switch (normalizedcondition) {
    case "new":
      return "Il dispositivo è come nuovo";
    case "accettabile":
      return "Il dispositivo è in condizioni accettabili";
    case "eccellente":
      return "Il dispositivo è in condizioni eccellenti";
    case "ottimo":
      return "Il dispositivo è in ottime condizioni";
    default:
      return "Condizione non specificata";
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductCard({ product, layout }: ProductCardProps) {
  const productUrl = `/buy/${product?.slug}`;
  const priceValue = product.price ? Math.floor(product.price) : "N/A";
  const formattedPrice =
    priceValue !== "N/A" ? `€${priceValue}` : "Prezzo non disponibile";
  const conditionText = getConditionText(product.condition);
  return (
    <Link
      href={productUrl}
      className="block group bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-blue-500/10 flex items-center justify-center">
        <img
          src={`${API_URL}${product?.images[0]}`}
          alt={product?.name}
          className="w-full aspect-square rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
          }}
        />
      </div>
      <div className="p-3 pb-2 flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start **gap-1**">
          <h3 className="text-base font-bold text-gray-900 leading-tight  transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xl font-extrabold text-gray-900 whitespace-nowrap">
            {formattedPrice}
          </p>
        </div>
        <p className="text-base text-gray-900 leading-tight  transition-colors line-clamp-2">
          {product.model}
        </p>

        <hr />

        <p className="text-sm text-gray-700 mt-auto pt-1">{conditionText}</p>
      </div>
    </Link>
  );
}
