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
  const [groupAnalytics, setGroupAnalytics] = useState<any>(null);
  const [discountAnalytics, setDiscountAnalytics] = useState<any>(null);
  const [groupConflicts, setGroupConflicts] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
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

  useEffect(() => {
    if (!slug) return;
    const loadAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError("");
      try {
        const [groupRes, discountRes, conflictsRes] = await Promise.all([
          FlagshipService.getGroupAnalytics(slug),
          FlagshipService.getDiscountAnalytics(slug),
          FlagshipService.getGroupConflicts(slug),
        ]);
        setGroupAnalytics((groupRes as any)?.data ?? groupRes);
        setDiscountAnalytics((discountRes as any)?.data ?? discountRes);
        setGroupConflicts((conflictsRes as any)?.data ?? conflictsRes);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        setAnalyticsError("Failed to load analytics.");
      } finally {
        setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
  }, [slug]);

  const handleReconcileLinks = async () => {
    if (!slug) return;
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      await FlagshipService.reconcileGroupLinks(slug);
      const updated = await FlagshipService.getGroupAnalytics(slug);
      const conflicts = await FlagshipService.getGroupConflicts(slug);
      setGroupAnalytics((updated as any)?.data ?? updated);
      setGroupConflicts((conflicts as any)?.data ?? conflicts);
    } catch (error) {
      console.error("Failed to reconcile links:", error);
      setAnalyticsError("Failed to reconcile links.");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleVisibilityToggle = async () => {
    if (!flagship?._id) return;
    const nextVisibility = flagship.visibility === "private" ? "public" : "private";
    setVisibilityUpdating(true);
    setVisibilityError("");
    try {
      const res: any = await flagshipAction.update(flagship._id, {
        visibility: nextVisibility,
        silentUpdate: true,
        contentVersion: flagship?.contentVersion,
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
          <div className="flex flex-col gap-2">
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
            <button
              type="button"
              onClick={() => {
                if (!flagship?._id) return;
                router.push(`/flagship/create?editId=${flagship._id}`);
              }}
              className="w-full px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Edit trip
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
      {activeTab === "stats" && (
        <div className="px-4 pb-6 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Discount Analytics</p>
                <p className="text-xs text-gray-500">Usage and remaining value by discount type.</p>
              </div>
              {analyticsLoading && (
                <span className="text-xs text-gray-500">Refreshing…</span>
              )}
            </div>
            {analyticsError && (
              <p className="mt-2 text-xs text-red-600">{analyticsError}</p>
            )}
            {discountAnalytics && (
              <div className="mt-3 space-y-2 text-xs text-gray-700">
                {(["soloFemale", "group", "musafir"] as const).map((key) => {
                  const item = discountAnalytics?.[key];
                  if (!item) return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace("Female", " female")}</span>
                      <span>
                        Used {item.usedValue || 0} / {item.totalValue || 0} (Count {item.usedCount || 0}/{item.count || 0})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Group Link Analytics</p>
                <p className="text-xs text-gray-500">Completion rate and link status counts.</p>
              </div>
              <button
                type="button"
                onClick={handleReconcileLinks}
                disabled={analyticsLoading}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Reconcile links
              </button>
            </div>
            {groupAnalytics && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div>Total groups: {groupAnalytics.totalGroups ?? 0}</div>
                <div>All linked: {groupAnalytics.allLinkedGroups ?? 0}</div>
                <div>Grouped regs: {groupAnalytics.groupedRegistrations ?? 0}</div>
                <div>
                  Completion rate: {Math.round(((groupAnalytics.completionRate || 0) * 100))}%
                </div>
                <div>Linked: {groupAnalytics?.contacts?.linked ?? 0}</div>
                <div>Pending: {groupAnalytics?.contacts?.pending ?? 0}</div>
                <div>Invited: {groupAnalytics?.contacts?.invited ?? 0}</div>
                <div>Conflicts: {groupAnalytics?.contacts?.conflict ?? 0}</div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Group Conflicts</p>
            <p className="text-xs text-gray-500">Members linked to multiple groups or marked as conflicts.</p>
            {groupConflicts?.conflicts?.length ? (
              <div className="mt-3 space-y-2 text-xs text-gray-700">
                {groupConflicts.conflicts.slice(0, 6).map((conflict: any) => (
                  <div key={conflict.email} className="flex flex-col gap-1 border-b border-gray-100 pb-2">
                    <span className="font-medium">{conflict.email}</span>
                    <span className="text-gray-500">
                      Groups: {Array.from(conflict.groupIds || []).length}
                    </span>
                  </div>
                ))}
                {groupConflicts.conflicts.length > 6 && (
                  <p className="text-xs text-gray-500">
                    Showing 6 of {groupConflicts.conflicts.length} conflicts.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-500">No conflicts found.</p>
            )}
          </div>
        </div>
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
