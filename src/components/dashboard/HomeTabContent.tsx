"use client";

import React from "react";
import { useDashboard } from "@/context/DashboardContext";
import HomeEventCard from "@/components/cards/HomeEventCard";
import ExploreCard from "@/components/cards/ExploreCard";
import ExploreEmptyStateCard from "@/components/cards/ExploreEmptyStateCard";
import PassportUpcomingCard from "@/components/cards/PassportUpcomingCard";
import CompanyProfileHero from "@/components/brand/CompanyProfileHero";
import { formatDate } from "@/utils/formatDate";

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
    const dueAmount = Number(event.amountDue || 0);
    if (event.status === "payment") return true;
    if (event.status === "confirmed" && dueAmount > 0) return true;
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
                image={event.flagship?.images?.[0]}
                status={event.status}
                paymentInfo={{
                  price: event.price,
                  dueAmount: event.amountDue,
                  discountApplied: event.discountApplied,
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
