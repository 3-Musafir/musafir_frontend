'use client';

import Head from "next/head";
import Link from 'next/link';

export default function TrustAndVerificationPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const title = "Trust & Verification — 3Musafir safety framework";
  const description =
    "See how 3Musafir builds trust and verification systems to make group travel safer for women in Pakistan.";
  const canonicalUrl = `${siteUrl}/trust-and-verification`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Our trust and verification framework",
      description,
      inLanguage: "en-PK",
      mainEntityOfPage: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "3Musafir",
        url: siteUrl,
        logo: `${siteUrl}/3mwinterlogo.png`,
      },
      about: [
        "Pakistan",
        "International travellers",
        "International backpackers in Pakistan",
        "Asian travel scene",
        "Women travelers",
        "Group travel",
        "Safety",
        "Trust & verification",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does 3Musafir verify travelers?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "3Musafir follows a female-first onboarding model with community referrals, and applies additional verification for solo male travelers to protect group comfort.",
          },
        },
        {
          "@type": "Question",
          name: "How are hotels and vendors vetted?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Hotels and vendors are onboarded through background checks and direct interviews, and staff identification is verified before partnerships begin.",
          },
        },
        {
          "@type": "Question",
          name: "How does 3Musafir prepare travelers for local context in Pakistan?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Musafirs receive guidance on regional norms, expectations, and respectful behavior so that safety is supported through shared awareness.",
          },
        },
      ],
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
          name: "Trust & verification",
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
    <div className="min-h-screen w-full bg-gray-50">
      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <section className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 lg:p-10 shadow-sm">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text">Trust & safety</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-heading leading-tight">
                Our trust and verification framework
              </h1>
              <p className="text-base sm:text-lg text-text leading-relaxed">
                At 3Musafir, safety is not an afterthought. Especially for women traveling in Pakistan, trust must be designed intentionally across people, places, and regions. Our Trust & Verification Framework addresses the real-world risks of group travel through clear systems, human checks, and shared responsibility.
              </p>
            </div>
          </section>

          <details open className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-heading">
                    Three touchpoints that define travel safety
                  </h2>
                  <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                </div>
                <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              <p className="text-sm sm:text-base text-text leading-relaxed">
                Through experience and community feedback, 3Musafir has identified three critical touchpoints that directly affect how safe and comfortable a journey feels — particularly for women. Every policy and process we follow is built around these three areas.
              </p>
              <p className="text-sm sm:text-base text-text leading-relaxed">
                We also listen to women travelers, families, international travellers, and international backpackers in Pakistan who experience the broader Asian travel scene, so the framework reflects both local realities and visiting expectations.
              </p>
            </div>
          </details>

          <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-heading">1. Who you are traveling with</h2>
                  <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                </div>
                <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              <p className="text-sm sm:text-base text-text leading-relaxed">
                The people you travel with shape the entire experience. For women in Pakistan, uncertainty about group members is often the biggest barrier to joining a trip. This is why 3Musafir follows a female-first onboarding model.
              </p>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-heading">Female-first onboarding</h3>
                <p className="text-sm sm:text-base text-text leading-relaxed">
                  At this stage, 3Musafir only onboards new Musafirs through community referrals. Every new Musafir must be referred by at least two existing community members. This ensures accountability, familiarity, and social trust before anyone joins a group.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-heading">
                  Additional verification for solo male travelers
                </h3>
                <p className="text-sm sm:text-base text-text leading-relaxed">
                  All solo male applicants undergo additional verification. This includes background checks, direct interviews with the 3Musafir team, and behavioral screening before they are approved to travel. This process exists to protect group comfort and maintain a respectful environment for women travelers.
                </p>
              </div>
            </div>
          </details>

          <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-heading">
                    2. Where you are going and where you stay
                  </h2>
                  <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                </div>
                <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              <p className="text-sm sm:text-base text-text leading-relaxed">
                Safety is deeply connected to the environments travelers stay in. Hotels, transport partners, and local vendors play a critical role in how secure and respected women feel during a trip.
              </p>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-heading">
                  Vendor onboarding & background checks
                </h3>
                <p className="text-sm sm:text-base text-text leading-relaxed">
                  3Musafir maintains a strict vendor onboarding process. All hotels and vendors are background checked before being added to the 3Musafir vendor panel. Hotel owners and operators are interviewed directly to assess mindset, professionalism, and alignment with women-first safety standards.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-heading">Staff verification & accountability</h3>
                <p className="text-sm sm:text-base text-text leading-relaxed">
                  Before onboarding a hotel or vendor, 3Musafir verifies staff identification, including ID cards for on-ground personnel. This ensures accountability and reduces unknown interactions during a stay.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-heading">
                  Ongoing safety & mindset alignment
                </h3>
                <p className="text-sm sm:text-base text-text leading-relaxed">
                  Safety is not a one-time check. 3Musafir conducts ongoing discussions with partner hotels and vendors around respectful behavior, guest privacy, and safe hosting practices — especially for women travelers.
                </p>
              </div>
            </div>
          </details>

          <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-heading">
                    3. The region you are traveling to
                  </h2>
                  <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                </div>
                <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              <p className="text-sm sm:text-base text-text leading-relaxed">
                While 3Musafir can design systems and partnerships, it cannot change the culture of an entire region. Different areas in Pakistan have different social norms, sensitivities, and expectations.
              </p>
              <p className="text-sm sm:text-base text-text leading-relaxed">
                Rather than ignoring this reality, 3Musafir addresses it through awareness and preparation.
              </p>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-heading">
                  Education, awareness, and mutual respect
                </h3>
                <p className="text-sm sm:text-base text-text leading-relaxed">
                  Before travel, Musafirs are informed about the cultural context of the region they are visiting. This includes guidance on social norms, dress expectations, local sensitivities, and appropriate behavior.
                </p>
                <p className="text-sm sm:text-base text-text leading-relaxed">
                  Travelers are encouraged to remain aware of their surroundings, respect local culture, and avoid crossing boundaries. This shared responsibility plays a crucial role in maintaining safety and harmony during the journey.
                </p>
              </div>
            </div>
          </details>

          <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-heading">Safety as a shared responsibility</h2>
                  <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                </div>
                <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              <p className="text-sm sm:text-base text-text leading-relaxed">
                Safety in group travel is strongest when systems and people work together. 3Musafir provides structure, verification, and support — and asks Musafirs to travel with awareness, respect, and consideration for each other and the communities they visit.
              </p>
            </div>
          </details>

          <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-heading">An evolving framework</h2>
                  <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                </div>
                <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              <p className="text-sm sm:text-base text-text leading-relaxed">
                This Trust & Verification Framework is not static. As the community grows and travel patterns evolve, 3Musafir continues to refine its processes based on real experiences, feedback, and emerging risks — with women’s safety remaining a top priority.
              </p>
              <p className="text-sm sm:text-base text-text leading-relaxed">
                The goal is to keep group travel in Pakistan credible for families, transparent for partners, and clear for the wider Asian travel scene.
              </p>
            </div>
          </details>

          <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
            <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-heading">Travel built on trust</h2>
                  <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                </div>
                <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              <p className="text-sm sm:text-base text-text leading-relaxed">
                For women in Pakistan, safe travel requires more than good intentions. It requires systems, accountability, and care. This framework represents 3Musafir’s ongoing commitment to building travel experiences where trust is earned, protected, and respected.
              </p>
            </div>
          </details>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-xl font-semibold text-heading">Next steps</h2>
                <p className="text-sm text-text leading-relaxed">
                  When you’re ready, explore journeys that follow the same trust and verification standards.
                </p>
              </div>
              <Link
                href="/home"
                className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Explore journeys →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
    </>
  );
}
