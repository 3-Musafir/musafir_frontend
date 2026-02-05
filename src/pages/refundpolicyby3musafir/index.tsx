"use client";

import Head from "next/head";
import Header from "@/components/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "../navigation";

export default function RefundPolicyBy3Musafir() {
  const standardTiers = [
    {
      label: "More than 15 days prior",
      percent: 100,
      detail: "100% refund minus PKR 500 processing fee",
    },
    {
      label: "10–14 days prior",
      percent: 50,
      detail: "50% refund minus PKR 500 processing fee",
    },
    {
      label: "5–9 days prior",
      percent: 30,
      detail: "30% refund minus PKR 500 processing fee",
    },
    {
      label: "Less than 5 days prior",
      percent: 0,
      detail: "No refund",
    },
  ];

  const ogTiers = [
    {
      label: "More than 48 hours before departure",
      percent: 100,
      detail: "100% refund minus PKR 500 processing fee",
    },
    {
      label: "Within 48 hours of departure",
      percent: 75,
      detail: "75% refund minus PKR 500 processing fee",
    },
  ];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/refundpolicyby3musafir`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Explore",
        item: `${siteUrl}/explore`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Refund & Cancellation Policy",
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    <div className="min-h-screen bg-gray-50 text-foreground flex flex-col">
      <Header setSidebarOpen={() => {}} showMenuButton={false} />

      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
        <div className="mx-auto w-full max-w-6xl space-y-8 lg:space-y-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-heading">
              3Musafir Trip Cancellation, Refund, Wallet Credit &amp; Transfer Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last Updated: 21st January 2021
            </p>
          </div>

        {/* Summary */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-heading">How cancellations work</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>
                Cancellation/refund/credit/transfer requests must be submitted via the official Refund Request Form.
              </li>
              <li>
                Refund eligibility is calculated using the Refund Request Form submission date (not WhatsApp/calls/emails).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-heading">Processing fee</p>
                <p className="text-xs text-muted-foreground">Deducted from all cancellations.</p>
              </div>
              <p className="text-sm font-semibold text-heading">PKR 500</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-heading">Default refund method</p>
            <p className="text-sm text-muted-foreground">
              Wallet Credit is the preferred/default method; refunds to the original payment method may be available.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-heading">Wallet credit expiry</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Valid up to 12 months from issuance.</li>
              <li>
                Annual expiry rule: on 1st January, wallet credits issued in the immediately preceding calendar year expire.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-sm font-medium text-heading">Standard cancellation tiers</p>
            <div className="space-y-2">
              {standardTiers.map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-heading">{tier.label}</p>
                      <p className="text-xs text-muted-foreground">{tier.detail}</p>
                    </div>
                    <p className="text-sm font-semibold text-heading">{tier.percent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-sm font-medium text-heading">OG Musafir tiers</p>
            <p className="text-xs text-muted-foreground">
              OG Musafir = completed five (5) or more flagship multi-night trips.
            </p>
            <div className="space-y-2">
              {ogTiers.map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-heading">{tier.label}</p>
                      <p className="text-xs text-muted-foreground">{tier.detail}</p>
                    </div>
                    <p className="text-sm font-semibold text-heading">{tier.percent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed (expandable) */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="policy" className="border-gray-200/70">
              <AccordionTrigger className="text-sm text-brand-primary">
                View detailed policy
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      This Trip Cancellation, Refund, Wallet Credit &amp; Transfer Policy ("Policy") governs all bookings,
                      payments, cancellations, refunds, credits, and transfers made with 3Musafir Pvt. Ltd. ("3Musafir,"
                      "we," "us," or "our") through its website, mobile application, or any officially authorized sales channel.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By making a booking, submitting a payment, or participating in a trip organized by 3Musafir, the client
                      ("User," "Traveler," "Musafir" or "Customer") expressly acknowledges, agrees to, and is legally bound by
                      this Policy.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">1. Definitions</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Booking: A confirmed reservation for a trip, experience, or event organized by 3Musafir.</li>
                      <li>Departure Date: The officially published start date of the trip.</li>
                      <li>
                        Refund Request Form: The official digital form provided by 3Musafir through its app or website for
                        initiating refunds, wallet credits, or transfers.
                      </li>
                      <li>
                        Wallet / Wallet Credit: A non-cash digital credit balance maintained within the 3Musafir application,
                        usable solely for eligible 3Musafir offerings.
                      </li>
                      <li>
                        OG Musafir: A customer who has successfully completed five (5) or more flagship multi-night trips with
                        3Musafir.
                      </li>
                      <li>Advance Payment: The initial payment required to reserve a booking.</li>
                      <li>Processing Fee: A fixed administrative charge applied to cancellations.</li>
                      <li>Calendar Year: January 1 to December 31.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">
                      2. Mandatory Refund &amp; Cancellation Request Procedure
                    </h2>
                    <ul className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>
                        All cancellation, refund, wallet credit, or transfer requests must be submitted exclusively through the
                        official Refund Request Form.
                      </li>
                      <li>
                        Requests via phone call, WhatsApp, email, social media, or verbal communication shall not be deemed
                        valid unless accompanied by a properly submitted Refund Request Form.
                      </li>
                      <li>
                        The date and time of Refund Request Form submission shall be considered the official cancellation date,
                        irrespective of any prior communication.
                      </li>
                      <li>
                        3Musafir shall not be responsible for delays caused by incomplete, inaccurate, or improperly submitted
                        forms.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">3. Refund Methods &amp; User Wallet System</h2>
                    <ul className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>
                        Eligible refund amounts may be issued at the discretion of 3Musafir as either (a) Wallet Credit, or (b)
                        refund to the original payment method.
                      </li>
                      <li>
                        Wallet Credit is the preferred and default refund method due to faster processing times and
                        operational feasibility.
                      </li>
                      <li>
                        Wallet Credits are non-cash, non-transferable, non-withdrawable; usable only for eligible 3Musafir
                        products/services; and may not be sold, gifted, or assigned.
                      </li>
                      <li>
                        3Musafir reserves the right to restrict wallet usage for certain trips, promotions, or partner
                        offerings.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">4. Wallet Credit Validity &amp; Expiry</h2>
                    <ul className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>All Wallet Credits are valid for a maximum period of twelve (12) months from issuance.</li>
                      <li>
                        Annual Expiry Rule: On 1st January of every calendar year, all wallet credits issued in the immediately
                        preceding calendar year shall automatically expire in full, regardless of remaining balance.
                      </li>
                      <li>
                        Expired wallet credits are permanently forfeited and cannot be reinstated, extended, refunded, or
                        converted.
                      </li>
                      <li>
                        Users are solely responsible for monitoring wallet balances and expiry timelines via the app.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">5. Administrative Processing Fee</h2>
                    <ul className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>A non-refundable administrative processing fee of PKR 500 shall be deducted from all cancellations.</li>
                      <li>
                        The processing fee applies regardless of cancellation timing, refund method, and user status (including
                        OG Musafirs), unless explicitly stated otherwise.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">
                      6. Standard Cancellation Timeframes &amp; Refund Eligibility
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Refund eligibility is calculated strictly based on the number of days between the Departure Date and the
                      Refund Request Form submission date.
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>More than 15 days prior: 100% refund minus processing fee.</li>
                      <li>10–14 days prior: 50% refund minus processing fee.</li>
                      <li>5–9 days prior: 30% refund minus processing fee.</li>
                      <li>Less than 5 days prior: No refund.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      Refund percentages apply to the total amount paid by the user up to the cancellation date.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">7. Advance Payments &amp; Installments</h2>
                    <ul className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>All bookings require an Advance Payment to secure reservation.</li>
                      <li>Advance payments follow the general refund tiers and are not exempt.</li>
                      <li>Refund eligibility is calculated on amounts actually paid, not on remaining balances.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">8. Trip Transfers &amp; Future Credits</h2>
                    <ul className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>
                        Users may request to transfer their paid amount to a future trip instead of cancelling, provided the
                        transfer request is submitted at least seven (7) days prior to departure.
                      </li>
                      <li>Approval is subject to seat availability and pricing adjustments.</li>
                      <li>Requests made within seven (7) days of departure are not eligible for transfer.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">9. Enhanced Policy for OG Musafirs</h2>
                    <ul className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>OG Musafir eligibility requires completion of five (5) or more flagship multi-night trips.</li>
                      <li>More than 48 hours before departure: 100% refund minus processing fee.</li>
                      <li>Within 48 hours of departure: 75% refund minus processing fee.</li>
                      <li>
                        If an OG Musafir provides an approved replacement participant at the standard trip price, a full refund
                        including the processing fee may be granted.
                      </li>
                      <li>
                        OG Musafir cancellation cap: only one (1) full-refund cancellation per calendar year is permitted under
                        this privilege.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">10. Unforeseen Events &amp; Exceptions</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>
                        Medical Emergencies: valid medical documentation required; eligible for full refund minus processing fee.
                      </li>
                      <li>Flight Cancellations: refunds issued as wallet credit only; PKR 1,000 administrative deduction applies.</li>
                      <li>Political Unrest: full refund minus processing fee.</li>
                      <li>
                        Natural Disasters: priority given to rescheduling; if declined, 75% refund applies.
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      3Musafir’s determination of event classification shall be final and binding.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">11. Refund Processing Timelines</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Wallet Credits: 3–7 business days post-approval.</li>
                      <li>Bank/Card Refunds: 14–30 business days depending on banking institutions.</li>
                      <li>Processing timelines are estimates and not guaranteed.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">12. Policy Enforcement &amp; Abuse Prevention</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>3Musafir may reject refund requests suspected of abuse.</li>
                      <li>3Musafir may restrict wallet access or suspend accounts engaging in repeated cancellations.</li>
                      <li>
                        Attempts to manipulate refund timelines or systems may result in forfeiture of eligibility.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">13. Policy Modification</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>3Musafir reserves the right to amend this Policy at any time.</li>
                      <li>Material changes will be communicated at least 15 days in advance via app and website.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">14. Governing Law &amp; Jurisdiction</h2>
                    <p className="text-sm text-muted-foreground">
                      This Policy shall be governed by and construed in accordance with the laws of Pakistan. All disputes shall
                      be subject to the exclusive jurisdiction of courts in Lahore, Pakistan.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">15. Acceptance</h2>
                    <p className="text-sm text-muted-foreground">
                      By completing a booking or making payment, the user confirms full understanding and acceptance of this
                      Policy.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </div>
      </main>

      <Navigation />
    </div>
    </>
  );
}
