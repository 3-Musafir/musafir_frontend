import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "encrypted-tbn0.gstatic.com",
      "teenmusafir.s3.ap-south-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
