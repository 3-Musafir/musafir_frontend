import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import useSignUpHook from "@/hooks/useSignUp";
import { showAlert } from "@/pages/alert";

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const useSignUp = useSignUpHook();

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

    await signIn("google", {
      callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/signup/registrationform` || "/signup/registrationform",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 md:flex md:items-center md:justify-center p-0">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
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
              className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed py-4 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up with Google
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
