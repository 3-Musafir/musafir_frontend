"use client";

import React from "react";
import { useDashboard } from "@/context/DashboardContext";
import PassportUpcomingCard from "@/components/cards/PassportUpcomingCard";
import PassportPastCard from "@/components/cards/PassportPastCard";
import { formatDate } from "@/utils/formatDate";

export default function PassportTabContent() {
  const {
    upcomingEvents,
    pastEvents,
    passportLoading,
    passportSubTab,
    setPassportSubTab,
    userVerificationStatus,
  } = useDashboard();

  return (
    <>
      {/* Sub-tabs */}
      <div className="border-b border-border flex justify-between mt-4 px-4 md:px-6 lg:px-8 xl:px-10">
        <button
          className={`w-1/2 py-3 lg:py-4 text-sm lg:text-base font-medium text-center ${
            passportSubTab === "upcoming"
              ? "border-b-2 border-heading text-heading"
              : "text-muted-foreground border-b-2 border-border"
          }`}
          onClick={() => setPassportSubTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`w-1/2 py-3 lg:py-4 text-sm lg:text-base font-medium text-center ${
            passportSubTab === "past"
              ? "border-b-2 border-heading text-heading"
              : "text-muted-foreground border-b-2 border-border"
          }`}
          onClick={() => setPassportSubTab("past")}
        >
          Past
        </button>
      </div>

      {/* Content */}
      <main className="px-4 py-4 md:px-6 lg:px-8 xl:px-10 pb-20 lg:pb-6">
        {passportSubTab === "upcoming" && upcomingEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {upcomingEvents.map((event) => (
              <PassportUpcomingCard
                key={event._id}
                registrationId={event._id}
                title={event.flagship.tripName}
                date={formatDate(event.flagship.startDate, event.flagship.endDate)}
                appliedDate={new Date(event.createdAt).toLocaleDateString()}
                location={event.flagship.destination}
                image={event.flagship.images[0]}
                status={event.status}
                paymentInfo={{
                  price: event.price,
                  dueAmount: event.amountDue,
                  discountApplied: event.discountApplied,
                }}
                detailedPlan={event?.flagship?.detailedPlan}
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
        )}
        {passportSubTab === "upcoming" && upcomingEvents.length === 0 && !passportLoading && (
          <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
            <p className="text-center text-lg mb-2">No upcoming trips scheduled!</p>
            <p className="text-center">Explore our trips and plan your next adventure.</p>
          </div>
        )}
        {passportSubTab === "past" && pastEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {pastEvents.map((event) => (
              <PassportPastCard
                key={event._id}
                registrationId={event._id}
                title={event.flagshipId.tripName}
                date={formatDate(event.flagshipId.startDate, event.flagshipId.endDate)}
                location={event.flagshipId.destination}
                rating={event.ratingId?.rating}
                price={event.price}
                status={event.status}
                refundStatus={event.refundStatus}
              />
            ))}
          </div>
        )}
        {passportSubTab === "past" && pastEvents.length === 0 && !passportLoading && (
          <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
            <p className="text-center text-lg mb-2">You haven&apos;t been on any trips yet.</p>
            <p className="text-center">Time for an adventure - book your first trip now!</p>
          </div>
        )}
        {passportLoading && (
          <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
            <p className="text-center text-lg">Loading...</p>
          </div>
        )}
      </main>
    </>
  );
}
