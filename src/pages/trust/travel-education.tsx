import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import FaqSection from "@/components/seo/FaqSection";
import { educationFaq } from "@/data/geo/faq";

const title = "Travel education — Trust & Safety | 3Musafir";
const description =
  "See how 3Musafir prepares travelers with regional context, cultural norms, and safety expectations before departure.";

export default function TravelEducationPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/trust/travel-education"
        ogImage="/globe.svg"
        faqItems={educationFaq}
      />
      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trust & Safety</p>
            <h1 className="mt-3 text-3xl font-semibold text-heading md:text-4xl">Travel education</h1>
            <p className="mt-3 text-sm text-text leading-relaxed">
              We prepare every group with guidance on local norms, regional context, and shared expectations. This
              reduces uncertainty and makes group travel safer and more respectful.
            </p>
          </header>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">How it works</h2>
            <ul className="mt-4 space-y-2 text-sm text-text">
              <li>Pre-travel briefings on cultural norms and regional sensitivities.</li>
              <li>Clear group expectations for respectful behavior.</li>
              <li>Guidance on communication and safety during travel.</li>
              <li>On-trip support when local context changes.</li>
            </ul>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-heading">What we do</h2>
              <ul className="mt-3 space-y-2 text-sm text-text">
                <li>Share regional norms before departure.</li>
                <li>Explain expectations for group conduct.</li>
                <li>Provide safety awareness guidance for each destination.</li>
                <li>Offer support when plans shift on-ground.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-heading">What we don’t do</h2>
              <ul className="mt-3 space-y-2 text-sm text-text">
                <li>We don’t leave groups without preparation before travel.</li>
                <li>We don’t ignore regional context when planning itineraries.</li>
                <li>We don’t treat safety as an afterthought.</li>
              </ul>
            </div>
          </section>

          <FaqSection title="Travel education FAQs" items={educationFaq} />

          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-text shadow-sm">
            <p>
              Return to the
              <Link href="/trust" className="ml-1 text-brand-primary hover:underline">
                Trust & Safety Hub
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
