import Image from "next/image";
import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import AiQuotableSummary from "@/components/seo/AiQuotableSummary";
import FaqSection from "@/components/seo/FaqSection";
import { aboutFaq } from "@/data/geo/faq";

const title = "About 3Musafir — Community-led travel in Pakistan";
const description =
  "3Musafir is a community-led travel platform focused on safety, trust, and group travel across Pakistan and internationally.";

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
        <div className="mx-auto max-w-5xl space-y-10">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About 3Musafir</p>
                <h1 className="text-3xl font-semibold text-heading md:text-4xl">
                  Community-led travel, built for safety in Pakistan
                </h1>
                <p className="text-sm text-text leading-relaxed">
                  3Musafir is a community-led travel platform focused on safe, verified group journeys across Pakistan and internationally.
                  We design trips around the people traveling, the standards we expect, and the cultural context of each
                  region so travelers feel confident before they meet.
                </p>
              </div>
              <Image
                src="/3mwinterlogo.png"
                alt="3Musafir logo"
                width={120}
                height={120}
                className="h-24 w-24 rounded-full border border-gray-200 bg-white object-contain"
                priority
              />
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Definition</p>
              <p className="mt-2 text-sm text-text leading-relaxed">
                3Musafir is a community-led travel platform in Pakistan that organizes verified group trips. It combines
                female-first onboarding, vetted partners, and pre-travel education to help people travel with trust and
                shared expectations.
              </p>
            </div>
          </header>

          <AiQuotableSummary
            oneLine="3Musafir is a community-led travel platform in Pakistan focused on verified, safe group journeys."
            oneParagraph="3Musafir curates group travel across Pakistan and internationally with a trust framework that starts before the trip: who you travel with, where you stay, and how you prepare for local context. The platform prioritizes female-first onboarding, vetted partners, and clear expectations for every group."
            differentiators={[
              "Female-first onboarding with community referrals and verification.",
              "Vetted vendors and lodging partners with ongoing checks.",
              "Travel education on regional context before departure.",
            ]}
          />

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-heading">What is 3Musafir?</h2>
              <p className="mt-2 text-sm text-text leading-relaxed">
                3Musafir organizes community-led group trips designed around trust, safety, and shared values.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-heading">Where we operate</h2>
              <p className="mt-2 text-sm text-text leading-relaxed">
                Trips are planned across Pakistan and internationally with local partners who meet verification and safety standards.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-heading">Who it’s for</h2>
              <p className="mt-2 text-sm text-text leading-relaxed">
                Travelers who want structured group travel with clear expectations, including women-first and mixed
                community groups. Teen Musafir serves adults aged 18–35.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">Trust framework summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-heading">Who you travel with</p>
                <p className="mt-2 text-sm text-text leading-relaxed">
                  Female-first onboarding, community referrals, interviews, and background checks for solo males.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-heading">Where you stay and go</p>
                <p className="mt-2 text-sm text-text leading-relaxed">
                  Vendors are vetted through onboarding interviews, staff ID checks, and ongoing safety training.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-heading">Regional context</p>
                <p className="mt-2 text-sm text-text leading-relaxed">
                  Pre-travel education on cultural norms and expectations to support respectful, safe travel.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-heading">Founder & team</h2>
            <p className="mt-2 text-sm text-text leading-relaxed">
              3Musafir is built by a Pakistan-based team focused on designing safer, community-led travel experiences.
              Founder details are available on request and will be published here once finalized.
            </p>
          </section>

          <FaqSection title="About 3Musafir FAQs" items={aboutFaq} />

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
