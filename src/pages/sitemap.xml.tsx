import type { GetServerSideProps } from "next";

import { INDEXABLE_PATHS, normalizeSeoPath } from "@/lib/seo/seoConfig";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(
  /\/$/,
  ""
);

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const priorityForRoute = (route: string) => {
  if (route === "/fixed-departure") return "0.9";
  if (route === "/pakistan-dmc") return "0.95";
  if (["/explore", "/reviews", "/why", "/trust", "/about-3musafir"].includes(route)) {
    return "0.85";
  }
  return "0.60";
};

const changeFreqForRoute = (route: string) => {
  if (route === "/fixed-departure" || route === "/explore" || route === "/pakistan-dmc") {
    return "weekly";
  }
  return "monthly";
};

const buildSiteMap = () => {
  const allRoutes = Array.from(new Set(INDEXABLE_PATHS.map(normalizeSeoPath)));

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
  const sitemap = buildSiteMap();

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
