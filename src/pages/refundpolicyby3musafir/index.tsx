"use client";

import Header from "@/components/header";
import { Navigation } from "../navigation";

export default function RefundPolicyBy3Musafir() {
  const externalUrl = "https://3musafir.com/refundpolicyby3musafir";

  const tiers = [
    { label: "15+ days", percent: 100, detail: "Full refund (minus processing fee)" },
    { label: "10-14 days", percent: 50, detail: "Partial refund (minus processing fee)" },
    { label: "5-9 days", percent: 30, detail: "Partial refund (minus processing fee)" },
    { label: "0-4 days", percent: 0, detail: "No refund" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header setSidebarOpen={() => {}} showMenuButton={false} />

      <main className="mx-auto w-full max-w-md px-4 pt-16 md:pt-6 pb-24 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-heading">Refund Policy</h1>
          <p className="text-sm text-muted-foreground">
            Summary shown in-app. The official policy is available on our website.
          </p>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-heading">Processing fee</p>
              <p className="text-xs text-muted-foreground">Deducted from the refundable amount.</p>
            </div>
            <p className="text-sm font-semibold text-heading">PKR 500</p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-sm font-medium text-heading">Refund tiers</p>
            <div className="mt-2 space-y-2">
              {tiers.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-heading">{tier.label}</p>
                    <p className="text-xs text-muted-foreground">{tier.detail}</p>
                  </div>
                  <p className="text-sm font-semibold text-heading">{tier.percent}%</p>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Refund amount = floor(amountPaid × tier%) − 500, minimum 0.
            </p>
          </div>
        </section>

        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-md bg-brand-primary px-4 py-3 text-btn-secondary-text hover:bg-brand-primary-hover"
        >
          View official refund policy
        </a>
      </main>

      <Navigation />
    </div>
  );
}
