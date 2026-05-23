import Head from "next/head";

import SkarduDmcPage from "@/components/dmc/SkarduDmcPage";
import {
  skarduDmcDescription,
  skarduDmcTitle,
  skarduFaqs,
  skarduSummaryItinerary,
} from "@/components/dmc/skarduDmcContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const pagePath = "/pakistan-dmc/tours/skardu";
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

const skarduJsonLd = pruneJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: skarduDmcTitle,
      description: skarduDmcDescription,
      inLanguage: "en-PK",
      isPartOf: {
        "@id": `${siteUrl}#website`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
      },
      about: [
        "Skardu DMC",
        "Skardu Valley group tours",
        "Northern Pakistan group tours",
        "Pakistan DMC",
        "Pakistan inbound tour operator",
        "Gilgit-Baltistan itinerary",
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
      "@id": `${pageUrl}#skardu-dmc-services`,
      name: "Skardu DMC and 10-day Northern Pakistan group tour logistics",
      serviceType: "Skardu DMC, inbound tour operation, flight coordination, hotel coordination, transport planning, local guides, cultural experiences, and group logistics",
      provider: {
        "@id": orgId,
      },
      areaServed: [
        { "@type": "Place", name: "Skardu Valley" },
        { "@type": "AdministrativeArea", name: "Gilgit-Baltistan" },
        { "@type": "Place", name: "Northern Pakistan" },
      ],
      audience: {
        "@type": "Audience",
        audienceType:
          "Foreign travel agencies, inbound tour operators, cultural travel companies, private groups, corporate retreats, and MICE groups",
      },
      category: [
        "Skardu DMC",
        "Pakistan DMC",
        "Northern Pakistan group tours",
        "Pakistan inbound tour operator",
        "Skardu Valley itinerary",
      ],
      description:
        "Local execution support for 10-day Skardu Valley group tours in Northern Pakistan, including flights, hotels, road transport, local guides, cultural experiences, route planning, and contingency-aware on-ground logistics.",
    },
    {
      "@type": "TouristTrip",
      "@id": `${pageUrl}#skardu-10-day-itinerary`,
      name: "10-Day Skardu Valley DMC Itinerary",
      description:
        "A 10-day Skardu Valley itinerary for foreign travel agencies that need Pakistan ground handling, cultural depth, mountain landscapes, flight contingency planning, and group travel execution.",
      provider: {
        "@id": travelAgencyId,
      },
      touristType: [
        "Foreign travel agencies",
        "Inbound Pakistan group tours",
        "Cultural travel companies",
        "Soft adventure groups",
        "Photography groups",
        "Corporate retreats",
        "MICE groups",
      ],
      itinerary: {
        "@type": "ItemList",
        itemListElement: skarduSummaryItinerary.map((item, index) => ({
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
      mainEntity: skarduFaqs.map((faq) => ({
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
          name: "Skardu",
          item: pageUrl,
        },
      ],
    },
  ],
});

export default function SkarduDmcRoute() {
  return (
    <>
      <Head>
        <script
          key="skardu-dmc-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(skarduJsonLd),
          }}
        />
      </Head>
      <SkarduDmcPage />
    </>
  );
}
