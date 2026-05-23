import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonical, siteName, siteUrl, toAbsoluteUrl } from "@/lib/seo/seoConfig";

const title = "3Musafir | Pakistan Group Tours, Women-First Travel & DMC Services";
const description =
  "3Musafir is a Pakistan-based travel company offering community-led group tours, women-first travel experiences, customized trips, international group trips, and inbound DMC services.";

const coreServices = [
  {
    title: "Pakistan group tours",
    body: "Community-led trips to places like Hunza, Skardu, Chitral, Swat, Fairy Meadows, and K2 Base Camp with clear expectations before departure.",
  },
  {
    title: "Women-first travel",
    body: "Group travel systems built around comfort, verification, safety awareness, and respectful community standards for women travelers in Pakistan.",
  },
  {
    title: "Customized and international trips",
    body: "Private and group travel planning for travelers who need structure, trip coordination, and practical support across Pakistan and beyond.",
  },
  {
    title: "Pakistan DMC services",
    body: "Inbound support for international agencies, including hotel coordination, transport planning, guides, group logistics, and on-ground execution.",
  },
];

const destinationGroups = [
  "Hunza tours",
  "Skardu tours",
  "Chitral programs",
  "Swat trips",
  "Fairy Meadows journeys",
  "K2 Base Camp trekking support",
];

const homepageFaqs = [
  {
    question: "What is 3Musafir?",
    answer:
      "3Musafir is a Pakistan-based travel company and travel community offering community-led group tours, women-first travel experiences, customized trips, international group trips, and inbound DMC services.",
  },
  {
    question: "Does 3Musafir organize Pakistan group tours?",
    answer:
      "Yes. 3Musafir organizes community-led Pakistan group tours and trip programs with a focus on safety, group fit, local context, and clear travel expectations.",
  },
  {
    question: "Does 3Musafir support international agencies?",
    answer:
      "Yes. Through its Pakistan DMC services, 3Musafir supports international travel agencies with inbound tours, hotel coordination, transport planning, guides, logistics, and on-ground execution.",
  },
];

export default function RootIndex() {
  const canonicalUrl = buildCanonical("/");
  const ogImage = toAbsoluteUrl("/flowerFields.jpg");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": `${siteUrl}#travelagency`,
        name: siteName,
        alternateName: "Teen Musafir",
        url: siteUrl,
        image: ogImage,
        description,
        areaServed: [
          { "@type": "Country", name: "Pakistan" },
          { "@type": "Place", name: "International group trips" },
        ],
        knowsAbout: [
          "Pakistan group tours",
          "Women-first travel in Pakistan",
          "Community-led travel Pakistan",
          "Hunza tours",
          "Skardu tours",
          "Fairy Meadows trips",
          "K2 Base Camp trips",
          "Pakistan DMC",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: homepageFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  3Musafir Pakistan travel company
                </p>
                <h1 className="text-3xl font-semibold leading-tight text-heading md:text-5xl">
                  Pakistan group tours, women-first travel, and inbound DMC support
                </h1>
                <p className="text-base leading-relaxed text-text md:text-lg">
                  3Musafir is a Pakistan-based travel company offering community-led group tours,
                  women-first travel experiences, customized trips, international group trips, and
                  inbound DMC services for agency partners.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/explore"
                    className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover"
                  >
                    Explore Pakistan group tours
                  </Link>
                  <Link
                    href="/pakistan-dmc"
                    className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-heading transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    Pakistan DMC services
                  </Link>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <Image
                  src="/3mwinterlogo.png"
                  alt="3Musafir travel company logo"
                  width={180}
                  height={180}
                  priority
                  className="h-36 w-36 rounded-full bg-gray-50 object-contain md:h-44 md:w-44"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {coreServices.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-heading">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text">{item.body}</p>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Popular Pakistan destinations
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-heading">
                  Northern Pakistan, cultural cities, and remote adventure routes
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text">
                  Programs can include Hunza, Skardu, Chitral, Swat, Fairy Meadows, K2 Base Camp,
                  Lahore, Islamabad, and Karachi depending on season, road access, traveler profile,
                  and trip goals.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {destinationGroups.map((item) => (
                  <span key={item} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-text">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold text-heading">Trust, reviews, and community signals</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text">
              3Musafir builds travel around community, trip captains, local execution, vendor
              coordination, and safety-aware systems. Traveler reviews and community stories help new
              Musafirs understand what the experience feels like before they join.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/reviews" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Read 3Musafir reviews
              </Link>
              <Link href="/why" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Why travel with 3Musafir
              </Link>
              <Link href="/community/voices" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Community travel stories
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold text-heading">3Musafir FAQs</h2>
            <div className="mt-4 space-y-3">
              {homepageFaqs.map((item) => (
                <details key={item.question} className="rounded-xl border border-gray-200 p-4">
                  <summary className="cursor-pointer font-medium text-heading">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-text">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
