import Head from "next/head";

import HunzaDmcPage from "@/components/dmc/HunzaDmcPage";
import {
  hunzaDmcDescription,
  hunzaDmcTitle,
  hunzaFaqs,
  hunzaSummaryItinerary,
} from "@/components/dmc/hunzaDmcContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const pagePath = "/pakistan-dmc/tours/hunza";
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

const hunzaJsonLd = pruneJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: hunzaDmcTitle,
      description: hunzaDmcDescription,
      inLanguage: "en-PK",
      isPartOf: {
        "@id": `${siteUrl}#website`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
      },
      about: [
        "Hunza DMC",
        "Hunza Valley group tours",
        "Northern Pakistan group tours",
        "Pakistan DMC",
        "Pakistan inbound tour operator",
        "Karakoram Highway itinerary",
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
      "@id": `${pageUrl}#hunza-dmc-services`,
      name: "Hunza DMC and 10-day Northern Pakistan group tour logistics",
      serviceType: "Hunza DMC, inbound tour operation, hotel coordination, transport planning, local guides, cultural experiences, and group logistics",
      provider: {
        "@id": orgId,
      },
      areaServed: [
        { "@type": "Place", name: "Hunza Valley" },
        { "@type": "Place", name: "Northern Pakistan" },
        { "@type": "AdministrativeArea", name: "Gilgit-Baltistan" },
      ],
      audience: {
        "@type": "Audience",
        audienceType:
          "Foreign travel agencies, inbound tour operators, cultural travel companies, private groups, corporate retreats, and university travel groups",
      },
      category: [
        "Hunza DMC",
        "Pakistan DMC",
        "Northern Pakistan group tours",
        "Pakistan inbound tour operator",
        "Hunza Valley itinerary",
      ],
      description:
        "Local execution support for 10-day Hunza Valley group tours in Northern Pakistan, including hotels, road transport, local guides, cultural experiences, route planning, and contingency-aware on-ground logistics.",
    },
    {
      "@type": "TouristTrip",
      "@id": `${pageUrl}#hunza-10-day-itinerary`,
      name: "10-Day Hunza Valley DMC Itinerary",
      description:
        "A 10-day Hunza Valley itinerary for foreign travel agencies that need Pakistan ground handling, cultural depth, scenic Northern Pakistan routes, and group travel execution.",
      provider: {
        "@id": travelAgencyId,
      },
      touristType: [
        "Foreign travel agencies",
        "Inbound Pakistan group tours",
        "Cultural travel companies",
        "Photography groups",
        "Soft adventure groups",
        "Corporate retreats",
      ],
      itinerary: {
        "@type": "ItemList",
        itemListElement: hunzaSummaryItinerary.map((item, index) => ({
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
      mainEntity: hunzaFaqs.map((faq) => ({
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
          name: "Hunza",
          item: pageUrl,
        },
      ],
    },
  ],
});

export default function HunzaDmcRoute() {
  return (
    <>
      <Head>
        <script
          key="hunza-dmc-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(hunzaJsonLd),
          }}
        />
      </Head>
      <HunzaDmcPage />
    </>
  );
}
