import "@/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { RecoilRoot } from "recoil";
import AlertContainer from "./alert";
import { Toaster } from "@/components/ui/toaster";
import { NotificationsProvider } from "@/context/NotificationsProvider";
import UserScreenShell from "@/components/UserScreenShell";

const DEFAULT_DESCRIPTION =
  "3Musafir is a community-led travel platform focused on safety, trust, and meaningful group journeys across Pakistan and beyond.";
const DEFAULT_OG_IMAGE = "/3mwinterlogo.png";

const SEO_MAP: Record<
  string,
  { title: string; description: string; ogImage?: string }
> = {
  "/": {
    title: "3Musafir — Community-led travel in Pakistan",
    description:
      "3Musafir is a community-first travel platform focused on safety, trust, and meaningful group journeys for women in Pakistan.",
    ogImage: "/flowerFields.jpg",
  },
  "/home": {
    title: "3Musafir Home — Upcoming journeys",
    description:
      "Explore upcoming flagship journeys and community-led group travel experiences with 3Musafir.",
    ogImage: "/norwayUpcomming.jpg",
  },
  "/explore": {
    title: "Explore 3Musafir — Community-led travel in Pakistan",
    description:
      "Discover how 3Musafir designs travel around people, shared values, and safe group experiences for women in Pakistan.",
    ogImage: "/murree.webp",
  },
  "/reviews": {
    title: "Musafir Reviews — Real travel experiences",
    description:
      "Read honest, community-sourced reviews from Musafirs about their first group travel experiences.",
    ogImage: "/sc.png",
  },
  "/why": {
    title: "Why 3Musafir Exists — Safer travel for women in Pakistan",
    description:
      "Learn why 3Musafir was created to make group travel safer, more comfortable, and more human for women in Pakistan.",
    ogImage: "/blue-shield.png",
  },
  "/trust-and-verification": {
    title: "Trust & Verification — 3Musafir safety framework",
    description:
      "See how 3Musafir builds trust and verification systems to make group travel safer for women in Pakistan.",
    ogImage: "/star_shield.png",
  },
  "/refundpolicyby3musafir": {
    title: "Refund & Cancellation Policy — 3Musafir",
    description:
      "Understand 3Musafir’s trip cancellation, refund, wallet credit, and transfer policies.",
    ogImage: "/payments-cover.png",
  },
  "/musafircommunityequityframework": {
    title: "Community Equity Framework — 3Musafir",
    description:
      "Read the Musafir Community Equity Framework covering inclusivity, safety, and accountability.",
    ogImage: "/globe.svg",
  },
  "/terms&conditonsby3musafir": {
    title: "Terms and Conditions — 3Musafir",
    description:
      "Review the terms and conditions governing 3Musafir trips and services.",
    ogImage: "/window.svg",
  },
  "/login": {
    title: "Sign in — 3Musafir",
    description: "Access your 3Musafir account and manage upcoming journeys.",
    ogImage: "/3mlogosmall.svg",
  },
  "/signup/create-account": {
    title: "Create account — 3Musafir",
    description: "Join 3Musafir to access community-led group travel in Pakistan.",
    ogImage: "/3mlogosmall.svg",
  },
};

const titleCase = (value: string) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const buildFallbackTitle = (path: string) => {
  if (path === "/") return "3Musafir — Community-led travel in Pakistan";
  const clean = path.replace(/\/+/g, " ").trim();
  if (!clean) return "3Musafir — Community-led travel in Pakistan";
  return `3Musafir — ${titleCase(clean)}`;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const useUserShell = useMemo(() => {
    const pathname = router.pathname || "";
    const adminPrefixes = [
      "/admin",
      "/dashboard",
      "/flagship/create",
      "/flagship/payment",
    ];
    return !adminPrefixes.some((prefix) => pathname.startsWith(prefix));
  }, [router.pathname]);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const rawPath = (router.asPath || "/").split("?")[0].split("#")[0] || "/";
  const normalizedPath =
    rawPath !== "/" && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
  const canonicalUrl = `${siteUrl}${normalizedPath === "/" ? "" : normalizedPath}`;

  const matchedSeo = SEO_MAP[normalizedPath];
  const title = matchedSeo?.title || buildFallbackTitle(normalizedPath);
  const description = matchedSeo?.description || DEFAULT_DESCRIPTION;
  const ogImagePath = matchedSeo?.ogImage || DEFAULT_OG_IMAGE;
  const ogImage = `${siteUrl}${ogImagePath.startsWith("/") ? "" : "/"}${ogImagePath}`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "3Musafir",
      url: siteUrl,
      logo: `${siteUrl}/3mwinterlogo.png`,
      description: DEFAULT_DESCRIPTION,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonicalUrl,
      inLanguage: "en-PK",
    },
  ];

  return (
    <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} key="canonical" />
      <meta name="robots" content="index,follow" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="3Musafir" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_PK" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="3Musafir" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="alternate" hrefLang="en-PK" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
    <SessionProvider
      session={pageProps.session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      <RecoilRoot>
        <NotificationsProvider>
          {useUserShell ? (
            <UserScreenShell>
              <Component {...pageProps} />
            </UserScreenShell>
          ) : (
            <Component {...pageProps} />
          )}
        </NotificationsProvider>
        <AlertContainer />
        <Toaster />
      </RecoilRoot>
    </SessionProvider>

    </>
  ) 
}
