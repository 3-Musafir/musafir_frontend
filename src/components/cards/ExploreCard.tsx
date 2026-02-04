import Link from "next/link";

export default function ExploreCard() {
  return (
    <Link
      href="/explore"
      className="group relative overflow-hidden rounded-2xl border border-brand-primary/30 bg-gradient-to-br from-white via-white to-orange-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-brand-primary/10 blur-2xl" />
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
            See what Musafirs are planning
          </span>
          <h3 className="text-lg font-semibold text-heading">Discover</h3>
          <p className="text-sm text-text">
            Quiet ideas, upcoming journeys, and experiences shaped by the community — not algorithms.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
          <span>Explore with the community</span>
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
