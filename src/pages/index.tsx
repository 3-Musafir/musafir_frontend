import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { ElementType } from 'react';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe2,
  HeartHandshake,
  Map,
  Mountain,
  Sparkles,
  Star,
} from 'lucide-react';

import Footer from '@/components/Footer';
import PublicHeader from '@/components/header/PublicHeader';
import {
  INDEXABLE_PATHS,
  contactPoints,
  logoUrl,
  sameAs,
  siteName,
  siteUrl,
} from '@/lib/seo/seoConfig';

type DiscoveryOption = {
  label: string;
  description: string;
  href: string;
};

type DiscoveryGroup = {
  label: string;
  icon: ElementType;
  options: DiscoveryOption[];
};

type LandingCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  icon: ElementType;
  label?: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const title = '3Musafir | Verified Pakistan Group Tours & Women-First Travel';
const description =
  'Explore Pakistan with verified community-led group tours, women-first travel experiences, trusted captains, custom journeys, international trips, and inbound DMC services by 3Musafir.';
const trustpilotUrl = 'https://www.trustpilot.com/review/3musafir.com';

const discoveryGroups: DiscoveryGroup[] = [
  {
    label: 'Where?',
    icon: Map,
    options: [
      {
        label: 'Hunza and Skardu',
        description: 'Northern Pakistan fixed departures',
        href: '/fixed-departure',
      },
      {
        label: 'Fairy Meadows',
        description: 'Mountain routes with group support',
        href: '/explore',
      },
      {
        label: 'Agency programs',
        description: 'Inbound Pakistan DMC operations',
        href: '/pakistan-dmc',
      },
    ],
  },
  {
    label: 'When?',
    icon: CalendarDays,
    options: [
      {
        label: 'Upcoming departures',
        description: 'See live group journeys',
        href: '/fixed-departure',
      },
      {
        label: 'Seasonal routes',
        description: 'Match timing to road and weather realities',
        href: '/explore',
      },
      {
        label: 'Custom dates',
        description: 'Plan private or agency-led movement',
        href: '/pakistan-dmc',
      },
    ],
  },
  {
    label: 'Travel style?',
    icon: Sparkles,
    options: [
      {
        label: 'Women-first comfort',
        description: 'Clear expectations and support',
        href: '/why',
      },
      {
        label: 'First group trip',
        description: 'Stories from Musafirs who came alone',
        href: '/reviews',
      },
      {
        label: 'Private or DMC',
        description: 'Designed for families, teams, and agencies',
        href: '/pakistan-dmc',
      },
    ],
  },
];

const answerCards = [
  {
    question: 'What is 3Musafir?',
    answer:
      '3Musafir is a Pakistan-based travel company for verified community-led group tours, women-first travel, private journeys, international group trips, and inbound Pakistan DMC services.',
  },
  {
    question: 'Who is 3Musafir for?',
    answer:
      '3Musafir is for travelers who want structured group travel with safer onboarding, clear expectations, captain support, and a community that continues after the trip.',
  },
  {
    question: 'Where does 3Musafir operate?',
    answer:
      'Core routes include Hunza, Skardu, Fairy Meadows, Chitral, Kashmir, Murree, forest retreats, and selected international community trips, with DMC support across Pakistan.',
  },
  {
    question: 'Why choose 3Musafir over a regular tour group?',
    answer:
      'Our model prioritizes verified people, women-first comfort, vetted partners, on-trip captains, route-aware planning, and post-trip community instead of only dates and destinations.',
  },
];

const whySteps = [
  {
    image: '/communityimage5.jpg',
    alt: '3Musafir travelers together in Northern Pakistan',
    before: 'Join verified people with',
    highlight: 'shared expectations',
    after: '',
  },
  {
    image: '/communityimage10.jpg',
    alt: 'Women travelers on a 3Musafir community trip',
    before: 'Choose trips built around',
    highlight: 'comfort and group fit',
    after: '',
  },
  {
    image: '/communityimage14.jpg',
    alt: '3Musafir route logistics in Pakistan',
    before: 'Captains handle the plan so',
    highlight: 'you stay present',
    after: '',
  },
  {
    image: '/communityimage1.jpg',
    alt: '3Musafir international community gathering',
    before: 'The people you meet become',
    highlight: 'part of the journey',
    after: '',
  },
];

const travelStyles: LandingCard[] = [
  {
    title: 'First 3Musafir trip',
    label: 'Start here',
    description: 'For travelers who want structure, warm group dynamics, and clear expectations.',
    href: '/reviews',
    image: '/communityimage7.jpg',
    icon: Star,
  },
  {
    title: 'Women-first departures',
    label: 'Comfort-led',
    description: 'For women who want safe, thoughtful, and socially comfortable group travel.',
    href: '/why',
    image: '/communityimage10.jpg',
    icon: HeartHandshake,
  },
  {
    title: 'Northern Pakistan',
    label: 'Mountain routes',
    description: 'Hunza, Skardu, Fairy Meadows, Chitral, and route-aware group operations.',
    href: '/fixed-departure',
    image: '/communityimage5.jpg',
    icon: Mountain,
  },
  {
    title: 'Weekend escapes',
    label: 'Short format',
    description: 'Lower-commitment experiences for people who want a quick reset with the community.',
    href: '/explore',
    image: '/flowerFields.jpg',
    icon: CalendarDays,
  },
  {
    title: 'International community trips',
    label: 'Beyond Pakistan',
    description: 'Community-led trips beyond Pakistan with the same group-fit and support mindset.',
    href: '/fixed-departure',
    image: '/communityimage1.jpg',
    icon: Globe2,
  },
  {
    title: 'Private and custom journeys',
    label: 'Custom',
    description: 'For families, teams, agency partners, and groups needing a tailored Pakistan program.',
    href: '/pakistan-dmc',
    image: '/communityimage14.jpg',
    icon: Building2,
  },
];

const testimonials = [
  {
    quote:
      'I wanted to express heartfelt gratitude for creating such an amazing community where women feel safe and supported while traveling.',
    name: 'Aisha Mehar',
    context: 'FireFest 7.0',
  },
  {
    quote:
      'As a first-time female solo traveler, I had a lot of doubts and fears but not even for a second did I feel like I was on a solo trip.',
    name: 'Romaza',
    context: 'Detox 5.0',
  },
  {
    quote:
      'I joined as a solo Musafir and ended up with a wonderful friend circle. The captains always kept an eye on us and listened patiently.',
    name: 'Ghania Zakir',
    context: 'SummerFest 4.0 Skardu',
  },
];

const confidenceItems = [
  {
    title: 'Verified group members',
    description: 'Community checks and referrals reduce the uncertainty of traveling with strangers.',
  },
  {
    title: 'Clear rooming expectations',
    description: 'Shared-stay realities, comfort levels, and trip requirements are surfaced before booking.',
  },
  {
    title: 'Route and weather planning',
    description: 'Northern Pakistan routes are handled with local context, road timing, and contingency awareness.',
  },
  {
    title: 'Payment and refund clarity',
    description: 'Trip pages and policies set expectations around fares, inclusions, cancellation, and support.',
  },
  {
    title: 'Support before, during, and after',
    description: 'The team stays involved across onboarding, on-trip coordination, and post-trip community care.',
  },
];

const faqItems: FaqItem[] = [
  {
    question: 'What is 3Musafir?',
    answer:
      '3Musafir is a Pakistan-based travel company offering verified community-led group tours, women-first travel experiences, customized journeys, international group trips, and inbound Pakistan DMC services.',
  },
  {
    question: 'What destinations does 3Musafir cover?',
    answer:
      'Popular 3Musafir routes include Hunza, Skardu, Fairy Meadows, Chitral, Kashmir, Murree, forest retreats, and selected international community trips.',
  },
  {
    question: 'Is 3Musafir safe for women to travel with in Pakistan?',
    answer:
      '3Musafir is built around women-first comfort, verified groups, clear expectations, and active support before, during, and after trips.',
  },
  {
    question: 'Can I join if I do not know anyone?',
    answer:
      'Yes. Many Musafirs join individually. The community-led model is designed to create familiarity and group comfort before and during the journey.',
  },
  {
    question: 'What does a trip usually include?',
    answer:
      'Inclusions vary by route, but trips commonly include selected stays, transport segments, captain coordination, and clearly listed activities or route details.',
  },
  {
    question: 'Does 3Musafir work with international agencies?',
    answer:
      'Yes. The Pakistan DMC offering supports inbound agencies with route planning, local partners, transport, hotels, guides, and ground coordination.',
  },
  {
    question: 'How do I contact 3Musafir?',
    answer:
      'You can contact 3Musafir by email at hello@3musafir.com or by WhatsApp at +92 322 1848940 for trips, private journeys, or Pakistan DMC enquiries.',
  },
];

const footerLinkGroups = [
  {
    title: 'Travel',
    links: [
      { href: '/fixed-departure', label: 'Fixed departures', description: 'Live and upcoming community trips.' },
      { href: '/explore', label: 'Explore', description: 'How 3Musafir trips are shaped.' },
      { href: '/reviews', label: 'Reviews', description: 'Traveler stories and trust signals.' },
      { href: '/why', label: 'Why 3Musafir', description: 'Women-first travel purpose and approach.' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/trust', label: 'Trust & Safety', description: 'Verification, vendors, and safety systems.' },
      { href: '/trust/verification', label: 'Verification', description: 'How traveler verification works.' },
      { href: '/musafircommunityequityframework', label: 'Community framework', description: 'Respect, inclusion, and accountability.' },
      { href: '/about-3musafir', label: 'About 3Musafir', description: 'Company story and operating values.' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/pakistan-dmc', label: 'Pakistan DMC', description: 'Inbound services for agencies.' },
      { href: '/founderportfolio', label: 'Founder portfolio', description: 'Founders, community, and traveltech work.' },
      { href: '/login', label: 'Login', description: 'Account access for Musafirs.' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { href: '/refundpolicyby3musafir', label: 'Refund policy', description: 'Refund and cancellation rules.' },
      { href: '/terms&conditonsby3musafir', label: 'Terms', description: 'Trip and platform terms.' },
      { href: '/trust/vendor-onboarding', label: 'Vendor onboarding', description: 'Partner standards.' },
    ],
  },
];

const expectedStaticRoutes = new Set(INDEXABLE_PATHS);
const linkedRoutes = new Set(footerLinkGroups.flatMap((group) => group.links.map((link) => link.href)));
const missingStaticRoutes = Array.from(expectedStaticRoutes).filter(
  (route) => route !== '/' && !linkedRoutes.has(route)
);

if (process.env.NODE_ENV !== 'production' && missingStaticRoutes.length > 0) {
  // Keep the compact route hub aligned with the public sitemap during local development.
  console.warn('Homepage route hub is missing sitemap routes:', missingStaticRoutes);
}

export default function PublicHomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}#homepage`,
        url: siteUrl,
        name: title,
        headline: 'Explore Pakistan with a verified community, not a random tour group.',
        description,
        inLanguage: 'en-PK',
        isAccessibleForFree: true,
        dateModified: '2026-06-07',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteUrl}/communityimage7.jpg`,
          caption: '3Musafir travelers together on a mountain road in northern Pakistan',
        },
        isPartOf: {
          '@id': `${siteUrl}#website`,
        },
        about: [
          { '@type': 'Thing', name: 'Pakistan group tours' },
          { '@type': 'Thing', name: 'Women-first travel experiences' },
          { '@type': 'Thing', name: 'Verified community-led travel' },
          { '@type': 'Thing', name: 'Hunza and Skardu trips' },
          { '@type': 'Thing', name: 'Pakistan DMC services' },
        ],
        mainEntity: {
          '@id': `${siteUrl}#travelagency`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '3Musafir',
            item: siteUrl,
          },
        ],
      },
      {
        '@type': 'TravelAgency',
        '@id': `${siteUrl}#travelagency`,
        name: siteName,
        alternateName: ['Teen Musafir', '3Musafir Travels'],
        url: siteUrl,
        logo: logoUrl,
        image: `${siteUrl}/communityimage7.jpg`,
        description,
        areaServed: [
          'Pakistan',
          'Hunza',
          'Skardu',
          'Fairy Meadows',
          'Chitral',
          'Kashmir',
          'Gilgit-Baltistan',
        ],
        knowsAbout: [
          'Pakistan group tours',
          'Women-first travel in Pakistan',
          'Community-led travel',
          'Inbound Pakistan DMC services',
          'Hunza group tours',
          'Skardu group tours',
          'Fairy Meadows trips',
          'Travel verification',
        ],
        contactPoint: contactPoints,
        sameAs,
        makesOffer: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Verified Pakistan group tours',
              serviceType: 'Community-led fixed departures',
              areaServed: 'Pakistan',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Women-first travel experiences',
              serviceType: 'Women-first group travel',
              areaServed: 'Pakistan',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Pakistan DMC services',
              serviceType: 'Inbound destination management',
              areaServed: 'Pakistan',
            },
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}#travel-styles`,
        name: '3Musafir travel styles',
        itemListElement: travelStyles.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: `${siteUrl}${item.href}`,
          description: item.description,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}#reviews`,
        name: '3Musafir traveler review excerpts',
        itemListElement: testimonials.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Review',
            name: item.context,
            reviewBody: item.quote,
            author: {
              '@type': 'Person',
              name: item.name,
            },
            itemReviewed: {
              '@id': `${siteUrl}#travelagency`,
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="3Musafir, Pakistan group tours, women-first travel Pakistan, Hunza group tour, Skardu group tour, Fairy Meadows trip, verified group travel, community-led travel, Pakistan DMC, inbound Pakistan tour operator"
        />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="language" content="en-PK" />
        <meta name="geo.region" content="PK" />
        <meta name="geo.placename" content="Pakistan" />
        <meta name="classification" content="Travel agency, Pakistan group tours, Pakistan DMC" />
        <link rel="canonical" href={siteUrl} key="canonical" />
        <link rel="alternate" hrefLang="en-PK" href={siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_PK" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:image" content={`${siteUrl}/communityimage7.jpg`} />
        <meta property="og:image:alt" content="3Musafir travelers together in northern Pakistan" />
        <meta property="og:image:width" content="1600" />
        <meta property="og:image:height" content="900" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/communityimage7.jpg`} />
        <meta name="twitter:image:alt" content="3Musafir travelers together in northern Pakistan" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="min-h-screen overflow-x-hidden bg-canvas-base text-heading">
        <section className="relative flex min-h-[92vh] flex-col overflow-hidden bg-heading text-white">
          <Image
            src="/communityimage7.jpg"
            alt="3Musafir travelers together on a mountain road in northern Pakistan"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-heading/95 via-heading/70 to-heading/25" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-heading/90 to-heading/0" />

          <PublicHeader variant="transparentOverlay" hideAuthCta>
            <nav className="hidden items-center gap-5 text-sm font-medium text-white/82 md:flex">
              <Link href="/fixed-departure" className="hover:text-white">
                Trips
              </Link>
              <Link href="/reviews" className="hover:text-white">
                Reviews
              </Link>
              <Link href="/why" className="hover:text-white">
                Women-first
              </Link>
              <Link href="/pakistan-dmc" className="hover:text-white">
                DMC
              </Link>
            </nav>
          </PublicHeader>

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pb-8 pt-20 sm:px-6 lg:px-8 xl:px-10 lg:pb-12">
            <div className="max-w-4xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/24 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
                <HeartHandshake className="h-4 w-4" />
                Community-led travel from Pakistan
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-7xl">
                Explore Pakistan with a verified community, not a random tour group.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/84 sm:text-lg">
                Women-first, safety-aware group trips to Hunza, Skardu, Fairy Meadows, and
                beyond. We handle the planning, group comfort, and on-ground coordination.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/fixed-departure"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary px-5 py-3 text-sm font-bold text-heading shadow-sm transition hover:bg-brand-primary-hover"
                >
                  Find a group trip
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

            <div className="mt-8 overflow-hidden rounded-lg border border-white/18 bg-white text-heading shadow-2xl">
              <div className="grid divide-y divide-canvas-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                {discoveryGroups.map(({ label, icon: Icon, options }) => (
                  <div key={label} className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-heading">
                      <Icon className="h-4 w-4 text-brand-primary" />
                      {label}
                    </div>
                    <div className="mt-3 space-y-2">
                      {options.map((option) => (
                        <Link
                          key={`${label}-${option.label}`}
                          href={option.href}
                          className="group flex items-center justify-between gap-3 rounded-md border border-canvas-line bg-canvas-base px-3 py-3 transition hover:border-brand-primary/60 hover:bg-white"
                        >
                          <span>
                            <span className="block text-sm font-bold text-heading">
                              {option.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-text">
                              {option.description}
                            </span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-heading/35 transition group-hover:text-brand-primary" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-10 sm:px-8 lg:px-12">
          <a
            href={trustpilotUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open 3Musafir reviews on Trustpilot"
            className="group mx-auto grid max-w-5xl gap-6 text-center text-heading transition hover:text-brand-primary sm:grid-cols-[1fr_auto_1fr] sm:items-center"
          >
            <div className="hidden h-px bg-canvas-line sm:block" />
            <div>
              <h2 className="text-2xl font-black leading-tight sm:text-3xl">
                Over 20,000 Musafirs have already experienced with us
              </h2>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-base font-bold text-heading">
                <span>Excellent</span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-6 w-6 fill-[#00B67A] text-[#00B67A]"
                    />
                  ))}
                </span>
                <span>
                  4.6 / 5 on Trustpilot
                </span>
              </div>
            </div>
            <div className="hidden h-px bg-canvas-line sm:block" />
          </a>
        </section>

        <section className="border-b border-canvas-line bg-white px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
                Quick answers
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl">
                What travelers and agencies should know about 3Musafir.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {answerCards.map((item) => (
                <article
                  key={item.question}
                  className="rounded-md border border-canvas-line bg-canvas-base p-5 shadow-sm"
                >
                  <h3 className="text-base font-bold text-heading">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-text">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <h2 className="text-4xl font-black leading-tight text-heading sm:text-5xl">
                Why 3Musafir
              </h2>
              <Link
                href="/why"
                className="inline-flex items-center gap-2 text-sm font-bold text-heading transition hover:text-brand-primary"
              >
                Read the approach
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
              {whySteps.map((step, index) => (
                <Link
                  key={step.highlight}
                  href="/why"
                  className="group relative flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-canvas-line bg-white px-4 pb-5 pt-14 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/50 sm:min-h-[210px] sm:px-6 lg:min-h-[176px]"
                >
                  {index < whySteps.length - 1 && (
                    <span className="absolute left-full top-1/2 hidden h-px w-7 bg-canvas-line lg:block" />
                  )}
                  <span className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-canvas-line bg-canvas-base sm:h-24 sm:w-24">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(min-width: 640px) 96px, 80px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="text-base font-medium leading-snug text-heading sm:text-xl">
                    {step.before}{' '}
                    <span className="rounded-sm bg-brand-primary/18 px-1.5 py-0.5">
                      {step.highlight}
                    </span>
                    {step.after}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-canvas-base px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
                  Find your travel style
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-heading sm:text-4xl">
                  Pick the kind of trip that matches your comfort, pace, and people.
                </h2>
              </div>
              <Link
                href="/fixed-departure"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-heading px-5 py-3 text-sm font-bold text-heading transition hover:bg-heading hover:text-white"
              >
                See departures
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {travelStyles.map(({ title: cardTitle, label, description: cardDescription, href, image, icon: Icon }) => (
                <Link
                  key={cardTitle}
                  href={href}
                  className="group grid min-h-[220px] overflow-hidden rounded-md border border-canvas-line bg-white shadow-sm transition hover:border-brand-primary/50 md:grid-cols-[0.9fr_1.1fr]"
                >
                  <div className="relative min-h-[180px] md:min-h-full">
                    <Image
                      src={image}
                      alt={`${cardTitle} travel style`}
                      fill
                      sizes="(min-width: 1024px) 17vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-primary">
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                      <h3 className="mt-4 text-lg font-bold leading-6 text-heading">
                        {cardTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-text">{cardDescription}</p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-heading">
                      Explore
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-heading px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
                  Real Musafir stories
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                  People come for a route. They remember the group.
                </h2>
              </div>
              <p className="text-base leading-8 text-white/76">
                Traveler feedback repeatedly mentions safety, solo-travel nerves, captain support,
                friendship, and the feeling of belonging. These are the signals first-time Musafirs
                look for before joining.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure
                  key={`${testimonial.name}-${testimonial.context}`}
                  className="rounded-md border border-white/14 bg-white/8 p-5"
                >
                  <Star className="h-5 w-5 fill-brand-primary text-brand-primary" />
                  <blockquote className="mt-5 text-base font-medium leading-8 text-white">
                    "{testimonial.quote}"
                  </blockquote>
                  <figcaption className="mt-6 border-t border-white/14 pt-4">
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="mt-1 text-sm text-white/68">{testimonial.context}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary px-5 py-3 text-sm font-bold text-heading transition hover:bg-brand-primary-hover"
              >
                Read Musafir stories
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
                Book with confidence
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl">
                Clarity before the road gets unpredictable.
              </h2>
              <p className="mt-5 text-base leading-8 text-text">
                Pakistan travel depends on people, weather, route conditions, and supplier quality.
                3Musafir makes those details clearer before someone commits.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {confidenceItems.map((item) => (
                <div key={item.title} className="rounded-md border border-canvas-line bg-white p-5 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                  <h3 className="mt-4 text-base font-bold text-heading">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
                Pakistan DMC services
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl">
                Bringing agencies into Pakistan with local operating context.
              </h2>
              <p className="mt-5 text-base leading-8 text-text">
                For international travel agencies, 3Musafir supports route planning, hotels,
                transport, guides, vendor coordination, and contingency-aware execution across
                Pakistan.
              </p>
              <Link
                href="/pakistan-dmc"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-heading px-5 py-3 text-sm font-bold text-white transition hover:bg-heading/90"
              >
                Explore DMC services
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[320px] overflow-hidden rounded-md">
              <Image
                src="/communityimage14.jpg"
                alt="3Musafir ground transport on a Pakistan route"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-primary">
              Questions before your first trip
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl">
              The practical things people ask before joining.
            </h2>
            <div className="mt-8 space-y-3">
              {faqItems.map((item) => (
                <details key={item.question} className="group rounded-md border border-canvas-line bg-white p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-bold text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    {item.question}
                    <span className="text-brand-primary transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-text">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
