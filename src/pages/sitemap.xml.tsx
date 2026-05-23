import type { GetServerSideProps } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(
  /\/$/,
  ""
);
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "").replace(
  /\/$/,
  ""
);

const ROUTES = [
  "/",
  "/explore",
  "/reviews",
  "/pakistan-dmc",
  "/pakistan-dmc/tours/hunza",
  "/pakistan-dmc/tours/skardu",
  "/pakistan-dmc/tours/k2basecamp",
  "/why",
  "/about-3musafir",
  "/founderportfolio",
  "/founderportfolio/biography",
  "/trust",
  "/trust/verification",
  "/trust/vendor-onboarding",
  "/trust/travel-education",
  "/community/voices",
  "/trust-and-verification",
  "/refundpolicyby3musafir",
  "/musafircommunityequityframework",
  "/terms&conditonsby3musafir",
];

type FlagshipLite = { id?: string; _id?: string };

const escapeXml = (value: string) => value.replace(/&/g, "&amp;");

const extractFlagshipIds = (payload: any): string[] => {
  if (!payload) return [];
  const list = Array.isArray(payload) ? payload : payload?.data || payload?.items || [];
  if (!Array.isArray(list)) return [];
  return list
    .map((item: FlagshipLite) => item?.id || item?._id)
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

const buildSiteMap = (dynamicRoutes: string[]) => {
  const allRoutes = [...ROUTES, ...dynamicRoutes];
  const urls = allRoutes.map((route) => {
    const loc = `${SITE_URL}${route === "/" ? "" : route}`;
    return `<url><loc>${escapeXml(loc)}</loc></url>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const [upcoming, live, past] = await Promise.all([
    fetchFlagships("/flagship/upcoming-trips"),
    fetchFlagships("/flagship/live-trips"),
    fetchFlagships("/flagship/past-trips"),
  ]);
  const uniqueIds = Array.from(new Set([...upcoming, ...live, ...past]));
  const dynamicRoutes = uniqueIds.map((id) => `/flagship/details?id=${id}`);
  const sitemap = buildSiteMap(dynamicRoutes);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {
  return null;
}
