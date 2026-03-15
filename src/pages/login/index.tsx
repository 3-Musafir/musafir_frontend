import { ROLES, ROUTES_CONSTANTS } from "@/config/constants";
import endpoints from "@/config/apiEndpoints";
import useLoginHook from "@/hooks/useLoginHandler";
import { User } from "@/interfaces/login";
import { mapErrorToUserMessage } from "@/utils/errorMessages";
import { trackClarityEvent } from "@/lib/analytics/clarity";
import { CLARITY_EVENTS } from "@/lib/analytics/events";
import apiService from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localReturnTo, setLocalReturnTo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("returnTo");
    if (stored && /^\/(?!\/)/.test(stored)) {
      setLocalReturnTo(stored);
    }
  }, []);

  const requestedCallback = useMemo(() => {
    const raw = searchParams?.get("callbackUrl");
    const isSafe = typeof raw === "string" && /^\/(?!\/)/.test(raw);
    if (isSafe) return raw;
    if (localReturnTo && /^\/(?!\/)/.test(localReturnTo)) return localReturnTo;
    return null;
  }, [searchParams, localReturnTo]);
  const actionLogin = useLoginHook();
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const verifyUser = useCallback(async () => {
    try {
      const userData: User = await actionLogin.verifyToken(); // Call API

      if (userData?.roles?.includes(ROLES.ADMIN)) {
        if (requestedCallback && requestedCallback.startsWith("/admin")) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("returnTo");
          }
          router.push(requestedCallback);
          return;
        }

        router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
        return;
      }

      if (userData?.roles?.includes(ROLES.MUSAFIR)) {
        if (requestedCallback && !requestedCallback.startsWith("/admin")) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("returnTo");
          }
          router.push(requestedCallback);
          return;
        }

        router.push(ROUTES_CONSTANTS.HOME);
      }
    } catch (error) {
      console.error("Token verification failed", error);
      router.push("/login"); // Redirect to login if token invalid
    }
  }, [actionLogin, requestedCallback, router]);

  useEffect(() => {
    if (!session || hasRedirected) return;
    // Session exists (e.g., after Google OAuth); route based on role
    setHasRedirected(true);
    verifyUser();
  }, [session, hasRedirected, verifyUser]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiService.post(endpoints.SEND_LOGIN_PASSWORD, { email });
      setStep("otp");
      setOtpDigits(["", "", "", "", "", ""]);
      setResendCooldown(30);
    } catch (error) {
      setError(mapErrorToUserMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setIsLoading(true);

    try {
      await apiService.post(endpoints.SEND_LOGIN_PASSWORD, { email });
      setResendCooldown(30);
    } catch (error) {
      setError(mapErrorToUserMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 6) return;
    setError("");
    setIsLoading(true);
    trackClarityEvent(CLARITY_EVENTS.LOGIN_SUBMIT);

    try {
      const result = await signIn("credentials", {
        email,
        password: otp,
        redirect: false,
      });

      if (result?.status === 200) {
        trackClarityEvent(CLARITY_EVENTS.LOGIN_SUCCESS);
        setHasRedirected(true);
        if (requestedCallback) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("returnTo");
          }
          router.replace(requestedCallback);
          return;
        }
        setTimeout(() => {
          verifyUser();
        }, 1000);
      }

      if (result?.error) {
        trackClarityEvent(CLARITY_EVENTS.LOGIN_ERROR);
        setError("Invalid or expired OTP");
      }
    } catch (error) {
      console.error("Login error:", error);
      trackClarityEvent(CLARITY_EVENTS.LOGIN_ERROR);
      setError(mapErrorToUserMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Mark intent — only promoted to "isGoogleLogin" after session is confirmed
    // in auth-callback. This prevents a stale flag if sign-in fails.
    if (typeof window !== "undefined") {
      localStorage.setItem("isGoogleLoginPending", "true");
    }

    // Allow caller to pass a safe callbackUrl (e.g., /admin) via query.
    const requestedCallbackParam = searchParams?.get("callbackUrl");
    const isSafePath =
      typeof requestedCallbackParam === "string" &&
      /^\/(?!\/)/.test(requestedCallbackParam); // allow "/foo", disallow "//" or protocols

    const base =
      process.env.NEXT_PUBLIC_AUTH_URL && process.env.NEXT_PUBLIC_AUTH_URL.trim().length > 0
        ? process.env.NEXT_PUBLIC_AUTH_URL
        : "";
    const defaultCallback = base ? `${base}/auth-callback` : "/auth-callback";
    const nextPath = requestedCallback ?? (isSafePath ? requestedCallbackParam! : undefined);
    const callbackUrl = nextPath
      ? `${defaultCallback}?next=${encodeURIComponent(nextPath)}`
      : defaultCallback;

    trackClarityEvent(CLARITY_EVENTS.LOGIN_GOOGLE_START);

    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen w-full bg-white p-0">
      <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
        {/* Header */}
        <header className="flex items-center px-4 py-2 border-b">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center flex-1 text-xl font-semibold mr-7">
            Login
          </h1>
        </header>

        {/* Main Content */}
        <main className="p-4 max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Login to your Musafir Account
            </h2>
          </div>

          {step === "email" ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
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
                  className="w-full input-field"
                  disabled={isLoading}
                  required
                />
                {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
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
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
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
                Sign In with Google
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Email
                </label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">{email}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtpDigits(["", "", "", "", "", ""]);
                      setError("");
                      setResendCooldown(0);
                    }}
                    className="text-brand-primary hover:text-brand-primary-hover text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Enter OTP
                </label>
                <div className="flex justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isLoading}
                      autoComplete={idx === 0 ? "one-time-code" : "off"}
                      className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (!val && !digit) return;
                        const next = [...otpDigits];
                        if (val.length > 1) {
                          const chars = val.slice(0, 6).split("");
                          chars.forEach((c, i) => { if (idx + i < 6) next[idx + i] = c; });
                          setOtpDigits(next);
                          const focusIdx = Math.min(idx + chars.length, 5);
                          otpRefs.current[focusIdx]?.focus();
                          return;
                        }
                        next[idx] = val;
                        setOtpDigits(next);
                        if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
                          const next = [...otpDigits];
                          next[idx - 1] = "";
                          setOtpDigits(next);
                          otpRefs.current[idx - 1]?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        if (!pasted) return;
                        const next = [...otpDigits];
                        pasted.split("").forEach((c, i) => { if (i < 6) next[i] = c; });
                        setOtpDigits(next);
                        const focusIdx = Math.min(pasted.length, 5);
                        otpRefs.current[focusIdx]?.focus();
                      }}
                    />
                  ))}
                </div>
                {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
              </div>

              <div className="text-right">
                {resendCooldown > 0 ? (
                  <span className="text-sm text-gray-500">
                    Resend OTP in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-brand-primary hover:text-brand-primary-hover text-sm font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otpDigits.join("").length !== 6}
                className="btn-primary w-full flex items-center justify-center"
                aria-busy={isLoading || undefined}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
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
                Sign In with Google
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
