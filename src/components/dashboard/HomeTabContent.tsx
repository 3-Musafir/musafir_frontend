"use client";

import Link from "next/link";
import React from "react";
import { useDashboard } from "@/context/DashboardContext";
import HomeEventCard from "@/components/cards/HomeEventCard";
import ExploreCard from "@/components/cards/ExploreCard";
import DmcCard from "@/components/cards/DmcCard";
import ExploreEmptyStateCard from "@/components/cards/ExploreEmptyStateCard";
import PassportUpcomingCard from "@/components/cards/PassportUpcomingCard";
import CompanyProfileHero from "@/components/brand/CompanyProfileHero";
import { formatDate } from "@/utils/formatDate";
import { RegistrationStatus } from "@/config/registration-status";

const homepageEntityLinks = [
  { href: "/explore", label: "Explore group tours" },
  { href: "/reviews", label: "Read reviews" },
  { href: "/why", label: "Why 3Musafir" },
  { href: "/community/voices", label: "Community voices" },
  { href: "/pakistan-dmc", label: "Pakistan DMC services" },
];

export default function HomeTabContent() {
  const {
    flagships,
    flagshipsLoading,
    companyProfile,
    profileLoading,
    upcomingEvents,
    userVerificationStatus,
  } = useDashboard();

  // Filter for actionable registrations (payment needed)
  const actionableRegistrations = upcomingEvents.filter((event) => {
    if (!event?.flagship) return false;
    if (event?.cancelledAt) return false;
    if (event?.refundStatus && event.refundStatus !== "none") return false;
    const dueAmount = Number(
      event.paymentSummary?.amountDue ?? event.amountDue ?? 0
    );
    if (event.status === RegistrationStatus.PAYMENT) return true;
    if (event.status === RegistrationStatus.CONFIRMED && dueAmount > 0) return true;
    return false;
  });

  return (
    <main className="flex-1 overflow-visible px-4 py-4 md:px-6 lg:px-8 xl:px-10 bg-gray-50 space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <CompanyProfileHero
        companyProfile={companyProfile}
        loading={profileLoading}
        className="mt-4 mb-10"
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <div className="max-w-4xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Pakistan travel company
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-heading md:text-3xl">
            3Musafir group tours, women-first travel, and Pakistan DMC services
          </h1>
          <p className="text-sm leading-relaxed text-text md:text-base">
            3Musafir is a Pakistan-based travel company offering community-led group tours,
            women-first travel experiences, customized trips, international group trips, and
            inbound DMC services for foreign travel agencies.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {homepageEntityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-primary transition hover:border-brand-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Actionable Registrations */}
      {actionableRegistrations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Complete your payment</h2>
            <span className="text-sm text-gray-500">Finish payment to confirm your seat</span>
          </div>
          <div className="space-y-4">
            {actionableRegistrations.map((event) => (
              <PassportUpcomingCard
                key={event._id}
                registrationId={event._id}
                title={event.flagship?.tripName}
                date={formatDate(event.flagship?.startDate, event.flagship?.endDate)}
                appliedDate={new Date(event.createdAt).toLocaleDateString()}
                location={event.flagship?.destination}
                images={event.flagship?.images}
                status={event.status}
                paymentInfo={event.paymentSummary || {
                  price: event.price,
                  amountDue: event.amountDue,
                  discountApplied: event.discountApplied,
                  paidAmount: 0,
                  isFullyPaid: false,
                }}
                detailedPlan={event.flagship?.detailedPlan}
                userVerificationStatus={userVerificationStatus}
                hasPaymentSubmitted={Boolean(event.paymentId)}
                paymentStatus={
                  event.paymentId && typeof event.paymentId === "object"
                    ? event.paymentId.status
                    : undefined
                }
                refundStatus={event.refundStatus}
                cancelledAt={event.cancelledAt}
              />
            ))}
          </div>
        </section>
      )}

      {/* Flagships Grid */}
      <section className="space-y-4 pb-20 lg:pb-6">
        {flagships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {flagships.map((event) => (
                <HomeEventCard key={event._id} {...event} />
              ))}
              <ExploreCard />
              <DmcCard />
            </div>

          </>
        ) : flagshipsLoading ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-xl font-medium mb-2">Loading Flagships For You</p>
          </div>
        ) : (
          <ExploreEmptyStateCard />
        )}
      </section>
    </main>
  );
}
