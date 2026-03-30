import Head from "next/head";
import ReviewFeed from "@/components/ReviewFeed";
import { REVIEWS } from "@/data/reviews";

export default function ReviewsPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const title = "3Musafir Reviews 2026 | Verified Women-Friendly Group Travel Experiences";
  const description =
    "Read verified 3Musafir reviews from community-led trips across Pakistan, including Hunza Valley, Skardu, Shigar Valley, Fairy Meadows, and K2 Base Camp.";
  const canonicalUrl = `${siteUrl}/reviews`;
  const normalizeRating = (intensityScore: number) =>
    Math.min(5, Math.max(1, Number((1 + intensityScore * 4).toFixed(1))));
  const averageRating =
    REVIEWS.length > 0
      ? (REVIEWS.reduce((acc, review) => acc + normalizeRating(review.intensityScore), 0) / REVIEWS.length).toFixed(1)
      : "5.0";
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
      "@type": "Organization",
      name: "3Musafir",
      url: siteUrl,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating,
        ratingCount: REVIEWS.length || 1,
        bestRating: 5,
      },
      review: REVIEWS.slice(0, 5).map((review) => ({
        "@type": "Review",
        reviewBody: review.quote,
        reviewRating: {
          "@type": "Rating",
          ratingValue: normalizeRating(review.intensityScore),
          bestRating: 5,
        },
        author: {
          "@type": "Person",
          name: review.name || "Musafir",
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
        <meta
          name="keywords"
          content="3Musafir reviews, women friendly travel Pakistan, Hunza Valley group trip reviews, Skardu travel reviews, Fairy Meadows trip reviews"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <ReviewFeed />
    </>
  );
}
