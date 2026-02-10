"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileMenu from "@/components/header/UserProfileMenu";

const resolveLabel = (path: string) => {
  if (path === "/explore") return "Explore";
  if (path === "/about-3musafir") return "About 3Musafir";
  if (path === "/community/voices") return "Community Voices";
  if (path === "/reviews") return "Reviews";
  if (path === "/why") return "Why 3Musafir";
  if (path === "/refundpolicyby3musafir") return "Refund Policy";
  if (path === "/terms&conditonsby3musafir") return "Terms";
  if (path.startsWith("/trust")) return "Trust & Safety";
  return "";
};

export default function PublicHeader({ hideAuthCta = false }: { hideAuthCta?: boolean }) {
  const { status } = useSession();
  const router = useRouter();
  const rawPath = (router.asPath || "/").split("?")[0].split("#")[0] || "/";
  const label = resolveLabel(rawPath);
  const callbackUrl = encodeURIComponent(router.asPath || "/");

  return (
    <header className="w-full bg-white border-b">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10 h-16 lg:h-20">
        <div className="flex items-center gap-2">
          <Link href="/home" aria-label="3Musafir home" className="flex items-center">
            <Image
              src="/primarylogo.svg"
              alt="3Musafir"
              width={160}
              height={160}
              className="h-16 w-16 lg:h-24 lg:w-24"
            />
          </Link>
          {label ? <span className="text-xs text-text">{label}</span> : null}
        </div>
        <div className="flex items-center">
          {status === "authenticated" ? (
            <UserProfileMenu />
          ) : hideAuthCta ? null : status === "loading" ? (
            <Skeleton className="h-9 w-36 rounded-full" />
          ) : (
            <Link
              href={`/login?callbackUrl=${callbackUrl}`}
              aria-label="Already a Musafir? Sign in"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-text hover:border-brand-primary hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Already a Musafir?
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
