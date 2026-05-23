import Head from "next/head";

import ChitralDmcPage from "@/components/dmc/ChitralDmcPage";
import {
  chitralDmcDescription,
  chitralDmcTitle,
  chitralFaqs,
  chitralSummaryItinerary,
} from "@/components/dmc/chitralDmcContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const pagePath = "/pakistan-dmc/tours/chitral";
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

const chitralJsonLd = pruneJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: chitralDmcTitle,
      description: chitralDmcDescription,
      inLanguage: "en-PK",
      isPartOf: {
        "@id": `${siteUrl}#website`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
      },
      about: [
        "Chitral DMC",
        "Kalash Valley tours",
        "Chitral cultural tours",
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
      "@id": `${pageUrl}#chitral-dmc-services`,
      name: "Chitral DMC and Kalash Valley cultural tour logistics",
      serviceType:
        "Chitral DMC, Kalash Valley cultural travel, heritage stays, local guides, transport planning, responsible cultural access, and group logistics",
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
          "Foreign travel agencies, cultural travel companies, heritage tour operators, educational travel groups, responsible tourism groups, private groups, and corporate retreats",
      },
      category: [
        "Chitral DMC",
        "Kalash Valley tours",
        "Pakistan DMC",
        "Pakistan inbound tour operator",
        "Northern Pakistan cultural tours",
      ],
      description:
        "Local execution support for 10-day Chitral and Kalash Valley cultural programs in Northern Pakistan, including hotels, transport, local guides, responsible cultural access, heritage stays, route planning, and contingency-aware on-ground logistics.",
    },
    {
      "@type": "TouristTrip",
      "@id": `${pageUrl}#chitral-10-day-itinerary`,
      name: "10-Day Chitral and Kalash Valley DMC Itinerary",
      description:
        "A 10-day Chitral and Kalash Valley itinerary for foreign travel agencies that need Pakistan ground handling, heritage access, responsible cultural immersion, and group travel execution.",
      provider: {
        "@id": travelAgencyId,
      },
      touristType: [
        "Foreign travel agencies",
        "Cultural travel companies",
        "Heritage tour operators",
        "Educational travel groups",
        "Photography groups",
        "Responsible tourism groups",
        "Corporate leadership retreats",
      ],
      itinerary: {
        "@type": "ItemList",
        itemListElement: chitralSummaryItinerary.map((item, index) => ({
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
      mainEntity: chitralFaqs.map((faq) => ({
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
          name: "Chitral",
          item: pageUrl,
        },
      ],
    },
  ],
});

export default function ChitralDmcRoute() {
  return (
    <>
      <Head>
        <script
          key="chitral-dmc-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(chitralJsonLd),
          }}
        />
      </Head>
      <ChitralDmcPage />
    </>
  );
}
