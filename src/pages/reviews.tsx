import Head from "next/head";
import ReviewFeed from "@/components/ReviewFeed";
import { REVIEWS } from "@/data/reviews";

export default function ReviewsPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const title = "Musafir Reviews — Real travel experiences";
  const description =
    "Read honest, community-sourced reviews from Musafirs about their first group travel experiences.";
  const canonicalUrl = `${siteUrl}/reviews`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "3Musafir reviews",
      itemListElement: REVIEWS.slice(0, 8).map((review, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Review",
          reviewBody: review.quote,
          datePublished: review.createdAt,
          author: {
            "@type": "Person",
            name: review.name || "Musafir",
          },
          itemReviewed: {
            "@type": "Organization",
            name: "3Musafir",
          },
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Explore",
          item: `${siteUrl}/explore`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Reviews",
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <ReviewFeed />
    </>
  );
}
