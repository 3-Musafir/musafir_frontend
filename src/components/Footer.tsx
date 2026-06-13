"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import {
  INDEXABLE_PATHS,
  socialProfiles,
} from "@/lib/seo/seoConfig";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  id: string;
  title: string;
  links: FooterLink[];
};

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/fixed-departure": "Fixed departures",
  "/explore": "Explore",
  "/reviews": "Reviews",
  "/why": "Why 3Musafir",
  "/about-3musafir": "About 3Musafir",
  "/founderportfolio": "Founder portfolio",
  "/hc": "Help center",
  "/pakistan-dmc": "Pakistan DMC",
  "/login": "Login",
};

const makeRouteLink = (href: string): FooterLink => ({
  href,
  label:
    routeLabels[href] ||
    href
      .replace(/^\//, "")
      .replace(/[-/]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
});

const footerSections: FooterSection[] = [
  {
    id: "travel",
    title: "Travel",
    links: ["/", "/fixed-departure", "/explore", "/reviews", "/why"]
      .filter((href) => INDEXABLE_PATHS.includes(href as (typeof INDEXABLE_PATHS)[number]))
      .map(makeRouteLink),
  },
  {
    id: "company",
    title: "Company",
    links: ["/about-3musafir", "/founderportfolio", "/hc"]
      .filter((href) => INDEXABLE_PATHS.includes(href as (typeof INDEXABLE_PATHS)[number]))
      .map(makeRouteLink),
  },
  {
    id: "services",
    title: "Services",
    links: ["/pakistan-dmc", "/login"]
      .filter((href) => INDEXABLE_PATHS.includes(href as (typeof INDEXABLE_PATHS)[number]))
      .map(makeRouteLink),
  },
  {
    id: "policies",
    title: "Policies",
    links: [
      { label: "Refund policy", href: "/refundpolicyby3musafir" },
      { label: "Terms", href: "/terms&conditonsby3musafir" },
      { label: "International terms", href: "/intlterms" },
    ],
  },
];

const assignedIndexablePaths = new Set(
  footerSections.flatMap((section) => section.links.map((link) => link.href)),
);

const additionalIndexableLinks = INDEXABLE_PATHS
  .filter((href) => !assignedIndexablePaths.has(href))
  .map(makeRouteLink);

if (additionalIndexableLinks.length > 0) {
  footerSections.push({
    id: "more",
    title: "More",
    links: additionalIndexableLinks,
  });
}

const contactLinks = [
  {
    label: "Email",
    href: "mailto:hello@3musafir.com",
    value: "hello@3musafir.com",
    icon: Mail,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923221848940",
    value: "+92 322 1848940",
    icon: MessageCircle,
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim();
    const isValid = normalized.includes("@") && normalized.includes(".");
    setStatus(isValid ? "success" : "error");
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <footer
      className="border-t border-canvas-line bg-canvas-soft px-4 py-12 text-heading sm:px-6 lg:px-8 xl:px-10"
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr]">
          <div className="space-y-6">
            <Link href="/" className="relative block h-14 w-56" aria-label="3Musafir home">
              <Image
                src="/primarylogo.svg"
                alt="3Musafir"
                fill
                sizes="224px"
                className="object-contain object-left"
              />
            </Link>
            <p className="max-w-md text-sm leading-7 text-text">
              Safe community-led group travel for people who want comfort, belonging, and clear
              support, from Pakistan routes to selected global journeys and inbound DMC services.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {contactLinks.map(({ label, href, value, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-3 rounded-md border border-canvas-line bg-white p-3 text-sm shadow-sm transition hover:border-brand-primary/50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-text">
                      {label}
                    </span>
                    <span className="mt-0.5 block font-semibold text-heading transition group-hover:text-brand-primary">
                      {value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-6 rounded-md border border-canvas-line bg-white p-5 shadow-sm md:flex-row md:items-start md:justify-between">
              <div className="max-w-md">
                <h3 className="text-base font-semibold text-heading">Get trip drops in your inbox</h3>
                <p className="mt-1 text-sm text-text">
                  Monthly updates. Zero spam. Just upcoming experiences.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-2"
                aria-label="Subscribe for updates"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="footer-email">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-md border border-canvas-line bg-canvas-base px-4 py-2 text-sm text-heading placeholder:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-brand-primary px-5 py-2 text-sm font-bold text-heading transition hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    Subscribe
                  </button>
                </div>
                <div aria-live="polite">
                  {status === "success" && (
                    <p className="text-xs text-brand-primary">Subscribed. Welcome aboard.</p>
                  )}
                  {status === "error" && (
                    <p className="text-xs text-text">Please enter a valid email.</p>
                  )}
                </div>
              </form>
            </div>

            <div className="hidden grid-cols-4 gap-8 md:grid">
              {footerSections.map((group) => (
                <div key={group.id}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-heading">
                    {group.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-start gap-2 text-sm font-medium text-text transition hover:text-brand-primary"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:hidden">
              {footerSections.map((section) => {
                const isOpen = Boolean(openSections[section.id]);
                const panelId = `footer-${section.id}`;
                return (
                  <div key={section.id} className="rounded-lg border border-canvas-line bg-white text-center shadow-sm">
                    <button
                      type="button"
                      className="flex min-h-[108px] w-full flex-col items-center justify-center gap-2 px-3 py-5 text-sm font-bold text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleSection(section.id)}
                    >
                      {section.title}
                      <span className="text-lg leading-none text-brand-primary">{isOpen ? "-" : "+"}</span>
                    </button>
                    <div id={panelId} className={`px-3 pb-4 ${isOpen ? "" : "hidden"}`}>
                      <ul className="space-y-2 border-t border-canvas-line pt-3">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="text-xs font-medium leading-5 text-text transition hover:text-brand-primary"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-heading">
                Social profiles
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {socialProfiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-canvas-line bg-white px-3 py-2 text-xs font-bold text-heading transition hover:border-brand-primary/60 hover:text-brand-primary"
                  >
                    {profile.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-canvas-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-medium text-text">
            &copy; {currentYear} 3Musafir (Pvt) Ltd. All rights reserved.
          </p>
          <p className="text-xs font-medium text-text">
            Verified community travel, selected global journeys, and Pakistan DMC operations.
          </p>
        </div>
      </div>
    </footer>
  );
}
