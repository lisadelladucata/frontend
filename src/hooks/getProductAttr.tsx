import Loading from "@/app/loading";
import { useGetProductAttrQuery } from "@/redux/features/products/ProductAPI";

const useGetProductAttr = () => {
  const { data: productAttr, isLoading, isError } = useGetProductAttrQuery({});

  if(isLoading) <Loading />

  return { productAttr, isLoading, isError };
};

export default useGetProductAttr;
