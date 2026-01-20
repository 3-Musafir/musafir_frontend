"use client";

import Link from "next/link";
import Header from "@/components/header";

export default function RefundPolicyBy3Musafir() {
  const externalUrl = "https://3musafir.com/refundpolicyby3musafir";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header setSidebarOpen={() => {}} showMenuButton={false} />

      <main className="mx-auto w-full max-w-md px-4 pb-10 pt-16 md:pt-6 space-y-4">
        <h1 className="text-2xl font-semibold text-heading">Refund Policy</h1>
        <p className="text-sm text-text">
          This is the official 3Musafir refund policy. For the latest version,
          please view it on our website.
        </p>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-md bg-brand-primary px-4 py-3 text-btn-secondary-text hover:bg-brand-primary-hover"
        >
          Open Refund Policy
        </a>
        <Link
          href="/passport"
          className="block text-center text-sm text-brand-primary hover:underline"
        >
          Back to Passport
        </Link>
      </main>
    </div>
  );
}

