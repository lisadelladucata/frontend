import baseAPI from "@/redux/api/baseAPI";

const settingAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSetting: build.query<any, void>({
      query: () => ({
        url: "/setting",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSettingQuery } = settingAPI;
