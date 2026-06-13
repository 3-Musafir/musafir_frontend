import Link from "next/link";
import {
  ArrowUpRight,
  CreditCard,
  HelpCircle,
  MapPinned,
  MessageCircle,
  Route,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { PublicPageContainer } from "@/components/layout/PublicLayout";
import SeoHead from "@/components/seo/SeoHead";

const title = "3Musafir FAQs — Trips, Safety, Payments & Support";
const description =
  "Find answers about 3Musafir group trips, women-first travel, safety, payments, private journeys, Pakistan DMC services, and support.";

const faqTopics = [
  {
    title: "Joining a group trip",
    description: "How fixed departures work, what to expect, and how solo travelers join.",
    href: "/fixed-departure",
    icon: UsersRound,
  },
  {
    title: "Women-first travel",
    description: "Comfort, rooming clarity, group boundaries, and support before joining.",
    href: "/why",
    icon: ShieldCheck,
  },
  {
    title: "Routes and destinations",
    description: "Hunza, Skardu, Fairy Meadows, Chitral, Kashmir, Murree, and custom routes.",
    href: "/explore",
    icon: MapPinned,
  },
  {
    title: "Payments and refunds",
    description: "Booking payments, cancellation expectations, wallet credits, and refund policy.",
    href: "/refundpolicyby3musafir",
    icon: CreditCard,
  },
  {
    title: "Private or DMC planning",
    description: "Custom family trips, agency programs, partner itineraries, and inbound operations.",
    href: "/pakistan-dmc",
    icon: HelpCircle,
  },
  {
    title: "Contact and support",
    description: "How to reach the team before booking or after confirming your trip.",
    href: "https://wa.me/923221848940",
    icon: MessageCircle,
    external: true,
  },
];

const helpCenterPages = [
  {
    title: "Safety framework",
    description: "The full hub for traveler verification, vendor standards, and travel education.",
    href: "/hc/safetyframework",
    icon: ShieldCheck,
  },
  {
    title: "Traveler verification",
    description: "How 3Musafir checks travelers before they join a group.",
    href: "/hc/safetyframework/verification",
    icon: UsersRound,
  },
  {
    title: "Vendor onboarding",
    description: "How hotels, stays, transport, and partners are vetted.",
    href: "/hc/safetyframework/vendor-onboarding",
    icon: Route,
  },
  {
    title: "Travel education",
    description: "Pre-trip guidance around local norms, safety, and group expectations.",
    href: "/hc/safetyframework/travel-education",
    icon: MapPinned,
  },
  {
    title: "Community framework",
    description: "The community conduct, inclusion, and accountability framework.",
    href: "/hc/safetyframework/community-framework",
    icon: HelpCircle,
  },
  {
    title: "Trust and verification",
    description: "A deeper explanation of how trust systems are designed for group travel.",
    href: "/hc/safetyframework/trust-and-verification",
    icon: CreditCard,
  },
];

const faqItems = [
  {
    question: "What is 3Musafir?",
    answer:
      "3Musafir is a Pakistan-based travel company for verified community-led group tours, women-first travel, private journeys, international community trips, and inbound Pakistan DMC services.",
  },
  {
    question: "Can I join a trip if I do not know anyone?",
    answer:
      "Yes. Many Musafirs join individually. The group model is designed to create clarity and comfort before the trip through onboarding, shared expectations, and captain support.",
  },
  {
    question: "Is 3Musafir suitable for women travelers?",
    answer:
      "3Musafir is built around women-first comfort, including clearer rooming expectations, support channels, group boundaries, and trip planning that reflects local travel realities.",
  },
  {
    question: "What does a captain do on a trip?",
    answer:
      "Captains coordinate routes, timing, vendors, stays, group movement, and contingency decisions so travelers can stay present during the journey.",
  },
  {
    question: "How do I plan a private or custom journey?",
    answer:
      "For families, teams, or agency partners, use the Pakistan DMC page or contact the team on WhatsApp to share dates, group size, route preferences, and operating needs.",
  },
  {
    question: "How do I contact 3Musafir?",
    answer:
      "You can email hello@3musafir.com or WhatsApp +92 322 1848940 for trip questions, private journeys, DMC planning, or booked-trip support.",
  },
];

export default function FaqPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/hc/faq"
        ogImage="/communityimage7.jpg"
        faqItems={faqItems}
      />
      <PublicPageContainer as="main" className="min-h-screen bg-canvas-base">
        <div className="space-y-10">
          <section className="rounded-md bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
              Help center
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-heading sm:text-5xl">
              3Musafir FAQs
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-text">
              Start with a topic below, or scan the common questions people ask before joining a
              group trip, planning a private journey, or contacting the team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-heading">FAQ topics</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {faqTopics.map(({ title: topicTitle, description: topicDescription, href, icon: Icon, external }) => (
                <Link
                  key={topicTitle}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="group rounded-md border border-canvas-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/50"
                >
                  <Icon className="h-6 w-6 text-brand-primary" />
                  <h3 className="mt-4 text-lg font-bold text-heading">{topicTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-text">{topicDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-heading transition group-hover:text-brand-primary">
                    Open topic
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-heading">Safety and support pages</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {helpCenterPages.map(({ title: pageTitle, description: pageDescription, href, icon: Icon }) => (
                <Link
                  key={pageTitle}
                  href={href}
                  className="group rounded-md border border-canvas-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/50"
                >
                  <Icon className="h-6 w-6 text-brand-primary" />
                  <h3 className="mt-4 text-lg font-bold text-heading">{pageTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-text">{pageDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-heading transition group-hover:text-brand-primary">
                    Open page
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-md bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-heading">Common questions</h2>
            <div className="mt-5 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-md border border-canvas-line bg-canvas-base p-5"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-bold text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    {item.question}
                    <span className="text-brand-primary transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-text">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </PublicPageContainer>
    </>
  );
}
