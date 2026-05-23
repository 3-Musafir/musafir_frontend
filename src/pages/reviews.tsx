import Head from "next/head";
import Link from "next/link";
import ReviewFeed from "@/components/ReviewFeed";
import FaqSection from "@/components/seo/FaqSection";
import SeoHead from "@/components/seo/SeoHead";
import { REVIEWS } from "@/data/reviews";
import { buildCanonical } from "@/lib/seo/seoConfig";

const title = "3Musafir Reviews: Google Reviews, Traveler Stories & Trust Signals";
const description =
  "Read real 3Musafir reviews, traveler stories, community feedback, safety signals, and post-trip experiences from Pakistan and international group trips.";

const reviewFaqs = [
  {
    question: "Is 3Musafir legit?",
    answer:
      "3Musafir is a Pakistan-based travel company and community-led group travel platform. This reviews page helps travelers evaluate public reputation, traveler stories, safety signals, and post-trip feedback before joining a trip.",
  },
  {
    question: "Is 3Musafir safe for women?",
    answer:
      "3Musafir is designed around women-first travel considerations, group fit, clear expectations, and safety-aware coordination. Travelers should still review the itinerary, rooming expectations, route conditions, and their own comfort before booking.",
  },
  {
    question: "Are 3Musafir trips worth it?",
    answer:
      "Many travelers value 3Musafir for community, friendships, trip captains, access to remote destinations, and structured group travel. Fit depends on the route, travel style, budget, and expectations for shared group experiences.",
  },
  {
    question: "What do people say about 3Musafir?",
    answer:
      "Travelers often mention community, friendships, trip captains, safety, and access to remote destinations. Common improvement areas may include response times during peak season, itinerary changes due to mountain roads or weather, and room-sharing expectations.",
  },
  {
    question: "Does 3Musafir organize Pakistan group tours?",
    answer:
      "Yes. 3Musafir organizes Pakistan group tours and community-led trip programs, including popular northern routes and selected international group trips.",
  },
  {
    question: "Does 3Musafir work with international travelers?",
    answer:
      "Yes. 3Musafir can support international travelers through group trips, private/customized programs, and Pakistan DMC services for overseas agency partners.",
  },
  {
    question: "What age group travels with 3Musafir?",
    answer:
      "3Musafir commonly serves young adults and community-minded travelers, while exact suitability depends on the specific trip, route difficulty, rooming model, and group expectations.",
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
        faqItems={reviewFaqs}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <main className="bg-gray-50 px-4 pt-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              3Musafir reviews
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-heading md:text-4xl">
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

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "What travelers say about 3Musafir",
                body: "Traveler stories often focus on community, friendships, trip captains, shared comfort, and reaching destinations that feel difficult to manage alone.",
              },
              {
                title: "Public reputation and Google review signals",
                body: "Review signals should be read alongside itinerary details, route difficulty, rooming expectations, and the traveler’s own comfort with group travel.",
              },
              {
                title: "Women traveler feedback",
                body: "Women travelers often look for clarity on group composition, safety expectations, captain support, room sharing, and communication before departure.",
              },
              {
                title: "Trip-specific review themes",
                body: "Northern Pakistan routes can involve weather shifts, road conditions, and flight changes, so reviews are most useful when read with the exact route in mind.",
              },
              {
                title: "Common praise",
                body: "Travelers often mention community, friendships, trip captains, safety, access to remote destinations, and the confidence to join a first group trip.",
              },
              {
                title: "Common improvement areas",
                body: "Common improvement areas may include response times during peak season, itinerary changes due to mountain roads or weather, and room-sharing expectations.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-heading">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text">{item.body}</p>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">
              Why reviews matter for safe group travel
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text">
              Reviews help future Musafirs understand the people, pacing, communication, and safety
              expectations behind a trip. They are especially useful for first-time group travelers,
              women travelers, and international travelers evaluating whether 3Musafir fits their
              comfort level.
            </p>
          </section>

          <FaqSection title="3Musafir reviews FAQs" items={reviewFaqs} />
        </div>
      </main>
      <ReviewFeed />
    </>
  );
}
