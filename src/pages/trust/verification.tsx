import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import FaqSection from "@/components/seo/FaqSection";
import { verificationFaq } from "@/data/geo/faq";

const title = "Verification — Trust & Safety | 3Musafir";
const description =
  "See how 3Musafir verifies travelers with female-first onboarding, referrals, interviews, and background checks for solo males.";

export default function VerificationPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/trust/verification"
        ogImage="/star_shield.png"
        faqItems={verificationFaq}
      />
      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trust & Safety</p>
            <h1 className="mt-3 text-3xl font-semibold text-heading md:text-4xl">Traveler verification</h1>
            <p className="mt-3 text-sm text-text leading-relaxed">
              Verification is the first layer of safety at 3Musafir. We prioritize women-led groups and use structured
              checks to reduce uncertainty before travelers meet.
            </p>
          </header>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">How it works</h2>
            <ul className="mt-4 space-y-2 text-sm text-text">
              <li>Female-first onboarding to establish trusted group foundations.</li>
              <li>Two community referrals to confirm identity and intent.</li>
              <li>Interviews for solo male travelers before approval.</li>
              <li>Background checks for solo males to protect group comfort.</li>
            </ul>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-heading">What we do</h2>
              <ul className="mt-3 space-y-2 text-sm text-text">
                <li>Verify identities and community referrals.</li>
                <li>Interview solo male travelers before approval.</li>
                <li>Use background checks for solo male applicants.</li>
                <li>Reassess verification if new information emerges.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-heading">What we don’t do</h2>
              <ul className="mt-3 space-y-2 text-sm text-text">
                <li>We don’t approve travelers without referrals or interviews.</li>
                <li>We don’t mix groups without clarity on shared expectations.</li>
                <li>We don’t bypass safety steps to fill seats faster.</li>
              </ul>
            </div>
          </section>

          <FaqSection title="Verification FAQs" items={verificationFaq} />

          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-text shadow-sm">
            <p>
              Next: learn how we vet partners on
              <Link href="/trust/vendor-onboarding" className="ml-1 text-brand-primary hover:underline">
                Vendor onboarding
              </Link>
              , or
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
