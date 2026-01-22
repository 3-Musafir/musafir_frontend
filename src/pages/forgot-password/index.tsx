import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { showAlert } from "@/pages/alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`,
        { email }
      );

      if (response.status === 200) {
        showAlert("Password reset link sent to your email", "success");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      showAlert("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0">
      <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
        {/* Header */}
        <header className="flex items-center p-4 border-b">
          <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center flex-1 text-xl font-semibold mr-7">
            Forgot Password
          </h1>
        </header>

        {/* Main Content */}
        <main className="p-4 max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
            <p className="text-gray-600 text-sm">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isLoading}
                required
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
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-brand-primary hover:text-brand-primary-hover text-sm font-medium"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
