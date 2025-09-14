import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "192.168.10.132",
      "115.127.156.132",
      "192.168.10.149",
      "192.168.10.251",
    ],
  },
};

export default nextConfig;
