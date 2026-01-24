"use client";

import { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "../../../../components/tabs";
import { cn } from "../../../../lib/utils";
import { RegistrationStatsContainer } from "../../../../containers/registrationStats";
import { PaymentStatsContainer } from "../../../../containers/paymentsStats";
import { VerificationList } from "../../../../containers/verification";
import { PaidListContainer } from "../../../../containers/paidList";
import { RegistrationsList } from "@/containers/registeredList";
import { useRouter } from "next/router";
import { FlagshipService } from "@/services/flagshipService";
import { format } from "date-fns";
import { IFlagship } from "@/services/types/flagship";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [activeSection, setActiveSection] = useState("registrations");
  const [flagship, setFlagship] = useState<IFlagship | null>(null);
  const router = useRouter();
  const { slug } = router.query as { slug?: string };

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

  return (
    <div className="max-w-md mx-auto pb-8">
      {flagship && (
        <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm px-4 py-5 mb-4 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-semibold text-gray-900">{flagship.tripName}</p>
            <div className="text-right text-sm text-gray-500">
              <p className="font-medium text-gray-700">{flagship.location || flagship.city || ""}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500">
            <span>{dateRange || "Dates TBA"}</span>
            <span>{basePrice ? `From PKR ${basePrice}` : "Price TBD"}</span>
          </div>
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
                Verification
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
      {activeTab === "registration" && <RegistrationsList />}
      {activeTab === "verification" && <VerificationList />}
      {activeTab === "paid" && <PaidListContainer />}
    </div>
  );
}
