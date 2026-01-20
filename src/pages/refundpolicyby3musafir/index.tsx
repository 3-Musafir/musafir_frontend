"use client";

import Header from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation } from "../navigation";

export default function RefundPolicyBy3Musafir() {
  const externalUrl = "https://3musafir.com/refundpolicyby3musafir";

  const tiers = [
    { label: "15+ days", percent: 100, detail: "Full refund (minus processing fee)" },
    { label: "10-14 days", percent: 50, detail: "Eligible for a 50% refund (minus processing fee)" },
    { label: "5-9 days", percent: 30, detail: "Eligible for a 30% refund (minus processing fee)" },
    { label: "0-4 days", percent: 0, detail: "Not eligible for a refund" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header setSidebarOpen={() => {}} showMenuButton={false} />

      <main className="mx-auto w-full max-w-md px-4 pt-16 md:pt-6 pb-24 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-heading">3Musafir Trip Cancellation and Refund Policy</h1>
          <p className="text-sm text-muted-foreground">
            Please read carefully before submitting a cancellation/refund request.
          </p>
        </div>

        {/* Summary */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-heading">Refund processing charge</p>
              <p className="text-xs text-muted-foreground">Administrative fee applied to all cancellations.</p>
            </div>
            <p className="text-sm font-semibold text-heading">PKR 500</p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-sm font-medium text-heading">Cancellation notification periods and refund tiers</p>
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

        {/* Official policy text */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Refund Form Requirement</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Clients must fill out the refund form to initiate a cancellation and refund request.</li>
              <li>The refund will be processed based on the date the refund form is submitted, not the initial cancellation request.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Refund Processing Charge</h2>
            <p className="text-sm text-muted-foreground">Administrative Fee: A fixed processing fee of 500 PKR will apply to all cancellations, regardless of when they are made.</p>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Cancellation Notification Periods and Refund Tiers</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>More than 15 Days Before Departure: Eligible for a full refund (minus the processing fee).</li>
              <li>Between 10 to 14 Days Before Departure: Eligible for a 50% refund (minus the processing fee).</li>
              <li>Between 5 to 9 Days Before Departure: Eligible for a 30% refund (minus the processing fee).</li>
              <li>Less than 5 Days Before Departure: Not eligible for a refund.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Refund Rules for Advance Payments &amp; Trip Transfers</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Every client first pays an advance amount, then proceeds to pay the remaining amount either in full, in two parts, or on the day of departure.</li>
              <li>Advance Payment Refund: Refund rules for advance payments follow the general refund tiers mentioned above.</li>
              <li>
                Trip Transfers: Clients may transfer their advance payment to a future trip instead of canceling, provided they inform 3Musafir at least 7 days before departure.
              </li>
              <li>Requests made less than 7 days before departure will not be eligible for transfer, and general refund rules will apply.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Enhanced Terms for Frequent Travelers (OG Musafirs)</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Eligibility: Clients who have participated in 5 or more flagship trips (more than 1 night trips) with 3Musafir.</li>
              <li>Full refund for cancellations more than 48 hours before departure, minus the processing fee.</li>
              <li>75% refund for cancellations within 48 hours of departure, minus the processing fee.</li>
              <li>
                Full refund, including processing fee, if OG Musafirs provide a replacement for their booking at the standard trip price, subject to approval by 3Musafir.
              </li>
              <li>OG Musafir Cancellation Limit: OG Musafirs can only request one full-refund cancellation per year under this policy.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Unforeseen Events &amp; Exceptions</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Medical Emergencies: General refund rules apply; with a valid doctor’s slip, eligible for a full refund (minus the processing fee).</li>
              <li>Flight Cancellations: Trip credit instead of a refund, with a 1,000 PKR deductible.</li>
              <li>Political Unrest: Full refund minus the 500 PKR processing fee.</li>
              <li>Natural Disasters: 3Musafir will provide a new trip date; if the client opts out, they will receive a 75% refund.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Standard Policy for Other Clients</h2>
            <p className="text-sm text-muted-foreground">
              All other participants who do not qualify as OG Musafirs are subject to the standard refund tiers as outlined above.
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Policy Modification and Notice</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>3Musafir reserves the right to modify these terms.</li>
              <li>Any policy changes will be communicated at least 15 days in advance for existing bookings.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-heading">Refund Processing Timeline</h2>
            <p className="text-sm text-muted-foreground">All refunds will be processed within 14-30 business days after approval.</p>
          </div>

          <Accordion type="single" collapsible className="pt-2">
            <AccordionItem value="official-link" className="border-border">
              <AccordionTrigger className="text-sm text-brand-primary">View official refund policy</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  This opens the official version on the 3Musafir website.
                </p>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-sm font-medium text-brand-primary hover:underline"
                >
                  {externalUrl}
                </a>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <Navigation />
    </div>
  );
}
