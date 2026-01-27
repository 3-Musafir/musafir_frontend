import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { FlagshipService } from "@/services/flagshipService";
import { IRegistration } from "@/interfaces/trip/trip";
import { useRouter } from "next/router";
import { IUser } from "@/services/types/user";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE = 12;

export const RegistrationsList = () => {
  const [registeredUsers, setRegisteredUsers] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<"all" | "verified" | "pending" | "rejected">("all");
  const [showRejectedOnly, setShowRejectedOnly] = useState(false);
  const [hideIdentityPending, setHideIdentityPending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [deletingRegistrationId, setDeletingRegistrationId] = useState<string | null>(null);
  const { slug } = router.query;

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "new":
        return "New";
      case "onboarding":
        return "Onboarding";
      case "payment":
        return "Payment";
      case "waitlisted":
        return "Waitlisted";
      case "confirmed":
        return "Confirmed";
      default:
        return status || "Unknown";
    }
  };

  const fetchUsers = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setHasNextPage(false);
      const trimmedSearch = searchQuery.trim();
      const response = await FlagshipService.getRegisteredUsers(slug as string, {
        search: trimmedSearch,
        verificationStatus: verificationFilter,
        rejectedOnly: showRejectedOnly,
        excludeVerificationStatus: hideIdentityPending ? "pending" : undefined,
        limit: PAGE_SIZE + 1,
        page: currentPage,
      });

      const hasMore = response.length > PAGE_SIZE;
      const registrations = hasMore ? response.slice(0, PAGE_SIZE) : response;
      setRegisteredUsers(registrations);
      setHasNextPage(hasMore);
    } catch (error) {
      console.error("Failed to fetch registered users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, showRejectedOnly, hideIdentityPending, slug, verificationFilter]);

  useEffect(() => {
    if (slug) {
      fetchUsers();
    }
  }, [slug, fetchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (!hasNextPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleSendPaymentReminders = async () => {
    if (!slug) return;
    const confirmed = window.confirm(
      "Send payment reminders to all eligible registrations for this trip? This respects the 24h cooldown.",
    );
    if (!confirmed) return;
    try {
      setSendingReminders(true);
      const result = await FlagshipService.sendPaymentReminders(slug as string);
      const summary = `Eligible: ${result?.totalEligible || 0}. Notifications: ${result?.notificationsSent || 0}. Emails: ${result?.emailsSent || 0}. Skipped: ${result?.skipped || 0}.`;
      toast({
        title: result?.totalEligible ? "Payment reminders sent" : "No eligible registrations",
        description: summary,
      });
    } catch (error: any) {
      console.error("Failed to send payment reminders:", error);
      toast({
        title: "Reminder send failed",
        description: error?.message || "Unable to send payment reminders right now.",
        variant: "destructive",
      });
    } finally {
      setSendingReminders(false);
    }
  };

  const handleDeleteRegistration = async (registration: IRegistration) => {
    if (!registration?._id) return;
    const fullName = (registration.user as IUser)?.fullName || "this user";
    window.alert(
      "Warning: deleting a registration permanently removes the user’s seat, related payment, and will notify the traveler—this cannot be undone."
    );
    const confirmed = window.confirm(
      `Are you sure you want to delete ${fullName}'s registration? This action cannot be undone.`,
    );
    if (!confirmed) return;
    const reasonInput = window.prompt(
      "Optional reason for the user (this will be included in the email/notification):",
      "",
    );
    const reason = reasonInput?.trim();
    try {
      setDeletingRegistrationId(registration._id);
      await FlagshipService.deleteRegistration(registration._id, reason || undefined);
      toast({
        title: "Registration deleted",
        description: `${fullName} can re-register if they wish.`,
      });
      await fetchUsers();
    } catch (error: any) {
      console.error("Failed to delete registration:", error);
      toast({
        title: "Delete failed",
        description: error?.message || "Unable to delete registration right now.",
        variant: "destructive",
      });
    } finally {
      setDeletingRegistrationId(null);
    }
  };

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Search Field */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name..."
          className="flex-1 min-w-[220px] border rounded-md p-2"
        />
        <button
          type="button"
          onClick={handleSendPaymentReminders}
          disabled={sendingReminders || loading || !slug}
          className="rounded-md border border-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-50"
        >
          {sendingReminders ? "Sending reminders..." : "Send payment reminders"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
        <label className="flex items-center gap-2">
          <span className="font-medium text-gray-800">Verification</span>
            <select
              className="input-field h-10 bg-white"
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value as typeof verificationFilter);
                setCurrentPage(1);
              }}
            >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showRejectedOnly}
              onChange={(e) => {
                setShowRejectedOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="h-4 w-4"
            />
          Show rejected registrations only
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={hideIdentityPending}
            onChange={(e) => {
              setHideIdentityPending(e.target.checked);
              setCurrentPage(1);
            }}
            className="h-4 w-4"
          />
          Hide identity-pending from main list
        </label>
      </div>
      <p className="text-xs text-gray-500 mb-2">Newest registrations appear first.</p>

      {/* Registered Users List */}
      {registeredUsers.length === 0 ? (
        <p>No registered users found.</p>
      ) : (
        <>
          {registeredUsers.map((r) => {
            const latestPaymentStatus = (r as any).latestPaymentStatus || "none";
            const latestPaymentCreatedAt = (r as any).latestPaymentCreatedAt;
            const paymentBadgeText =
              latestPaymentStatus === "rejected"
                ? "Payment Rejected — resubmit"
                : latestPaymentStatus === "pendingApproval"
                  ? "Payment Pending Approval"
                  : latestPaymentStatus === "approved"
                    ? "Payment Approved"
                    : null;
            const paymentBadgeClass =
              latestPaymentStatus === "rejected"
                ? "px-2 py-0.5 text-rose-700 bg-rose-100"
                : latestPaymentStatus === "pendingApproval"
                  ? "px-2 py-0.5 text-amber-800 bg-amber-100"
                  : latestPaymentStatus === "approved"
                    ? "px-2 py-0.5 text-emerald-800 bg-emerald-100"
                    : "";
            return (
              <Link href={`/admin/user-details/${r._id}`} key={r._id}>
              <div className="border rounded-lg p-4 flex flex-col relative mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {(r.user as IUser).fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{`Joining from ${
                    (r.user as IUser).city
                  }`}</p>
                  <p className="text-sm text-gray-500">{`Status: ${getStatusLabel(r.status)}`}</p>
                {((r.user as IUser)?.verification?.status) && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="uppercase tracking-wide font-semibold">
                      Verification:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${
                        (r.user as IUser)?.verification?.status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : (r.user as IUser)?.verification?.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {(r.user as IUser)?.verification?.status}
                    </span>
                  </p>
                )}
                {paymentBadgeText && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`font-semibold rounded-full ${paymentBadgeClass}`}>
                      {paymentBadgeText}
                    </span>
                    {latestPaymentCreatedAt && (
                      <span className="text-gray-500">
                        Submitted {new Date(latestPaymentCreatedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
                {r.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(r.createdAt).toLocaleString()}
                  </p>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Image
                    src="/star_shield.png"
                    alt="Verified Shield"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleDeleteRegistration(r);
                    }}
                    disabled={deletingRegistrationId === r._id}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deletingRegistrationId === r._id ? "Removing…" : "Delete registration"}
                  </button>
                </div>
              </div>
            </Link>
            );
          })}

        </>
      )}
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-medium">
          Page {currentPage}
        </span>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={!hasNextPage || loading}
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
