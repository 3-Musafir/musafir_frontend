import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { User } from "@/interfaces/login";
import useLoginHook from "@/hooks/useLoginHandler";
import { ROLES, ROUTES_CONSTANTS } from "@/config/constants";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const actionLogin = useLoginHook();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const verifyUser = async () => {
    try {
      const userData: User = await actionLogin.verifyToken(); // Call API
      if (userData?.roles?.includes(ROLES.ADMIN)) {
        router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
      } else if (userData.roles?.includes(ROLES.MUSAFIR)) {
        router.push(ROUTES_CONSTANTS.HOME);
      }
    } catch (error) {
      console.error("Token verification failed", error);
      router.push("/login"); // Redirect to login if token invalid
    }
  };

  useEffect(() => {
    if (session) {
      console.log("session: ", session);
      // router.push('/home'); // Redirect logged-in users to home
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log(result, "results");

      if (result?.status === 200) {
        setTimeout(() => {
          verifyUser();
        }, 1000);
      }

      if (result?.error) {
        console.log("error", error);
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Set local flag so downstream signup pages know this was a Google flow
    if (typeof window !== "undefined") {
      localStorage.setItem("isGoogleLogin", "true");
    }

    const base =
      process.env.NEXT_PUBLIC_AUTH_URL && process.env.NEXT_PUBLIC_AUTH_URL.trim().length > 0
        ? process.env.NEXT_PUBLIC_AUTH_URL
        : "";
    const callbackUrl = base ? `${base}/home` : "/home";

    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0">
      <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
        {/* Header */}
        <header className="flex items-center p-4 border-b">
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
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Your Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled={isLoading}
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
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
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
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>
            <div>
              {/* {session ? (
              <>
                <p>Welcome, {session.user?.name}!</p>
                <button onClick={() => signOut()}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => signIn("google")}>Sign in with Google</button>
            )} */}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
