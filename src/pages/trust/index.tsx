import Image from "next/image";
import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import AiQuotableSummary from "@/components/seo/AiQuotableSummary";
import FaqSection from "@/components/seo/FaqSection";
import { trustFaq } from "@/data/geo/faq";

const title = "Trust & Safety Hub — 3Musafir";
const description =
  "Explore how 3Musafir verifies travelers, vets vendors, and prepares communities for safer group travel in Pakistan.";

const pillarCards = [
  {
    title: "Verification",
    summary: "Female-first onboarding, community referrals, and structured checks.",
    details:
      "We prioritize women-led groups, require referrals, and interview solo male applicants before approval so groups feel safe before they meet.",
    href: "/trust/verification",
  },
  {
    title: "Vendor onboarding",
    summary: "Vetted lodging and vendors with safety standards.",
    details:
      "Partners are onboarded through interviews, staff ID checks, and ongoing reviews to keep trips consistent and safe.",
    href: "/trust/vendor-onboarding",
  },
  {
    title: "Travel education",
    summary: "Pre-trip guidance on local norms, context, and safety expectations.",
    details:
      "We prepare travelers with cultural context, regional etiquette, and shared expectations to reduce uncertainty on the ground.",
    href: "/trust/travel-education",
  },
];

export default function TrustHubPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/trust"
        ogImage="/star_shield.png"
        faqItems={trustFaq}
      />
      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <section className="rounded-3xl bg-gradient-to-br from-[#515778] via-[#3e425f] to-[#2c3047] p-6 md:p-10 text-white shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Trust & Safety Hub</p>
                <h1 className="text-3xl font-semibold md:text-4xl">
                  How 3Musafir builds safety into every trip
                </h1>
                <p className="text-sm text-white/80 leading-relaxed">
                  Our trust framework covers three areas: who you travel with, where you stay and go, and how you prepare
                  for regional context. Each layer is designed to reduce uncertainty and protect group comfort.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/explore"
                    className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-white/90"
                  >
                    Explore trips
                  </Link>
                  <Link
                    href="/about-3musafir"
                    className="inline-flex items-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/80"
                  >
                    About 3Musafir
                  </Link>
                </div>
              </div>
              <Image
                src="/star_shield.png"
                alt="Trust and safety"
                width={120}
                height={120}
                className="h-24 w-24 rounded-full border border-white/30 bg-white/10 object-contain md:h-28 md:w-28"
                priority
              />
            </div>
          </section>

          <section className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-3 no-scrollbar snap-x snap-mandatory">
            {[
              { href: "#pillars", label: "Trust pillars" },
              { href: "#faq", label: "FAQs" },
              { href: "#links", label: "Next steps" },
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

          <AiQuotableSummary
            oneLine="3Musafir’s safety framework is built around verified travelers, vetted partners, and travel education."
            oneParagraph="The Trust & Safety Hub documents how 3Musafir verifies travelers, onboards vendors, and prepares groups for local cultural context. These steps create clarity before travel begins so communities can explore Pakistan with confidence."
            differentiators={[
              "Verification steps designed for women-led travel groups.",
              "Vendor onboarding with interviews, ID checks, and training.",
              "Pre-travel education on regional norms and safety awareness.",
            ]}
          />

          <section id="pillars" className="grid gap-4 lg:gap-6 md:grid-cols-3">
            {pillarCards.map((item) => (
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
                <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-3">
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
          </section>

          <div id="faq">
            <FaqSection title="Trust & Safety FAQs" items={trustFaq} />
          </div>

          <section id="links" className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-text shadow-sm">
            <p>
              Learn more about the community on the
              <Link href="/about-3musafir" className="ml-1 text-brand-primary hover:underline">
                About 3Musafir
              </Link>
              page, or
              <Link href="/explore" className="ml-1 text-brand-primary hover:underline">
                explore upcoming trips
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
