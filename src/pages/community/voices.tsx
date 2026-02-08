import SeoHead from "@/components/seo/SeoHead";
import FaqSection from "@/components/seo/FaqSection";
import { voicesFaq } from "@/data/geo/faq";
import { voicesDisclaimer, voicesThemes } from "@/data/geo/voices";

const title = "Community Voices — 3Musafir";
const description =
  "A responsible summary of public community sentiment about safe group travel in Pakistan.";

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
              What travelers discuss before choosing group travel
            </h1>
            <p className="mt-3 text-sm text-text leading-relaxed">
              This page summarizes publicly shared sentiment about safety, trust, and group travel in Pakistan. It is
              not a list of endorsements or testimonials.
            </p>
          </header>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {voicesDisclaimer}
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
