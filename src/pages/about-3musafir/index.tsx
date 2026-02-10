import Image from "next/image";
import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import AiQuotableSummary from "@/components/seo/AiQuotableSummary";
import FaqSection from "@/components/seo/FaqSection";
import { aboutFaq } from "@/data/geo/faq";

const title = "About 3Musafir — Community-led travel in Pakistan";
const description =
  "3Musafir is a community-led travel platform focused on safety, trust, and group travel across Pakistan and internationally.";

const overviewCards = [
  {
    title: "What is 3Musafir?",
    summary: "Community-led group travel built around trust and shared expectations.",
    details:
      "We curate journeys where group fit, safety, and shared values are defined before the trip begins so travelers feel confident from day one.",
  },
  {
    title: "Where we operate",
    summary: "Trips across Pakistan and select international destinations.",
    details:
      "We work with vetted local partners, verified hosts, and trusted on-ground teams to support safe, culturally aware travel.",
  },
  {
    title: "Who it's for",
    summary: "Adults 18-35 seeking structured, community-first travel.",
    details:
      "Groups include women-first cohorts and mixed community groups with clear expectations, shared comfort levels, and respectful behavior.",
  },
];

const frameworkCards = [
  {
    title: "Who you travel with",
    summary: "Female-first onboarding, community referrals, and verification checks.",
    details:
      "We use referrals, interviews, and background checks (for solo males) to create trusted groups and reduce uncertainty before travel.",
    href: "/trust/verification",
  },
  {
    title: "Where you stay and go",
    summary: "Vetted lodging and vendors with safety standards.",
    details:
      "Partners are onboarded through interviews, ID checks, and ongoing reviews to ensure consistent experiences for every group.",
    href: "/trust/vendor-onboarding",
  },
  {
    title: "Regional context",
    summary: "Pre-travel education on norms and expectations.",
    details:
      "Musafirs receive guidance on cultural context, safety etiquette, and local expectations to support respectful travel.",
    href: "/trust/travel-education",
  },
];

export default function About3MusafirPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/about-3musafir"
        ogImage="/3mwinterlogo.png"
        faqItems={aboutFaq}
      />

      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <section className="rounded-3xl bg-gradient-to-br from-[#515778] via-[#3e425f] to-[#2c3047] p-6 md:p-10 text-white shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">About 3Musafir</p>
                <h1 className="text-3xl font-semibold md:text-4xl">
                  Community-led travel, built for safety in Pakistan
                </h1>
                <p className="text-sm text-white/80 leading-relaxed">
                  3Musafir is a community-led travel platform focused on safe, verified group journeys across Pakistan and internationally.
                  We design trips around the people traveling, the standards we expect, and the cultural context of each region.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/explore"
                    className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-white/90"
                  >
                    Explore trips
                  </Link>
                  <Link
                    href="/trust"
                    className="inline-flex items-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/80"
                  >
                    Trust & Safety
                  </Link>
                </div>
              </div>
              <Image
                src="/3mwinterlogo.png"
                alt="3Musafir logo"
                width={120}
                height={120}
                className="h-24 w-24 rounded-full border border-white/30 bg-white/10 object-contain md:h-28 md:w-28"
                priority
              />
            </div>
          </section>

          <section className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-3 no-scrollbar snap-x snap-mandatory">
            {[
              { href: "#definition", label: "Definition" },
              { href: "#overview", label: "What to expect" },
              { href: "#framework", label: "Trust framework" },
              { href: "#team", label: "Team" },
              { href: "#faq", label: "FAQs" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
              >
                {item.label}
              </Link>
            ))}
          </section>

          <section id="definition" className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Definition</p>
            <p className="mt-2 text-sm text-text leading-relaxed">
              3Musafir is a community-led travel platform in Pakistan that organizes verified group trips. It combines
              female-first onboarding, vetted partners, and pre-travel education to help people travel with trust and
              shared expectations.
            </p>
          </section>

          <AiQuotableSummary
            oneLine="3Musafir is a community-led travel platform in Pakistan focused on verified, safe group journeys."
            oneParagraph="3Musafir curates group travel across Pakistan and internationally with a trust framework that starts before the trip: who you travel with, where you stay, and how you prepare for local context. The platform prioritizes female-first onboarding, vetted partners, and clear expectations for every group."
            differentiators={[
              "Female-first onboarding with community referrals and verification.",
              "Vetted vendors and lodging partners with ongoing checks.",
              "Travel education on regional context before departure.",
            ]}
          />

          <section id="overview" className="grid gap-4 lg:gap-6 md:grid-cols-3">
            {overviewCards.map((item) => (
              <details
                key={item.title}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <summary className="list-none cursor-pointer p-5 md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-base font-semibold text-heading">{item.title}</h2>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">+</span>
                  </div>
                  <p className="mt-2 text-sm text-text leading-relaxed">{item.summary}</p>
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <p className="text-sm text-text leading-relaxed">{item.details}</p>
                </div>
              </details>
            ))}
          </section>

          <section id="framework" className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-heading">Trust framework summary</h2>
              <p className="text-sm text-text leading-relaxed">
                Our trust framework covers who you travel with, where you stay and go, and how you prepare for local context.
                Expand each layer to see what it includes.
              </p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {frameworkCards.map((item) => (
                <details
                  key={item.title}
                  className="group rounded-2xl border border-gray-200 bg-gray-50 shadow-sm"
                >
                  <summary className="list-none cursor-pointer p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-heading">{item.title}</p>
                      <span className="mt-1 text-brand-primary text-base transition group-open:rotate-45">+</span>
                    </div>
                    <p className="mt-2 text-sm text-text leading-relaxed">{item.summary}</p>
                  </summary>
                  <div className="px-4 pb-4 space-y-3">
                    <p className="text-sm text-text leading-relaxed">{item.details}</p>
                    <Link
                      href={item.href}
                      className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition"
                    >
                      Learn more →
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section id="team" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">Founder & team</h2>
            <p className="mt-2 text-sm text-text leading-relaxed">
              3Musafir is built by a Pakistan-based team focused on designing safer, community-led travel experiences.
              Founder details are available on request and will be published here once finalized.
            </p>
          </section>

          <div id="faq">
            <FaqSection title="About 3Musafir FAQs" items={aboutFaq} />
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-text shadow-sm">
            <p>
              Want the full trust framework? Visit the
              <Link href="/trust" className="ml-1 text-brand-primary hover:underline">
                Trust & Safety Hub
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
