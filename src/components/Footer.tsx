'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  id: string;
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    id: 'explore',
    title: 'Explore',
    links: [
      { label: 'Trips', href: '/home' },
      { label: 'Destinations', href: '/destinations' },
      { label: 'Stories', href: '/stories' },
      { label: 'Reviews', href: '/reviews' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Safety & Verification', href: '/trust-and-verification' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Cancellation Policy', href: '/refundpolicyby3musafir' },
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Community Framework', href: '/musafircommunityequityframework' },
    ],
  },
];

const trustChips = ['Verified Musafirs', 'Vetted Vendors', 'On-trip Support'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim();
    const isValid = normalized.includes('@') && normalized.includes('.');
    setStatus(isValid ? 'success' : 'error');
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <footer className="relative bg-background text-foreground border-t border-border" aria-labelledby="footer-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 xl:px-10 py-12 lg:py-16">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-lg space-y-3">
            <h3 className="text-lg font-semibold text-heading">Get trip drops in your inbox</h3>
            <p className="text-sm text-muted-foreground">
              Monthly updates. Zero spam. Just upcoming experiences.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-3"
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
                className="w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              />
              <button
                type="submit"
                className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Subscribe
              </button>
            </div>
            <div aria-live="polite">
              {status === 'success' && (
                <p className="text-xs text-brand-primary">Subscribed — welcome aboard ✨</p>
              )}
              {status === 'error' && (
                <p className="text-xs text-muted-foreground">Please enter a valid email.</p>
              )}
            </div>
          </form>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-heading">3Musafir</p>
              <p className="text-sm text-muted-foreground">
                Community-first travel, designed for safety.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {trustChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-heading">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {footerSections[0].links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-heading">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {footerSections[1].links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-heading">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {footerSections[2].links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 space-y-4 md:hidden">
          {footerSections.map((section) => {
            const isOpen = Boolean(openSections[section.id]);
            const panelId = `footer-${section.id}`;
            return (
              <div key={section.id} className="rounded-2xl border border-border bg-card">
                <button
                  type="button"
                  className="w-full px-4 py-4 text-left text-sm font-semibold text-heading flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleSection(section.id)}
                >
                  {section.title}
                  <span className="text-brand-primary text-base transition">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div id={panelId} className={`px-4 pb-4 ${isOpen ? '' : 'hidden'}`}>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
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

        <div className="mt-12 border-t border-border pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} 3Musafir. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com"
              className="text-muted-foreground hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              <span className="sr-only">Instagram</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zm5.6-.7a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com"
              className="text-muted-foreground hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              <span className="sr-only">TikTok</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M16.5 3a6.5 6.5 0 0 0 4.5 2v3a9.4 9.4 0 0 1-4.5-1.3v7.3a6.5 6.5 0 1 1-6.5-6.5c.5 0 1 .1 1.5.2v3.2a2.8 2.8 0 1 0 2.2 2.7V3h2.8z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com"
              className="text-muted-foreground hover:text-brand-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              <span className="sr-only">LinkedIn</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M6.94 8.5H4.1V19.5h2.84V8.5zm-1.42-4a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28zM20 13.1c0-2.6-1.4-4.3-3.7-4.3a3.2 3.2 0 0 0-2.9 1.6V8.5H10.6V19.5h2.84v-5.6c0-1.5.6-2.5 2-2.5s1.6 1 1.6 2.5v5.6H20v-6.4z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
