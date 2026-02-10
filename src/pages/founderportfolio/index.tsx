import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import FounderHeroFallback from "@/components/founderportfolio/FounderHeroFallback";
import SkillTiles from "@/components/founderportfolio/SkillTiles";
import ImageCarousel from "@/components/founderportfolio/ImageCarousel";
import FaqAccordion from "@/components/founderportfolio/FaqAccordion";

const FounderHero3D = dynamic(() => import("@/components/founderportfolio/FounderHero3D"), {
  ssr: false,
});

const title = "Founder Portfolio - 3Musafir";
const description =
  "Meet the founders behind 3Musafir, a traveltech and community-first platform shaping youth experiences in Pakistan.";
const keywords =
  "3Musafir, founder portfolio, traveltech, community building, Pakistan travel, MusafirAI";

const skills = [
  {
    title: "TravelTech",
    description:
      "We create and curate travel community experiences enabled by modern software: CRMs, full-stack travel platform development, and emotionally intelligent social media storytelling.",
    image: "/skillsimage2.jpg",
    alt: "Travel group gathered on a hillside with flags and bright sky",
  },
  {
    title: "Marketing & Branding",
    description:
      "We use design thinking to build brand systems, go-to-market narratives, and campaigns that convert attention into trust.",
    image: "/skillsimage3.jpeg",
    alt: "Founders in a purple-lit workspace with a laptop between them",
  },
  {
    title: "Community Building",
    description:
      "We design community frameworks and values that help people belong, contribute, and grow together.",
    image: "/skillsimage4.jpeg",
    alt: "Large community gathering outdoors sharing smiles and conversation",
  },
];

const faqItems = [
  {
    question: "What is 3Musafir?",
    answer:
      "3Musafir is a team building a youth-first travel community and the technology that powers it - from safe group experiences to tools that make discovery and planning easier.",
  },
  {
    question: "How do we help businesses?",
    answer:
      "We help businesses understand and improve growth using AI-informed insights from web behavior and social content performance - translating trends into clear actions.",
  },
  {
    question: "How do we help consumers?",
    answer:
      "We use design thinking to understand real user needs and build experiences that feel simpler, safer, and more worth it.",
  },
  {
    question: "What are our professional business development processes?",
    answer:
      "We run structured discovery, validation, and sprint cycles supported by in-house tools to identify market signals and convert them into measurable go-to-market execution.",
  },
  {
    question: "Can you hire our team?",
    answer:
      "Yes. We partner with consumers, businesses, and institutions on select projects.",
  },
];

const communityImages = [
  {
    src: "/communityimage1.jpg",
    alt: "Large community group photo indoors with flags and banners",
  },
  {
    src: "/communityimage2.jpg",
    alt: "Nighttime crowd with purple lights celebrating together on stage",
  },
  {
    src: "/communityimage3.jpg",
    alt: "Group photo in front of a traditional mountain lodge",
  },
  {
    src: "/communityimage4.jpg",
    alt: "Large group posing on a mountain overlook under a blue sky",
  },
  {
    src: "/communityimage5.jpg",
    alt: "Group portrait with snow-capped mountains and a travel sign",
  },
  {
    src: "/communityimage6.jpg",
    alt: "Travel group posing on a mountain road with scenic peaks",
  },
  {
    src: "/communityimage7.jpg",
    alt: "Group seated by a scenic road with mountains and trees",
  },
  {
    src: "/communityimage8.jpg",
    alt: "ATV riders traveling through a palm forest trail",
  },
  {
    src: "/communityimage9.jpg",
    alt: "Three founders posing in front of a colorful decorated truck",
  },
];

export default function FounderPortfolioPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonicalPath = "/founderportfolio";
  const pageUrl = siteUrl ? `${siteUrl}${canonicalPath}` : undefined;
  const ogImage = siteUrl ? `${siteUrl}/mainfounderphoto.jpeg` : undefined;

  const organization = {
    "@type": "Organization",
    "@id": siteUrl ? `${siteUrl}#organization` : undefined,
    name: "3Musafir",
    url: siteUrl || undefined,
  };

  const founders = ["Hameez", "Ahmed", "Ali"].map((name) => ({
    "@type": "Person",
    "@id": pageUrl ? `${pageUrl}#${name.toLowerCase()}` : undefined,
    name,
    jobTitle: "Co-founder",
    worksFor: {
      "@type": "Organization",
      name: "3Musafir",
      url: siteUrl || undefined,
    },
  }));

  const webPage = {
    "@type": "WebPage",
    "@id": pageUrl ? `${pageUrl}#webpage` : undefined,
    name: "Founder Portfolio",
    description,
    url: pageUrl,
  };

  const faqPage = {
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organization, ...founders, webPage, faqPage].filter(Boolean),
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="3Musafir" />
        {pageUrl ? <meta property="og:url" content={pageUrl} /> : null}
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
        {ogImage ? (
          <meta property="og:image:alt" content="3Musafir founders portfolio hero" />
        ) : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
        {pageUrl ? <link rel="canonical" href={pageUrl} /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-canvas-base via-white to-canvas-soft shadow-card">
            <FounderHeroFallback
              alt="Founders standing together with community backdrop and travel skyline"
              priority
            />
            <div className="absolute inset-0 pointer-events-none">
              <FounderHero3D />
            </div>
            <div className="relative z-10 p-6 md:p-10 lg:p-12">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text">Founder Portfolio</p>
                <h1 className="text-3xl font-semibold text-heading md:text-4xl">
                  Our Story & Vision
                </h1>
                <p className="text-sm text-text leading-relaxed md:text-base">
                  Biography, vision, and impact - powered by community and traveltech.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/founderportfolio/biography"
                    className="inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
                  >
                    View biography
                  </Link>
                  <Link
                    href="#impact"
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    Explore impact
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">Biography & Vision</h2>
            <p className="mt-2 text-sm font-medium text-brand-primary">
              Trailblazing community building through travelling
            </p>
            <p className="mt-4 text-sm text-text leading-relaxed">
              Hameez, Ahmed, and Ali founded 3Musafir with a bold vision to unite the youth of Pakistan through community building, diversity, and impactful experiences. Since then, 3Musafir has emerged as a leader in community-building and travel tech. With the Musafir Community expanding across Pakistan and travel tools such as MusafirAI accelerating how people discover and plan experiences, the team is more focused than ever.
            </p>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-heading">Our Skills</h2>
              <p className="mt-2 text-sm text-text leading-relaxed">
                Find out our latest achievements and innovations where we highlight our most cutting-edge work.
              </p>
            </div>
            <SkillTiles skills={skills} />
          </section>

          <section id="impact" className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-heading">Impact</h2>
              <p className="text-2xl font-semibold text-heading md:text-3xl">
                3Musafir has raised a community of 10,000+ verified Musafirs
              </p>
            </div>
            <div className="mt-6">
              <ImageCarousel
                images={communityImages}
                ariaLabel="Community impact gallery"
                enableCoverflow
              />
            </div>
          </section>

          <div id="faq">
            <FaqAccordion title="Frequently Asked Questions" items={faqItems} />
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-heading">Ready to go deeper?</h2>
                <p className="mt-2 text-sm text-text">
                  Read the full biography to understand the founders' journey and future vision.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/founderportfolio/biography"
                  className="inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
                >
                  Read the full biography
                </Link>
                <Link
                  href="#impact"
                  className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover"
                >
                  {"Explore our impact ->"}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
