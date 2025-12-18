import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import useCustomHook from "@/hooks/useSignUp";
import { BaseUser } from "@/interfaces/signup";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import api from "@/pages/api";
import apiEndpoints from "@/config/apiEndpoints";

export default function AdditionalInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = useCustomHook();
  const registrationAction = useRegistrationHook();
  const [university, setUniversity] = useState("LUM");
  const [cnic, setCnic] = useState("");
  const [cnicError, setCnicError] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [socialLink, setSocial] = useState("");
  const [flagshipId, setFlagshipId] = useState(null);
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState<boolean>(false);
  const isForcedCompletion = searchParams?.get("force") === "true";

  useEffect(() => {
    const flagshipId = localStorage.getItem("flagshipId");
    if (flagshipId) {
      setFlagshipId(JSON.parse(flagshipId));
    }
    const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
    console.log(savedData);
    if (savedData) {
      setUniversity(savedData?.university || "");
      setCnic(savedData?.cnic || "");
      setSocial(savedData?.socialLink || "");
      setCity(savedData?.city || "");
      setEmploymentStatus(savedData?.employmentStatus || "");
    }

    // Check if user is coming from Google login flow via localStorage flag
    // Set a flag 'isGoogleLogin' to 'true' during the Google signup redirect flow
    const googleFlag = localStorage.getItem('isGoogleLogin');
    setIsGoogleLogin(googleFlag === 'true' || isForcedCompletion);
  }, [isForcedCompletion]);

  const handleCnicChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 13);
    setCnic(digitsOnly);
    if (digitsOnly.length === 13) {
      setCnicError(null);
    }
  };

  const validateCnic = () => {
    if (cnic.length !== 13) {
      setCnicError("CNIC must be exactly 13 digits.");
      return false;
    }
    setCnicError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCnic()) {
      return;
    }
    setIsLoading(true);

    try {
      const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
      const formData = {
        ...savedData,
        university,
        cnic,
        socialLink,
        city,
        employmentStatus,
      };
      localStorage.setItem("formData", JSON.stringify(formData));

      // Different flow for Google login vs password login
      if (isGoogleLogin) {
        // For Google login, patch the authenticated user and continue
        const { USER } = apiEndpoints;
        const payload = {
          fullName: savedData?.fullName,
          gender: savedData?.gender,
          phone: savedData?.phone,
          university,
          cnic,
          socialLink,
          city,
        };
        await api.patch(USER.UPDATE_ME, payload);
        localStorage.removeItem("isGoogleLogin");
        localStorage.setItem("formData", JSON.stringify(formData));
        router.replace("/home");
      } else {
        // For password login, continue with the original flow
        const payload: BaseUser = { ...formData };
        const { userId, verificationId } = (await action.register(payload)) as {
          userId: string;
          verificationId: string;
        };

        if (flagshipId) {
          const registration = JSON.parse(
            localStorage.getItem("registration") || "{}"
          );
          registration.userId = userId;
          if (registration) {
            const { registrationId } = (await registrationAction.create(
              registration
            )) as { registrationId: string; message: string };
            localStorage.setItem(
              "registrationId",
              JSON.stringify(registrationId)
            );
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center p-0">
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
              <div className="w-10 h-10 rounded-full bg-black text-white  flex items-center justify-center text-sm">
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
                  pattern="[0-9]*"
                  maxLength={13}
                  onChange={(e) => handleCnicChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    cnicError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-gray-400"
                  }`}
                  placeholder="Enter CNIC number"
                  disabled={isLoading}
                  aria-invalid={cnicError ? "true" : "false"}
                  aria-describedby={cnicError ? "cnic-error" : undefined}
                />
                {cnicError && (
                  <p id="cnic-error" className="text-xs text-red-600 mt-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter City of residence"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Are you currently working?
              </h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="student"
                    checked={employmentStatus === "student"}
                    onChange={() => setEmploymentStatus("student")}
                    className="mr-2 accent-black"
                    color="black"
                    disabled={isLoading}
                  />
                  I&apos;m a student
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="employed"
                    checked={employmentStatus === "employed"}
                    onChange={() => setEmploymentStatus("employed")}
                    className="mr-2 accent-black"
                    disabled={isLoading}
                  />
                  Employed Professional
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="selfEmployed"
                    checked={employmentStatus === "selfEmployed"}
                    onChange={() => setEmploymentStatus("selfEmployed")}
                    className="mr-2 accent-black"
                    disabled={isLoading}
                  />
                  Self Employed/Business
                </label>
              </div>
            </div>

            {/* University/Workplace */}
            <div className="space-y-2">
              <label htmlFor="university" className="block text-sm font-medium">
                University/ Workplace/ Institute
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="university"
                  value={university}
                  required={true}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-black py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
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
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-black py-4 rounded-md text-sm font-medium transition-colors mt-8 flex items-center justify-center"
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
