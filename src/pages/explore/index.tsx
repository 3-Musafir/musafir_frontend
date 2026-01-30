'use client';

import Link from 'next/link';

export default function Explore() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="w-full bg-white border-b">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10 h-16 lg:h-20">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">3Musafir</span>
            <span className="text-xs text-gray-500">Explore</span>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-primary hover:text-brand-primary transition"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14 space-y-12">
        <section className="rounded-2xl bg-gradient-to-br from-[#515778] via-[#3e425f] to-[#2c3047] text-white p-8 lg:p-12 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Community-led travel</p>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              Discover curated trips built for Muslim travelers.
            </h1>
            <p className="text-base lg:text-lg text-white/90">
              Explore journeys designed with comfort, safety, and shared community experiences in mind.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/signup/create-account"
                className="rounded-full bg-white text-gray-900 px-5 py-2 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Join the community
              </Link>
              <Link
                href="/home"
                className="rounded-full border border-white/50 px-5 py-2 text-sm font-semibold text-white hover:border-white transition"
              >
                View current trips
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Curated flagships',
              description: 'Small groups, vetted itineraries, and trusted hosts.',
            },
            {
              title: 'Transparent pricing',
              description: 'Clear breakdowns, flexible payment options, no surprises.',
            },
            {
              title: 'Support all the way',
              description: 'Dedicated help from planning to post-trip follow-up.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">Plan less. Experience more.</h2>
              <p className="text-sm text-gray-600">
                We handle the logistics so you can focus on meaningful travel and community.
              </p>
            </div>
            <Link
              href="/signup/create-account"
              className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-primary/20 hover:bg-brand-primary-hover transition"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
