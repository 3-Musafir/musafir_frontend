import Link from "next/link";
import {
  ArrowUpRight,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { PublicPageContainer } from "@/components/layout/PublicLayout";
import SeoHead from "@/components/seo/SeoHead";

const title = "3Musafir Help Center — FAQs, Safety & Support";
const description =
  "Find 3Musafir FAQs, safety framework pages, traveler verification details, community guidelines, and support contact options.";

const helpCards = [
  {
    title: "FAQs",
    description: "Answers about group trips, payments, private journeys, DMC planning, and support.",
    href: "/hc/faq",
    icon: HelpCircle,
  },
  {
    title: "Safety framework",
    description: "Traveler verification, vendor onboarding, travel education, and trust systems.",
    href: "/hc/safetyframework",
    icon: ShieldCheck,
  },
  {
    title: "Community framework",
    description: "Conduct, inclusion, accountability, and expectations for the 3Musafir community.",
    href: "/hc/safetyframework/community-framework",
    icon: UsersRound,
  },
  {
    title: "Contact support",
    description: "Reach the team for trip planning, booked-trip assistance, or partner questions.",
    href: "https://wa.me/923221848940",
    icon: MessageCircle,
    external: true,
  },
];

export default function HelpCenterPage() {
  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonicalPath="/hc"
        ogImage="/communityimage7.jpg"
      />
      <PublicPageContainer as="main" className="min-h-screen bg-canvas-base">
        <div className="space-y-10">
          <section className="rounded-md bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
              Help center
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-heading sm:text-5xl">
              How can we help?
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-text">
              Start here for common questions, safety and verification resources, community
              guidelines, and ways to contact 3Musafir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-heading">Help topics</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {helpCards.map(({ title: cardTitle, description: cardDescription, href, icon: Icon, external }) => (
                <Link
                  key={cardTitle}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="group rounded-md border border-canvas-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/50"
                >
                  <Icon className="h-6 w-6 text-brand-primary" />
                  <h3 className="mt-4 text-lg font-bold text-heading">{cardTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-text">{cardDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-heading transition group-hover:text-brand-primary">
                    Open
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </PublicPageContainer>
    </>
  );
}
