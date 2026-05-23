import SeoHead from "@/components/seo/SeoHead";
import FaqSection from "@/components/seo/FaqSection";
import { voicesFaq } from "@/data/geo/faq";
import { voicesDisclaimer, voicesThemes } from "@/data/geo/voices";
import Link from "next/link";

const title = "Musafir Community Voices | Women-First Group Travel Stories";
const description =
  "Read responsible community voice summaries about 3Musafir, women-first group travel, traveler concerns, post-trip stories, and safe travel in Pakistan.";

export default function CommunityVoicesPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/community/voices"
        ogImage="/3mwinterlogo.png"
        faqItems={voicesFaq}
      />
      <main className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Community Voices</p>
            <h1 className="mt-3 text-3xl font-semibold text-heading md:text-4xl">
              Musafir community stories and travel reflections
            </h1>
            <p className="mt-3 text-sm text-text leading-relaxed">
              This page summarizes what travelers discuss before and after group travel:
              safety, trust, women-first comfort, trip captains, post-trip friendships, local
              context, and practical expectations for Pakistan group tours.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/reviews" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Read 3Musafir reviews
              </Link>
              <Link href="/explore" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Explore upcoming trips
              </Link>
              <Link href="/why" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary">
                Why travel with 3Musafir
              </Link>
            </div>
          </header>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {voicesDisclaimer}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">
              How to read these community voice summaries
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text">
              These are not invented testimonials. They are theme summaries that help answer common
              questions about 3Musafir’s community-led travel model, women traveler perspectives,
              post-trip stories, and the practical realities of safe group travel in Pakistan.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {voicesThemes.map((theme) => (
              <div key={theme.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-heading">{theme.title}</h2>
                <p className="mt-2 text-sm text-text leading-relaxed">{theme.summary}</p>
              </div>
            ))}
          </section>

          <FaqSection title="Community voices FAQs" items={voicesFaq} />
        </div>
      </main>
    </>
  );
}
