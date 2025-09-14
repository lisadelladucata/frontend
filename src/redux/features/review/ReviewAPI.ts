import baseAPI from "@/redux/api/baseAPI";

const ReviewAPI = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getReviews: builder.query({
			query: ({ productName, limit = 9, page = 1 }) => ({
				url: `/reviews?limit=${limit}&page=${page}&productName=${productName}`,
				method: "GET",
			}),
			providesTags: ["reviews"],
		}),
	}),
});

export const { useGetReviewsQuery } = ReviewAPI;
