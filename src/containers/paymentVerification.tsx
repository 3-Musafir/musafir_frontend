import { Card } from "@/components/card";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { FlagshipService } from "@/services/flagshipService";
import {
  IPendingPaymentVerificationItem,
  IUser,
} from "@/interfaces/trip/trip";
import { useRouter } from "next/router";

const PAGE_SIZE = 8;

export const PaymentVerificationList = () => {
  const [payments, setPayments] = useState<IPendingPaymentVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const router = useRouter();
  const { slug } = router.query as { slug?: string };

  const paymentsCountRef = useRef(0);
  useEffect(() => {
    paymentsCountRef.current = payments.length;
  }, [payments]);

  const retrievePayments = useCallback(async () => {
    if (!slug) throw new Error("missing slug");
    const response = await FlagshipService.getPendingPaymentVerifications(
      slug as string,
      {
        limit: PAGE_SIZE,
        page: currentPage,
      },
    );
    setPayments(response.payments);
    setHasNextPage(response.page < response.totalPages);
    setTotalPages(response.totalPages || 1);
    setTotalPayments(response.total);
    return response;
  }, [currentPage, slug]);

  const fetchPayments = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      await retrievePayments();
    } catch (error) {
      console.error("Failed to fetch pending payments:", error);
    } finally {
      setLoading(false);
    }
  }, [retrievePayments, slug]);

  useEffect(() => {
    if (slug) {
      fetchPayments();
    }
  }, [fetchPayments, slug]);

  useEffect(() => {
    const handlePaymentUpdate = () => {
      fetchPayments();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("paymentStatusChanged", handlePaymentUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("paymentStatusChanged", handlePaymentUpdate);
      }
    };
  }, [fetchPayments]);

  const visibilityRef = useRef(true);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const updateVisibility = () => {
      visibilityRef.current = document.visibilityState === "visible";
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!slug) return undefined;
    let timer: NodeJS.Timeout | null = null;
    let active = true;
    let failureCount = 0;

    const runPoll = async () => {
      if (!active) return;
      if (!visibilityRef.current) {
        scheduleNext(1000);
        return;
      }
      try {
        await retrievePayments();
        failureCount = 0;
        const interval = paymentsCountRef.current === 0 ? 60000 : 15000;
        scheduleNext(interval);
      } catch (error) {
        failureCount += 1;
        const backoffDelay = Math.min(300000, 15000 * 2 ** failureCount);
        console.error("Polling failed for pending payments:", error);
        scheduleNext(backoffDelay);
      }
    };

    const scheduleNext = (delay: number) => {
      if (!active) return;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(runPoll, delay);
    };

    scheduleNext(0);
    return () => {
      active = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [retrievePayments, slug]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => {
    if (!hasNextPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    return format(new Date(value), "do MMM yyyy, hh:mm a");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between text-sm text-gray-500">
        <p>
          Showing pending payments ({payments.length} / {totalPayments})
        </p>
        <div className="flex items-center gap-2">
          <span>
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button
            type="button"
            onClick={fetchPayments}
            disabled={loading}
            className="px-3 py-1 rounded-md border border-gray-300 text-xs font-semibold disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading pending payments…</p>
      ) : payments.length === 0 ? (
        <p className="text-sm text-gray-600">No pending payments found.</p>
      ) : (
        payments.map((payment) => {
          const user = payment.registration?.user as IUser | undefined;
          return (
            <Link
              href={`/admin/payment/${payment._id}`}
              key={payment._id}
              className="block"
            >
              <Card className="cursor-pointer p-0 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid lg:grid-cols-4 gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <span className="font-semibold text-lg">
                        {user?.fullName ? user.fullName[0] : "U"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user?.fullName || "Unknown user"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {user?.city || "City unavailable"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Registration status</div>
                    <div className="text-gray-900 font-medium">
                      {payment.registration.status || "Unknown"}
                    </div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mt-1">
                      Submitted{" "}
                      {formatDate(payment.registration.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Payment type</div>
                    <div className="text-gray-900 font-semibold">
                      {payment.paymentType === "fullPayment"
                        ? "Full Payment"
                        : "Partial Payment"}
                    </div>
                    <div className="text-gray-500 mt-1">
                      Method:{" "}
                      {payment.paymentMethod
                        ? payment.paymentMethod.replace(/_/g, " ")
                        : "Bank transfer"}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Amount
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {payment.amount.toLocaleString()} PKR
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                      <span className="h-2 w-2 rounded-full bg-orange-400" />
                      Pending approval
                    </span>
                  </div>
                </div>
                {payment.screenshot && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={payment.screenshot}
                      alt="Payment screenshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Card>
            </Link>
          );
        })
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          {currentPage} / {Math.max(1, totalPages)}
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasNextPage || loading}
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
