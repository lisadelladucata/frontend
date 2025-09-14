import baseAPI from "@/redux/api/baseAPI";

const BlogAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({ page = 1, limit = 5 }) => `/blogs?limit=${limit}&page=${page}`,
    }),

    getBlog: builder.query({
      query: (slug: string) => `/blogs/${slug}`,
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogQuery } = BlogAPI;
