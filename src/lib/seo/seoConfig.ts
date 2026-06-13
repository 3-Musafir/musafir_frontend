export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
export const siteName = "3Musafir";
export const defaultTitle = "3Musafir | Pakistan Group Tours, Women-First Travel & DMC";
export const defaultDescription =
  "3Musafir is a Pakistan-based travel company for verified community-led group tours, women-first travel experiences, customized journeys, international group trips, and inbound Pakistan DMC services.";
export const logoUrl = `${siteUrl}/primarylogo.svg`;

export const INDEXABLE_PATHS = [
  "/",
  "/fixed-departure",
  "/explore",
  "/reviews",
  "/why",
  "/hc",
  "/about-3musafir",
  "/founderportfolio",
  "/pakistan-dmc",
  "/login",
] as const;

const indexablePathSet = new Set<string>(INDEXABLE_PATHS);

export const normalizeSeoPath = (path: string) => {
  const cleanPath = (path || "/").split("?")[0].split("#")[0] || "/";
  if (cleanPath === "/") return "/";
  const withSlash = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
};

export const isIndexablePath = (path: string) =>
  indexablePathSet.has(normalizeSeoPath(path));

export const indexableRobotsContent =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

export const noindexRobotsContent = "noindex,follow";

export const robotsContentForPath = (path: string) =>
  isIndexablePath(path) ? indexableRobotsContent : noindexRobotsContent;

export const socialProfiles = [
  {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/teen_musafir/",
  },
  {
    label: "TikTok",
    href: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/@3musafir",
  },
  {
    label: "LinkedIn",
    href:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ||
      "https://www.linkedin.com/company/3musafirinternational/",
  },
  {
    label: "Google Business",
    href: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || "https://share.google/WMcHCZww0KImXq7B4",
  },
  {
    label: "Pinterest",
    href: process.env.NEXT_PUBLIC_PINTEREST_URL || "https://ie.pinterest.com/3musafiir/",
  },
  {
    label: "Substack",
    href: process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://3musafir.substack.com/",
  },
  {
    label: "Medium",
    href: process.env.NEXT_PUBLIC_MEDIUM_URL || "https://3musafir.medium.com/",
  },
  {
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/3Musafir",
  },
  {
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@3musafir",
  },
  {
    label: "Trustpilot",
    href: process.env.NEXT_PUBLIC_TRUSTPILOT_URL || "https://www.trustpilot.com/review/3musafir.com",
  },
].filter((profile) => Boolean(profile.href));

export const contactPoints = [
  {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@3musafir.com",
    telephone: "+923221848940",
    areaServed: "PK",
    availableLanguage: ["en", "ur"],
  },
];

export const sameAs: string[] = socialProfiles.map((profile) => profile.href);

export const buildCanonical = (path: string) => {
  const normalized = path && path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path || "/";
  return `${siteUrl}${normalized === "/" ? "" : normalized}`;
};

export const toAbsoluteUrl = (pathOrUrl?: string) => {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};
