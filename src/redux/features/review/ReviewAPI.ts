import baseAPI from "@/redux/api/baseAPI";

const ReviewAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ productName, limit = 9, page = 1 }) => {
        // 1. Costruisci i parametri base: limit e page
        let url = `/reviews?limit=${limit}&page=${page}`;

        // 2. Aggiungi il filtro productName solo se è definito e non è una stringa vuota
        if (productName && productName.length > 0) {
          url += `&productName=${productName}`;
        }

        return {
          url, // L'URL ora includerà productName solo quando necessario
          method: "GET",
        };
      },
      providesTags: ["reviews"],
    }),
  }),
});

export const { useGetReviewsQuery } = ReviewAPI;
