import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  distDir: "next-build",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "3musafir.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "teenmusafir.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
