'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import CompanyProfileHero from '@/components/brand/CompanyProfileHero';
import useCompanyProfile from '@/hooks/useCompanyProfile';
import { CompanyProfile } from '@/services/types/companyProfile';

export default function Explore() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { getProfile } = useCompanyProfile();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const validIds = new Set(['community-led', 'how-it-works', 'paths', 'signals', 'why']);
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setOpenSection(null);
        return;
      }
      if (validIds.has(hash)) {
        setOpenSection(hash);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const profile = await getProfile();
        if (isMounted) {
          setCompanyProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <CompanyProfileHero companyProfile={companyProfile} loading={profileLoading} />
          <section id="community-led">
            <details
              open={openSection === 'community-led'}
              className="group rounded-2xl border border-gray-200 bg-white p-6 md:p-8 lg:p-10 shadow-sm"
            >
              <summary
                className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={(event) => {
                  event.preventDefault();
                  toggleSection('community-led');
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Community-led travel</p>
                    <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-heading">
                      Travel built around people, not packages
                    </h1>
                  </div>
                  <span className="mt-2 text-brand-primary text-xl transition group-open:rotate-45">+
                  </span>
                </div>
              </summary>
              <div className="mt-6 space-y-4">
                <p className="text-base sm:text-lg text-text">
                  3Musafir is a community-first travel platform where journeys are shaped by shared values, trust, and meaningful experiences — before dates, prices, or destinations.
                </p>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  New here? Start with how 3Musafir works →
                </Link>
              </div>
            </details>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Travel with clarity</p>
                <h2 className="text-xl font-semibold text-heading">Learn how we verify travelers and partners</h2>
                <p className="text-sm text-text leading-relaxed">
                  Explore the Trust & Safety Hub to see how verification, vendor onboarding, and travel education work together.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/trust"
                  className="rounded-full border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition"
                >
                  Trust & Safety Hub
                </Link>
                <Link
                  href="/about-3musafir"
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-heading hover:border-brand-primary transition"
                >
                  About 3Musafir
                </Link>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
              <Link
                href="/trust/verification"
                className="rounded-xl border border-gray-200 px-4 py-3 text-heading hover:border-brand-primary transition"
              >
                Verification
              </Link>
              <Link
                href="/trust/vendor-onboarding"
                className="rounded-xl border border-gray-200 px-4 py-3 text-heading hover:border-brand-primary transition"
              >
                Vendor onboarding
              </Link>
              <Link
                href="/trust/travel-education"
                className="rounded-xl border border-gray-200 px-4 py-3 text-heading hover:border-brand-primary transition"
              >
                Travel education
              </Link>
            </div>
          </section>

          <section className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-3 no-scrollbar snap-x snap-mandatory">
            <Link
              href="#how-it-works"
              onClick={() => setOpenSection('how-it-works')}
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              How it works
            </Link>
            <Link
              href="#paths"
              onClick={() => setOpenSection('paths')}
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              Choose your path
            </Link>
            <Link
              href="#signals"
              onClick={() => setOpenSection('signals')}
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              Signals of life
            </Link>
            <Link
              href="#why"
              onClick={() => setOpenSection('why')}
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              Why we exist
            </Link>
          </section>

          <section id="how-it-works">
            <details
              open={openSection === 'how-it-works'}
              className="group rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
            >
              <summary
                className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={(event) => {
                  event.preventDefault();
                  toggleSection('how-it-works');
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-heading">How 3Musafir works</h2>
                    <p className="text-sm text-text leading-relaxed">
                      A quick look at how community-led trips take shape from the people first.
                    </p>
                  </div>
                  <span className="mt-1 text-brand-primary text-xl transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <div className="mt-6 grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'It starts with the community',
                    description:
                      'Trips on 3Musafir begin with people — shared interests, comfort levels, and a sense of belonging — not just locations on a map.',
                  },
                  {
                    title: 'Journeys take shape',
                    description:
                      'From curated flagships to emerging ideas, experiences are designed thoughtfully with safety, pacing, and group dynamics in mind.',
                  },
                  {
                    title: 'The connection continues',
                    description:
                      'Travel doesn’t end on the last day. Musafirs stay connected through meetups, conversations, and future journeys together.',
                  },
                ].map((item) => (
                  <details
                    key={item.title}
                    className="group rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    <summary className="list-none cursor-pointer p-5 md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                        <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                          +
                        </span>
                      </div>
                    </summary>
                    <div className="px-5 md:px-6 pb-5 md:pb-6">
                      <p className="text-sm text-text leading-relaxed">{item.description}</p>
                    </div>
                  </details>
                ))}
              </div>
            </details>
          </section>

          <section id="paths">
            <details
              open={openSection === 'paths'}
              className="group rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
            >
              <summary
                className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={(event) => {
                  event.preventDefault();
                  toggleSection('paths');
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-heading">Choose your path</h2>
                    <p className="text-sm text-text leading-relaxed">
                      Explore ways to travel, connect, and build alongside the community.
                    </p>
                  </div>
                  <span className="mt-1 text-brand-primary text-xl transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: 'Travel with us',
                      description:
                        'Explore current flagships and upcoming journeys designed for comfort, safety, and shared experiences — led by the 3Musafir community.',
                      href: '/home',
                    },
                    {
                      title: 'Join the community',
                      description:
                        'Be part of conversations, meetups, and city-based groups where Musafirs connect beyond just trips.',
                      href: '/community',
                    },
                    {
                      title: 'Read Musafir reviews',
                      description:
                        'See the real questions people asked — and how their first experiences were described.',
                      href: '/reviews',
                    },
                  ].map((item) => (
                    <details
                      key={item.title}
                      className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-brand-primary"
                    >
                      <summary className="list-none cursor-pointer p-5 md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                          <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                            +
                          </span>
                        </div>
                      </summary>
                      <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
                        <p className="text-sm text-text leading-relaxed">{item.description}</p>
                        <Link
                          href={item.href}
                          className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                        >
                          Go →
                        </Link>
                      </div>
                    </details>
                  ))}
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  {[
                    {
                      title: 'Build with 3Musafir',
                      description:
                        'Explore opportunities and collaborations for people shaping the future of community-led travel.',
                      href: '/careers',
                    },
                    {
                      title: 'Trust & verification',
                      description:
                        'See how 3Musafir designs safety systems and accountability for group travel in Pakistan.',
                      href: '/trust',
                    },
                  {
                    title: 'Why 3Musafir exists',
                    description:
                      'Learn about the purpose, values, and long-term vision behind building a more human way to travel together.',
                    href: '/about-3musafir',
                  },
                  {
                    title: 'Founder portfolio',
                    description:
                      'A closer look at the founder’s journey, work, and the thinking behind 3Musafir.',
                    href: '/founderportfolio',
                  },
                ].map((item) => (
                    <details
                      key={item.title}
                      className="group rounded-2xl border border-gray-200/70 bg-white/70 text-text/90 transition hover:border-brand-primary/70"
                    >
                      <summary className="list-none cursor-pointer p-5 md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-semibold text-heading/90">{item.title}</h3>
                          <span className="mt-1 text-brand-primary/80 text-lg transition group-open:rotate-45">
                            +
                          </span>
                        </div>
                      </summary>
                      <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
                        <p className="text-sm text-text/80 leading-relaxed">{item.description}</p>
                        <Link
                          href={item.href}
                          className="inline-flex items-center text-sm font-semibold text-brand-primary/80 hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                        >
                          Learn more →
                        </Link>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </details>
          </section>

          <section id="signals">
            <details
              open={openSection === 'signals'}
              className="group rounded-2xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm"
            >
              <summary
                className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={(event) => {
                  event.preventDefault();
                  toggleSection('signals');
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-heading">Signals of life</h2>
                    <p className="text-sm text-text leading-relaxed">
                      Early hints of journeys the community is shaping next.
                    </p>
                  </div>
                  <span className="mt-1 text-brand-primary text-xl transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <div className="mt-4 space-y-3 text-sm text-text">
                <p>Some journeys here are still just ideas — and that’s intentional.</p>
                <p>Not every experience is public. Some are shaped quietly, within the community.</p>
                <p>This space keeps evolving as Musafirs do.</p>
              </div>
            </details>
          </section>

          <section id="why">
            <details
              open={openSection === 'why'}
              className="group rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
            >
              <summary
                className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={(event) => {
                  event.preventDefault();
                  toggleSection('why');
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-heading">Why we exist</h2>
                    <p className="text-sm text-text leading-relaxed">
                      We build travel around people, shared values, and the comfort of the group.
                    </p>
                  </div>
                  <span className="mt-1 text-brand-primary text-xl transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <div className="mt-4 space-y-4 text-sm text-text">
                <p className="text-base md:text-lg font-medium text-heading">
                  Most trips start with dates. Ours start with people.
                </p>
                <p className="leading-relaxed">
                  3Musafir exists to normalize safe, community-led travel in Pakistan by prioritizing trust, shared
                  expectations, and human connection before logistics.
                </p>
              </div>
            </details>
          </section>

        </div>
      </main>
    </div>
  );
}
