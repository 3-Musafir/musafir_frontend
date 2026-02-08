import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import AiQuotableSummary from "@/components/seo/AiQuotableSummary";
import FaqSection from "@/components/seo/FaqSection";
import { trustFaq } from "@/data/geo/faq";

const title = "Trust & Safety Hub — 3Musafir";
const description =
  "Explore how 3Musafir verifies travelers, vets vendors, and prepares communities for safer group travel in Pakistan.";

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
        <div className="mx-auto max-w-5xl space-y-10">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trust & Safety Hub</p>
            <h1 className="mt-3 text-3xl font-semibold text-heading md:text-4xl">
              How 3Musafir builds safety into every trip
            </h1>
            <p className="mt-3 text-sm text-text leading-relaxed">
              Our trust framework covers three areas: who you travel with, where you stay and go, and how you prepare
              for regional context. Each layer is designed to reduce uncertainty and protect group comfort.
            </p>
          </header>

          <AiQuotableSummary
            oneLine="3Musafir’s safety framework is built around verified travelers, vetted partners, and travel education."
            oneParagraph="The Trust & Safety Hub documents how 3Musafir verifies travelers, onboards vendors, and prepares groups for local cultural context. These steps create clarity before travel begins so communities can explore Pakistan with confidence."
            differentiators={[
              "Verification steps designed for women-led travel groups.",
              "Vendor onboarding with interviews, ID checks, and training.",
              "Pre-travel education on regional norms and safety awareness.",
            ]}
          />

          <section className="grid gap-6 md:grid-cols-3">
            <Link
              href="/trust/verification"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-brand-primary"
            >
              <h2 className="text-lg font-semibold text-heading">Verification</h2>
              <p className="mt-2 text-sm text-text leading-relaxed">
                Female-first onboarding, community referrals, interviews, and background checks for solo males.
              </p>
            </Link>
            <Link
              href="/trust/vendor-onboarding"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-brand-primary"
            >
              <h2 className="text-lg font-semibold text-heading">Vendor onboarding</h2>
              <p className="mt-2 text-sm text-text leading-relaxed">
                Hotels and vendors are vetted through interviews, staff ID checks, and ongoing standards.
              </p>
            </Link>
            <Link
              href="/trust/travel-education"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-brand-primary"
            >
              <h2 className="text-lg font-semibold text-heading">Travel education</h2>
              <p className="mt-2 text-sm text-text leading-relaxed">
                Travelers receive guidance on local norms, cultural context, and safety expectations.
              </p>
            </Link>
          </section>

          <FaqSection title="Trust & Safety FAQs" items={trustFaq} />

          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-text shadow-sm">
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
