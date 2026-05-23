import "@/styles/globals.css";
import Head from "next/head";
import { DefaultSeo, OrganizationJsonLd } from "next-seo";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { contactPoints, defaultDescription, defaultTitle, logoUrl, sameAs, siteName, siteUrl as baseSiteUrl } from "@/lib/seo/seoConfig";
import { RecoilRoot } from "recoil";
import AlertContainer from "./alert";
import { Toaster } from "@/components/ui/toaster";
import { NotificationsProvider } from "@/context/NotificationsProvider";
import UserScreenShell from "@/components/UserScreenShell";
import ClarityTracker from "@/components/analytics/ClarityTracker";
import AnalyticsConsentBanner from "@/components/analytics/AnalyticsConsentBanner";

const DEFAULT_DESCRIPTION = defaultDescription;
const DEFAULT_OG_IMAGE = "/3mwinterlogo.png";

const SEO_MAP: Record<
  string,
  { title: string; description: string; ogImage?: string }
> = {
  "/": {
    title: "3Musafir | Pakistan Group Tours, Women-First Travel & DMC Services",
    description:
      "3Musafir is a Pakistan-based travel company offering community-led group tours, women-first travel experiences, customized trips, international group trips, and inbound DMC services.",
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
    title: "3Musafir Reviews — Community travel stories and trust signals",
    description:
      "Read community-sourced 3Musafir testimonials about solo travel, safety, first-time group trips, and the people behind each journey.",
    ogImage: "/sc.png",
  },
  "/pakistan-dmc": {
    title: "Pakistan DMC for International Travel Agencies | 3Musafir",
    description:
      "Pakistan DMC for international agencies. 3Musafir manages inbound tours, MICE, retreats, hotel contracting, transport, and on-ground logistics across Pakistan.",
    ogImage: "/3musafir-founders.jpg",
  },
  "/pakistan-dmc/tours/hunza": {
    title: "Hunza DMC | 10-Day Northern Pakistan Group Tour Itinerary | 3Musafir",
    description:
      "3Musafir is a Pakistan DMC and inbound tour operator offering 10-day Hunza Valley group tours for foreign travel agencies, including hotels, transport, guides, cultural experiences, and on-ground logistics across Northern Pakistan.",
    ogImage: "/communityimage14.jpg",
  },
  "/pakistan-dmc/tours/skardu": {
    title: "Skardu DMC | 10-Day Northern Pakistan Group Tour Itinerary | 3Musafir",
    description:
      "3Musafir is a Pakistan DMC and inbound tour operator offering 10-day Skardu Valley group tours for foreign travel agencies, including hotels, transport, guides, cultural experiences, Deosai, Shigar, Khaplu, and on-ground logistics across Northern Pakistan.",
    ogImage: "/communityimage14.jpg",
  },
  "/pakistan-dmc/tours/chitral": {
    title: "Chitral DMC | 10-Day Kalash Valley & Heritage Tour Itinerary | 3Musafir",
    description:
      "3Musafir is a Pakistan DMC offering immersive Chitral and Kalash Valley itineraries for foreign travel agencies, including Bumburet, Rumbur, Ayun, heritage stays, cultural experiences, transport, guides, and on-ground logistics.",
    ogImage: "/communityimage14.jpg",
  },
  "/pakistan-dmc/tours/k2-basecamp-trek": {
    title: "K2 Base Camp DMC Pakistan | Expedition Logistics & Ground Handling | 3Musafir",
    description:
      "3Musafir supports international travel agencies with K2 Base Camp expedition logistics in Pakistan, including permits, hotels, transport, guides, porters, meals, equipment coordination, and on-ground field execution.",
    ogImage: "/communityimage14.jpg",
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
  if (path === "/") return defaultTitle;
  const clean = path.replace(/\/+/g, " ").trim();
  if (!clean) return defaultTitle;
  return `3Musafir — ${titleCase(clean)}`;
};

const matchesRoutePrefix = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

const appRoutePrefixes = [
  "/admin",
  "/dashboard",
  "/home",
  "/passport",
  "/wallet",
  "/referrals",
  "/notifications",
  "/userSettings",
  "/musafir",
  "/flagship/create",
  "/flagship/payment",
  "/flagship/seats",
];

const authenticatedStandaloneRoutes = [
  "/change-password",
  "/feedback",
  "/verification",
  "/flagship/flagship-requirement",
  "/flagship/flagshipRequirement-dark",
];

const authStandaloneRoutes = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/unauthorized",
  "/auth-callback",
];

const authStandalonePrefixes = ["/signup", "/signup-dark", "/musafir-signup"];

const publicStandaloneRoutes = ["/flagship/details"];

const noindexRoutes = [
  "/auth-callback",
  "/change-password",
  "/feedback",
  "/forgot-password",
  "/launch",
  "/login",
  "/reset-password",
  "/unauthorized",
  "/vendor-onboarding",
  "/verification",
  "/flagship/flagship-requirement",
  "/flagship/flagshipRequirement-dark",
];

const noindexRoutePrefixes = [
  "/admin",
  "/dashboard",
  "/flagship/create",
  "/flagship/payment",
  "/flagship/seats",
  "/home",
  "/musafir",
  "/musafir-signup",
  "/notifications",
  "/passport",
  "/referrals",
  "/signup",
  "/signup-dark",
  "/userSettings",
  "/wallet",
];

const publicShellRoutes = [
  "/about-3musafir",
  "/community/voices",
  "/explore",
  "/musafircommunityequityframework",
  "/refundpolicyby3musafir",
  "/reviews",
  "/terms&conditonsby3musafir",
  "/trust-and-verification",
  "/vendor-onboarding",
  "/why",
];

const publicShellPrefixes = ["/alert", "/founderportfolio", "/launch", "/trust"];

const usesStandaloneLayout = (pathname: string) =>
  pathname === "/" ||
  appRoutePrefixes.some((prefix) => matchesRoutePrefix(pathname, prefix)) ||
  authenticatedStandaloneRoutes.includes(pathname) ||
  authStandaloneRoutes.includes(pathname) ||
  authStandalonePrefixes.some((prefix) => matchesRoutePrefix(pathname, prefix)) ||
  publicStandaloneRoutes.includes(pathname);

const usesPublicShell = (pathname: string) =>
  publicShellRoutes.includes(pathname) ||
  publicShellPrefixes.some((prefix) => matchesRoutePrefix(pathname, prefix));

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const useUserShell = useMemo(() => {
    const pathname = router.pathname || "";
    return usesPublicShell(pathname) && !usesStandaloneLayout(pathname);
  }, [router.pathname]);

  const siteUrl = baseSiteUrl;
  const rawPath = (router.asPath || "/").split("?")[0].split("#")[0] || "/";
  const normalizedPath =
    rawPath !== "/" && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
  const canonicalUrl = `${siteUrl}${normalizedPath === "/" ? "" : normalizedPath}`;

  const matchedSeo = SEO_MAP[normalizedPath];
  const title = matchedSeo?.title || buildFallbackTitle(normalizedPath);
  const description = matchedSeo?.description || DEFAULT_DESCRIPTION;
  const ogImagePath = matchedSeo?.ogImage || DEFAULT_OG_IMAGE;
  const ogImage = `${siteUrl}${ogImagePath.startsWith("/") ? "" : "/"}${ogImagePath}`;
  const shouldNoindex =
    noindexRoutes.includes(normalizedPath) ||
    noindexRoutePrefixes.some((prefix) => matchesRoutePrefix(normalizedPath, prefix));

  return (
    <>
      <DefaultSeo
        title={title}
        defaultTitle={defaultTitle}
        description={description}
        canonical={canonicalUrl}
        noindex={shouldNoindex}
        nofollow={false}
        openGraph={{
          type: "website",
          url: canonicalUrl,
          title,
          description,
          site_name: siteName,
          locale: "en_PK",
          images: [
            {
              url: ogImage,
              alt: title,
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
        additionalLinkTags={[
          { rel: "alternate", hrefLang: "en-PK", href: canonicalUrl },
          { rel: "alternate", hrefLang: "x-default", href: canonicalUrl },
        ]}
      />
      <OrganizationJsonLd
        type="Organization"
        id={`${siteUrl}#organization`}
        name={siteName}
        alternateName="Teen Musafir"
        url={siteUrl}
        logo={logoUrl}
        contactPoint={contactPoints}
        sameAs={sameAs}
        description={DEFAULT_DESCRIPTION}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteUrl}#website`,
              url: siteUrl,
              name: siteName,
              description: DEFAULT_DESCRIPTION,
            }),
          }}
        />
      </Head>
      <SessionProvider
        session={pageProps.session}
        refetchOnWindowFocus={true}
        refetchInterval={5 * 60}
      >
        <ClarityTracker />
        <AnalyticsConsentBanner />
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
  );
}
