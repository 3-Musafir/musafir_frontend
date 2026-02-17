"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardProvider, useDashboard, TabType } from "@/context/DashboardContext";
import Header from "@/components/header";
import HomeTabContent from "./HomeTabContent";
import PassportTabContent from "./PassportTabContent";
import WalletTabContent from "./WalletTabContent";
import ReferralsTabContent from "./ReferralsTabContent";
import { Home, Flag, Wallet, Users } from "lucide-react";
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
  const { activeTab, setActiveTab } = useDashboard();

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
