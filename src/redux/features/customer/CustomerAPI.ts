import baseAPI from "@/redux/api/baseAPI";
import { create } from "domain";

const customerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/resolve",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateCustomerMutation } = customerAPI;
