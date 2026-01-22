import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/launch",
  "/unauthorized",
  "/forgot-password",
  "/reset-password",
  "/refundpolicyby3musafir",
  "/musafircommunityequityframework",
  "/terms&conditonsby3musafir",
  "/flagship/details",
  "/signup/accountCreated",
  "/signup/create-account",
  "/signup/password-setup",
  "/signup/registrationform",
  "/signup/additionalinfo",
  "/signup/email-verify",
  "/musafir-signup",
  "/musafir-signup/confirm",
  "/musafir-signup/verify-password",
  "/signup-dark/AccountCreation",
  "/signup-dark/AdditionalInfo",
  "/signup-dark/PasswordConfirmation",
  "/signup-dark/Verification",
  "/signup-dark/musafiridform-dark",
]);

const ADMIN_PATH_PREFIXES = [
  "/admin",
  "/dashboard",
  "/flagship/create",
  "/flagship/payment",
  "/flagship/seats",
];

const USER_PATH_PREFIXES = [
  "/home",
  "/passport",
  "/wallet",
  "/referrals",
  "/userSettings",
  "/change-password",
  "/verification",
  "/feedback",
  "/musafir",
  "/flagship/flagship-requirement",
  "/flagship/flagshipRequirement-dark",
];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.has(pathname) ||
  Array.from(PUBLIC_PATHS).some((p) => p !== "/" && pathname.startsWith(`${p}/`));

const matchesPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const buildLoginRedirect = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search || ""}`;
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(url);
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const requiresAdmin = matchesPrefix(pathname, ADMIN_PATH_PREFIXES);
  const requiresUser = matchesPrefix(pathname, USER_PATH_PREFIXES);

  if (!requiresAdmin && !requiresUser) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return buildLoginRedirect(req);
  }

  if (requiresAdmin) {
    const roles = (token as any)?.user?.roles || [];
    if (!Array.isArray(roles) || !roles.includes("admin")) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)|api).*)",
  ],
};
