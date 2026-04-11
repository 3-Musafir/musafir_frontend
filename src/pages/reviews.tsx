import Head from "next/head";
import ReviewFeed from "@/components/ReviewFeed";
import SeoHead from "@/components/seo/SeoHead";
import { REVIEWS } from "@/data/reviews";
import { buildCanonical } from "@/lib/seo/seoConfig";

const title = "3Musafir Reviews | Community travel stories and trust signals";
const description =
  "Read community-sourced 3Musafir testimonials about solo travel, safety, first-time group trips, and the people behind each journey.";

export default function ReviewsPage() {
  const canonicalUrl = buildCanonical("/reviews");
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Explore",
          item: buildCanonical("/explore"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Reviews",
          item: canonicalUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "3Musafir community testimonials",
      description:
        "A curated list of community-sourced post-trip testimonials and trip-linked reviews.",
      itemListElement: REVIEWS.slice(0, 12).map((review, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${canonicalUrl}#${review.id}`,
        name: review.sourceEvent || review.context,
        item: {
          "@type": "CreativeWork",
          headline: review.quote,
          description: review.story || review.quote,
          datePublished: review.sourceDate || review.createdAt,
          author: {
            "@type": "Person",
            name: review.name || "Musafir",
          },
          inLanguage:
            review.language === "mixed"
              ? "en-PK"
              : review.language === "ur"
                ? "ur-PK"
                : "en-PK",
        },
      })),
    },
  ];

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/reviews"
        ogImage="/sc.png"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <ReviewFeed />
    </>
  );
}
