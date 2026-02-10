export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
export const siteName = "3Musafir";
export const defaultTitle = "3Musafir — Community-led travel in Pakistan";
export const defaultDescription =
  "3Musafir is a community-led travel platform focused on safety, trust, and meaningful group journeys across Pakistan and internationally.";
export const logoUrl = `${siteUrl}/3mwinterlogo.png`;

// TODO: Replace placeholder contact details and social profiles before launch.
export const contactPoints = [
  {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@3musafir.com",
    areaServed: "PK",
    availableLanguage: ["en", "ur"],
  },
];

export const sameAs: string[] = [];

export const buildCanonical = (path: string) => {
  const normalized = path && path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path || "/";
  return `${siteUrl}${normalized === "/" ? "" : normalized}`;
};

export const toAbsoluteUrl = (pathOrUrl?: string) => {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};
