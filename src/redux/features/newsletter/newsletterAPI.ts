import baseAPI from "@/redux/api/baseAPI";

const newsletterAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterAPI;
