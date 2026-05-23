import Link from "next/link";

export default function DmcCard() {
  return (
    <Link
      href="/pakistan-dmc"
      className="group relative overflow-hidden rounded-2xl border border-[#ff3b0a]/25 bg-gradient-to-br from-white via-white to-[#fff4f0] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#ff3b0a]/10 blur-2xl" />
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#ff3b0a]">
            For agencies and partners
          </span>
          <h3 className="text-lg font-semibold text-heading">Pakistan DMC</h3>
          <p className="text-sm text-text">
            Ground handling, transport, hotels, guides, and inbound logistics for Pakistan programs.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff3b0a]">
          <span>View DMC services</span>
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
