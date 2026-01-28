"use client";

import { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "../../../../components/tabs";
import { cn } from "../../../../lib/utils";
import { RegistrationStatsContainer } from "../../../../containers/registrationStats";
import { PaymentStatsContainer } from "../../../../containers/paymentsStats";
import { IdentityVerificationList } from "../../../../containers/verification";
import { PaidListContainer } from "../../../../containers/paidList";
import { RegistrationsList } from "@/containers/registeredList";
import { PaymentVerificationList } from "@/containers/paymentVerification";
import { useRouter } from "next/router";
import { FlagshipService } from "@/services/flagshipService";
import { format } from "date-fns";
import { IFlagship } from "@/services/types/flagship";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import { mapErrorToUserMessage } from "@/utils/errorMessages";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [activeSection, setActiveSection] = useState("registrations");
  const [flagship, setFlagship] = useState<IFlagship | null>(null);
  const [visibilityUpdating, setVisibilityUpdating] = useState(false);
  const [visibilityError, setVisibilityError] = useState("");
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const flagshipAction = useFlagshipHook();

  const dateRange = useMemo(() => {
    if (!flagship) return "";
    const start = flagship.startDate ? new Date(flagship.startDate) : null;
    const end = flagship.endDate ? new Date(flagship.endDate) : null;
    if (start && end) {
      const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
      const startFormat = format(start, sameMonth ? "do" : "do MMM");
      const endFormat = format(end, "do MMM yyyy");
      return `${startFormat} — ${endFormat}`;
    }
    if (start) return format(start, "do MMM yyyy");
    if (end) return format(end, "do MMM yyyy");
    return "";
  }, [flagship]);

  const basePrice = flagship?.basePrice
    ? Number(flagship.basePrice).toLocaleString()
    : null;

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      try {
        const data = await FlagshipService.getFlagshipByID(slug as string);
        setFlagship(data);
      } catch (error) {
        console.error("Failed to load flagship summary:", error);
      }
    };
    fetch();
  }, [slug]);

  const handleVisibilityToggle = async () => {
    if (!flagship?._id) return;
    const nextVisibility = flagship.visibility === "private" ? "public" : "private";
    setVisibilityUpdating(true);
    setVisibilityError("");
    try {
      const res: any = await flagshipAction.update(flagship._id, {
        visibility: nextVisibility,
      });
      const updatedFlagship = res?.data || { ...flagship, visibility: nextVisibility };
      setFlagship(updatedFlagship);
    } catch (error) {
      setVisibilityError(mapErrorToUserMessage(error));
    } finally {
      setVisibilityUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-8">
      {flagship && (
        <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm px-4 py-5 mb-4 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-semibold text-gray-900">{flagship.tripName}</p>
            <div className="text-right text-sm text-gray-500">
              <p className="font-medium text-gray-700">
                {flagship.locations?.[0]?.name || flagship.destination || ""}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500">
            <span>{dateRange || "Dates TBA"}</span>
            <span>{basePrice ? `From PKR ${basePrice}` : "Price TBD"}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Visibility: {flagship.visibility || "unknown"}
            </span>
            <button
              type="button"
              onClick={handleVisibilityToggle}
              disabled={visibilityUpdating}
              className={cn(
                "px-3 py-2 rounded-full text-xs font-semibold border transition",
                flagship.visibility === "private"
                  ? "border-green-600 text-green-700"
                  : "border-red-600 text-red-700",
                visibilityUpdating && "opacity-60 cursor-not-allowed",
              )}
            >
              {flagship.visibility === "private" ? "Show to users" : "Hide from users"}
            </button>
          </div>
          {visibilityError && (
            <p className="text-xs text-red-600">{visibilityError}</p>
          )}
        </div>
      )}
      <div className="sticky top-0 bg-white z-10">
        <div className="p-2 mt-3 mb-3">
          <Link href="/admin" className="text-md text-gray-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Back to Admin Dashboard</span>
          </Link>
        </div>

        <header className="">
          <Tabs
            defaultValue="stats"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full grid grid-cols-4 h-12">
              <TabsTrigger
                value="stats"
                className={cn(
                  "py-3 flex justify-center",
                  activeTab === "stats" && "border-b-2 border-black"
                )}
              >
                Stats
              </TabsTrigger>
              <TabsTrigger
                value="registration"
                className={cn(
                  "py-3 flex justify-center",
                  activeTab === "registration" && "border-b-2 border-black"
                )}
              >
                Registration
              </TabsTrigger>
          <TabsTrigger
            value="verification"
            className={cn(
              "py-3 flex justify-center",
              activeTab === "verification" && "border-b-2 border-black"
            )}
          >
            Payment Verification
          </TabsTrigger>
              <TabsTrigger
                value="paid"
                className={cn(
                  "py-3 flex justify-center",
                  activeTab === "paid" && "border-b-2 border-black"
                )}
              >
                Paid
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* {activeTab === "stats" && (
          <div className="grid grid-cols-2 border-b">
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "registrations" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("registrations")}
            >
              Registrations
            </button>
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "payments" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("payments")}
            >
              Payments
            </button>
          </div>
        )} */}
        </header>
      </div>
      {activeTab === "stats" && activeSection === "registrations" && (
        <RegistrationStatsContainer />
      )}
      {activeTab === "stats" && activeSection === "payments" && (
        <PaymentStatsContainer />
      )}
      {activeTab === "registration" && (
        <>
          <RegistrationsList />
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col gap-1 mb-3">
              <p className="text-sm font-semibold text-gray-900">Identity Verification</p>
              <p className="text-xs text-gray-500">
                Pending identity verifications (users must be verified before payments can be processed).
              </p>
            </div>
            <IdentityVerificationList />
          </div>
        </>
      )}
      {activeTab === "verification" && <PaymentVerificationList />}
      {activeTab === "paid" && <PaidListContainer />}
    </div>
  );
}
