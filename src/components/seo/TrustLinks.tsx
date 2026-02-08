import Link from "next/link";

export default function TrustLinks({ className = "" }: { className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
      aria-label="Trust and safety links"
    >
      <p className="text-sm font-semibold text-heading">Travel with clarity</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Learn how 3Musafir verifies travelers and partners.
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <Link
          href="/trust"
          className="rounded-full border border-brand-primary px-4 py-1.5 text-brand-primary hover:bg-brand-primary/10"
        >
          Trust & Safety Hub
        </Link>
        <Link
          href="/about-3musafir"
          className="rounded-full border border-gray-200 px-4 py-1.5 text-heading hover:border-brand-primary"
        >
          About 3Musafir
        </Link>
      </div>
    </section>
  );
}
