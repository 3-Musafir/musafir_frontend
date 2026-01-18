import React, { useState } from "react";
import Image from "next/image";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { ROUTES_CONSTANTS } from "@/config/constants";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { X } from "lucide-react";

type StatusType = "rejected" | "pending" | "notReserved" | "confirmed" | "refundProcessing";

interface PaymentDetails {
  price: number;
  dueAmount: number;
  discountApplied?: number;
}

const getStatusStyles = (status: StatusType) => {
  switch (status) {
    case "rejected":
      return "bg-white text-brand-error border-red-300";
    case "pending":
      return "bg-white text-gray-700 border-gray-300";
    case "notReserved":
      return "bg-white text-brand-error border-red-300";
    case "confirmed":
      return "bg-white text-brand-primary border-green-300";
    case "refundProcessing":
      return "bg-white text-brand-primary border-green-300";
    default:
      return "bg-white text-gray-700 border-gray-300";
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
    case "rejected":
      return {
        css: '',
        text: 'Ask Jury to re-evaluate (Rs.500)',
        onClick: () => sendReEvaluateRequestToJury(registrationId)
      };
    case "pending":
      if (
        userVerificationStatus === "unverified" ||
        userVerificationStatus === "pending" ||
        userVerificationStatus === "rejected"
      ) {
        return {
          css: '',
          text: 'Add video for quicker verification',
          onClick: () => router.push(ROUTES_CONSTANTS.VERIFICATION_REQUEST)
        };
      }
      if (paymentStatus === "pendingApproval" || (hasPaymentSubmitted && !paymentStatus)) {
        return {
          css: 'bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 hover:border-gray-300 cursor-not-allowed',
          text: 'Awaiting approval',
          onClick: () => {},
          disabled: true,
        };
      }
      return {
        css: 'bg-brand-primary',
        text: 'Complete Payment',
        onClick: () => router.push(`/musafir/payment/${registrationId}`)
      };
    case "notReserved":
      return {
        css: 'bg-brand-primary',
        text: 'Complete Payment',
        onClick: () => router.push(`/musafir/payment/${registrationId}`)
      };
    case "confirmed":
      if (paymentStatus === "pendingApproval") {
        return {
          css: 'bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 hover:border-gray-300 cursor-not-allowed',
          text: 'Awaiting approval',
          onClick: () => {},
          disabled: true,
        };
      }
      if (paymentInfo && typeof paymentInfo.dueAmount === 'number' && paymentInfo.dueAmount > 0) {
        return {
          css: 'bg-brand-primary',
          text: `Pay remaining (Rs.${paymentInfo.dueAmount.toLocaleString()})`,
          onClick: () => router.push(`/musafir/payment/${registrationId}`),
        };
      }
      return {
        css: 'bg-brand-primary',
        text: 'View Brief',
        onClick: () => setShowPdfModal(true)
      };
    case "refundProcessing":
      return {
        css: 'bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 hover:border-gray-300 cursor-not-allowed',
        text: 'Refund under review',
        onClick: () => { },
        disabled: true,
      };
    default:
      return {
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
}> = ({ status, paymentInfo, appliedDate, hasPaymentSubmitted, paymentStatus }) => {
  switch (status) {
    case "rejected":
      return (
        <p className="text-sm text-gray-900">Status: Verification Failed</p>
      );
    case "pending":
      if (paymentStatus === "pendingApproval" || (hasPaymentSubmitted && !paymentStatus)) {
        return (
          <p className="text-sm text-gray-900">
            Status: Payment submitted, awaiting approval
            <br />
            {`Applied on ${appliedDate}`}
          </p>
        );
      }
      return (
        <p className="text-sm text-gray-900">
          Status: Pending on 3m Team
          <br />
          {`Applied on ${appliedDate}`}
        </p>
      );
    case "notReserved":
    case "refundProcessing":
      return (
        <p className="text-sm text-gray-900">
          Status: Refund under review
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
        <div className="text-sm text-gray-900 space-y-1">
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
}) => {
  const { sendReEvaluateRequestToJury } = useRegistrationHook();
  const router = useRouter();
  const [showPdfModal, setShowPdfModal] = useState(false);
  const actionButton = getActionButton(
    status,
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
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-300">
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
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span
            className={`rounded-md px-2 py-1 text-md font-medium border ${getStatusStyles(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        {status === "rejected" && (
          <p className="text-sm text-gray-600">
            {date} @ {location}
          </p>
        )}

        <div className="space-y-2 pt-1">
          <StatusInfo
            status={status}
            paymentInfo={paymentInfo}
            appliedDate={appliedDate}
            hasPaymentSubmitted={hasPaymentSubmitted}
            paymentStatus={paymentStatus}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={actionButton.onClick}
              disabled={Boolean((actionButton as any)?.disabled)}
              className={`rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-primary hover:text-gray-900 hover:border-brand-warning active:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed ${actionButton.css ? actionButton.css : 'bg-white'}`}
            >
              {actionButton.text}
            </button>
            {status === "confirmed" && paymentInfo?.dueAmount === 0 && (
              <button
                onClick={() => router.push(`/musafir/refund/${registrationId}`)}
                className="ml-2 p-2 text-gray-500 hover:text-brand-error transition-colors"
              >
                <DeleteIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {showPdfModal && detailedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="text-md font-semibold">Detailed Travel Plan</h3>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
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
