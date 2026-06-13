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
        source: "/faq",
        destination: "/hc/faq",
        permanent: true,
      },
      {
        source: "/trust",
        destination: "/hc/safetyframework",
        permanent: true,
      },
      {
        source: "/trust/verification",
        destination: "/hc/safetyframework/verification",
        permanent: true,
      },
      {
        source: "/trust/vendor-onboarding",
        destination: "/hc/safetyframework/vendor-onboarding",
        permanent: true,
      },
      {
        source: "/trust/travel-education",
        destination: "/hc/safetyframework/travel-education",
        permanent: true,
      },
      {
        source: "/musafircommunityequityframework",
        destination: "/hc/safetyframework/community-framework",
        permanent: true,
      },
      {
        source: "/trust-and-verification",
        destination: "/hc/safetyframework/trust-and-verification",
        permanent: true,
      },
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
        source: "/pakistan-dmc/chitral",
        destination: "/pakistan-dmc/tours/chitral",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/k2basecamp",
        destination: "/pakistan-dmc/tours/k2-basecamp-trek",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/k2-basecamp-trek",
        destination: "/pakistan-dmc/tours/k2-basecamp-trek",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/k2-base-camp",
        destination: "/pakistan-dmc/tours/k2-basecamp-trek",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/tours/k2basecamp",
        destination: "/pakistan-dmc/tours/k2-basecamp-trek",
        permanent: true,
      },
      {
        source: "/pakistan-dmc/tours/k2-base-camp",
        destination: "/pakistan-dmc/tours/k2-basecamp-trek",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
