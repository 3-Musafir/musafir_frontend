import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // IMPORTANT: let Next.js use the default `.next` directory
  // so Amplify can find required-server-files.json

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

  async redirects() {
    return [
      {
        source: "/pakistan-dmc/hunza",
        destination: "/pakistan-dmc/tours/hunza",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/skardu",
        destination: "/pakistan-dmc/tours/skardu",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/k2basecamp",
        destination: "/pakistan-dmc/tours/k2basecamp",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/k2-base-camp",
        destination: "/pakistan-dmc/tours/k2basecamp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
