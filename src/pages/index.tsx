import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { ElementType } from 'react';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  HeartHandshake,
  Map,
  Mountain,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

import {
  specialInterestFestivals,
} from '@/components/dmc/specialInterestFestivalContent';
import { INDEXABLE_PATHS, siteName, siteUrl } from '@/lib/seo/seoConfig';

type HubLink = {
  href: string;
  label: string;
  description: string;
};

type HubSection = {
  title: string;
  eyebrow: string;
  icon: ElementType;
  links: HubLink[];
};

const description =
  '3Musafir is a Pakistan-based travel company for community-led fixed departures, women-first group travel, responsible journeys, and inbound DMC services.';

const primaryLinks = [
  {
    href: '/fixed-departure',
    label: 'Fixed departures',
    description: 'Upcoming flagship journeys and group departures.',
    icon: CalendarDays,
  },
  {
    href: '/explore',
    label: 'Explore travel style',
    description: 'How 3Musafir designs community-led journeys.',
    icon: Map,
  },
  {
    href: '/reviews',
    label: 'Traveler reviews',
    description: 'Public trust signals and traveler stories.',
    icon: Star,
  },
  {
    href: '/pakistan-dmc',
    label: 'Pakistan DMC',
    description: 'Inbound services for international agencies.',
    icon: Building2,
  },
];

const hubSections: HubSection[] = [
  {
    title: 'Travel With 3Musafir',
    eyebrow: 'For travelers',
    icon: Mountain,
    links: [
      {
        href: '/fixed-departure',
        label: 'Fixed departures',
        description: 'Live and upcoming group journeys.',
      },
      {
        href: '/explore',
        label: 'Explore',
        description: 'Community-led travel in Pakistan.',
      },
      {
        href: '/reviews',
        label: 'Reviews',
        description: 'Traveler stories and public review signals.',
      },
      {
        href: '/why',
        label: 'Why 3Musafir',
        description: 'The purpose behind safer group travel.',
      },
    ],
  },
  {
    title: 'Trust And Community',
    eyebrow: 'Safety systems',
    icon: ShieldCheck,
    links: [
      {
        href: '/about-3musafir',
        label: 'About 3Musafir',
        description: 'Company story, founders, and operating values.',
      },
      {
        href: '/trust',
        label: 'Trust',
        description: 'Safety, verification, and accountability framework.',
      },
      {
        href: '/trust/verification',
        label: 'Verification',
        description: 'How verification supports safer travel.',
      },
      {
        href: '/trust/vendor-onboarding',
        label: 'Vendor onboarding',
        description: 'Partner standards for responsible operations.',
      },
      {
        href: '/trust/travel-education',
        label: 'Travel education',
        description: 'Practical guidance for better-prepared travelers.',
      },
      {
        href: '/musafircommunityequityframework',
        label: 'Community equity framework',
        description: 'Inclusion, safety, and accountability commitments.',
      },
    ],
  },
  {
    title: 'Pakistan DMC Services',
    eyebrow: 'For agencies',
    icon: Globe2,
    links: [
      {
        href: '/pakistan-dmc',
        label: 'Pakistan DMC',
        description: 'Inbound tour operations and ground handling.',
      },
      {
        href: '/pakistan-dmc/tours/hunza',
        label: 'Hunza DMC',
        description: 'Northern Pakistan group itinerary support.',
      },
      {
        href: '/pakistan-dmc/tours/skardu',
        label: 'Skardu DMC',
        description: 'Baltistan hotels, transport, guides, and logistics.',
      },
      {
        href: '/pakistan-dmc/tours/chitral',
        label: 'Chitral DMC',
        description: 'Kalash Valley and Hindukush group operations.',
      },
      {
        href: '/pakistan-dmc/tours/k2-basecamp-trek',
        label: 'K2 Base Camp DMC',
        description: 'Expedition logistics and field coordination.',
      },
      {
        href: '/pakistan-dmc/special-interests/festivals-of-pakistan',
        label: 'Festivals of Pakistan',
        description: 'Special-interest festival routes for agencies.',
      },
      {
        href: '/pakistan-dmc/special-interests/kalash-festival-2027',
        label: 'Kalash Festival 2027',
        description: 'Kalash Valley festival logistics and agency support.',
      },
    ],
  },
  {
    title: 'Special Interest Routes',
    eyebrow: 'Festival products',
    icon: Sparkles,
    links: specialInterestFestivals.map((festival) => ({
      href: `/pakistan-dmc/special-interests/${festival.slug}`,
      label: festival.name,
      description: `${festival.region} · ${festival.duration}`,
    })),
  },
  {
    title: 'Company And Reference',
    eyebrow: 'Public pages',
    icon: FileText,
    links: [
      {
        href: '/founderportfolio',
        label: 'Founder portfolio',
        description: 'Founder profile and work.',
      },
      {
        href: '/login',
        label: 'Login',
        description: 'Account access for Musafirs.',
      },
      {
        href: '/founderportfolio/biography',
        label: 'Founder biography',
        description: 'Long-form biography and background.',
      },
      {
        href: '/refundpolicyby3musafir',
        label: 'Refund policy',
        description: 'Trip cancellation, wallet credit, and refund rules.',
      },
      {
        href: '/terms&conditonsby3musafir',
        label: 'Terms and conditions',
        description: 'Terms governing trips and services.',
      },
    ],
  },
];

const expectedStaticRoutes = new Set(INDEXABLE_PATHS);

const linkedRoutes = new Set(
  hubSections.flatMap((section) => section.links.map((link) => link.href))
);

const missingStaticRoutes = Array.from(expectedStaticRoutes).filter(
  (route) => route !== '/' && !linkedRoutes.has(route)
);

if (process.env.NODE_ENV !== 'production' && missingStaticRoutes.length > 0) {
  // Keep the route hub aligned with the public sitemap during local development.
  console.warn('Homepage route hub is missing sitemap routes:', missingStaticRoutes);
}

export default function PublicHomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}#homepage`,
    url: siteUrl,
    name: siteName,
    description,
    isPartOf: {
      '@id': `${siteUrl}#website`,
    },
    about: [
      'Pakistan group tours',
      'Women-first travel experiences',
      'Responsible travel',
      'Fixed departures',
      'Pakistan DMC services',
    ],
    provider: {
      '@id': `${siteUrl}#organization`,
      name: siteName,
    },
  };

  return (
    <>
      <Head>
        <meta name="description" content={description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="min-h-screen bg-[#f8f7f2] text-[#171717]">
        <section className="relative flex min-h-[92vh] flex-col overflow-hidden bg-[#161615] text-white">
          <Image
            src="/flowerFields.jpg"
            alt="3Musafir travelers in a northern Pakistan landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.34),rgba(0,0,0,0.18))]" />

          <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
            <Link href="/" className="flex items-center gap-3" aria-label="3Musafir home">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sm font-black text-[#171717]">
                3M
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/86">
                3Musafir
              </span>
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-medium text-white/82 md:flex">
              <Link href="/fixed-departure" className="hover:text-white">
                Departures
              </Link>
              <Link href="/reviews" className="hover:text-white">
                Reviews
              </Link>
              <Link href="/pakistan-dmc" className="hover:text-white">
                DMC
              </Link>
            </nav>
          </header>

          <div className="relative z-10 flex flex-1 items-end px-5 pb-16 pt-20 sm:px-8 lg:px-12">
            <div className="max-w-4xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/24 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
                <HeartHandshake className="h-4 w-4" />
                Community-led travel from Pakistan
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Group journeys, safer travel systems, and Pakistan DMC operations.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
                3Musafir connects travelers with fixed departures, women-first community travel,
                practical trust systems, and inbound support for international travel agencies.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/fixed-departure"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f15a24] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#d84918]"
                >
                  View fixed departures
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pakistan-dmc"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/28 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/16"
                >
                  Pakistan DMC services
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e5e0d8] bg-[#f8f7f2] px-5 py-8 sm:px-8 lg:px-12">
          <div className="grid gap-3 md:grid-cols-4">
            {primaryLinks.map(({ href, label, description: itemDescription, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-md border border-[#e5e0d8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#171717]/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-5 w-5 text-[#f15a24]" />
                  <ArrowUpRight className="h-4 w-4 text-[#171717]/35 transition group-hover:text-[#171717]" />
                </div>
                <h2 className="mt-5 text-base font-bold text-[#171717]">{label}</h2>
                <p className="mt-2 text-sm leading-6 text-[#5f625f]">{itemDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f15a24]">
                  Public route hub
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#171717] sm:text-4xl">
                  Main public paths, one clear way in.
                </h2>
              </div>
              <p className="text-base leading-8 text-[#5f625f]">
                Browse the main 3Musafir entry points and supporting reference pages, from fixed
                departures and traveler trust to Pakistan DMC information and company policies.
              </p>
            </div>

            <div className="mt-10 grid gap-5">
              {hubSections.map(({ title, eyebrow, icon: Icon, links }) => (
                <section key={title} className="rounded-md border border-[#e5e0d8] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-[#ece8e1] pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#173f35] text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f15a24]">
                          {eyebrow}
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-[#171717]">{title}</h3>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#5f625f]">
                      <CheckCircle2 className="h-4 w-4 text-[#173f35]" />
                      {links.length} links
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group rounded-md border border-[#ece8e1] bg-[#fbfaf7] p-4 transition hover:border-[#f15a24]/50 hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-bold leading-6 text-[#171717]">{link.label}</h4>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#171717]/35 transition group-hover:text-[#f15a24]" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#686b68]">{link.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#173f35] px-5 py-14 text-white sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f7c66a]">
                Built for repeat trust
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Travel pages for travelers, agencies, and community partners.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Users, label: 'Community-led', text: 'Group journeys designed around people.' },
                { icon: ShieldCheck, label: 'Safety-minded', text: 'Verification, vendor, and trust systems.' },
                { icon: Newspaper, label: 'Agency-ready', text: 'DMC itineraries with operational context.' },
              ].map(({ icon: Icon, label, text }) => (
                <div key={label} className="rounded-md border border-white/16 bg-white/8 p-4">
                  <Icon className="h-5 w-5 text-[#f7c66a]" />
                  <h3 className="mt-4 text-base font-bold">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/74">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
