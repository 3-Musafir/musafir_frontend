"use client";

import Head from "next/head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "../navigation";

export default function TermsAndConditionsBy3Musafir() {
  const summaryPoints = [
    "Carry original CNIC during the trip.",
    "Personal belongings are your responsibility; travel insurance is recommended.",
    "You must follow the Community Equity Framework; violations can lead to removal without refund.",
    "Trips/itineraries may change due to external factors.",
    "Refunds/cancellations follow the refund policy and timelines.",
    "Media captured by 3Musafir may be used for marketing per these terms.",
  ];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/terms&conditonsby3musafir`;
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
        name: "Terms and conditions",
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

      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
        <div className="mx-auto w-full max-w-6xl space-y-8 lg:space-y-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-heading">
              3Musafir Trip Registration Terms and Conditions
            </h1>
            <p className="text-sm text-muted-foreground">Effective Date: 17th March 2021</p>
          </div>

        {/* Summary */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-heading">Quick summary</p>
            <p className="text-sm text-muted-foreground">
              These terms apply to bookings and participation in 3Musafir trips and services.
            </p>
          </div>

          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {summaryPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Detailed (expandable) */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="terms" className="border-gray-200/70">
              <AccordionTrigger className="text-sm text-brand-primary">
                View complete terms and conditions
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    These Terms and Conditions (the “Terms”) constitute a binding legal agreement between 3Musafir Pvt. Ltd.
                    (“3Musafir”, “the Company”, “we”, “our”, “us”) and the client (“Participant”, “you”, “your”). By booking a
                    trip, registering for trip-related services, or otherwise engaging with the Company, you agree to be
                    legally bound by these Terms and acknowledge that you have read, understood, and accept all provisions.
                  </p>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">1. Introduction to the Agreement</h2>
                    <p className="text-sm text-muted-foreground">
                      1.1 These Terms govern the rights, duties, and obligations of 3Musafir and the Participant concerning all
                      bookings, trips, services, and related activities. By proceeding with a booking, the Participant
                      unconditionally consents to be bound by these Terms. Consent may be provided through digital acceptance
                      (click-wrap) and payment authorization via our booking platforms.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      1.2 Any changes, amendments, or modifications to these Terms will be communicated to Participants and shall
                      be effective upon such notification, subject to the Company’s discretion and applicable notice period,
                      unless otherwise stipulated by law.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">2. General Terms and Conditions</h2>
                    <p className="text-sm text-muted-foreground">
                      2.1 Identification Requirement: All Participants are required to possess and carry their original National
                      Identity Card (CNIC) at all times during the trip. Failure to comply may result in disqualification from
                      participation in the trip without any refund or recourse.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2.2 Liability for Personal Belongings: The Company shall not be held liable for loss, theft, or damage to
                      personal belongings during the trip. Participants are recommended to obtain comprehensive travel insurance.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2.3 Compliance with Community Equity Framework: The Participant is bound by the Community Equity Framework.
                      Failure to adhere may result in removal from the trip without refund or compensation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">3. Safety and Risk Acknowledgment</h2>
                    <p className="text-sm text-muted-foreground">
                      3.1 Safety Commitment: 3Musafir follows safety protocols; however, travel and outdoor activities involve
                      inherent risks. The Participant acknowledges these risks and agrees the Company’s liability is limited as
                      described herein.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      3.2 Insurance Mandate: Travel insurance is strongly recommended. The obligation to obtain coverage rests
                      solely with the Participant.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">4. Itinerary and Trip Changes</h2>
                    <p className="text-sm text-muted-foreground">
                      4.1 The Company reserves the right to alter, modify, or cancel itineraries due to external factors (weather,
                      regulations, disasters, disruptions, etc.). Reasonable efforts will be made to notify Participants.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      4.2 Refunds Due to Changes: Where changes materially impact the experience, an appropriate refund or
                      alternative compensation may be offered at the Company’s discretion, subject to the refund policy.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">5. Financial Terms</h2>
                    <p className="text-sm text-muted-foreground">
                      5.1 Dynamic Pricing: Trip costs may change due to external economic factors. Pricing adjustments for future
                      bookings may be communicated.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      5.2 Payment Methods: Full payment must be received before departure unless otherwise agreed in writing.
                      Failure to complete payment may result in cancellation of booking.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">6. Data Usage and Privacy</h2>
                    <p className="text-sm text-muted-foreground">
                      6.1 By registering, the Participant consents to collection and processing of personal data for operations and
                      compliance with legal obligations.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      6.2 Marketing Opt-Out: Participants may opt out of marketing communications by notifying the Company.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">7. Third-Party Services</h2>
                    <p className="text-sm text-muted-foreground">
                      7.1 3Musafir uses third-party providers with due care but does not assume liability for their actions or
                      failures.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">8. Cancellation Policy</h2>
                    <p className="text-sm text-muted-foreground">
                      8.1 Cancellation by 3Musafir: Trips may be cancelled due to force majeure, safety, low bookings, or external
                      factors; refunds may exclude non-recoverable costs.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      8.2 Cancellation by Participant: Cancellations are subject to tiered refund structure and administrative
                      fees as detailed in the refund process.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">9. Force Majeure Clause</h2>
                    <p className="text-sm text-muted-foreground">
                      9.1 3Musafir shall not be liable for delays/cancellations due to force majeure events beyond reasonable
                      control. Alternative arrangements may be offered without guarantee.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">10. Refund Process and Procedures</h2>
                    <p className="text-sm text-muted-foreground">
                      10.1 Refund requests must be submitted via the official platform with required documentation. Processing may
                      take up to 30 business days depending on method and complexity.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      10.2 Refund eligibility is governed by cancellation windows, administrative fees, and non-recoverable third
                      party costs.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">11. Legal Compliance and Dispute Resolution</h2>
                    <p className="text-sm text-muted-foreground">
                      11.1 Governing Law: These Terms are governed by the laws of Pakistan.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      11.2 Dispute Resolution: Participants agree to attempt amicable resolution first; disputes fall under the
                      competent courts of Lahore.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">12. Amendment of Terms</h2>
                    <p className="text-sm text-muted-foreground">
                      12.1 The Company may amend these Terms. Amendments take effect upon posting/notification.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">13. Intellectual Property and Media Content</h2>
                    <p className="text-sm text-muted-foreground">
                      13.1 Rights to Media Content: Media captured by 3Musafir during trips is the property of 3Musafir; the
                      Participant grants a perpetual, royalty-free license for marketing and related use.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      13.2 Participant’s Media Usage: Participants may capture personal media; commercial use involving Company
                      branding/staff requires written consent.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">14. Luggage and Transport Liability</h2>
                    <p className="text-sm text-muted-foreground">
                      14.1 Local transport may involve risks to luggage; 3Musafir is not responsible for damage/theft in transit.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      14.2 Packing Responsibility: Participants must pack appropriately and secure belongings.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">15. Loyalty Discount Policy</h2>
                    <p className="text-sm text-muted-foreground">
                      15.1 Per-Trip Discount: Each trip attended earns a PKR 500 discount on the next booking (non-transferable).
                    </p>
                    <p className="text-sm text-muted-foreground">
                      15.2 Discount Cap: Accumulates up to PKR 5,000 (10 trips). On the 11th trip, the discount is a flat PKR
                      5,000.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">16. Acknowledgment and Acceptance</h2>
                    <p className="text-sm text-muted-foreground">
                      By booking and proceeding with payment, the Participant acknowledges and accepts these Terms in their
                      entirety, including updates or amendments.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Legal Advice Notice: Participants are encouraged to seek independent legal advice for uncertainties.
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
