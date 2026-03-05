"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DashboardProvider, useDashboard, TabType } from "@/context/DashboardContext";
import Header from "@/components/header";
import HomeTabContent from "./HomeTabContent";
import PassportTabContent from "./PassportTabContent";
import WalletTabContent from "./WalletTabContent";
import ReferralsTabContent from "./ReferralsTabContent";
import { Home, Flag, Wallet, Users, X, Phone } from "lucide-react";
import { showAlert } from "@/pages/alert";

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "passport", label: "Passport", icon: Flag },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "referrals", label: "Referral", icon: Users },
];

const validTabs: TabType[] = ["home", "passport", "wallet", "referrals"];

function DashboardContent() {
  const router = useRouter();
  const { activeTab, setActiveTab, userPhone, passportLoading } = useDashboard();
  const [phoneBannerDismissed, setPhoneBannerDismissed] = useState(false);
  const showPhoneBanner = !passportLoading && userPhone === null && !phoneBannerDismissed;

  // Handle URL query parameter for initial tab
  useEffect(() => {
    if (!router.isReady) return;
    const tabParam = router.query.tab;
    if (typeof tabParam === "string" && validTabs.includes(tabParam as TabType)) {
      setActiveTab(tabParam as TabType);
      // Clean up the URL by removing the tab param
      router.replace("/home", undefined, { shallow: true });
    }
  }, [router.isReady, router.query.tab, setActiveTab, router]);

  // Show deferred merge notification (set during Google SSO signup)
  useEffect(() => {
    const merged = localStorage.getItem('accountMerged');
    if (merged) {
      localStorage.removeItem('accountMerged');
      showAlert('We found your existing account! Your trip history has been preserved.', 'success');
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <Header
        setSidebarOpen={() => {}}
        showMenuButton={false}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />

      {/* Phone number missing banner */}
      {showPhoneBanner && (
        <div className="mx-4 md:mx-6 lg:mx-8 xl:mx-10 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <Phone className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-800">
              Add your phone number to unlock your trip history and discounts.
            </p>
          </div>
          <button
            onClick={() => router.push("/userSettings?forceEdit=true&returnTo=/home")}
            className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover whitespace-nowrap"
          >
            Add Now
          </button>
          <button
            onClick={() => setPhoneBannerDismissed(true)}
            className="text-amber-400 hover:text-amber-600 shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tab Content - renders based on activeTab */}
      <div className="flex-1 flex flex-col">
        {activeTab === "home" && <HomeTabContent />}
        {activeTab === "passport" && <PassportTabContent />}
        {activeTab === "wallet" && <WalletTabContent />}
        {activeTab === "referrals" && <ReferralsTabContent />}
      </div>

      {/* Bottom Navigation - Mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden">
        <div className="w-full md:max-w-3xl mx-auto px-3 pb-[env(safe-area-inset-bottom)]">
          <div className="border-t border-border bg-white">
            <ul className="flex justify-around px-1 pt-2 pb-1">
              {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setActiveTab(id)}
                      className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs rounded-xl transition ${
                        isActive ? "text-brand-primary" : "text-gray-600 hover:text-brand-primary"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
