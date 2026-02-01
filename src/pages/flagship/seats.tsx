import Header from "@/components/header";
import Navigation from "@/pages/navigation";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentUser } from "@/store/signup";

export default function RemainingSeats() {
  const [flagship, setFlagship] = useState<any>({});
  const action = useFlagshipHook();
  const router = useRouter();
  const [registrationId, setRegistrationId] = useState<string>('');
  const [registrationFeedback, setRegistrationFeedback] = useState<
    | {
        linkConflicts?: { email: string; reason: 'already_in_another_group' }[];
        groupDiscount?: {
          status: 'applied' | 'not_eligible' | 'budget_exhausted' | 'disabled';
          perMember: number;
          groupSize: number;
        } | null;
      }
    | null
  >(null);
  const [feedbackDismissed, setFeedbackDismissed] = useState(false);
  const user = useRecoilValue(currentUser);
  const verificationStatus = (user as any)?.verification?.status;
  const isVerified = verificationStatus === "verified";

  const getGroupDiscountFeedback = (
    info: NonNullable<{
      status: 'applied' | 'not_eligible' | 'budget_exhausted' | 'disabled';
      perMember: number;
      groupSize: number;
    }>
  ) => {
    switch (info.status) {
      case 'applied':
        return {
          message: `Group discount applied: PKR ${info.perMember} off each (${info.groupSize} members).`,
          tone: 'success' as const,
        };
      case 'not_eligible':
        return {
          message: `Group discount unlocks at 4 members. Current group size: ${info.groupSize}.`,
          tone: 'warning' as const,
        };
      case 'budget_exhausted':
        return {
          message: 'Your group qualifies, but the group discount budget is exhausted for this trip.',
          tone: 'warning' as const,
        };
      case 'disabled':
      default:
        return {
          message: 'Group discount is not enabled for this trip.',
          tone: 'warning' as const,
        };
    }
  };

  const getFlagship = async (flagshipId: any) => {
    const response = await action.getFlagship(flagshipId);
    setFlagship(response);
  };

  useEffect(() => {
    const flagshipId = JSON.parse(localStorage.getItem("flagshipId") || "null");
    if (flagshipId) {
      getFlagship(flagshipId);
    }

    const registrationId = JSON.parse(localStorage.getItem("registrationId") || "null");
    if (registrationId) {
      setRegistrationId(registrationId);
    }

    const feedbackRaw = localStorage.getItem("registrationFeedback");
    if (feedbackRaw) {
      try {
        const parsed = JSON.parse(feedbackRaw);
        setRegistrationFeedback(parsed);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    router.push(`/musafir/payment/${registrationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-6">
      <Header setSidebarOpen={() => {}} showMenuButton={false} />
      <div className="bg-white min-h-screen w-full rounded-lg shadow-sm p-3 lg:p-6 mt-4 lg:mt-6">
        <h2 className="text-xl lg:text-2xl font-bold text-center pt-2 mb-4">
          Flagship Registration
        </h2>

        <main className="p-4 lg:max-w-2xl lg:mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-700">
              Remaining Seat For <br /> {flagship.tripName}
            </h1>
          </div>

          {registrationFeedback && !feedbackDismissed && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  {registrationFeedback.linkConflicts?.length ? (
                    <p className="text-sm text-red-700">
                      Some members are already linked to another group: {registrationFeedback.linkConflicts
                        .map((conflict) => conflict.email)
                        .join(', ')}.
                    </p>
                  ) : null}
                  {registrationFeedback.groupDiscount ? (
                    (() => {
                      const feedback = getGroupDiscountFeedback(registrationFeedback.groupDiscount);
                      return (
                        <p
                          className={`text-sm ${
                            feedback.tone === 'success' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {feedback.message}
                        </p>
                      );
                    })()
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackDismissed(true)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="border border-gray-400 rounded-lg p-4 relative w-1/2 mx-auto bg-gray-100">
              <div className="text-lg text-gray-600 mb-2 text-center">
                Remaining Tickets
              </div>
              <div className="text-6xl font-bold text-center">
                {(() => {
                  const total = Number(flagship?.totalSeats || 0);
                  const confirmedMale = Number(flagship?.confirmedMaleCount || 0);
                  const confirmedFemale = Number(flagship?.confirmedFemaleCount || 0);
                  const remaining = Math.max(0, total - (confirmedMale + confirmedFemale));
                  return remaining;
                })()}
              </div>
            </div>
          </div>

          {isVerified ? (
            <button
              onClick={handleSubmit}
              className="btn-primary w-full"
            >
              Make Payment
            </button>
          ) : (
            <>
              <p className="text-center text-sm text-gray-500 mb-4">
                Your identity needs verification before completing the payment.
              </p>
              <button
                onClick={() => {
                  if (registrationId) {
                    localStorage.setItem(
                      "verificationReturnTo",
                      `/musafir/payment/${registrationId}`,
                    );
                  }
                  router.push("/verification");
                }}
                className="btn-primary w-full bg-amber-500 hover:bg-amber-600 border-0"
              >
                Get Verified
              </button>
            </>
          )}
        </main>
      </div>
      <Navigation />
    </div>
  );
}
