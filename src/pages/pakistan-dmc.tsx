import Head from "next/head";

import DmcLandingPage from "@/components/dmc/DmcLandingPage";
import { dmcDescription, dmcFaqs, dmcTitle } from "@/components/dmc/dmcContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const configuredSiteUrl = siteUrl;
const absoluteUrl = (path: string) =>
  configuredSiteUrl ? `${configuredSiteUrl}${path === "/" ? "" : path}` : undefined;

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

const pageUrl = absoluteUrl("/pakistan-dmc");
const orgId = configuredSiteUrl ? `${configuredSiteUrl}#organization` : undefined;
const dmcId = pageUrl ? `${pageUrl}#travelagency` : undefined;
const provider = orgId ? { "@id": orgId } : { name: "3Musafir" };

const dmcJsonLd = pruneJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: "3Musafir",
      legalName: "3Musafir Travels (Pvt) Ltd.",
      url: configuredSiteUrl || undefined,
      logo: absoluteUrl("/3mlogosmall.svg"),
    },
    {
      "@type": "TravelAgency",
      "@id": dmcId,
      name: "3Musafir Travels",
      description: dmcDescription,
      url: pageUrl,
      image: absoluteUrl("/3musafir-founders.jpg"),
      parentOrganization: provider,
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
      audience: {
        "@type": "Audience",
        audienceType: "International travel agencies and tour operator partners",
      },
      knowsAbout: [
        "Pakistan DMC",
        "Destination management company in Pakistan",
        "Pakistan inbound tours",
        "Pakistan ground handling",
        "Pakistan MICE",
        "Corporate retreats in Pakistan",
        "Hotel contracting in Pakistan",
        "Transport logistics in Pakistan",
      ],
    },
    {
      "@type": "Service",
      "@id": pageUrl ? `${pageUrl}#destination-management-services` : undefined,
      name: "Pakistan destination management services",
      serviceType: "Destination management services",
      provider,
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
      audience: {
        "@type": "Audience",
        audienceType: "International travel agencies",
      },
      description:
        "Inbound tours, group logistics, route planning, guides, vendor coordination, and on-ground execution for overseas agency partners.",
    },
    {
      "@type": "Service",
      "@id": pageUrl ? `${pageUrl}#mice-corporate-retreats` : undefined,
      name: "Pakistan MICE and corporate retreat services",
      serviceType: "MICE and corporate retreat services",
      provider,
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
      audience: {
        "@type": "Audience",
        audienceType: "International travel agencies and corporate group planners",
      },
      description:
        "Venue sourcing, hotel coordination, airport transfers, executive transport, group movement, dispatch coordination, and on-ground support where operationally available.",
    },
    {
      "@type": "Service",
      "@id": pageUrl ? `${pageUrl}#hotel-transport-logistics` : undefined,
      name: "Pakistan hotel contracting and transport logistics",
      serviceType: "Hotel contracting and transport logistics",
      provider,
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
      audience: {
        "@type": "Audience",
        audienceType: "International travel agencies",
      },
      description:
        "Hotel sourcing, group rooming, transport planning, fleet allocation, and route management for inbound groups.",
    },
    {
      "@type": "FAQPage",
      "@id": pageUrl ? `${pageUrl}#faq` : undefined,
      mainEntity: dmcFaqs.map((faq) => ({
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
      "@id": pageUrl ? `${pageUrl}#breadcrumb` : undefined,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "DMC",
          item: pageUrl,
        },
      ],
    },
  ],
});

export default function DmcPage() {
  return (
    <>
      <Head>
        <title>{dmcTitle}</title>
        <meta name="description" content={dmcDescription} />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dmcJsonLd),
          }}
        />
      </Head>
      <DmcLandingPage />
    </>
  );
}
