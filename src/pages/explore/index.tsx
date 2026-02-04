'use client';

import Link from 'next/link';

export default function Explore() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="w-full bg-white border-b">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10 h-16 lg:h-20">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-heading">3Musafir</span>
            <span className="text-xs text-text">Explore</span>
          </div>
          <Link
            href="/login"
            aria-label="Already a Musafir? Sign in"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Already a Musafir?
          </Link>
        </div>
      </header>

      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-8 md:py-10 lg:py-14">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <section className="rounded-2xl bg-gradient-to-br from-[#515778] via-[#3e425f] to-[#2c3047] text-white p-6 md:p-8 lg:p-12 shadow-sm">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Community-led travel</p>
              <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Travel built around people, not packages
              </h1>
              <p className="text-base sm:text-lg text-white/90">
                3Musafir is a community-first travel platform where journeys are shaped by shared values, trust, and meaningful experiences — before dates, prices, or destinations.
              </p>
              <Link
                href="#how-it-works"
                className="inline-flex items-center text-sm text-white/80 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                New here? Start with how 3Musafir works →
              </Link>
            </div>
          </section>

          <section className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-3 no-scrollbar snap-x snap-mandatory">
            <Link
              href="#how-it-works"
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              How it works
            </Link>
            <Link
              href="#paths"
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              Choose your path
            </Link>
            <Link
              href="#signals"
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              Signals of life
            </Link>
            <Link
              href="#why"
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
            >
              Why we exist
            </Link>
          </section>

          <section id="how-it-works" className="space-y-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl font-semibold text-heading">How 3Musafir works</h2>
            </div>
            <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
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
                <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                  <p className="text-sm text-text mt-2 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 text-center">
            <p className="text-base md:text-lg font-medium text-heading">
              Most trips start with dates. Ours start with people.
            </p>
          </section>

          <section id="paths" className="space-y-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl font-semibold text-heading">Choose your path</h2>
            </div>
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
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 md:p-6 transition hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary shadow-sm"
                >
                  <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                  <p className="text-sm text-text mt-2 leading-relaxed">{item.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-primary">
                    Go →
                  </span>
                </Link>
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
                  title: 'Why 3Musafir exists',
                  description:
                    'Learn about the purpose, values, and long-term vision behind building a more human way to travel together.',
                  href: '/why',
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-gray-200/70 bg-white/70 p-5 md:p-6 text-text/90 transition hover:border-brand-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <h3 className="text-base font-semibold text-heading/90">{item.title}</h3>
                  <p className="text-sm text-text/80 mt-2 leading-relaxed">{item.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-primary/80">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section
            id="signals"
            className="rounded-2xl bg-orange-50/60 border border-orange-100 p-6 lg:p-8 space-y-3"
          >
            <p className="text-sm text-text">
              Some journeys here are still just ideas — and that’s intentional.
            </p>
            <p className="text-sm text-text">
              Not every experience is public. Some are shaped quietly, within the community.
            </p>
            <p className="text-sm text-text">
              This space keeps evolving as Musafirs do.
            </p>
          </section>

          <section id="why" className="space-y-3 max-w-3xl">
            <h2 className="text-2xl font-semibold text-heading">Why 3Musafir exists</h2>
            <p className="text-sm text-text leading-relaxed">
              3Musafir was created to make travel feel safer, more intentional, and more human — especially in group settings where trust and comfort matter most. We believe meaningful journeys are built through shared values, clear expectations, and communities that look out for each other.
            </p>
            <Link
              href="/why"
              className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Read our story →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
