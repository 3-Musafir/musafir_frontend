"use client";

import { useEffect, useMemo, useState } from "react";
import { RegistrationAdminService } from "@/services/registrationAdminService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PaymentWizard from "@/components/checkinPaymentWizard";

type CheckinItem = {
  _id: string;
  userId?: string;
  name: string;
  email?: string;
  city?: string;
  amountDue: number;
  attendanceStatus: "unknown" | "present" | "absent";
  settlementStatus?: string;
  pendingPayment?: boolean;
  latestPaymentStatus?: string;
};

type CheckinStats = {
  totalDue: number;
  totalPresent: number;
  totalCollectedToday: number;
};

export function CheckinList({ flagshipId }: { flagshipId: string }) {
  const { toast } = useToast();
  const [items, setItems] = useState<CheckinItem[]>([]);
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "present" | "absent">("all");
  const [selected, setSelected] = useState<CheckinItem | null>(null);

  const loadData = async () => {
    if (!flagshipId) return;
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        RegistrationAdminService.getCheckinList(flagshipId),
        RegistrationAdminService.getCheckinStats(flagshipId),
      ]);
      setItems((listRes as any)?.data ?? listRes ?? []);
      setStats((statsRes as any)?.data ?? statsRes ?? null);
    } catch (error) {
      toast({
        title: "Failed to load check-in list",
        description: "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [flagshipId]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.attendanceStatus === filter);
  }, [items, filter]);

  const handleAttendance = async (
    registrationId: string,
    status: "present" | "absent",
    deferPayment = false
  ) => {
    try {
      await RegistrationAdminService.updateAttendance(registrationId, {
        status,
        source: "admin_checkin",
        deferPayment,
      });
      await loadData();
    } catch (error: any) {
      toast({
        title: "Unable to update attendance",
        description:
          error?.response?.data?.message || "Please retry or refresh the page.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 pb-10 space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Check-in Summary</p>
            <p className="text-xs text-gray-500">PKT day totals</p>
          </div>
          {loading && <span className="text-xs text-gray-500">Loading…</span>}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-700">
          <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-gray-500">Total due</p>
            <p className="text-sm font-semibold">PKR {stats?.totalDue?.toLocaleString() || 0}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-gray-500">Present</p>
            <p className="text-sm font-semibold">{stats?.totalPresent || 0}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-gray-500">Collected today</p>
            <p className="text-sm font-semibold">
              PKR {stats?.totalCollectedToday?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(["all", "present", "absent"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
              filter === key
                ? "border-orange-500 text-orange-600 bg-orange-50"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            )}
          >
            {key === "all" ? "All" : key === "present" ? "Present" : "Absent"}
          </button>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
          No musafirs to show yet.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.city && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
                      {item.city}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full border",
                      item.attendanceStatus === "present"
                        ? "border-green-200 text-green-700 bg-green-50"
                        : item.attendanceStatus === "absent"
                          ? "border-red-200 text-red-600 bg-red-50"
                          : "border-gray-200 text-gray-600 bg-gray-50"
                    )}
                  >
                    {item.attendanceStatus === "present"
                      ? "Present"
                      : item.attendanceStatus === "absent"
                        ? "Absent"
                        : "Not checked in"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500">Amount due</p>
                <p className="text-sm font-semibold text-gray-900">
                  PKR {item.amountDue?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {item.pendingPayment && (
              <p className="text-xs text-amber-600">
                Payment pending approval — manual collection disabled.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {item.attendanceStatus !== "present" && (
                <button
                  type="button"
                  onClick={() => handleAttendance(item._id, "present", false)}
                  className="px-3 py-2 rounded-full text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600"
                >
                  Mark present
                </button>
              )}
              <button
                type="button"
                onClick={() => handleAttendance(item._id, "absent")}
                className="px-3 py-2 rounded-full text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Mark absent
              </button>
              {item.attendanceStatus !== "present" && item.amountDue > 0 && (
                <button
                  type="button"
                  onClick={() => handleAttendance(item._id, "present", true)}
                  className="px-3 py-2 rounded-full text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Present, pay later
                </button>
              )}
              <button
                type="button"
                disabled={item.amountDue <= 0 || item.pendingPayment}
                onClick={() => setSelected(item)}
                className={cn(
                  "px-3 py-2 rounded-full text-xs font-semibold",
                  item.amountDue <= 0 || item.pendingPayment
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                )}
              >
                Collect payment
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <PaymentWizard
          registrationId={selected._id}
          name={selected.name}
          amountDue={selected.amountDue}
          onClose={() => setSelected(null)}
          onSuccess={async () => {
            setSelected(null);
            await loadData();
          }}
        />
      )}
    </div>
  );
}

export default CheckinList;
