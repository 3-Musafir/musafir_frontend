'use client';

import Link from 'next/link';

export default function WhyPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
        <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
          <section
            id="purpose"
            className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 lg:p-10 shadow-sm"
          >
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text">Why we exist</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-heading leading-tight">
                Making travel safer, more comfortable, and more human for women in Pakistan
              </h1>
              <p className="text-base sm:text-lg text-text leading-relaxed">
                In Pakistan, many women want to travel — but hesitate due to safety concerns, social barriers, and the lack of trusted travel environments. 3Musafir exists to change that by building community-led group travel experiences where trust, structure, and care come first.
              </p>
            </div>
          </section>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
            <nav
              aria-label="Why 3Musafir overview"
              className="lg:hidden rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-text mb-3">On this page</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
                {[
                  { href: '#problem', label: 'The reality' },
                  { href: '#insight', label: 'Safety insight' },
                  { href: '#approach', label: 'Our approach' },
                  { href: '#community', label: 'Community' },
                  { href: '#impact', label: 'Beyond trips' },
                  { href: '#forward', label: 'Way forward' },
                  { href: '#next', label: 'Next steps' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary snap-start"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
            <aside className="hidden lg:block">
              <nav
                aria-label="Why 3Musafir overview"
                className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-text mb-4">On this page</p>
                <ul className="space-y-3 text-sm text-text">
                  <li>
                    <a
                      href="#problem"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      The reality of travel for women in Pakistan
                    </a>
                  </li>
                  <li>
                    <a
                      href="#insight"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Safety is not just about destinations
                    </a>
                  </li>
                  <li>
                    <a
                      href="#approach"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      How 3Musafir makes travel safer for women
                    </a>
                  </li>
                  <li>
                    <a
                      href="#community"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Why community-led travel changes everything
                    </a>
                  </li>
                  <li>
                    <a
                      href="#impact"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Beyond trips
                    </a>
                  </li>
                  <li>
                    <a
                      href="#forward"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      An intentional way forward
                    </a>
                  </li>
                  <li>
                    <a
                      href="#next"
                      className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                    >
                      Next steps
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>

            <div className="space-y-10 lg:space-y-12">
              <details id="problem" open className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">
                        The reality of travel for women in Pakistan
                      </h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    For many women in Pakistan, travel is not limited by curiosity or interest, but by safety concerns, unclear logistics, and the absence of reliable companions. Solo travel can feel risky, and traditional tour groups often fail to consider comfort, boundaries, and real-world challenges women face on the road.
                  </p>
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    This results in fewer opportunities to explore, delayed plans, or complete avoidance of travel — not because women don’t want to go, but because the environment does not feel safe or predictable.
                  </p>
                </div>
              </details>

              <details id="insight" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">
                        Safety is not just about destinations
                      </h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Travel safety for women is often discussed in terms of locations. At 3Musafir, we believe safety is primarily about people, systems, and expectations. Who you travel with, how groups are managed, how communication works, and how issues are handled matter more than the destination itself.
                  </p>
                  <p className="text-sm lg:text-base text-text">This insight shaped everything we built.</p>
                </div>
              </details>

              <section id="approach" className="space-y-6">
                <div className="max-w-3xl space-y-2">
                  <h2 className="text-2xl font-semibold text-heading">
                    How 3Musafir makes travel safer for women
                  </h2>
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: 'Community-first groups',
                      description:
                        'Trips are built around vetted groups, shared values, and clear group dynamics. No random assemblies, no ambiguity about who you are traveling with.',
                    },
                    {
                      title: 'Clear structure & accountability',
                      description:
                        'From itineraries to on-ground coordination, expectations are defined upfront. This reduces uncertainty, miscommunication, and uncomfortable situations.',
                    },
                    {
                      title: 'Care beyond logistics',
                      description:
                        'Support does not end at bookings. The 3Musafir team stays involved before, during, and after trips to ensure concerns are addressed quickly and respectfully.',
                    },
                  ].map((item) => (
                    <details
                      key={item.title}
                      className="group rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      <summary className="list-none cursor-pointer p-5 md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                            <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                          </div>
                          <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                            +
                          </span>
                        </div>
                      </summary>
                      <div className="px-5 md:px-6 pb-5 md:pb-6">
                        <p className="text-sm text-text mt-2 leading-relaxed">{item.description}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <details id="community" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">
                        Why community-led travel changes everything
                      </h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Community-led travel creates familiarity before the journey even begins. When travelers know they are part of a shared space — not just customers on a bus — trust forms naturally. For women, this sense of collective responsibility and belonging significantly improves comfort and confidence.
                  </p>
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    This is why many women travel with 3Musafir for their first group experience — and continue traveling with people they’ve already met.
                  </p>
                </div>
              </details>

              <details id="impact" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">Beyond trips</h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    Our goal is not just to organize journeys, but to normalize safe, thoughtful travel for women in Pakistan. Each successful trip builds confidence, changes perceptions, and makes the next journey easier — for one person, then many more.
                  </p>
                </div>
              </details>

              <details id="forward" className="group rounded-2xl bg-white border border-gray-200 shadow-sm">
                <summary className="list-none cursor-pointer p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-heading">An intentional way forward</h2>
                      <p className="text-xs text-text/70 mt-2">Tap to expand</p>
                    </div>
                    <span className="mt-1 text-brand-primary text-lg transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
                  <p className="text-sm lg:text-base text-text leading-relaxed">
                    3Musafir is built for people who value safety, clarity, and shared respect. Especially for women, travel should feel empowering — not stressful. We are here to make that possible, one journey and one community at a time.
                  </p>
                </div>
              </details>

              <section id="next" className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-2xl space-y-2">
                    <h2 className="text-xl font-semibold text-heading">Next steps</h2>
                    <p className="text-sm text-text leading-relaxed">
                      When you’re ready, explore journeys built with the same community-led approach.
                    </p>
                  </div>
                  <Link
                    href="/home"
                    className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    Explore journeys →
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
