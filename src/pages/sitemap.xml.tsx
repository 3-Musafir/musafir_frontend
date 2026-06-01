import type { GetServerSideProps } from "next";

import { specialInterestFestivalRoutes } from "@/components/dmc/specialInterestFestivalContent";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(
  /\/$/,
  ""
);

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "").replace(
  /\/$/,
  ""
);

const STATIC_ROUTES = [
  "/",
  "/fixed-departure",
  "/explore",
  "/reviews",
  "/why",
  "/about-3musafir",
  "/founderportfolio",
  "/founderportfolio/biography",
  "/trust",
  "/trust/verification",
  "/trust/vendor-onboarding",
  "/trust/travel-education",
  "/musafircommunityequityframework",

  // DMC pillar and child pages
  "/pakistan-dmc",
  "/pakistan-dmc/tours/hunza",
  "/pakistan-dmc/tours/skardu",
  "/pakistan-dmc/tours/chitral",
  "/pakistan-dmc/tours/k2-basecamp-trek",

  // Special interest pages
  ...specialInterestFestivalRoutes,
];

type FlagshipLite = { id?: string; _id?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const normalizeRoute = (route: string) => {
  if (!route) return "/";
  if (route === "/") return "/";
  const path = route.startsWith("/") ? route : `/${route}`;
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

const extractFlagshipIds = (payload: unknown): string[] => {
  if (!payload) return [];
  const list = Array.isArray(payload)
    ? payload
    : isRecord(payload)
      ? payload.data || payload.items || []
      : [];
  if (!Array.isArray(list)) return [];

  return list
    .map((item): string | undefined => {
      if (!isRecord(item)) return undefined;
      const flagship = item as FlagshipLite;
      return flagship.id || flagship._id;
    })
    .filter(Boolean) as string[];
};

const fetchFlagships = async (endpoint: string) => {
  if (!API_BASE) return [];

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { method: "GET" });
    if (!res.ok) return [];

    const data = await res.json();
    return extractFlagshipIds(data);
  } catch {
    return [];
  }
};

const priorityForRoute = (route: string) => {
  if (route === "/") return "1.0";
  if (route === "/fixed-departure") return "0.9";
  if (route === "/pakistan-dmc") return "0.95";
  if (route.startsWith("/pakistan-dmc/")) return "0.85";
  if (["/explore", "/reviews", "/why", "/trust"].includes(route)) return "0.85";
  return "0.60";
};

const changeFreqForRoute = (route: string) => {
  if (route === "/" || route === "/fixed-departure" || route === "/explore") return "weekly";
  if (route.startsWith("/pakistan-dmc")) return "weekly";
  return "monthly";
};

const buildSiteMap = (dynamicRoutes: string[]) => {
  const allRoutes = Array.from(
    new Set([...STATIC_ROUTES, ...dynamicRoutes].map(normalizeRoute))
  );

  const urls = allRoutes
    .map((route) => {
      const loc = `${SITE_URL}${route === "/" ? "" : route}`;

      return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>${changeFreqForRoute(route)}</changefreq>
    <priority>${priorityForRoute(route)}</priority>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const [upcoming, live] = await Promise.all([
    fetchFlagships("/flagship/upcoming-trips"),
    fetchFlagships("/flagship/live-trips"),
  ]);

  const uniqueIds = Array.from(new Set([...upcoming, ...live]));

  // Keep only if these pages are public, indexable, and return 200.
  const dynamicRoutes = uniqueIds.map((id) => `/flagship/details?id=${encodeURIComponent(id)}`);

  const sitemap = buildSiteMap(dynamicRoutes);

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {
  return null;
}
