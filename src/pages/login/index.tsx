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
              className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed py-4 rounded-md text-sm font-medium transition-colors"
            >
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
