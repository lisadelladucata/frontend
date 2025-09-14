import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductType {
  _id: string;
  image: string;
  name: string;
  base_price: number;
}

const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="flex flex-col gap-4 bg-[#FDFDFD] rounded-lg hover:shadow">
      <div className="bg-[#D0DDD0] w-full  h-[300px] relative rounded-t-lg">
        <Image
          src={`${API_URL}${product?.image}`}
          alt="Product"
          width={400}
          height={400}
          className="object-contain w-full h-[300px] aspect-square"
        />
      </div>
      <div className="flex justify-between items-center gap-2 p-5">
        <div>
          <h3 className="text-xl font-semibold text-[#101010] mb-2">
            {product.name}
          </h3>
          <p className="text-[#2B2B2B] text-base">
            Price Estimate: ${product?.base_price}
          </p>
        </div>
        <Link
          href={`/sell/${product?._id}`}
          className="py-3 px-8 bg-[#101010] text-[#FDFDFD] rounded-sm"
        >
          SELL
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
