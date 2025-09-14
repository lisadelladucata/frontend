import Image from "next/image";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  warranty: string;
  storage: string;
  condition: string;
  delivery: string;
  isAvailable: boolean;
  hasAlternative?: boolean;
  onAddToCart: (id: string) => void;
}

export function CartItem({
  id,
  name,
  price,
  warranty,
  storage,
  condition,
  delivery,
  isAvailable,
  hasAlternative,
  onAddToCart,
}: CartItemProps) {
  return (
    <>
      {/* for mobile */}
      <div className="lg:hidden bg-white p-6 rounded-lg shadow-sm">
        {!isAvailable && (
          <span className="inline-block px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md mb-4">
            Not available
          </span>
        )}
        {hasAlternative && (
          <span className="inline-block px-3 py-1 text-sm bg-pink-100 text-pink-600 rounded-md mb-4">
            Alternative option available
          </span>
        )}

        <div className="flex flex-col gap-4">
          <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
            <Image
              src="/buy/p3.png"
              alt={name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{name}</h3>
              <p className="text-lg font-medium">${price}</p>
            </div>

            <div className="space-y-1 text-sm text-gray-600 mt-2">
              <p>
                Warranty: {warranty} | {storage}
              </p>
              <p>Condition: {condition}</p>
              <p className="text-[#00B67A] text-sm font-medium">
                Delivery: {delivery}
              </p>
              <p>Sales & Shipping: Console & you</p>

              <div className="flex items-center justify-between">
                <p>Warranty: {warranty}</p>
                <button
                  onClick={() => onAddToCart(id)}
                  className="text-sm font-medium text-[#222C9B]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // previous code:::::::::::::::::::::::: */}

      <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm">
        {!isAvailable && (
          <span className="inline-block px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md mb-4">
            Not available
          </span>
        )}
        {hasAlternative && (
          <span className="inline-block px-3 py-1 text-sm bg-pink-100 text-pink-600 rounded-md mb-4">
            Alternative option available
          </span>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image Section */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mx-auto md:mx-0">
            <Image
              src="/buy/p3.png"
              alt={name}
              fill
              className="object-contain rounded-md"
            />
          </div>

          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-center md:text-left">
              {name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600 mt-2 text-center md:text-left">
              <p className="text-xs  text-[#101010]">
                Warranty: {warranty} | {storage}
              </p>
              <p className="text-xs text-[#2B2B2B]">Condition: {condition}</p>
              <p className="text-[#00B67A] font-medium text-sm">
                Delivery: {delivery}
              </p>
              <p className="text-xs text-[#101010]">
                Sales & Shipping: Console & you
              </p>
              <p className="text-xs text-[#101010]">Warranty: {warranty}</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-between space-y-4 md:space-y-0">
            <span className="text-lg font-medium">${price}</span>
            <button
              onClick={() => onAddToCart(id)}
              className="text-sm font-medium text-[#222C9B]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
