import baseAPI from "@/redux/api/baseAPI";

interface GetEstimateProductPriceRequest {
  questions: {
    quesId?: string;
    optionId?: string;
    questionAnswer?: {
      questionName?: string;
      questionTitle?: string;
    };
  }[];
}

const ProductAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductsForHome: builder.query<
      any,
      {
        product_type?: string;
        brand?: string;
        condition?: string;
        limit?: number;
        page?: number;
        price?: [number, number];
        sortBy?: string;
      }
    >({
      query: ({
        product_type,
        brand,
        condition,
        limit,
        page,
        sortBy,
        price,
      }) => {
        // console.log("price range: ", price);

        let queryParams = new URLSearchParams();

        if (product_type && product_type !== "all")
          queryParams.append("product_type", product_type);
        if (brand && brand !== "all") queryParams.append("brand", brand);
        if (condition && condition !== "all")
          queryParams.append("condition", condition);
        if (limit) queryParams.append("limit", limit.toString());
        if (page) queryParams.append("page", page.toString());
        if (sortBy) queryParams.append("sort", sortBy.toString());

        // if(price && price.length === 2) {
        if (price) {
          queryParams.append("min_price", price[0].toString());
          queryParams.append("max_price", price[1].toString());
        }

        return `/products/forHome?${queryParams.toString()}`;
      },
    }),

    getAllProducts: builder.query<
      any,
      {
        product_type?: string;
        brand?: string;
        condition?: string;
        limit?: number;
        page?: number;
        price?: [number, number];
        sortBy?: string;
      }
    >({
      query: ({
        product_type,
        brand,
        condition,
        limit,
        page,
        sortBy,
        price,
      }) => {
        // console.log("price range: ", price);

        let queryParams = new URLSearchParams();

        if (product_type && product_type !== "all")
          queryParams.append("product_type", product_type);
        if (brand && brand !== "all") queryParams.append("brand", brand);
        if (condition && condition !== "all")
          queryParams.append("condition", condition);
        if (limit) queryParams.append("limit", limit.toString());
        if (page) queryParams.append("page", page.toString());
        if (sortBy) queryParams.append("sort", sortBy.toString());

        // if(price && price.length === 2) {
        if (price) {
          queryParams.append("min_price", price[0].toString());
          queryParams.append("max_price", price[1].toString());
        }

        return `/products?${queryParams.toString()}`;
      },
    }),

    getSingleProduct: builder.query<
      any,
      { productName?: string; slug?: string }
    >({
      query: ({ slug }) => `/products/${slug}`,
    }),

    findSlugProduct: builder.query<
      any,
      {
        productName?: string;
        model?: string;
        condition?: string;
        controller?: string;
        memory?: string;
      }
    >({
      query: ({ productName, model, condition, controller, memory }) =>
        `/products/${productName}/find-slug?model=${model}&condition=${condition}&controller=${controller}&memory=${memory}`,
    }),

    // query: ({ productName, slug }) => `/products/${productName}/find-slug?${slug}`,
    createProduct: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/create/product",
        method: "POST",
        body: formData,
      }),
    }),

    getEstimateProductPrice: builder.mutation<
      any,
      { id: string; body: GetEstimateProductPriceRequest }
    >({
      query: ({ id, body }) => ({
        url: `/sell/products/${id}/price`,
        method: "POST",
        body: body,
      }),
    }),

    getProductAttr: builder.query<any, any>({
      query: () => `/config-attr`,
    }),
  }),
});

export const {
  useGetAllProductsForHomeQuery,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useGetEstimateProductPriceMutation,
  useFindSlugProductQuery,
  useGetProductAttrQuery,
} = ProductAPI;

export default ProductAPI;
