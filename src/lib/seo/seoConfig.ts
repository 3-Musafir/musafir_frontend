export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
export const siteName = "3Musafir";
export const defaultTitle = "3Musafir | Pakistan Group Tours & Women-First Travel";
export const defaultDescription =
  "3Musafir is a Pakistan-based travel company offering community-led group tours, women-first travel experiences, customized trips, international group trips, and inbound DMC services for foreign travel agencies.";
export const logoUrl = `${siteUrl}/3mwinterlogo.png`;
const configuredProfiles = [
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/teen_musafir/",
  process.env.NEXT_PUBLIC_TIKTOK_URL,
  process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/company/3musafirinternational/",
  process.env.NEXT_PUBLIC_YOUTUBE_URL,
  process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || "https://share.google/WMcHCZww0KImXq7B4",
].filter(Boolean) as string[];

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

export const sameAs: string[] = configuredProfiles;

export const buildCanonical = (path: string) => {
  const normalized = path && path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path || "/";
  return `${siteUrl}${normalized === "/" ? "" : normalized}`;
};

export const toAbsoluteUrl = (pathOrUrl?: string) => {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};
