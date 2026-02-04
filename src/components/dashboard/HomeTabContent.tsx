"use client";

import React from "react";
import { useDashboard } from "@/context/DashboardContext";
import HomeEventCard from "@/components/cards/HomeEventCard";
import ExploreCard from "@/components/cards/ExploreCard";
import ExploreEmptyStateCard from "@/components/cards/ExploreEmptyStateCard";
import PassportUpcomingCard from "@/components/cards/PassportUpcomingCard";
import { Skeleton } from "@/components/ui/skeleton";
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

  const fallbackLogo = "/3mwinterlogo.png";

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
    <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 lg:px-8 xl:px-10 bg-gray-50 space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#515778] via-[#3e425f] to-[#2c3047] p-6 shadow-sm">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-0 -bottom-20 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-transparent shadow-none">
            {profileLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : companyProfile?.logoUrl ? (
              <img
                src={companyProfile.logoUrl}
                alt={companyProfile.name || "Company logo"}
                className="h-full w-full object-cover"
                width={112}
                height={112}
              />
            ) : (
              <img
                src={fallbackLogo}
                alt="3Musafir logo"
                className="h-full w-full object-cover"
                width={112}
                height={112}
              />
            )}
          </div>
          {profileLoading ? (
            <div className="space-y-3 w-full flex flex-col items-center">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-5 w-80" />
            </div>
          ) : (
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl font-bold text-white leading-tight">
                {companyProfile?.name || "3Musafir"}
              </h1>
              <p className="text-base text-white/90">
                {companyProfile?.description ||
                  "A Founder Institute certified platform making community-led travel safe and sustainable for Asians globally."}
              </p>
            </div>
          )}
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
