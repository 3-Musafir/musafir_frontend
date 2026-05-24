import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

import SpecialInterestFestivalPage from "@/components/dmc/SpecialInterestFestivalPage";
import {
  getSpecialInterestFestival,
  specialInterestFestivals,
  type SpecialInterestFestival,
} from "@/components/dmc/specialInterestFestivalContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const ogImage = `${siteUrl}/communityimage14.jpg`;
const orgId = `${siteUrl}#organization`;
const travelAgencyId = `${siteUrl}#travelagency`;

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

const buildFestivalJsonLd = (festival: SpecialInterestFestival) => {
  const pagePath = `/pakistan-dmc/special-interests/${festival.slug}`;
  const pageUrl = `${siteUrl}${pagePath}`;

  return pruneJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: festival.seoTitle,
        description: festival.metaDescription,
        inLanguage: "en-PK",
        isPartOf: {
          "@id": `${siteUrl}#website`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: ogImage,
        },
        about: [
          festival.name,
          "Festivals of Pakistan",
          "Pakistan DMC",
          "Pakistan inbound tour operator",
          "Special interest travel in Pakistan",
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
        "@id": `${pageUrl}#festival-dmc-services`,
        name: `${festival.name} DMC logistics`,
        serviceType:
          "Pakistan festival DMC, special-interest travel, local guides, hotel coordination, private transport, festival timing coordination, responsible cultural access, and on-ground group logistics",
        provider: {
          "@id": orgId,
        },
        areaServed: [
          { "@type": "Country", name: "Pakistan" },
          { "@type": "Place", name: festival.region },
        ],
        audience: {
          "@type": "Audience",
          audienceType:
            "Foreign travel agencies, festival tour operators, cultural travel companies, sports tourism groups, photography groups, educational travel programs, and private international groups",
        },
        category: [
          "Pakistan DMC",
          "Festivals of Pakistan",
          "Special interest travel",
          "Pakistan inbound tour operator",
        ],
        description: festival.metaDescription,
      },
      {
        "@type": "TouristTrip",
        "@id": `${pageUrl}#itinerary`,
        name: festival.name,
        description: festival.positioning,
        provider: {
          "@id": travelAgencyId,
        },
        touristType: [
          "Foreign travel agencies",
          "Festival tour operators",
          "Cultural travel companies",
          "Sports tourism groups",
          "Photography groups",
          "Responsible tourism groups",
          "Private international groups",
        ],
        itinerary: {
          "@type": "ItemList",
          itemListElement: festival.itinerary.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.day,
            description: item.plan,
          })),
        },
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
            name: "Festivals of Pakistan",
            item: `${siteUrl}/pakistan-dmc/special-interests/festivals-of-pakistan`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: festival.name,
            item: pageUrl,
          },
        ],
      },
    ],
  });
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: specialInterestFestivals.map((festival) => ({
    params: { slug: festival.slug },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{
  festival: SpecialInterestFestival;
}> = ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const festival = getSpecialInterestFestival(slug);

  if (!festival) {
    return { notFound: true };
  }

  return {
    props: {
      festival,
    },
  };
};

export default function SpecialInterestFestivalRoute({
  festival,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const pageUrl = `${siteUrl}/pakistan-dmc/special-interests/${festival.slug}`;
  const jsonLd = buildFestivalJsonLd(festival);

  return (
    <>
      <Head>
        <title>{festival.seoTitle}</title>
        <meta name="description" content={festival.metaDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={festival.seoTitle} />
        <meta property="og:description" content={festival.metaDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <script
          key={`${festival.slug}-jsonld`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <SpecialInterestFestivalPage festival={festival} />
    </>
  );
}
