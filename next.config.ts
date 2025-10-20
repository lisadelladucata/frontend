import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "api.consolelocker.it",
        port: "",
        pathname: "/images/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/newsletter/subscribe",
        destination: "https://api.consolelocker.it/api/v1/newsletter/subscribe",
      },
      {
        source: "/api/v1/:path*",
        destination: "https://api.consolelocker.it/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
