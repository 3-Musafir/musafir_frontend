import Head from "next/head";

import KalashFestivalDmcPage from "@/components/dmc/KalashFestivalDmcPage";
import {
  kalashFestivalDescription,
  kalashFestivalFaqs,
  kalashFestivalSummaryItinerary,
  kalashFestivalTitle,
} from "@/components/dmc/kalashFestivalContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const pagePath = "/pakistan-dmc/special-interests/kalash-festival-2027";
const pageUrl = `${siteUrl}${pagePath}`;
const orgId = `${siteUrl}#organization`;
const travelAgencyId = `${siteUrl}#travelagency`;
const ogImage = `${siteUrl}/communityimage14.jpg`;

const pruneJsonLd = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(pruneJsonLd).filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, pruneJsonLd(item)] as const)
      .filter(([, item]) => item !== undefined);

    return Object.fromEntries(entries);
  }

  return value === undefined ? undefined : value;
};

const kalashFestivalJsonLd = pruneJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: kalashFestivalTitle,
      description: kalashFestivalDescription,
      inLanguage: "en-PK",
      isPartOf: {
        "@id": `${siteUrl}#website`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
      },
      about: [
        "Kalash Festival 2027",
        "Kalash Chilam Joshi Festival",
        "Chitral DMC",
        "Kalash Valley cultural tours",
        "Pakistan DMC",
        "Pakistan inbound tour operator",
        "Responsible cultural travel in Pakistan",
        "Foreign travel agency support in Pakistan",
      ],
    },
    {
      "@type": "TravelAgency",
      "@id": travelAgencyId,
      name: "3Musafir",
      alternateName: "Teen Musafir",
      url: siteUrl,
      description:
        "Pakistan-based travel company offering community-led group tours, women-first travel experiences, customized trips, international group trips, and inbound DMC services.",
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#kalash-festival-dmc-services`,
      name: "Kalash Festival 2027 DMC and Chitral cultural tour logistics",
      serviceType:
        "Kalash Festival DMC, Chitral DMC, Kalash Valley cultural travel, heritage stays, local guides, transport planning, responsible cultural access, and group logistics",
      provider: {
        "@id": orgId,
      },
      areaServed: [
        { "@type": "Place", name: "Chitral" },
        { "@type": "Place", name: "Kalash Valleys" },
        { "@type": "Place", name: "Bumburet" },
        { "@type": "Place", name: "Rumbur" },
        { "@type": "Place", name: "Ayun" },
        { "@type": "AdministrativeArea", name: "Khyber Pakhtunkhwa" },
        { "@type": "Place", name: "Northern Pakistan" },
      ],
      audience: {
        "@type": "Audience",
        audienceType:
          "Foreign travel agencies, festival tour operators, cultural travel companies, heritage travel groups, educational travel programs, responsible tourism groups, photography groups, and private international groups",
      },
      category: [
        "Kalash Festival 2027",
        "Chitral DMC",
        "Kalash Valley tours",
        "Pakistan DMC",
        "Pakistan inbound tour operator",
        "Northern Pakistan cultural tours",
      ],
      description:
        "Local execution support for Kalash Festival 2027 itineraries in Chitral and the Kalash Valleys, including hotels, transport, local guides, responsible cultural access, heritage stays, festival timing coordination, route planning, and contingency-aware on-ground logistics.",
    },
    {
      "@type": "TouristTrip",
      "@id": `${pageUrl}#kalash-festival-2027-itinerary`,
      name: "Kalash Festival 2027 DMC Itinerary",
      description:
        "A 10-day Kalash Festival 2027 itinerary for foreign travel agencies that need Pakistan ground handling, responsible cultural access, heritage stays, local guides, and group travel execution in Chitral and the Kalash Valleys.",
      provider: {
        "@id": travelAgencyId,
      },
      touristType: [
        "Foreign travel agencies",
        "Cultural travel companies",
        "Festival tour operators",
        "Heritage travel groups",
        "Educational travel programs",
        "Photography groups",
        "Responsible tourism groups",
        "Private international groups",
      ],
      itinerary: {
        "@type": "ItemList",
        itemListElement: kalashFestivalSummaryItinerary.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${item.day}: ${item.route}`,
          description: item.focus,
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: kalashFestivalFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pakistan DMC",
          item: `${siteUrl}/pakistan-dmc`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Kalash Festival 2027",
          item: pageUrl,
        },
      ],
    },
  ],
});

export default function KalashFestivalDmcRoute() {
  return (
    <>
      <Head>
        <title>{kalashFestivalTitle}</title>
        <meta name="description" content={kalashFestivalDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={kalashFestivalTitle} />
        <meta property="og:description" content={kalashFestivalDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <script
          key="kalash-festival-dmc-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(kalashFestivalJsonLd),
          }}
        />
      </Head>
      <KalashFestivalDmcPage />
    </>
  );
}
