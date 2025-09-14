import baseAPI from "@/redux/api/baseAPI";

const GetProductsByIds = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByIds: builder.query({
      query: (ids) => `/products/retrieve?ids=${ids}`,
    }),
  }),
});

export const { useGetProductsByIdsQuery } = GetProductsByIds;
