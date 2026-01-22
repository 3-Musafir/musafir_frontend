import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import useSignUpHook from "@/hooks/useSignUp";
import { showAlert } from "@/pages/alert";

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const useSignUp = useSignUpHook();
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
      localStorage.setItem(
        "formData",
        JSON.stringify({ ...savedData, referralCode: ref })
      );
    }
  }, [searchParams]);

  const checkEmailAvailability = async () => {
    return await useSignUp.checkEmailAvailability(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!(await checkEmailAvailability())) {
        showAlert("Email already exists, Please enter another email", "error");
        return;
      }

      const savedData = JSON.parse(localStorage.getItem("formData") || "{}");

      const formData = {
        ...savedData,
        email,
      };
      localStorage.setItem("formData", JSON.stringify(formData));
      router.push("/signup/registrationform");
    } catch {
      showAlert("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Mark this navigation as a Google signup flow so downstream steps
    // (like AdditionalInfo) can adapt the UI/flow.
    if (typeof window !== "undefined") {
      localStorage.setItem("isGoogleLogin", "true");
    }

    const base =
      process.env.NEXT_PUBLIC_AUTH_URL && process.env.NEXT_PUBLIC_AUTH_URL.trim().length > 0
        ? process.env.NEXT_PUBLIC_AUTH_URL
        : "";
    const callbackUrl = base ? `${base}/signup/registrationform` : "/signup/registrationform";

    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-0">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-sm h-screen p-3">
        {/* Header */}
        <header className="flex items-center p-4 border-b">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center flex-1 text-2xl font-semibold mr-7">
            Onboarding
          </h1>
        </header>

        {/* Main Content */}
        <main className="p-4 max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Let&apos;s create your account
            </h2>
            <p className="text-gray-600">
              Never fill long forms again + get discounts on future flagships
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full input-field"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
              aria-busy={isLoading || undefined}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={isLoading}
              className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-3"
              aria-busy={isLoading || undefined}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
              </svg>
              Sign Up with Google
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
