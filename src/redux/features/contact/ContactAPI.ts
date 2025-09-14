import baseAPI from "@/redux/api/baseAPI";

const ContactAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    sendContact: builder.mutation({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data, // No need to JSON.stringify
      }),
    }),
  }),
});

export const { useSendContactMutation } = ContactAPI;
