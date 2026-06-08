import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check, MapPin, Route, Zap } from "lucide-react";

import Footer from "@/components/Footer";
import PublicHeader from "@/components/header/PublicHeader";

import {
  festivalPageNote,
  specialInterestFestivals,
  sharedFestivalExclusions,
  sharedFestivalInclusions,
} from "@/components/dmc/specialInterestFestivalContent";
import { siteUrl } from "@/lib/seo/seoConfig";

const pagePath = "/pakistan-dmc/special-interests/festivals-of-pakistan";
const pageUrl = `${siteUrl}${pagePath}`;
const ogImage = `${siteUrl}/communityimage14.jpg`;

const title = "Festivals of Pakistan DMC | Cultural & Winter Festival Tours | 3Musafir";
const description =
  "3Musafir is a Pakistan DMC supporting foreign travel agencies with festival itineraries across Hunza, Skardu, Chitral, Shimshal, Khaplu, Taxila, Gilgit-Baltistan, and the Hindukush.";

const hubJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en-PK",
      isPartOf: {
        "@id": `${siteUrl}#website`,
      },
      about: [
        "Festivals of Pakistan",
        "Pakistan DMC",
        "Special interest travel",
        "Cultural festivals in Pakistan",
        "Winter sports in Pakistan",
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#festival-list`,
      name: "Pakistan festival DMC itineraries",
      itemListElement: specialInterestFestivals.map((festival, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: festival.name,
        url: `${siteUrl}/pakistan-dmc/special-interests/${festival.slug}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pakistan DMC",
          item: `${siteUrl}/pakistan-dmc`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Festivals of Pakistan",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function FestivalsOfPakistanHub() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <script
          key="festivals-of-pakistan-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }}
        />
      </Head>

      <main className="min-h-screen scroll-smooth bg-[#fffaf8] font-[Outfit,Inter,sans-serif] text-[#2d2f49]">
        <div className="min-h-screen w-full overflow-x-hidden bg-[#fffaf8]">
          <PublicHeader variant="dmc" hideAuthCta>
          <a
              href="#urgent-enquiry"
              className="hidden h-11 items-center justify-center rounded-full bg-[#ff3b0a] px-5 text-[14px] font-black text-white md:flex"
            >
              Request Festival Portfolio
            </a>
        </PublicHeader>

          <section className="mx-auto w-full max-w-6xl md:grid md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-8 md:px-8 md:py-10 lg:gap-12 xl:px-10">
            <div className="relative h-[232px] w-full overflow-hidden bg-[#2f3143] grayscale md:order-2 md:aspect-[780/500] md:h-auto md:min-h-0 md:rounded-[28px]">
              <Image
                src="/communityimage14.jpg"
                alt="Festivals of Pakistan DMC itineraries"
                fill
                priority
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 44vw, 520px"
                className="object-cover object-center opacity-75"
              />
              <div className="absolute inset-0 bg-[#151625]/30" />
            </div>

            <div className="px-[21px] pb-12 pt-[24px] md:order-1 md:flex md:min-h-[650px] md:flex-col md:justify-center md:px-0 md:py-0">
              <nav aria-label="Breadcrumb" className="mb-[19px] text-[13px] font-bold text-[#747b8c]">
                <Link href="/" className="text-[#2d2f49] underline decoration-[#ff3b0a]/30 underline-offset-4">
                  Home
                </Link>
                <span className="px-2 text-[#a0a5b0]">/</span>
                <Link href="/pakistan-dmc" className="text-[#2d2f49] underline decoration-[#ff3b0a]/30 underline-offset-4">
                  Pakistan DMC
                </Link>
              </nav>

              <p className="text-[14px] font-black uppercase text-[#ff3b0a]">Festival DMC hub</p>
              <h1 className="mt-[14px] max-w-[455px] text-[39px] font-black leading-[1.16] text-[#2d2f49] md:max-w-none md:text-[54px] md:leading-[1.04] lg:text-[60px]">
                Festivals of Pakistan DMC Itineraries for Foreign Travel Agencies
              </h1>

              <p className="mt-[25px] max-w-[620px] text-[20px] font-medium leading-[1.5] text-[#596173] md:text-[23px]">
                A special-interest portfolio for agencies selling cultural festivals, winter
                sports, high-altitude events, Buddhist heritage, folklore, and community-led
                travel across Pakistan.
              </p>

              <div className="mt-[34px] grid gap-[12px] md:grid-cols-3">
                {[
                  { label: "Products", value: `${specialInterestFestivals.length}+ festival pages` },
                  { label: "Regions", value: "Hunza, Skardu, Chitral, Taxila, Baltistan" },
                  { label: "Scope", value: "Hotels, transport, guides, permits, route monitoring" },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[16px] border border-[#ece8e5] bg-white px-[18px] py-[15px] shadow-[0_3px_10px_rgba(29,31,50,0.05)]"
                  >
                    <p className="text-[12px] font-black uppercase text-[#ff3b0a]">{fact.label}</p>
                    <p className="mt-[5px] text-[15px] font-extrabold leading-[1.25] text-[#2d2f49]">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
            <div className="mx-auto max-w-[860px] text-center">
              <p className="text-[14px] font-black uppercase text-[#ff3b0a]">Recommended architecture</p>
              <h2 className="mt-[14px] text-[30px] font-black leading-[1.08] text-[#2d2f49] md:text-[44px]">
                One hub page linking to every festival DMC product
              </h2>
              <p className="mx-auto mt-5 max-w-[720px] text-[15.5px] font-medium leading-[1.55] text-[#596173] md:text-[18px]">
                Each page uses visible date caution language, agency positioning, a basic itinerary,
                shared inclusions/exclusions, and local confirmation notes before final sale.
              </p>
            </div>

            <div className="mt-[42px] grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
              {specialInterestFestivals.map((festival) => (
                <Link
                  key={festival.slug}
                  href={`/pakistan-dmc/special-interests/${festival.slug}`}
                  className="flex min-h-[280px] flex-col rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(20,24,36,0.08)]"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={20} strokeWidth={2.5} className="shrink-0 text-[#ff3b0a]" />
                    <p className="text-[12px] font-black uppercase text-[#ff3b0a]">{festival.duration}</p>
                  </div>
                  <h3 className="mt-[13px] text-[20px] font-black leading-tight text-[#2d2f49]">
                    {festival.name}
                  </h3>
                  <p className="mt-[10px] text-[14px] font-medium leading-[1.45] text-[#596173]">
                    {festival.positioning}
                  </p>
                  <p className="mt-auto pt-[18px] text-[13px] font-black leading-tight text-[#2d2f49]">
                    View DMC itinerary
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-[#fffaf8] px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
            <div className="grid gap-[18px] lg:grid-cols-[1fr_0.8fr]">
              <article className="rounded-[18px] border border-[#ebe9e7] bg-white px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]">
                <Route size={24} strokeWidth={2.5} className="text-[#ff3b0a]" />
                <h2 className="mt-[14px] text-[24px] font-black leading-tight text-[#2d2f49]">
                  Shared DMC inclusions
                </h2>
                <ul className="mt-[15px] grid gap-[10px] md:grid-cols-2">
                  {sharedFestivalInclusions.map((item) => (
                    <li key={item} className="flex gap-[10px] text-[14px] font-medium leading-[1.42] text-[#596173]">
                      <Check size={17} strokeWidth={3} className="mt-[2px] shrink-0 text-[#ff3b0a]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[18px] border border-[#ffd9cf] bg-[#fff4f0] px-[20px] py-[20px]">
                <CalendarDays size={24} strokeWidth={2.5} className="text-[#ff3b0a]" />
                <h2 className="mt-[14px] text-[24px] font-black leading-tight text-[#2d2f49]">
                  Date and scope caution
                </h2>
                <p className="mt-[12px] text-[15px] font-medium leading-[1.55] text-[#596173]">
                  {festivalPageNote}
                </p>
                <ul className="mt-[15px] space-y-[10px]">
                  {sharedFestivalExclusions.slice(0, 5).map((item) => (
                    <li key={item} className="flex gap-[10px] text-[14px] font-medium leading-[1.42] text-[#596173]">
                      <Check size={17} strokeWidth={3} className="mt-[2px] shrink-0 text-[#ff3b0a]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section
            id="urgent-enquiry"
            className="scroll-mt-[100px] bg-white px-[17px] pb-[37px] pt-[42px] md:px-8 md:py-24 lg:px-12 xl:px-10"
          >
            <div className="rounded-[20px] border border-[#ffc9bb] bg-[#fff4f0] px-[31px] pb-[30px] pt-[27px] md:grid md:grid-cols-[0.8fr_1.2fr] md:gap-8 md:px-8 md:py-8 lg:gap-12">
              <div>
                <div className="flex items-center gap-[13px]">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#ff3b0a] text-white">
                    <Zap size={21} fill="white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-[25px] font-black leading-[1.25] text-[#2d2f49] md:text-[36px]">
                    Request Festival
                    <br />
                    Portfolio
                  </h2>
                </div>

                <p className="mt-[31px] text-[15.5px] font-medium leading-[1.5] text-[#596173] md:text-[17px]">
                  Share your agency market, group profile, dates, budget, and destination preference.
                  3Musafir can scope festival timing, local partners, hotels, transport, guides, and
                  responsible access.
                </p>
              </div>

              <div className="mt-[28px] md:mt-0 md:flex md:items-center">
                <a
                  href="https://wa.me/923221848940?text=Hi%203Musafir%2C%20I%20need%20a%20DMC%20festival%20portfolio%20for%20Pakistan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[57px] w-full items-center justify-center rounded-[14px] bg-[#ff3b0a] px-5 text-center text-[17px] font-black text-white shadow-[0_13px_22px_rgba(255,59,10,0.22)] md:max-w-[360px]"
                >
                  Request Portfolio on WhatsApp
                </a>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </main>
    </>
  );
}
