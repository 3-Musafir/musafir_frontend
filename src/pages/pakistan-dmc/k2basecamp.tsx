import Head from "next/head";

import K2BaseCampDmcPage from "@/components/dmc/K2BaseCampDmcPage";
import {
  k2DmcDescription,
  k2DmcTitle,
  k2Faqs,
} from "@/components/dmc/k2BasecampContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const pagePath = "/pakistan-dmc/k2basecamp";
const pageUrl = `${siteUrl}${pagePath}`;
const orgId = `${siteUrl}#organization`;
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

const k2JsonLd = pruneJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: k2DmcTitle,
      description: k2DmcDescription,
      inLanguage: "en-PK",
      isPartOf: {
        "@id": `${siteUrl}#website`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
      },
      about: [
        "K2 Base Camp DMC Pakistan",
        "K2 Base Camp expedition logistics",
        "Pakistan inbound adventure operator",
        "Baltoro Glacier trekking logistics",
        "Concordia trekking expedition Pakistan",
        "Adventure DMC Pakistan",
        "Trekking DMC Pakistan",
      ],
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#k2-base-camp-expedition-logistics`,
      name: "K2 Base Camp DMC Pakistan and expedition ground handling",
      serviceType: "K2 Base Camp DMC, expedition logistics, and ground operator services",
      provider: {
        "@id": orgId,
      },
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "International travel agencies, expedition companies, adventure tour operators, and private international groups",
      },
      category: [
        "Pakistan DMC",
        "K2 Base Camp ground operator",
        "K2 Base Camp tour operator Pakistan",
        "Trekking DMC Pakistan",
        "Adventure DMC Pakistan",
        "Baltoro Glacier trekking logistics",
        "Pakistan inbound adventure operator",
      ],
      description:
        "Local execution support for K2 Base Camp expedition programs in Pakistan, including hotels, domestic transport, permits, guides, porters, meals, camping logistics, equipment coordination, and contingency planning.",
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: k2Faqs.map((faq) => ({
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
          name: "K2 Base Camp",
          item: pageUrl,
        },
      ],
    },
  ],
});

export default function K2BaseCampDmcRoute() {
  return (
    <>
      <Head>
        <script
          key="k2-basecamp-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(k2JsonLd),
          }}
        />
      </Head>
      <K2BaseCampDmcPage />
    </>
  );
}
