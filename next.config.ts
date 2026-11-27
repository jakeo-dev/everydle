import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jakeo.dev",
        port: "",
        pathname: "/logos/**",
      },
    ],
  },
};

export default nextConfig;
