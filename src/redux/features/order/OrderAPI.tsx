import baseAPI from "@/redux/api/baseAPI";

const OrderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: ({ orderId, customer }) => {
        // const customer = JSON.parse(
        //   localStorage?.getItem("customer") || "{}"
        // )?._id;

        // console.log({customer})

        return {
          url: `/order?customer=${customer}&orderId=${orderId}`,
          method: "GET",
        };
      },
    }),

    createOrder: builder.mutation({
      query: ({ productDetails, customer, secondary_phone, method }) => ({
        url: `/order/checkout?method=${method}`,
        method: "POST",
        body: { productDetails, customer, secondary_phone },
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderQuery } = OrderAPI;
