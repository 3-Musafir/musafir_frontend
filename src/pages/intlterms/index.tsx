"use client";

import Head from "next/head";
import { PublicPageContainer } from "@/components/layout/PublicLayout";
import { buildCanonical } from "@/lib/seo/seoConfig";

type PolicySection = {
  title: string;
  body?: string[];
  points?: string[];
  note?: string;
};

const bookingSummary = [
  "International bookings depend on seat availability, flight availability, visa processing timelines, hotel confirmation, and payment status.",
  "A booking is confirmed only once the required payment has been received by 3Musafir.",
  "Flights are booked only after full payment, and fares are locked only once the ticket is issued.",
  "Partial payment may allow visa verification only; full payment is required before final documents are released.",
];

const bookingSections: PolicySection[] = [
  {
    title: "1. Booking Principle",
    body: [
      "3Musafir believes in clear, honest, and controlled communication.",
      "All international experience bookings depend on seat availability, flight availability, visa processing timelines, hotel confirmation, and full or partial payment status.",
      "A booking is only considered confirmed once the required payment has been received by 3Musafir.",
    ],
  },
  {
    title: "2A. Package & Flight Policy - Group Flight",
    body: ["If group flight seats are available, the price is fixed and seats are limited."],
    points: [
      "Once your booking is confirmed, your price is locked.",
      "Group flight seats are offered on a first-paid, first-confirmed basis.",
      "Simple rule: group seat available means fixed price.",
    ],
  },
  {
    title: "2B. Package & Flight Policy - Individual Flight",
    body: [
      "If group flight seats are not available, the flight will be booked separately on live pricing. Final price depends on the fare available at the time of booking.",
      "If the individual flight price is close to the package estimate, the customer may proceed with the same package. If it is higher, 3Musafir will keep the ground package fixed and share the updated flight cost separately.",
    ],
    points: [
      "3Musafir does not guarantee the same fare after a delay in payment.",
      "Simple rule: no group seat means live flight price.",
    ],
  },
  {
    title: "3. Same Flight as the Group",
    body: [
      "Customers may travel on the same flight as the group only if group seats are still available.",
      "If group seats are not available, 3Musafir will book the closest possible flight option based on departure city, arrival timing, airline availability, fare availability, and group coordination requirements.",
    ],
    note: "Exact same flight is not guaranteed unless confirmed at the time of full payment.",
  },
  {
    title: "4. Flight Booking Rule",
    body: ["Flights are booked only after full payment is received."],
    points: [
      "Once full payment is received, the flight is booked instantly, subject to availability.",
      "The ticket is shared after booking.",
      "Fare is locked only after the ticket is issued.",
      "3Musafir is not responsible for fare increases caused by payment delays.",
    ],
  },
  {
    title: "5. Visa Policy",
    body: [
      "Visa processing is subject to embassy, consulate, airline, immigration, or third-party processing timelines.",
      "If the visa is under process, customers will be informed with an estimated timeline.",
      "Once the visa is issued, it will be shared for verification after partial payment has been completed.",
    ],
    note: "Visa approval is not guaranteed by 3Musafir unless clearly stated in writing for a specific package.",
  },
  {
    title: "6. Document Sharing Policy",
    body: [
      "3Musafir follows a strict document-sharing policy to avoid confusion, misuse, or incomplete information.",
      "After partial payment, 3Musafir may share the visa copy only for verification of name, passport number, visa dates, and basic travel details.",
      "Final travel documents are shared only after full payment is completed and are usually shared within 7 days before departure.",
    ],
    points: [
      "No payment means no documents.",
      "Partial payment means visa only, for verification.",
      "Full payment means complete final documents.",
      "No tentative documents are shared.",
      "No incomplete documents are shared.",
      "No unconfirmed hotel or flight details are shared as final documents.",
    ],
  },
  {
    title: "7. Hotel Policy",
    body: [
      "Hotel details are shared closer to departure, usually 7-10 days before the trip.",
      "Hotel names, rooming, and final allocations may depend on group size, availability, supplier confirmation, operational requirements, and final payment status.",
      "3Musafir may provide the same category of hotel even if the exact hotel changes due to availability or operational reasons.",
    ],
  },
  {
    title: "8. Payment Policy",
    body: [
      "Payment timelines are shared at the time of booking. Customers are responsible for completing payments within the given deadline.",
      "Failure to pay on time may result in loss of group flight seat, fare increase, delay in ticket issuance, delay in document release, booking cancellation, or change in package price.",
    ],
    note: "Flights are not booked without full payment.",
  },
];

const refundSections: PolicySection[] = [
  {
    title: "9. General Refund Principle",
    body: [
      "Refunds depend on the stage of booking and the non-refundable costs already paid to airlines, hotels, visa vendors, DMCs, transport providers, or other suppliers.",
      "3Musafir can only refund the amount that has not already been paid, committed, or locked with vendors.",
    ],
  },
  {
    title: "10. Before Visa Processing",
    points: [
      "If the customer cancels before visa processing has started, a refund may be possible after deducting administrative, banking, or service charges.",
      "Any already committed supplier cost will be deducted.",
    ],
  },
  {
    title: "11. After Visa Processing Starts",
    points: [
      "Visa fee is non-refundable.",
      "Service charges are non-refundable.",
      "Any document, appointment, or processing cost is non-refundable.",
      "Refund, if any, will apply only to the remaining unutilized amount.",
    ],
  },
  {
    title: "12. After Visa Is Issued",
    points: [
      "Visa-related charges are non-refundable.",
      "Service charges are non-refundable.",
      "Any supplier-committed amount is non-refundable.",
      "If flights or hotels have not yet been booked, the remaining unutilized amount may be refunded after deductions.",
    ],
  },
  {
    title: "13. After Flight Ticket Is Issued",
    points: [
      "Flight refund depends entirely on airline rules.",
      "Airline cancellation charges will apply.",
      "Airline refund timelines will apply.",
      "3Musafir cannot guarantee airline refund approval.",
      "If the ticket is non-refundable, no flight refund will be possible.",
    ],
  },
  {
    title: "14. After Hotel or Ground Package Confirmation",
    points: [
      "Refund depends on supplier cancellation rules.",
      "Non-refundable hotel, transport, tour, or DMC payments will be deducted.",
      "3Musafir will only refund recoverable amounts.",
    ],
  },
  {
    title: "15. Within 7 Days of Departure",
    body: [
      "Cancellations made within 7 days of departure are generally non-refundable because flights, hotels, visas, transfers, guides, and ground arrangements are already locked at this stage.",
      "Any exception will depend on airline, hotel, and supplier policies.",
    ],
  },
  {
    title: "16. No-Show Policy",
    points: [
      "If a customer does not show up for the trip, flight, transfer, activity, or hotel check-in, no refund will be applicable.",
      "3Musafir will not be responsible for missed services due to customer delay, absence, immigration issue, incorrect documents, or personal reasons.",
    ],
  },
  {
    title: "17. Visa Rejection Policy",
    points: [
      "Visa fee is non-refundable.",
      "Processing charges are non-refundable.",
      "Service charges are non-refundable.",
      "Any supplier-committed cost will be deducted.",
      "If flights, hotels, or ground services were not booked, the remaining recoverable amount may be refunded.",
      "3Musafir is not responsible for visa rejection by the embassy, consulate, immigration authority, or third-party visa processor.",
    ],
  },
  {
    title: "18. Price Change Policy",
    body: ["Package price may change if group flight seats are no longer available, flight fare increases, payment is delayed, hotel availability changes, visa requirements change, exchange rate changes, or supplier pricing changes."],
    note: "Once the booking is fully paid and confirmed, the confirmed components are locked.",
  },
  {
    title: "19. Transfer of Booking",
    body: ["A customer may request to transfer their booking to another person."],
    points: [
      "Transfer is subject to visa status, airline rules, hotel rules, supplier approval, name-change possibility, and applicable transfer charges.",
      "3Musafir does not guarantee that every booking can be transferred.",
    ],
  },
  {
    title: "20. Final Travel Responsibility",
    body: [
      "Customers are responsible for providing accurate documents, including valid passport, correct name spellings, CNIC or national ID, required photos, bank statements if needed, employment or student documents if needed, and any other embassy-required documents.",
      "3Musafir is not responsible for delays, rejections, or losses caused by incorrect, incomplete, expired, or late documents from the customer.",
    ],
  },
];

const coreRules = [
  "Group seat means fixed price.",
  "No group seat means live flight price.",
  "Flight booking requires full payment.",
  "Partial payment allows visa verification only.",
  "Full payment is required for final documents.",
  "No payment means no documents.",
  "No tentative or incomplete documents are shared.",
  "Refunds depend on recoverable amount from suppliers.",
];

function PolicyCard({ section }: { section: PolicySection }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-semibold text-heading">{section.title}</h2>
      {section.body ? (
        <div className="mt-3 space-y-3">
          {section.body.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
      {section.points ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          {section.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
      {section.note ? (
        <p className="mt-4 rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3 text-sm font-medium leading-relaxed text-heading">
          {section.note}
        </p>
      ) : null}
    </section>
  );
}

export default function InternationalTermsPage() {
  const canonicalUrl = buildCanonical("/intlterms");

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <meta name="robots" content="noindex,follow" key="robots" />
      </Head>

      <PublicPageContainer as="main" className="min-h-screen bg-gray-50 text-foreground">
        <div className="space-y-8 lg:space-y-10">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              3Musafir International Experiences
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-heading md:text-4xl">
              Terms & Conditions + Refund Policy
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              These terms apply to 3Musafir international experience bookings, including package
              confirmation, flights, visas, document release, hotel arrangements, payments,
              cancellations, and refunds.
            </p>
          </header>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold text-heading">Quick summary</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {bookingSummary.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Terms and booking policy
              </p>
              <h2 className="text-2xl font-semibold text-heading">Booking, flights, visas, and documents</h2>
            </div>
            {bookingSections.map((section) => (
              <PolicyCard key={section.title} section={section} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Refund and cancellation policy
              </p>
              <h2 className="text-2xl font-semibold text-heading">Refund stages and supplier deductions</h2>
            </div>
            {refundSections.map((section) => (
              <PolicyCard key={section.title} section={section} />
            ))}
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold text-heading">21. Core Rules to Remember</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {coreRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-brand-primary/30 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold text-heading">22. Final Statement</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Clarity builds trust. Control closes deals.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              By booking with 3Musafir, the customer agrees to the above Terms & Conditions and
              Refund Policy.
            </p>
          </section>
        </div>
      </PublicPageContainer>
    </>
  );
}
