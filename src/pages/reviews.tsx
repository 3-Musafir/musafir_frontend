import Head from "next/head";
import Link from "next/link";
import ReviewFeed from "@/components/ReviewFeed";
import SeoHead from "@/components/seo/SeoHead";
import { PublicPageContainer } from "@/components/layout/PublicLayout";
import { REVIEWS } from "@/data/reviews";
import { buildCanonical } from "@/lib/seo/seoConfig";

const title = "3Musafir Reviews: Google Reviews, Traveler Stories & Trust Signals";
const description =
  "Read real 3Musafir reviews, traveler stories, Google review signals, Trustpilot profile, safety feedback, and post-trip experiences from Pakistan and international group trips.";

const trustSignalCards = [
  {
    title: "Google Business reviews",
    body: "Use Google Business review signals to cross-check recent traveler sentiment, location trust, response patterns, and public reputation outside the 3Musafir website.",
    href: "https://www.google.com/search?q=3Musafir+reviews",
    cta: "Search Google reviews",
  },
  {
    title: "Trustpilot profile",
    body: "Trustpilot can provide another third-party reputation checkpoint where profile data is available. Treat it as one signal alongside traveler stories and route-specific feedback.",
    href: "https://www.trustpilot.com/review/3musafir.com",
    cta: "Check Trustpilot",
  },
  {
    title: "Medium archive",
    body: "Long-form stories and founder notes help explain the thinking behind community-led travel, women-first trip design, and the operating culture behind 3Musafir.",
    href: "https://medium.com/search?q=3Musafir",
    cta: "Search Medium stories",
  },
  {
    title: "NIC Islamabad recognition",
    body: "Public startup ecosystem recognition is useful context when evaluating 3Musafir as a traveltech and community-first company operating from Pakistan.",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7461105834467467264?actorCompanyId=28727958",
    cta: "View NIC Islamabad backing",
  },
  {
    title: "Instagram field proof",
    body: "Instagram gives visual field proof of real groups, captains, destinations, culture, weather, and the kind of people who actually travel with 3Musafir.",
    href: "https://www.instagram.com/teen_musafir/",
    cta: "View Instagram",
  },
];

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
      <PublicPageContainer as="main" className="overflow-x-hidden bg-gray-50">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              3Musafir reviews
            </p>
            <h1 className="mt-3 max-w-4xl break-words text-3xl font-semibold leading-tight text-heading md:text-4xl">
              3Musafir reviews, traveler stories, and trust signals
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text md:text-base">
              Use this page to evaluate 3Musafir through traveler stories, community feedback,
              women traveler perspectives, post-trip experiences, and recurring themes from
              Pakistan and international group trips.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/explore" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Explore Pakistan group tours
              </Link>
              <Link href="/why" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Why travel with 3Musafir
              </Link>
              <Link href="/pakistan-dmc" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Pakistan DMC services
              </Link>
            </div>
          </section>

          <section
            aria-label="Third-party trust signals"
            className="flex max-w-full snap-x gap-4 overflow-x-auto overscroll-x-contain pb-2"
          >
            {trustSignalCards.map((item) => (
              <article
                key={item.title}
                className="flex min-h-[260px] w-[82vw] max-w-[390px] shrink-0 snap-start flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-heading">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text">{item.body}</p>
                {item.href && item.cta ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex pt-4 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover"
                  >
                    {item.cta}
                  </a>
                ) : null}
              </article>
            ))}
          </section>

          <ReviewFeed />
        </div>
      </PublicPageContainer>
    </>
  );
}
