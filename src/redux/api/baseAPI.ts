import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL2,
  }),
  tagTypes: ["Products", "reviews", "review"],
  endpoints: () => ({}),
});

export default baseAPI;
