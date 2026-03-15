"use client";

import { useEffect, useState } from "react";
import { PaymentService } from "@/services/paymentService";
import { IPayment, IPaymentRejectionReason } from "@/services/types/payment";
import { FlagshipService } from "@/services/flagshipService";
import { IFlagship } from "@/services/types/flagship";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { IRegistration, IUser } from "@/interfaces/trip/trip";
import { useRouter } from "next/router";

export default function PaymentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const paymentId = id as string;
  const { toast } = useToast();

  const [payment, setPayment] = useState<IPayment | null>(null);
  const [flagship, setFlagship] = useState<IFlagship | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<IPaymentRejectionReason[]>([]);
  const [rejectionReasonLoading, setRejectionReasonLoading] = useState(false);
  const [rejectionReasonError, setRejectionReasonError] = useState<string | null>(null);
  const [selectedRejectionCode, setSelectedRejectionCode] = useState<string>("");
  const [publicNote, setPublicNote] = useState<string>("");
  const [internalNote, setInternalNote] = useState<string>("");
  const [userMessagePrefill, setUserMessagePrefill] = useState<string>("");
  const [manualRejectionCode, setManualRejectionCode] = useState<string>("");

  const fetchData = async () => {
    if (!paymentId) return;
    try {
      setLoading(true);
      const data = await PaymentService.getPayment(paymentId);
      setPayment(data);

      // Fetch flagship details if it's a string (ID)
      if (typeof (data.registration as IRegistration).flagship === "string") {
        const flagshipData = await FlagshipService.getFlagshipByID(
          (data.registration as IRegistration).flagship as string
        );
        setFlagship(flagshipData);
      } else {
        // If it's already an IFlagship object
        setFlagship(
          (data.registration as IRegistration).flagship as IFlagship
        );
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paymentId]);

  useEffect(() => {
    const loadRejectionReasons = async () => {
      if (!paymentId || !payment || payment.status !== "pendingApproval") return;
      setRejectionReasonLoading(true);
      setRejectionReasonError(null);
      try {
        const data = await PaymentService.getPaymentRejectionReasons();
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => {
              const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
              const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
              if (orderA !== orderB) return orderA - orderB;
              return a.label.localeCompare(b.label);
            })
          : [];
        setRejectionReasons(sorted);
      } catch (error) {
        setRejectionReasonError("Unable to load rejection reasons.");
        setRejectionReasons([]);
      } finally {
        setRejectionReasonLoading(false);
      }
    };
    loadRejectionReasons();
  }, [paymentId, payment]);

  const handleSelectRejectionCode = (code: string) => {
    const selected = rejectionReasons.find((reason) => reason.code === code);
    const nextUserMessage = selected?.userMessage || "";
    if (!publicNote || publicNote === userMessagePrefill) {
      setPublicNote(nextUserMessage);
    }
    setUserMessagePrefill(nextUserMessage);
    setSelectedRejectionCode(code);
  };

  const handleApprovePayment = async () => {
    if (!paymentId) return;
    try {
      await PaymentService.approvePayment(paymentId);
      toast({
        title: "Success",
        description: "Payment approved successfully",
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("paymentStatusChanged", {
            detail: { paymentId, status: "approved" },
          }),
        );
      }
      await fetchData();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayment = async () => {
    if (!paymentId) return;
    try {
      const hasReasons = rejectionReasons.length > 0;
      const rejectionCode = hasReasons ? selectedRejectionCode : manualRejectionCode.trim();
      if (!rejectionCode) {
        toast({
          title: "Rejection reason required",
          description: hasReasons
            ? "Please select a rejection reason."
            : "Please enter a rejection code.",
          variant: "destructive",
        });
        return;
      }
      await PaymentService.rejectPayment(paymentId, {
        rejectionCode,
        publicNote: publicNote.trim() || undefined,
        internalNote: internalNote.trim() || undefined,
      });
      toast({
        title: "Success",
        description: "Payment rejected successfully",
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("paymentStatusChanged", {
            detail: { paymentId, status: "rejected" },
          }),
        );
      }
      await fetchData();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (!payment) {
    return <div className="max-w-md mx-auto p-4">Payment not found</div>;
  }

  // Type guard to check if user is an IUser object
  const user =
    typeof (payment.registration as IRegistration).user === "string"
      ? null
      : ((payment.registration as IRegistration).user as IUser);
  const registration = payment.registration as any;
  const registrationPrice =
    typeof registration?.price === "number" ? registration.price : undefined;
  const registrationAmountDue =
    typeof registration?.amountDue === "number" ? registration.amountDue : undefined;
  const projectedRemainingDue =
    typeof (payment as any)?.remainingDueAtDecision === "number"
      ? (payment as any).remainingDueAtDecision
      : registrationAmountDue;
  // Type guard to check if bankAccount is an IBankAccount object
  const bankAccount =
    typeof payment.bankAccount === "string" ? null : payment.bankAccount;
  const walletApplied =
    typeof payment.walletApplied === "number" ? payment.walletApplied : 0;
  const walletRequested =
    typeof payment.walletRequested === "number" ? payment.walletRequested : 0;
  const bankLabel = bankAccount?.bankName || payment.bankAccountLabel;
  const paymentSourceLabel =
    payment.paymentMethod === "wallet_only"
      ? "Wallet"
      : payment.paymentMethod === "wallet_plus_bank"
        ? bankLabel
          ? `${bankLabel} + Wallet`
          : "Bank + Wallet"
        : payment.paymentMethod === "cash"
          ? "Cash"
          : payment.paymentMethod === "partial_cash"
            ? "Partial Cash"
            : payment.paymentMethod === "split_cash_bank"
              ? bankLabel
                ? `Cash + ${bankLabel}`
                : "Cash + Bank"
              : bankLabel || "Bank transfer";
  const cashProof = (payment as any)?.cashProofKey as string | undefined;
  const bankProof = (payment as any)?.bankProofKey as string | undefined;

  console.log(payment);
  const showRejectPanel = payment.status === "pendingApproval";
  const reasonsUnavailable = rejectionReasonError || rejectionReasons.length === 0;
  const requiresManualCode = rejectionReasons.length === 0;
  const rejectDisabled =
    rejectionReasonLoading ||
    (rejectionReasons.length > 0 && !selectedRejectionCode) ||
    (requiresManualCode && !manualRejectionCode.trim());
  const publicNoteRemaining = 240 - publicNote.length;
  const internalNoteRemaining = 240 - internalNote.length;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Payment Details</h1>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">User Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {user ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{user.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">University</span>
                  <span className="font-medium">{user.university}</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">User details not available</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Payment Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium">
                Rs. {payment.amount.toLocaleString()}
              </span>
            </div>
            {walletRequested > 0 && walletApplied <= 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Wallet Requested</span>
                <span className="font-medium">
                  Rs. {walletRequested.toLocaleString()}
                </span>
              </div>
            )}
            {walletApplied > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Wallet Applied</span>
                <span className="font-medium">
                  Rs. {walletApplied.toLocaleString()}
                </span>
              </div>
            )}
            {payment.discount && payment.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount Applied</span>
                <span className="font-medium text-brand-primary">
                  Rs. {payment.discount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Source</span>
              <span className="font-medium">{paymentSourceLabel}</span>
            </div>
            {typeof payment.cashAmount === "number" && payment.cashAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Collected</span>
                <span className="font-medium">
                  Rs. {payment.cashAmount.toLocaleString()}
                </span>
              </div>
            )}
            {typeof payment.bankAmount === "number" && payment.bankAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Collected</span>
                <span className="font-medium">
                  Rs. {payment.bankAmount.toLocaleString()}
                </span>
              </div>
            )}
            {bankAccount ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium">{bankAccount.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-medium">
                    {bankAccount.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IBAN</span>
                  <span className="font-medium">{bankAccount.IBAN}</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                {payment.paymentMethod === "wallet_only"
                  ? "Paid from wallet"
                  : bankLabel
                    ? `Bank: ${bankLabel}`
                    : "Bank account details not available"}
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Type</span>
              <span className="font-medium capitalize">
                {payment.paymentType}
              </span>
            </div>
            {typeof registrationPrice === "number" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Trip Price</span>
                <span className="font-medium">
                  Rs. {registrationPrice.toLocaleString()}
                </span>
              </div>
            )}
            {typeof registrationAmountDue === "number" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Due</span>
                <span className="font-medium">
                  Rs. {registrationAmountDue.toLocaleString()}
                </span>
              </div>
            )}
            {payment.status === "pendingApproval" &&
              typeof projectedRemainingDue === "number" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Remaining Due (after approval)
                  </span>
                  <span className="font-medium">
                    Rs. {projectedRemainingDue.toLocaleString()}
                  </span>
                </div>
              )}
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {new Date(payment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  payment.status === "pendingApproval" && "text-brand-warning",
                  payment.status === "approved" && "text-brand-primary",
                  payment.status === "rejected" && "text-brand-error"
                )}
              >
                {payment.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {flagship && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Trip Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Trip Name</span>
                <span className="font-medium">{flagship.tripName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination</span>
                <span className="font-medium">{flagship.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dates</span>
                <span className="font-medium">
                  {new Date(flagship.startDate).toLocaleDateString()} -{" "}
                  {new Date(flagship.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{flagship.days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">Rs. {flagship.basePrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Payment Proofs</h2>
        </CardHeader>
        <CardContent>
          {cashProof || bankProof || payment.screenshot ? (
            <div className="space-y-4">
              {cashProof && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Cash Proof</p>
                  <div className="relative aspect-video w-full">
                    <Image
                      src={cashProof}
                      alt="Cash Proof"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              {bankProof && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Bank Proof</p>
                  <div className="relative aspect-video w-full">
                    <Image
                      src={bankProof}
                      alt="Bank Proof"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              {!cashProof && !bankProof && payment.screenshot && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={payment.screenshot}
                    alt="Payment Screenshot"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              No proof was submitted for this payment.
            </div>
          )}
        </CardContent>
      </Card>

      {showRejectPanel && (
        <>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Reject Payment</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {rejectionReasons.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Reason</label>
                  <select
                    value={selectedRejectionCode}
                    onChange={(event) => handleSelectRejectionCode(event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={rejectionReasonLoading}
                  >
                    <option value="">Select a reason</option>
                    {rejectionReasons.map((reason) => (
                      <option key={reason._id} value={reason.code}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                  {rejectionReasonLoading && (
                    <p className="text-xs text-muted-foreground">Loading rejection reasons…</p>
                  )}
                  {rejectionReasonError && (
                    <p className="text-xs text-brand-error">Unable to load rejection reasons.</p>
                  )}
                  {selectedRejectionCode && userMessagePrefill && (
                    <p className="text-xs text-muted-foreground">{userMessagePrefill}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Rejection code</label>
                  <input
                    value={manualRejectionCode}
                    onChange={(event) => setManualRejectionCode(event.target.value)}
                    placeholder="invalid_screenshot"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={rejectionReasonLoading}
                  />
                  {rejectionReasonLoading && (
                    <p className="text-xs text-muted-foreground">Loading rejection reasons…</p>
                  )}
                  {rejectionReasonError && (
                    <p className="text-xs text-brand-error">Unable to load rejection reasons.</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Public note (optional)</label>
                <textarea
                  value={publicNote}
                  onChange={(event) => setPublicNote(event.target.value.slice(0, 240))}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Visible to the user"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {publicNoteRemaining} characters left
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Internal note (optional)</label>
                <textarea
                  value={internalNote}
                  onChange={(event) => setInternalNote(event.target.value.slice(0, 240))}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Visible to admins only"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {internalNoteRemaining} characters left
                </p>
              </div>

              {reasonsUnavailable && (
                <p className="text-xs text-muted-foreground">
                  Rejection reasons are unavailable. Enter a valid code manually.
                </p>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-between gap-4 px-6 pb-6">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleRejectPayment}
              disabled={rejectDisabled}
            >
              Reject Payment
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleApprovePayment}
            >
              Approve Payment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
