import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import useCustomHook from "@/hooks/useSignUp";
import { BaseUser } from "@/interfaces/signup";
import useRegistrationHook, { RegistrationCreationResponse } from "@/hooks/useRegistrationHandler";
import api from "@/lib/api";
import apiEndpoints from "@/config/apiEndpoints";
import { showAlert } from "@/pages/alert";
import { mapErrorToUserMessage } from "@/utils/errorMessages";
import { cnicDigits, formatCnicInput, validateCnicFormat } from "@/utils/cnic";

export default function AdditionalInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: sessionStatus } = useSession();
  const action = useCustomHook();
  const registrationAction = useRegistrationHook();
  const [university, setUniversity] = useState("");
  const [cnic, setCnic] = useState("");
  const [cnicError, setCnicError] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [socialLink, setSocial] = useState("");
  const [flagshipId, setFlagshipId] = useState(null);
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState<boolean>(false);
  const [employmentError, setEmploymentError] = useState<string | null>(null);
  const isForcedCompletion = searchParams?.get("force") === "true";

  const employmentOptions = [
    { value: "student", label: "Student", placeholder: "University" },
    { value: "employed", label: "Employed", placeholder: "Workplace" },
    { value: "selfEmployed", label: "Business/Self Employed", placeholder: "Business Name" },
    { value: "unemployed", label: "Living in my unemployment era", placeholder: "" },
  ];


  const getGroupDiscountFeedback = (
    info: NonNullable<RegistrationCreationResponse['groupDiscount']>
  ) => {
    switch (info.status) {
      case 'applied':
        return {
          message: `Group discount applied: PKR ${info.perMember} off each (${info.groupSize} members).`,
          type: 'success' as const,
        };
      case 'not_eligible':
        return {
          message: `Group discount unlocks at 4 members. Current group size: ${info.groupSize}.`,
          type: 'error' as const,
        };
      case 'budget_exhausted':
        return {
          message: 'Your group qualifies, but the group discount budget is exhausted for this trip.',
          type: 'error' as const,
        };
      case 'disabled':
      default:
        return {
          message: 'Group discount is not enabled for this trip.',
          type: 'error' as const,
        };
    }
  };

  const employmentPlaceholder =
    employmentOptions.find((o) => o.value === employmentStatus)?.placeholder || "";

  useEffect(() => {
    const flagshipId = localStorage.getItem("flagshipId");
    if (flagshipId) {
      setFlagshipId(JSON.parse(flagshipId));
    }
    const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
    console.log(savedData);
    if (savedData) {
      setUniversity(savedData?.university || "");
      setCnic(formatCnicInput(savedData?.cnic || ""));
      setSocial(savedData?.socialLink || "");
      setCity(savedData?.city || "");
      setEmploymentStatus(savedData?.employmentStatus || "");
    }

    // Determine Google login flow. We only trust the flag if the user
    // actually has an authenticated session — prevents a stale flag from
    // a failed Google sign-in from triggering the PATCH flow.
    const googleFlag = localStorage.getItem('isGoogleLogin');
    const googlePending = localStorage.getItem('isGoogleLoginPending');

    if (sessionStatus === 'authenticated' && (googleFlag === 'true' || googlePending === 'true' || isForcedCompletion)) {
      // Session exists — safe to use Google flow
      if (googlePending) {
        localStorage.setItem('isGoogleLogin', 'true');
        localStorage.removeItem('isGoogleLoginPending');
      }
      setIsGoogleLogin(true);
    } else if (sessionStatus !== 'loading') {
      // No session or still loading — don't enable Google flow
      // Clean up stale flags
      if (googlePending) localStorage.removeItem('isGoogleLoginPending');
      setIsGoogleLogin(isForcedCompletion && sessionStatus === 'authenticated');
    }
  }, [isForcedCompletion, sessionStatus]);

  const handleCnicChange = (value: string) => {
    const formatted = formatCnicInput(value);
    setCnic(formatted);
    if (validateCnicFormat(formatted) === null) {
      setCnicError(null);
    }
  };

  const validateCnic = () => {
    const error = validateCnicFormat(cnic);
    if (error) {
      setCnicError(error);
      return false;
    }
    setCnicError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employmentStatus) {
      setEmploymentError("Please select your employment status.");
      return;
    }
    const requiresWorkDetail = employmentStatus !== "unemployed";
    if (requiresWorkDetail && !university) {
      setEmploymentError("This field is required for your selection.");
      return;
    }
    setEmploymentError(null);
    if (!validateCnic()) {
      return;
    }
    setIsLoading(true);

    try {
      const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
      const formData = {
        ...savedData,
        university,
        cnic: cnicDigits(cnic),
        socialLink,
        city,
        employmentStatus,
      };
      localStorage.setItem("formData", JSON.stringify(formData));

      // Different flow for Google login vs password login
      if (isGoogleLogin) {
        // Guard: verify session exists before making authenticated call
        if (sessionStatus !== 'authenticated') {
          showAlert('Your session has expired. Please sign in again.', 'error');
          router.replace('/login');
          return;
        }
        // For Google login, patch the authenticated user and continue
        const { USER } = apiEndpoints;
        const payload = {
          fullName: savedData?.fullName,
          gender: savedData?.gender,
          phone: savedData?.phone,
          university,
          cnic: cnicDigits(cnic),
          socialLink,
          city,
          employmentStatus,
        };
        const res = await api.patch(USER.UPDATE_ME, payload);
        const patchData = res?.data ?? res;
        if (patchData?.merged) {
          localStorage.setItem('accountMerged', 'true');
        }
        localStorage.removeItem("isGoogleLogin");
        localStorage.setItem("formData", JSON.stringify(formData));
        router.replace("/home");
      } else {
        // For password login, continue with the original flow
        const payload: BaseUser = { ...formData, employmentStatus };
        const registerResponse = (await action.register(payload)) as {
          userId: string;
          verificationId: string;
          merged?: boolean;
        };
        const { userId, verificationId } = registerResponse;

        if (registerResponse.merged) {
          localStorage.setItem('accountMerged', 'true');
        }

        if (flagshipId) {
          const registration = JSON.parse(
            localStorage.getItem("registration") || "{}"
          );
          registration.userId = userId;
          if (registration) {
            const response = (await registrationAction.create(
              registration
            )) as RegistrationCreationResponse;
            const registrationId = response.registrationId;
            localStorage.setItem(
              "registrationId",
              JSON.stringify(registrationId)
            );
            const conflictEmails = response?.linkConflicts?.map((conflict) => conflict.email) || [];
            if (conflictEmails.length) {
              showAlert(`These members are already linked to another group: ${conflictEmails.join(', ')}`, 'error');
            }
            if (registration?.tripType === 'group' && response?.groupDiscount) {
              const feedback = getGroupDiscountFeedback(response.groupDiscount);
              showAlert(feedback.message, feedback.type);
            }
            const feedbackPayload = {
              linkConflicts: response?.linkConflicts || [],
              groupDiscount: response?.groupDiscount || null,
            };
            if ((feedbackPayload.linkConflicts || []).length || feedbackPayload.groupDiscount) {
              localStorage.setItem("registrationFeedback", JSON.stringify(feedbackPayload));
            } else {
              localStorage.removeItem("registrationFeedback");
            }
          }
        }
        const storeData = {
          ...formData,
          verificationId,
        };
        localStorage.setItem("formData", JSON.stringify(storeData));

        console.log("clearing any existing session and routing to the email verify page");
        try {
          // Clear any existing NextAuth session so email-verify can create a fresh one
          await signOut({ redirect: false });
        } catch (err) {
          console.warn("Error signing out existing session:", err);
        }

        router.push("/signup/email-verify");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showAlert(mapErrorToUserMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-0">
      <div className="bg-white min-h-screen w-full max-w-md mx-auto rounded-lg shadow-sm p-3">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl font-semibold">Onboarding</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-3 relative">
            {/* Step 1 */}
            <div
              className="flex flex-col items-center z-10"
              onClick={() => router.push("/signup/registrationform")}
            >
              <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                1
              </div>
              <span className="mt-2 text-sm font-medium">Basic</span>
            </div>

            {/* Line (centered absolutely) */}
            <div className="absolute left-6 right-6 top-1/4 transform -translate-y-1/2 z-0">
              <div className="w-full h-0.5 bg-[#F3F3F3]" />
            </div>

            {/* Step 2 (conditionally rendered) */}
            {flagshipId && (
              <>
                <div
                  className="flex flex-col items-center z-10"
                  onClick={() => router.push("/flagship/flagship-requirement")}
                >
                  <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                    2
                  </div>
                  <span className="mt-2 text-sm text-gray-600">Flagship</span>
                </div>
              </>
            )}

            {/* Step 3 */}
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm">
                {flagshipId ? 3 : 2}
              </div>
              <span className="mt-2 text-sm text-gray-600">Background</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-8 custom-h2">Some more info</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* CNIC */}
            <div className="space-y-2">
              <label htmlFor="cnic" className="block text-sm font-medium">
                CNIC
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cnic"
                  value={cnic}
                  required={true}
                  inputMode="numeric"
                  pattern="[0-9-]*"
                  maxLength={15} // allows 13 digits + 2 dashes (xxxxx-xxxxxxx-x)
                  onChange={(e) => handleCnicChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${ cnicError ? "border-brand-error focus:ring-red-500" : "border-gray-300 focus:ring-gray-400" }`}
                  placeholder="Enter CNIC number"
                  disabled={isLoading}
                  aria-invalid={cnicError ? "true" : "false"}
                  aria-describedby={cnicError ? "cnic-error" : undefined}
                />
                {cnicError && (
                  <p id="cnic-error" className="text-xs text-brand-error mt-1">
                    {cnicError}
                  </p>
                )}
              </div>
            </div>

            {/* city of residence */}
            <div className="space-y-2">
              <label htmlFor="cnic" className="block text-sm font-medium">
                City of residence
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="city"
                  value={city}
                  required={true}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full input-field"
                  placeholder="Enter City of residence"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Employment Status
              </h2>
              <div className="space-y-2">
                <select
                  className="w-full input-field bg-white"
                  value={employmentStatus}
                  onChange={(e) => {
                    setEmploymentStatus(e.target.value);
                    setEmploymentError(null);
                    if (e.target.value === "unemployed") {
                      setUniversity("");
                    }
                  }}
                  required
                  disabled={isLoading}
                >
                  <option value="" disabled>Select an option</option>
                  {employmentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {employmentError && (
                  <p className="text-xs text-brand-error">{employmentError}</p>
                )}
              </div>
            </div>

            {/* Employment detail input */}
            {employmentStatus !== "unemployed" && employmentStatus !== "" && (
              <div className="space-y-2">
                <label htmlFor="university" className="block text-sm font-medium">
                  {employmentPlaceholder || "Details"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="university"
                    value={university}
                    required
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full input-field"
                    placeholder={employmentPlaceholder}
                    disabled={isLoading}
                  />
                  {university && !isLoading && (
                    <button
                      type="button"
                      onClick={() => setUniversity("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full hover:bg-black p-1"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Social Handle */}
            <div className="space-y-2">
              <label htmlFor="social" className="block text-sm font-medium">
                Socials Handle/Insta
              </label>
              <input
                type="text"
                id="social"
                value={socialLink}
                onChange={(e) => setSocial(e.target.value)}
                required={true}
                placeholder="Instagram"
                className="w-full input-field"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button or Verification Buttons based on login flow */}
            {isGoogleLogin ? (
              <div className='space-y-3 mt-8'>
                {/* Musafir Verification */}
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-primary-disabled disabled:cursor-not-allowed text-black py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                    aria-busy={isLoading || undefined}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Save & Continue"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-primary-disabled disabled:cursor-not-allowed text-black py-4 rounded-md text-sm font-medium transition-colors mt-8 flex items-center justify-center"
                aria-busy={isLoading || undefined}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    {flagshipId ? "Processing..." : "Processing..."}
                  </>
                ) : flagshipId ? (
                  "Flagship Preferences"
                ) : (
                  "Get Password"
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
