import React, { useState } from "react";
import Image from "next/image";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { ROUTES_CONSTANTS } from "@/config/constants";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { X } from "lucide-react";

type StatusType = "rejected" | "pending" | "notReserved" | "confirmed" | "refundProcessing";

interface PaymentDetails {
  amount: number;
  dueAmount: number;
}

const getStatusStyles = (status: StatusType) => {
  switch (status) {
    case "rejected":
      return "bg-white text-red-700 border-red-300";
    case "pending":
      return "bg-white text-gray-700 border-gray-300";
    case "notReserved":
      return "bg-white text-red-700 border-red-300";
    case "confirmed":
      return "bg-white text-green-700 border-green-300";
    case "refundProcessing":
      return "bg-white text-green-700 border-green-300";
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
      return {
        css: 'bg-[#FF9000]',
        text: 'Complete Payment',
        onClick: () => router.push(`/musafir/payment/${registrationId}`)
      };
    case "notReserved":
      return {
        css: 'bg-[#FF9000]',
        text: 'Complete Payment',
        onClick: () => router.push(`/musafir/payment/${registrationId}`)
      };
    case "confirmed":
      return {
        css: 'bg-[#FF9000]',
        text: 'View Brief',
        onClick: () => setShowPdfModal(true)
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
}> = ({ status, paymentInfo, appliedDate }) => {
  switch (status) {
    case "rejected":
      return (
        <p className="text-sm text-gray-900">Status: Verification Failed</p>
      );
    case "pending":
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
          Status: Refund Pending on 3m Team
        </p>
      );
    case "confirmed":
      if (!paymentInfo) return null;
      return (
        <div className="text-sm text-gray-900 space-y-1">
          <p>
            Status:{" "}
            {status === "confirmed"
              ? "Your seat is confirmed"
              : "Seat will be booked on payment"}
          </p>
          <p>Receipt: Rs.{paymentInfo.amount.toLocaleString()}</p>
          <p>
            Paid: Rs.
            {(paymentInfo.amount - paymentInfo.dueAmount).toLocaleString()}
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
          />
          <div className="flex items-center justify-between">
            <button
              onClick={actionButton.onClick}
              className={`rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-[#FF9000] hover:text-gray-900 hover:border-yellow-500 active:bg-yellow-400 ${actionButton.css ? actionButton.css : 'bg.white'}`}
            >
              {actionButton.text}
            </button>
            {status === "confirmed" && (
              <button
                onClick={() => router.push(`/musafir/refund/${registrationId}`)}
                className="ml-2 p-2 text-gray-500 hover:text-red-600 transition-colors"
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
