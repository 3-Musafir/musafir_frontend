import Link from "next/link";

export default function ExploreEmptyStateCard() {
  return (
    <div className="rounded-2xl border border-brand-primary/20 bg-gradient-to-br from-white via-white to-orange-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-heading">
            Nothing upcoming right now.
          </h3>
          <p className="text-sm text-text">
            Explore all trips and community journeys to find what fits.
          </p>
        </div>
        <Link
          href="/explore"
          aria-label="Go to Explore"
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Go to Explore
        </Link>
      </div>
    </div>
  );
}
