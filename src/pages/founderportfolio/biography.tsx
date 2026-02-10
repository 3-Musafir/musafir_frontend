import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ImageCarousel from "@/components/founderportfolio/ImageCarousel";
import StatsGrid from "@/components/founderportfolio/StatsGrid";

const title = "3Musafir Biography";
const description =
  "Discover how 3Musafir connects community building and technology to empower youth in Pakistan.";
const keywords =
  "3Musafir biography, founders, community building, travel technology, Pakistan youth";

const biographyImages = [
  {
    src: "/biographysubimage1.jpeg",
    alt: "Founders standing inside a historic stone archway with weathered walls",
  },
  {
    src: "/biographysubimage2.jpeg",
    alt: "Founders posing in front of a skyline at an outdoor plaza",
  },
  {
    src: "/biographysubimage3.jpeg",
    alt: "Founder at National Incubation Center in Islamabad, Pakistan, with modern architecture in background",
  },
  {
    src: "/biographysubimage4.jpeg",
    alt: "Founders seated along ancient amphitheater stone steps under open sky",
  },
];

const stats = [
  { value: "11,000+", label: "Members served" },
  { value: "20+", label: "Cultures explored" },
  { value: "5+", label: "Community enablement initiatives" },
  { value: "100+", label: "Projects delivered" },
];

export default function FounderBiographyPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonicalPath = "/founderportfolio/biography";
  const pageUrl = siteUrl ? `${siteUrl}${canonicalPath}` : undefined;
  const ogImage = siteUrl ? `${siteUrl}/mainbiographyimage.jpg` : undefined;

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
    name: "3Musafir Biography",
    description,
    url: pageUrl,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organization, ...founders, webPage].filter(Boolean),
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
          <meta property="og:image:alt" content="3Musafir biography hero" />
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
          <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm">
            <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text">3Musafir Biography</p>
                <h1 className="text-3xl font-semibold text-heading md:text-4xl">
                  3Musafir Biography
                </h1>
                <p className="text-sm text-text leading-relaxed">
                  Learn how community building and technology combine to empower Pakistan's youth through travel.
                </p>
                <Link
                  href="/founderportfolio"
                  className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover"
                >
                  {"Back to founder portfolio ->"}
                </Link>
              </div>
              <div className="relative h-64 overflow-hidden rounded-2xl md:h-full md:min-h-[320px]">
                <Image
                  src="/mainbiographyimage.jpg"
                  alt="Portrait of 3Musafir founders with warm light and modern workspace"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">
              Connecting community building and technology in the modern world
            </h2>
            <p className="mt-3 text-sm text-text leading-relaxed">
              At 3Musafir, we blend community building with technology to empower Pakistan's youth. Through digital platforms, we connect adventurers, organize immersive travel experiences, and foster lasting relationships. Technology amplifies our mission - making exploration, cultural exchange, and meaningful community growth accessible to more people, from anywhere. Join the movement.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">Biography highlights</h2>
            <div className="mt-5">
              <ImageCarousel
                images={biographyImages}
                ariaLabel="Biography highlights carousel"
                aspectClassName="aspect-[4/3] md:aspect-[3/2]"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">Metrics</h2>
            <div className="mt-5">
              <StatsGrid stats={stats} />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
