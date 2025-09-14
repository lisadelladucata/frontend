"use client";

import { useTranslation } from "react-i18next";
import Container from "../common/Container";
import ProductCard from "./ProductCard";
import { useSellProductQuery } from "@/redux/features/sell/SellProductAPI";
import Loading from "@/app/loading";

interface IProduct {
  _id: string;
  image: string;
  name: string;
  base_price: number;
}

const ProductSection = ({ product_type = "", setProduct_type }: any) => {
  const { t } = useTranslation();

  const {
    data: products,
    isLoading,
    isError,
  } = useSellProductQuery({
    limit: 100,
    product_type,
  });

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (isError) return <div>Error...</div>;

  return (
    <div id='products' className='bg-[#F2F5F7] pt-20 pb-12'>
      <Container>
        <h2 className='text-center text-[#101010] text-[40px] font-semibold'>
          Seleziona i tuoi articoli
        </h2>
        {products?.data?.products.length < 1 && (
          <h2 className='text-center text-[#101010] my-10'>
            No product found!
            <select
              defaultValue={product_type}
              onChange={(e) => setProduct_type(e.target.value)}
              className='mx-2'
            >
              {["xbox", "playstation", "nintendo"].map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </h2>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10'>
          {products?.data?.products?.map((product: IProduct) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ProductSection;
