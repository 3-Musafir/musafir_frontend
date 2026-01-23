import React, { useState } from "react";
import Image from "next/image";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { ROUTES_CONSTANTS } from "@/config/constants";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { X } from "lucide-react";

type StatusType =
  | "new"
  | "onboarding"
  | "payment"
  | "waitlisted"
  | "confirmed"
  | "cancelled"
  | "refundProcessing"
  | "refunded";

interface PaymentDetails {
  price: number;
  dueAmount: number;
  discountApplied?: number;
}

const getStatusStyles = (status: StatusType) => {
  switch (status) {
    case "waitlisted":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "payment":
      return "bg-card text-brand-primary border-brand-primary";
    case "confirmed":
      return "bg-card text-brand-primary border-brand-primary";
    case "new":
    case "onboarding":
      return "bg-card text-heading border-border";
    case "cancelled":
      return "bg-card text-heading border-border";
    case "refundProcessing":
      return "bg-card text-brand-primary border-brand-primary";
    case "refunded":
      return "bg-card text-heading border-border";
    default:
      return "bg-card text-heading border-border";
  }
};

const getStatusLabel = (status: StatusType) => {
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
    case "cancelled":
      return "Cancelled";
    case "refundProcessing":
      return "Refund under review";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
};

const getActionButton = (
  status: StatusType,
  registrationId: string,
  sendReEvaluateRequestToJury: any,
  router: AppRouterInstance,
  setShowPdfModal: React.Dispatch<React.SetStateAction<boolean>>,
  paymentInfo?: PaymentDetails,
  hasPaymentSubmitted?: boolean,
  paymentStatus?: string,
  userVerificationStatus?: string
) => {
  switch (status) {
    case "new":
    case "onboarding":
      if (userVerificationStatus === "pending") {
        return {
          css: "bg-muted text-muted-foreground border-border cursor-not-allowed hover:bg-muted hover:text-muted-foreground hover:border-border",
          text: "Verification pending",
          onClick: () => {},
          disabled: true,
        };
      }
      if (userVerificationStatus === "verified") {
        return {
          css: "bg-brand-primary text-btn-secondary-text border-brand-primary hover:bg-brand-primary-hover",
          text: "Complete Payment",
          onClick: () => router.push(`/musafir/payment/${registrationId}`),
        };
      }
      return {
        css: "bg-brand-primary text-btn-secondary-text border-brand-primary hover:bg-brand-primary-hover",
        text: "Complete Verification",
        onClick: () => router.push(ROUTES_CONSTANTS.VERIFICATION_REQUEST),
      };
    case "payment":
      if (paymentStatus === "pendingApproval" || (hasPaymentSubmitted && !paymentStatus)) {
        return {
          css: "bg-muted text-muted-foreground border-border cursor-not-allowed hover:bg-muted hover:text-muted-foreground hover:border-border",
          text: "Awaiting approval",
          onClick: () => {},
          disabled: true,
        };
      }
      return {
        css: "bg-brand-primary text-btn-secondary-text border-brand-primary hover:bg-brand-primary-hover",
        text: "Complete Payment",
        onClick: () => router.push(`/musafir/payment/${registrationId}`),
      };
    case "waitlisted":
      return {
        css: "bg-muted text-muted-foreground border-border cursor-not-allowed hover:bg-muted hover:text-muted-foreground hover:border-border",
        text: "Waitlisted",
        onClick: () => {},
        disabled: true,
      };
    case "confirmed":
      if (paymentStatus === "pendingApproval") {
        return {
          css: "bg-muted text-muted-foreground border-border cursor-not-allowed hover:bg-muted hover:text-muted-foreground hover:border-border",
          text: "Awaiting approval",
          onClick: () => {},
          disabled: true,
        };
      }
      if (paymentInfo && typeof paymentInfo.dueAmount === 'number' && paymentInfo.dueAmount > 0) {
        return {
          css: "bg-brand-primary text-btn-secondary-text border-brand-primary hover:bg-brand-primary-hover",
          text: `Pay remaining (Rs.${paymentInfo.dueAmount.toLocaleString()})`,
          onClick: () => router.push(`/musafir/payment/${registrationId}`),
        };
      }
      return {
        css: "bg-brand-primary text-btn-secondary-text border-brand-primary hover:bg-brand-primary-hover",
        text: "View Brief",
        onClick: () => setShowPdfModal(true)
      };
    case "cancelled":
      return {
        css: "bg-brand-primary text-btn-secondary-text border-brand-primary hover:bg-brand-primary-hover",
        text: "Request refund",
        onClick: () => router.push(`/musafir/refund/${registrationId}`),
      };
    case "refundProcessing":
      return {
        css: "bg-muted text-muted-foreground border-border cursor-not-allowed hover:bg-muted hover:text-muted-foreground hover:border-border",
        text: "Refund under review",
        onClick: () => { },
        disabled: true,
      };
    case "refunded":
      return {
        css: "bg-brand-primary text-btn-secondary-text border-brand-primary hover:bg-brand-primary-hover",
        text: "View refund status",
        onClick: () => router.push(`/musafir/refund/${registrationId}`),
      };
    default:
      return {
        css: "bg-background text-btn-text border-border hover:bg-muted",
        text: "Action",
        onClick: () => console.log("Default action clicked"),
      };
  }
};

const StatusInfo: React.FC<{
  status: StatusType;
  paymentInfo?: PaymentDetails;
  appliedDate?: string;
  hasPaymentSubmitted?: boolean;
  paymentStatus?: string;
  userVerificationStatus?: string;
}> = ({ status, paymentInfo, appliedDate, hasPaymentSubmitted, paymentStatus, userVerificationStatus }) => {
  switch (status) {
    case "new":
    case "onboarding":
      if (userVerificationStatus === "pending") {
        return (
          <p className="text-sm text-heading">
            Status: Verification submitted, awaiting approval
            <br />
            {`Applied on ${appliedDate}`}
          </p>
        );
      }
      if (userVerificationStatus === "rejected") {
        return (
          <p className="text-sm text-heading">
            Status: Verification rejected
          </p>
        );
      }
      return (
        <p className="text-sm text-heading">
          Status: Verification required
          <br />
          {`Applied on ${appliedDate}`}
        </p>
      );
    case "payment":
      if (paymentStatus === "pendingApproval" || (hasPaymentSubmitted && !paymentStatus)) {
        return (
          <p className="text-sm text-heading">
            Status: Payment submitted, awaiting approval
            <br />
            {`Applied on ${appliedDate}`}
          </p>
        );
      }
      return (
        <p className="text-sm text-heading">
          Status: Awaiting payment
          <br />
          {`Applied on ${appliedDate}`}
        </p>
      );
    case "waitlisted":
      return (
        <p className="text-sm text-heading">
          Status: Waitlisted
          <br />
          We'll notify you when a seat opens.
        </p>
      );
    case "refundProcessing":
      return (
        <p className="text-sm text-heading">
          Status: Refund under review
        </p>
      );
    case "refunded":
      return (
        <p className="text-sm text-heading">
          Status: Refund processed
          <br />
          Check your wallet/notifications for updates.
        </p>
      );
    case "cancelled":
      return (
        <p className="text-sm text-heading">
          Status: Seat cancelled
          <br />
          You can request a refund.
        </p>
      );
    case "confirmed":
      if (!paymentInfo) return null;
      const discountApplied =
        typeof paymentInfo.discountApplied === 'number' ? paymentInfo.discountApplied : 0;
      const paidAmount = Math.max(
        0,
        (paymentInfo.price || 0) - (paymentInfo.dueAmount || 0) - discountApplied,
      );
      const isFullyPaid = (paymentInfo.dueAmount || 0) <= 0;
      return (
        <div className="text-sm text-heading space-y-1">
          <p>
            Status:{" "}
            {isFullyPaid ? "Your seat is confirmed" : "Payment approved (balance due)"}
          </p>
          <p>Total: Rs.{paymentInfo.price.toLocaleString()}</p>
          {discountApplied > 0 && (
            <p>Discount: Rs.{discountApplied.toLocaleString()}</p>
          )}
          <p>
            Paid: Rs.{paidAmount.toLocaleString()}
          </p>
          <p className="font-bold text-sm">
            Due Amount: Rs.{paymentInfo.dueAmount.toLocaleString()}
          </p>
        </div>
      );
    default:
      return null;
  }
};

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const PassportUpcomingCard: React.FC<any> = ({
  registrationId,
  title,
  date,
  location,
  status,
  image,
  paymentInfo,
  appliedDate,
  detailedPlan,
  userVerificationStatus,
  hasPaymentSubmitted,
  paymentStatus,
  refundStatus,
  cancelledAt,
}) => {
  const { sendReEvaluateRequestToJury } = useRegistrationHook();
  const router = useRouter();
  const [showPdfModal, setShowPdfModal] = useState(false);

  const displayStatus: StatusType = (() => {
    if (refundStatus === "refunded") return "refunded";
    if (refundStatus === "pending" || refundStatus === "processing") return "refundProcessing";
    if (cancelledAt) return "cancelled";
    if (["new", "onboarding", "payment", "waitlisted", "confirmed"].includes(status)) {
      return status as StatusType;
    }
    return "new";
  })();
  const statusLabel = getStatusLabel(displayStatus);

  const handleCancelAndRefund = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        `Cancel your registration for ${title}? You’ll be taken to the refund form.`
      );
      if (!confirmed) return;
    }
    router.push(`/musafir/refund/${registrationId}`);
  };
  const actionButton = getActionButton(
    displayStatus,
    registrationId,
    sendReEvaluateRequestToJury,
    router,
    setShowPdfModal,
    paymentInfo,
    hasPaymentSubmitted,
    paymentStatus,
    userVerificationStatus,
  );

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm border border-border">
      {/* Image */}
      <div className="relative h-[140px] w-full overflow-hidden">
        <Image
          src={image || "/norwayUpcomming.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-heading">{title}</h3>
          <span
            className={`rounded-md px-2 py-1 text-md font-medium border ${getStatusStyles(
              displayStatus
            )}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {date} @ {location}
        </p>

        <div className="space-y-2 pt-1">
          <StatusInfo
            status={displayStatus}
            paymentInfo={paymentInfo}
            appliedDate={appliedDate}
            hasPaymentSubmitted={hasPaymentSubmitted}
            paymentStatus={paymentStatus}
            userVerificationStatus={userVerificationStatus}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={actionButton.onClick}
              disabled={Boolean((actionButton as any)?.disabled)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                actionButton.css
                  ? actionButton.css
                  : "bg-background text-btn-text border-border hover:bg-muted"
              }`}
            >
              {actionButton.text}
            </button>
            {displayStatus === "confirmed" && (
              <button
                onClick={handleCancelAndRefund}
                className="ml-2 p-2 text-muted-foreground hover:text-brand-error transition-colors"
                aria-label="Cancel seat"
              >
                <DeleteIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {showPdfModal && detailedPlan && (
        <div className="fixed inset-0 bg-heading/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card text-foreground rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-2 border-b border-border">
              <h3 className="text-md font-semibold text-heading">Detailed Travel Plan</h3>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={detailedPlan}
                className="w-full h-full"
                title="Detailed Travel Plan"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassportUpcomingCard;
