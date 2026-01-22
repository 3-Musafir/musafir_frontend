import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { showAlert } from "@/pages/alert";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
    });

  useEffect(() => {
    if (!token) {
      showAlert("Invalid reset link", "error");
    }
  }, [token, router]);

  useEffect(() => {
    // Password validation
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showAlert("Invalid reset link", "error");
      return;
    }

    if (!isPasswordValid) {
      showAlert("Please ensure your password meets all requirements", "error");
      return;
    }

    if (!passwordsMatch) {
      showAlert("Passwords do not match", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/reset-password-jwt?token=${token}`,
        {
          password,
          confirmPassword,
        }
      );

      if (response.status === 200) {
        showAlert("Password reset successfully!", "success");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      showAlert("Failed to reset password. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-white p-0">
      <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
        {/* Header */}
        <header className="flex items-center p-4 border-b">
          <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center flex-1 text-xl font-semibold mr-7">
            Reset Password
          </h1>
        </header>

        {/* Main Content */}
        <main className="p-4 max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
            <p className="text-gray-600 text-sm">
              Enter your new password below
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full input-field"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Password validation */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {passwordValidation.length ? (
                    <Check className="h-4 w-4 text-brand-primary" />
                  ) : (
                    <X className="h-4 w-4 text-brand-error" />
                  )}
                  <span
                    className={
                      passwordValidation.length
                        ? "text-brand-primary"
                        : "text-brand-error"
                    }
                  >
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {passwordValidation.uppercase ? (
                    <Check className="h-4 w-4 text-brand-primary" />
                  ) : (
                    <X className="h-4 w-4 text-brand-error" />
                  )}
                  <span
                    className={
                      passwordValidation.uppercase
                        ? "text-brand-primary"
                        : "text-brand-error"
                    }
                  >
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {passwordValidation.lowercase ? (
                    <Check className="h-4 w-4 text-brand-primary" />
                  ) : (
                    <X className="h-4 w-4 text-brand-error" />
                  )}
                  <span
                    className={
                      passwordValidation.lowercase
                        ? "text-brand-primary"
                        : "text-brand-error"
                    }
                  >
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {passwordValidation.number ? (
                    <Check className="h-4 w-4 text-brand-primary" />
                  ) : (
                    <X className="h-4 w-4 text-brand-error" />
                  )}
                  <span
                    className={
                      passwordValidation.number
                        ? "text-brand-primary"
                        : "text-brand-error"
                    }
                  >
                    One number
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full input-field"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-brand-error text-sm">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
              className="btn-primary w-full flex items-center justify-center"
              aria-busy={isLoading || undefined}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
