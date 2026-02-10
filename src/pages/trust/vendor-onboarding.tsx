import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import FaqSection from "@/components/seo/FaqSection";
import { vendorFaq } from "@/data/geo/faq";

const title = "Vendor onboarding — Trust & Safety | 3Musafir";
const description =
  "Learn how 3Musafir vets hotels and vendors through interviews, ID checks, and ongoing safety standards.";

export default function VendorOnboardingPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/trust/vendor-onboarding"
        ogImage="/blue-shield.png"
        faqItems={vendorFaq}
      />
      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trust & Safety</p>
            <h1 className="mt-3 text-3xl font-semibold text-heading md:text-4xl">Vendor onboarding</h1>
            <p className="mt-3 text-sm text-text leading-relaxed">
              Safe travel depends on where you stay and who supports your trip. We partner with vendors who align with
              our verification standards and ongoing safety expectations.
            </p>
          </header>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <details className="group" open>
              <summary className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-heading">How it works</h2>
                    <p className="text-sm text-text leading-relaxed">
                      The steps we follow before bringing a partner into a 3Musafir trip.
                    </p>
                  </div>
                  <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">+</span>
                </div>
              </summary>
              <ul className="mt-4 space-y-2 text-sm text-text">
                <li>Onboarding interviews to confirm safety practices and alignment.</li>
                <li>Background checks and verification of ownership and staff IDs.</li>
                <li>Clear safety standards shared with vendor teams.</li>
                <li>Ongoing reviews based on traveler feedback and on-ground checks.</li>
              </ul>
            </details>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-heading">What we do</h2>
                  <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">+</span>
                </div>
              </summary>
              <ul className="mt-3 space-y-2 text-sm text-text">
                <li>Verify vendors before listing trips.</li>
                <li>Confirm staff identification and onsite standards.</li>
                <li>Provide safety expectations and service training.</li>
                <li>Pause partnerships that fail to meet standards.</li>
              </ul>
            </details>

            <details className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <summary className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-heading">What we don't do</h2>
                  <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">+</span>
                </div>
              </summary>
              <ul className="mt-3 space-y-2 text-sm text-text">
                <li>We don't work with vendors without verified ownership.</li>
                <li>We don't ignore traveler feedback on safety issues.</li>
                <li>We don't onboard partners who refuse safety expectations.</li>
              </ul>
            </details>
          </section>

          <FaqSection title="Vendor onboarding FAQs" items={vendorFaq} />

          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-text shadow-sm">
            <p>
              Next: learn how we prepare travelers on
              <Link href="/trust/travel-education" className="ml-1 text-brand-primary hover:underline">
                Travel education
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
