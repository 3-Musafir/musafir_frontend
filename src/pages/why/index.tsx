'use client';

import Head from "next/head";
import Link from 'next/link';
import { PublicPageContainer } from "@/components/layout/PublicLayout";

export default function WhyPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const title = "Why 3Musafir | Pakistan-Tested Travel Framework for Global Trips";
  const description =
    "See why 3Musafir uses Pakistan as proof for a community-led travel framework built to scale across complex global destinations.";
  const canonicalUrl = `${siteUrl}/why`;
  const whyFaqs = [
    {
      question: "Why does 3Musafir start its trust framework in Pakistan?",
      answer:
        "Pakistan gives the framework a demanding test environment: diverse regions, shifting routes, supplier variation, safety perceptions, social expectations, and real on-ground complexity.",
    },
    {
      question: "How does a Pakistan-tested travel framework work globally?",
      answer:
        "If the framework can create trust, clarity, and accountability in Pakistan, it can be adapted to other destinations where travelers face uncertainty, cultural context, fragmented operators, or safety concerns.",
    },
    {
      question: "Is 3Musafir only for Pakistan travel?",
      answer:
        "No. Pakistan is the proof case, but the model is global: community-led groups, local expertise, clear standards, and support before, during, and after travel.",
    },
    {
      question: "Why does local on-ground expertise matter everywhere?",
      answer:
        "Every destination has local realities that do not show up in a generic itinerary. 3Musafir treats local coordination, cultural context, and operator accountability as core parts of the travel product.",
    },
  ];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Why 3Musafir exists",
      description,
      inLanguage: "en",
      mainEntityOfPage: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "3Musafir",
        url: siteUrl,
        logo: `${siteUrl}/3mwinterlogo.png`,
      },
      about: [
        "Pakistan",
        "Global travel",
        "Women travelers",
        "Group travel",
        "Safety",
        "Community-led travel",
        "Travel framework",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: whyFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
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
          name: "Why 3Musafir exists",
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
        <meta property="og:image" content={`${siteUrl}/blue-shield.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/blue-shield.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <PublicPageContainer as="main" className="bg-gray-50">
        <div className="space-y-10 lg:space-y-12">
          <section
            id="purpose"
            className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 lg:p-10 shadow-sm"
          >
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text">Why we exist</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-heading leading-tight">
                Pakistan is the proof. The framework is global.
              </h1>
              <p className="text-base sm:text-lg text-text leading-relaxed">
                3Musafir was built in Pakistan because it is one of the most demanding places to make travel feel simple: safety concerns, social barriers, family expectations, inconsistent suppliers, mountain roads, weather shifts, and deep cultural diversity all meet in one market. If a trust-first travel framework can work here, it can work in complex destinations anywhere.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <span className="rounded-full border border-gray-200 px-3 py-2 text-text">
                  40% Pakistan proof
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-2 text-brand-primary">
                  60% Global blueprint
                </span>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/explore" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                  Explore journeys
                </Link>
                <Link href="/hc" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                  Trust framework
                </Link>
                <Link href="/pakistan-dmc" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                  Pakistan DMC proof
                </Link>
                <Link href="/reviews" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                  Community reviews
                </Link>
              </div>
            </div>
          </section>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
            <nav
              aria-label="Why 3Musafir overview"
              className="lg:hidden rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-text mb-3">On this page</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
                {[
                  { href: '#problem', label: 'Pakistan proof' },
                  { href: '#insight', label: 'Global lesson' },
                  { href: '#approach', label: 'Framework' },
                  { href: '#community', label: 'Community' },
                  { href: '#impact', label: 'Beyond Pakistan' },
                  { href: '#forward', label: 'Global way forward' },
                  { href: '#local-expertise', label: 'Local expertise' },
                  { href: '#next', label: 'Next steps' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
            <aside className="hidden lg:block">
              <nav
                aria-label="Why 3Musafir overview"
                className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-text mb-4">On this page</p>
                <ul className="space-y-3 text-sm text-text">
                  <li>
                    <a
                      href="#problem"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Pakistan as the proof market
                    </a>
                  </li>
                  <li>
                    <a
                      href="#insight"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      The global lesson
                    </a>
                  </li>
                  <li>
                    <a
                      href="#approach"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      The framework we can take anywhere
                    </a>
                  </li>
                  <li>
                    <a
                      href="#community"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Why community-led travel travels across borders
                    </a>
                  </li>
                  <li>
                    <a
                      href="#impact"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Beyond Pakistan
                    </a>
                  </li>
                  <li>
                    <a
                      href="#forward"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      An intentional global way forward
                    </a>
                  </li>
                  <li>
                    <a
                      href="#local-expertise"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Local expertise in every market
                    </a>
                  </li>
                  <li>
                    <a
                      href="#next"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Next steps
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>

            <div className="space-y-10 lg:space-y-12">
              <details id="problem" open className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">
                        Pakistan as the proof market
                      </h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Pakistan is not a narrow use case for 3Musafir. It is the stress test. Travel here can involve long road journeys, sudden weather changes, uneven supplier quality, different regional norms, family concerns, safety perceptions, and limited room for weak coordination.
                  </p>
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    That is why roughly 40% of this story is Pakistan: the market where the framework had to earn trust under real constraints. The larger 60% is what those constraints teach us about building travel systems for the world.
                  </p>
                </div>
              </details>

              <details id="insight" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">
                        The global lesson: safety is a system
                      </h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Travel safety is often discussed as a destination problem. At 3Musafir, we treat it as a systems problem. Who you travel with, who hosts you, how expectations are set, how information moves, and how issues are handled matter in Pakistan and in any market where people travel with uncertainty.
                  </p>
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Pakistan made the pattern visible. The solution is not only local knowledge; it is a repeatable operating model that combines local knowledge with community, verification, clear standards, and active support.
                  </p>
                </div>
              </details>

              <section id="approach" className="space-y-6">
                <div className="max-w-3xl space-y-2">
                  <h2 className="text-2xl font-semibold text-heading">
                    The framework we can take anywhere
                  </h2>
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    The destination changes. The operating logic stays consistent.
                  </p>
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: 'Verified people before places',
                      description:
                        'Trips begin with the group, not only the itinerary. Travelers need clarity on who they are joining, what behavior is expected, and how trust is maintained.',
                    },
                    {
                      title: 'Local operators with shared standards',
                      description:
                        'Local expertise matters everywhere, but it must be connected to clear standards for lodging, transport, guides, communication, and accountability.',
                    },
                    {
                      title: 'Support before, during, and after',
                      description:
                        'A travel company should not disappear after booking. The framework keeps expectations, escalation, and feedback loops active across the whole journey.',
                    },
                  ].map((item) => (
                    <details
                      key={item.title}
                      className="group rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      <summary className="list-none cursor-pointer p-5 md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                            <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                          </div>
                          <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                            +
                          </span>
                        </div>
                      </summary>
                      <div className="px-5 md:px-6 pb-5 md:pb-6">
                        <p className="text-sm text-text mt-2 leading-relaxed">{item.description}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <details id="community" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">
                        Why community-led travel travels across borders
                      </h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Community-led travel creates familiarity before the journey begins. When travelers know they are part of a shared space - not just customers on a bus - trust forms earlier, expectations become clearer, and the group becomes easier to support.
                  </p>
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    That pattern is not limited to Pakistan. It matters anywhere people are traveling with strangers, entering unfamiliar cultures, joining women-first cohorts, or depending on local partners they cannot personally verify.
                  </p>
                </div>
              </details>

              <details id="impact" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">Beyond Pakistan</h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Our goal is not just to organize journeys in one country. It is to build a way of traveling that can move from Pakistan to other complex destinations without losing the human parts: trust, context, safety, accountability, and belonging.
                  </p>
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Pakistan remains central because it keeps the framework honest. The global opportunity comes from turning those hard-earned lessons into a standard that can serve travelers, hosts, agencies, and communities across borders.
                  </p>
                </div>
              </details>

              <details id="forward" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">An intentional global way forward</h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    3Musafir is built for people who value safety, clarity, and shared respect. The Pakistan chapter proves the framework under pressure; the global chapter applies it wherever travelers need more than a packaged itinerary.
                  </p>
                </div>
              </details>

              <section id="local-expertise" className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-heading">
                  Local expertise in every market
                </h2>
                <p className="mt-3 text-sm lg:text-base text-text leading-relaxed">
                  Pakistan shows why local expertise cannot be optional: seasonality, mountain roads,
                  regional norms, flight availability, hotel quality, and supplier reliability can all
                  change the trip. The same principle applies globally. Every destination needs people
                  who understand the ground reality and a framework that turns that knowledge into
                  consistent standards travelers can trust.
                </p>
              </section>

              <section id="faq" className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-heading">Why 3Musafir FAQs</h2>
                <div className="mt-4 space-y-3">
                  {whyFaqs.map((item) => (
                    <details key={item.question} className="rounded-xl border border-gray-200 p-4">
                      <summary className="cursor-pointer font-medium text-heading">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm text-text leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section id="next" className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-2xl space-y-2">
                    <h2 className="text-xl font-semibold text-heading">Next steps</h2>
                    <p className="text-sm text-text leading-relaxed">
                      When you&apos;re ready, explore journeys built with the same Pakistan-tested, globally relevant approach.
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    Explore journeys →
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </PublicPageContainer>
    </>
  );
}
