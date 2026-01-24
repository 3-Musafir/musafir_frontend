"use client";

import React, { useMemo, useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";
import { showAlert } from "@/pages/alert";

export default function ReferralsTabContent() {
  const { referralCode, verifiedByMe, referralsLoading } = useDashboard();
  const [copied, setCopied] = useState(false);

  const referralLink = useMemo(() => {
    const base =
      (process.env.NEXT_PUBLIC_AUTH_URL &&
        process.env.NEXT_PUBLIC_AUTH_URL.trim().length > 0 &&
        process.env.NEXT_PUBLIC_AUTH_URL) ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const code = referralCode || "";
    return code ? `${base}/signup/create-account?ref=${code}` : "";
  }, [referralCode]);

  const copyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
      showAlert("Unable to copy link", "error");
    }
  };

  const shareLink = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Musafir",
          text: "Join Musafir with my referral link and start your journey.",
          url: referralLink,
        });
      } catch (err) {
        console.error("Share cancelled/failed", err);
      }
    } else {
      await copyLink();
      showAlert("Link copied to clipboard", "success");
    }
  };

  if (referralsLoading) {
    return (
      <main className="px-4 md:px-6 lg:px-8 xl:px-10 pb-20 lg:pb-6 pt-4">
        <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
          <p className="text-center text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 md:px-6 lg:px-8 xl:px-10 pb-20 lg:pb-6 pt-4 space-y-6">
      <h1 className="text-2xl font-semibold">Referrals</h1>

      <div className="p-4 border rounded-xl bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Your Referral Code</h2>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-wide">{referralCode || "—"}</span>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
        <h3 className="text-md font-semibold flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          Share Link
        </h3>
        <div className="border rounded-lg p-3 text-sm break-all bg-white">
          {referralLink || "Link unavailable"}
        </div>
        <div className="flex gap-3">
          <button
            onClick={copyLink}
            disabled={!referralLink}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-60"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={shareLink}
            disabled={!referralLink}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-60"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-gray-50">
        <h3 className="text-md font-semibold mb-1">Your impact</h3>
        <p className="text-sm text-gray-600">Musafirs verified with your code</p>
        <div className="text-3xl font-bold mt-2">{verifiedByMe}</div>
      </div>
    </main>
  );
}
