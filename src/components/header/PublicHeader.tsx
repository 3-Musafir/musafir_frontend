"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  Copy,
  Globe2,
  Mail,
  MessageCircle,
  Phone,
  Route,
  UsersRound,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileMenu from "@/components/header/UserProfileMenu";
import { cn } from "@/lib/utils";
import { publicPageContainer, publicPageGutter } from "@/components/layout/PublicLayout";

const resolveLabel = (path: string) => {
  if (path === "/explore") return "Explore";
  if (path === "/pakistan-dmc") return "Pakistan DMC";
  if (path === "/about-3musafir") return "About 3Musafir";
  if (path === "/reviews") return "Reviews";
  if (path === "/why") return "Why 3Musafir";
  if (path === "/hc") return "Help Center";
  if (path === "/hc/faq") return "FAQs";
  if (path === "/intlterms") return "International Terms";
  if (path === "/hc/safetyframework/community-framework") return "Community Framework";
  if (path === "/refundpolicyby3musafir") return "Refund Policy";
  if (path === "/terms&conditonsby3musafir") return "Terms";
  if (path === "/founderportfolio") return "Founder Portfolio";
  if (path === "/founderportfolio/biography") return "Biography";
  if (path === "/launch" || path === "/launch/launch") return "Launch";
  if (path === "/hc/safetyframework/trust-and-verification") return "Trust & Verification";
  if (path.startsWith("/hc/safetyframework")) return "Trust & Safety";
  return "";
};

type PublicHeaderVariant = "default" | "transparentOverlay" | "dmc";

type PublicHeaderProps = {
  hideAuthCta?: boolean;
  variant?: PublicHeaderVariant;
  children?: ReactNode;
  className?: string;
};

type ContactPanel = "menu" | "planning" | "booking";

const supportPhone = "+92 322 1848940";
const supportPhoneCompact = "+923221848940";
const supportEmail = "hello@3musafir.com";
const whatsappUrl = `https://wa.me/${supportPhoneCompact.replace("+", "")}`;

export default function PublicHeader({
  hideAuthCta = false,
  variant = "default",
  children,
  className,
}: PublicHeaderProps) {
  const { status } = useSession();
  const router = useRouter();
  const [contactOpen, setContactOpen] = useState(false);
  const [contactPanel, setContactPanel] = useState<ContactPanel>("menu");
  const rawPath = (router.asPath || "/").split("?")[0].split("#")[0] || "/";
  const label = resolveLabel(rawPath);
  const callbackUrl = encodeURIComponent(router.asPath || "/");
  const isTransparent = variant === "transparentOverlay";
  const isDmc = variant === "dmc";

  const closeContact = useCallback(() => {
    setContactOpen(false);
    setContactPanel("menu");
  }, []);

  const openContact = useCallback(() => {
    setContactPanel("menu");
    setContactOpen(true);
  }, []);

  useEffect(() => {
    if (!contactOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [contactOpen, closeContact]);

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Browser clipboard permissions can fail; the visible value remains available.
    }
  };

  const contactButton = (
    <button
      type="button"
      onClick={openContact}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-heading/70 bg-white px-3 py-2 text-xs font-bold text-heading transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:px-4 sm:text-sm",
      )}
    >
      Contact us
    </button>
  );

  return (
    <>
      <header
        className={cn(
          "w-full",
          isTransparent
            ? "fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white text-heading shadow-sm"
            : "sticky top-0 z-50 border-b border-gray-200 bg-white text-heading",
          isDmc && "shadow-sm",
          className,
        )}
      >
        <div
          className={cn(
            publicPageContainer,
            publicPageGutter,
            "flex items-center justify-between gap-3 overflow-visible",
            isTransparent ? "h-14 lg:h-16" : "h-16 lg:h-20",
          )}
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/" aria-label="3Musafir home" className="flex shrink-0 items-center">
              {isTransparent ? (
                <Image
                  src="/primarylogo.svg"
                  alt="3Musafir"
                  width={200}
                  height={200}
                  className="h-10 w-36 object-contain object-left sm:h-11 sm:w-44"
                />
              ) : (
                <Image
                  src="/primarylogo.svg"
                  alt="3Musafir"
                  width={200}
                  height={200}
                  className="h-10 w-28 object-contain object-left sm:h-12 sm:w-44"
                />
              )}
            </Link>
            {label && !isTransparent ? (
              <span className="hidden min-w-0 truncate text-sm text-text sm:inline">
                {label}
              </span>
            ) : null}
          </div>
          <div className="flex h-full shrink-0 items-center gap-2 sm:gap-3">
            {children ? (
              <>
                {children}
                {contactButton}
              </>
            ) : (
              <>
                <Link
                  href="/pakistan-dmc"
                  className={`hidden rounded-full border px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary md:inline-flex lg:text-sm ${
                    rawPath === "/pakistan-dmc"
                      ? "border-brand-primary text-brand-primary"
                      : isTransparent
                        ? "border-gray-200 text-text hover:border-brand-primary hover:text-brand-primary"
                        : "border-gray-200 text-text hover:border-brand-primary hover:text-brand-primary"
                  }`}
                >
                  Pakistan DMC
                </Link>
                {status === "authenticated" ? (
                  <UserProfileMenu />
                ) : hideAuthCta ? null : status === "loading" ? (
                  <Skeleton className="h-9 w-20 rounded-full sm:w-36" />
                ) : (
                  <Link
                    href={`/login?callbackUrl=${callbackUrl}`}
                    aria-label="Already a Musafir? Sign in"
                    className="rounded-full border border-gray-200 px-3 py-2 text-xs font-medium text-text transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:px-4 sm:text-sm"
                  >
                    <span className="sm:hidden">Sign in</span>
                    <span className="hidden sm:inline">Already a Musafir?</span>
                  </Link>
                )}
                {contactButton}
              </>
            )}
          </div>
        </div>
      </header>

      {contactOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-heading/50 px-4 py-6 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="public-contact-title"
          onMouseDown={closeContact}
        >
          <div
            className="max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-y-auto rounded-lg bg-white text-heading shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 id="public-contact-title" className="text-2xl font-bold">
                Contact us
              </h2>
              <button
                type="button"
                onClick={closeContact}
                aria-label="Close contact options"
                className="rounded-md p-1 text-heading transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {contactPanel === "menu" ? (
              <div className="space-y-8 px-5 py-7">
                <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
                  <UsersRound className="h-12 w-12 text-text" />
                  <div>
                    <h3 className="text-xl font-bold">Any doubts?</h3>
                    <Link
                      href="/hc/faq"
                      onClick={closeContact}
                      className="mt-3 inline-flex rounded-md border border-brand-primary px-4 py-2 text-sm font-bold text-heading transition hover:bg-brand-primary hover:text-heading"
                    >
                      Read our FAQs
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
                  <Globe2 className="h-12 w-12 text-text" />
                  <div>
                    <h3 className="text-xl font-bold">Need help planning your next adventure?</h3>
                    <button
                      type="button"
                      onClick={() => setContactPanel("planning")}
                      className="mt-3 inline-flex rounded-md border border-brand-primary px-4 py-2 text-sm font-bold text-heading transition hover:bg-brand-primary hover:text-heading"
                    >
                      Contact us
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
                  <Route className="h-12 w-12 text-text" />
                  <div>
                    <h3 className="text-xl font-bold">Already booked but need assistance?</h3>
                    <button
                      type="button"
                      onClick={() => setContactPanel("booking")}
                      className="mt-3 inline-flex rounded-md border border-brand-primary px-4 py-2 text-sm font-bold text-heading transition hover:bg-brand-primary hover:text-heading"
                    >
                      Email us
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {contactPanel === "planning" ? (
              <div className="px-5 py-7">
                <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
                  <Globe2 className="h-12 w-12 text-text" />
                  <div>
                    <h3 className="text-xl font-bold">Need help planning your next adventure?</h3>
                    <p className="mt-2 text-base leading-7 text-text">
                      Monday-Friday: 09:00 - 18:30 Pakistan time, or try WhatsApp for a quicker reply.
                    </p>
                  </div>
                </div>

                <div className="mt-7 divide-y divide-gray-200 border-y border-gray-200">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 py-4 text-base font-bold transition hover:text-brand-primary"
                  >
                    <MessageCircle className="h-6 w-6 text-text" />
                    <span className="flex-1">DM us on WhatsApp</span>
                    <Copy className="h-5 w-5 text-text" />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(supportPhone)}
                    className="flex w-full items-center gap-4 py-4 text-left text-base font-bold transition hover:text-brand-primary"
                  >
                    <Phone className="h-6 w-6 text-text" />
                    <span className="flex-1">Call us at {supportPhone}</span>
                    <Copy className="h-5 w-5 text-text" />
                  </button>
                  <a
                    href={`mailto:${supportEmail}?subject=Travel planning with 3Musafir`}
                    className="flex items-center gap-4 py-4 text-base font-bold transition hover:text-brand-primary"
                  >
                    <Mail className="h-6 w-6 text-text" />
                    <span className="flex-1">Contact us at {supportEmail}</span>
                    <Copy className="h-5 w-5 text-text" />
                  </a>
                  <Link
                    href="/pakistan-dmc"
                    onClick={closeContact}
                    className="flex items-center gap-4 py-4 text-base font-bold transition hover:text-brand-primary"
                  >
                    <CalendarDays className="h-6 w-6 text-text" />
                    <span className="flex-1">Book a call with a travel advisor</span>
                    <Copy className="h-5 w-5 text-text" />
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setContactPanel("menu")}
                  className="mx-auto mt-6 flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-heading transition hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
              </div>
            ) : null}

            {contactPanel === "booking" ? (
              <div className="px-5 py-7">
                <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
                  <Route className="h-12 w-12 text-text" />
                  <div>
                    <h3 className="text-xl font-bold">Already booked but need assistance?</h3>
                    <p className="mt-2 text-base leading-7 text-text">
                      Send us an email at {supportEmail} and the 3Musafir team will help.
                    </p>
                  </div>
                </div>

                <div className="mt-7 divide-y divide-gray-200 border-y border-gray-200">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 py-4 text-base font-bold transition hover:text-brand-primary"
                  >
                    <MessageCircle className="h-6 w-6 text-text" />
                    <span className="flex-1">DM us on WhatsApp</span>
                    <Copy className="h-5 w-5 text-text" />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(supportPhone)}
                    className="flex w-full items-center gap-4 py-4 text-left text-base font-bold transition hover:text-brand-primary"
                  >
                    <Phone className="h-6 w-6 text-text" />
                    <span className="flex-1">Call us at {supportPhone}</span>
                    <Copy className="h-5 w-5 text-text" />
                  </button>
                  <a
                    href={`mailto:${supportEmail}?subject=Booked trip support`}
                    className="flex items-center gap-4 py-4 text-base font-bold transition hover:text-brand-primary"
                  >
                    <Mail className="h-6 w-6 text-text" />
                    <span className="flex-1">Contact us at {supportEmail}</span>
                    <Copy className="h-5 w-5 text-text" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setContactPanel("menu")}
                  className="mx-auto mt-6 flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-heading transition hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
