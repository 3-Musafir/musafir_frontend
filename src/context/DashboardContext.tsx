"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import useCompanyProfile from "@/hooks/useCompanyProfile";
import useUserHandler from "@/hooks/useUserHandler";
import { PaymentService } from "@/services/paymentService";
import { CompanyProfile } from "@/services/types/companyProfile";

export type TabType = "home" | "passport" | "wallet" | "referrals";

interface DashboardContextType {
  // Tab state
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Home data
  flagships: any[];
  companyProfile: CompanyProfile | null;
  profileLoading: boolean;
  flagshipsLoading: boolean;

  // Passport data
  upcomingEvents: any[];
  pastEvents: any[];
  passportLoading: boolean;
  passportSubTab: "upcoming" | "past";
  setPassportSubTab: (tab: "upcoming" | "past") => void;

  // Wallet data
  walletSummary: { balance: number; currency: string; topupPackages?: number[]; whatsappTopupNumber?: string } | null;
  walletTransactions: any[];
  walletLoading: boolean;
  walletNextCursor: string | null;
  walletPayments: any[];
  walletPaymentsLoading: boolean;
  walletPaymentsCursor: string | null;
  loadMoreTransactions: () => Promise<void>;
  refreshWalletPayments: () => Promise<void>;
  loadMoreWalletPayments: () => Promise<void>;
  requestTopup: (amount: number) => Promise<void>;
  creatingTopup: number | null;

  // Referrals data
  referralCode: string;
  verifiedByMe: number;
  referralsLoading: boolean;

  // User verification status (shared)
  userVerificationStatus: string | undefined;

  // Refresh functions
  refreshHome: () => Promise<void>;
  refreshPassport: () => Promise<void>;
  refreshReferrals: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [passportSubTab, setPassportSubTab] = useState<"upcoming" | "past">("upcoming");

  // Hooks
  const flagshipHook = useFlagshipHook();
  const registrationHook = useRegistrationHook();
  const { getProfile } = useCompanyProfile();
  const userHandler = useUserHandler();

  // Home state
  const [flagships, setFlagships] = useState<any[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [flagshipsLoading, setFlagshipsLoading] = useState(true);

  // Passport state
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [passportLoading, setPassportLoading] = useState(true);

  // Wallet state
  const [walletSummary, setWalletSummary] = useState<DashboardContextType["walletSummary"]>(null);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletNextCursor, setWalletNextCursor] = useState<string | null>(null);
  const [walletPayments, setWalletPayments] = useState<any[]>([]);
  const [walletPaymentsLoading, setWalletPaymentsLoading] = useState(true);
  const [walletPaymentsCursor, setWalletPaymentsCursor] = useState<string | null>(null);
  const [creatingTopup, setCreatingTopup] = useState<number | null>(null);

  // Referrals state
  const [referralCode, setReferralCode] = useState("");
  const [verifiedByMe, setVerifiedByMe] = useState(0);
  const [referralsLoading, setReferralsLoading] = useState(true);

  // Shared state
  const [userVerificationStatus, setUserVerificationStatus] = useState<string | undefined>(undefined);

  // Track which tabs have been loaded
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(new Set());

  // Fetch functions
  const refreshHome = useCallback(async () => {
    setFlagshipsLoading(true);
    setProfileLoading(true);
    try {
      const [flagshipsData, profileData] = await Promise.all([
        flagshipHook.getAllFlagships(),
        getProfile(),
      ]);
      if (flagshipsData) setFlagships(flagshipsData);
      if (profileData) setCompanyProfile(profileData);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setFlagshipsLoading(false);
      setProfileLoading(false);
    }
  }, []);

  const refreshPassport = useCallback(async () => {
    setPassportLoading(true);
    try {
      const [upcoming, past, status] = await Promise.all([
        registrationHook.getUpcomingPassport(),
        registrationHook.getPastPassport(),
        userHandler.getVerificationStatus(),
      ]);
      if (upcoming) setUpcomingEvents(upcoming);
      if (past) setPastEvents(past);
      setUserVerificationStatus(status);
    } catch (error) {
      console.error("Error fetching passport data:", error);
    } finally {
      setPassportLoading(false);
    }
  }, []);

  const refreshWalletPayments = useCallback(async () => {
    setWalletPaymentsLoading(true);
    try {
      const res = await PaymentService.getUserPayments({ limit: 20 });
      setWalletPayments(res?.payments || []);
      setWalletPaymentsCursor(res?.nextCursor || null);
    } catch (error) {
      console.error("Error fetching wallet payments:", error);
    } finally {
      setWalletPaymentsLoading(false);
    }
  }, []);

  const fetchWalletData = useCallback(async () => {
    setWalletLoading(true);
    try {
      const [summaryRes, txRes] = await Promise.all([
        PaymentService.getWalletSummary(),
        PaymentService.getWalletTransactions({ limit: 20 }),
      ]);
      setWalletSummary(summaryRes);
      setWalletTransactions(txRes?.transactions || []);
      setWalletNextCursor(txRes?.nextCursor || null);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const refreshReferrals = useCallback(async () => {
    setReferralsLoading(true);
    try {
      const me = await userHandler.getMe();
      setReferralCode(me?.referralID || "");
      setVerifiedByMe(me?.verificationStats?.verifiedByMe || 0);
    } catch (error) {
      console.error("Error fetching referrals data:", error);
    } finally {
      setReferralsLoading(false);
    }
  }, []);

  const loadMoreTransactions = useCallback(async () => {
    if (!walletNextCursor) return;
    const res = await PaymentService.getWalletTransactions({
      limit: 20,
      cursor: walletNextCursor,
    });
    setWalletTransactions((prev) => [...prev, ...(res?.transactions || [])]);
    setWalletNextCursor(res?.nextCursor || null);
  }, [walletNextCursor]);

  const loadMoreWalletPayments = useCallback(async () => {
    if (!walletPaymentsCursor) return;
    try {
      const res = await PaymentService.getUserPayments({
        limit: 20,
        cursor: walletPaymentsCursor,
      });
      setWalletPayments((prev) => [...prev, ...(res?.payments || [])]);
      setWalletPaymentsCursor(res?.nextCursor || null);
    } catch (error) {
      console.error("Error loading more wallet payments:", error);
    }
  }, [walletPaymentsCursor]);

  const requestTopup = useCallback(async (amount: number) => {
    setCreatingTopup(amount);
    try {
      const res = await PaymentService.createWalletTopupRequest(amount);
      const url = res?.whatsapp?.url;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      await Promise.all([fetchWalletData(), refreshWalletPayments()]);
    } finally {
      setCreatingTopup(null);
    }
  }, [fetchWalletData, refreshWalletPayments]);

  // Load data on initial mount and when tab changes
  useEffect(() => {
    // Always load home data on initial mount
    if (!loadedTabs.has("home")) {
      refreshHome();
      refreshPassport(); // Also load passport for upcoming registrations on home
      setLoadedTabs((prev) => new Set([...prev, "home", "passport"]));
    }
  }, []);

  // Load tab data when switching to it (lazy loading)
  useEffect(() => {
    if (activeTab === "wallet" && !loadedTabs.has("wallet")) {
      Promise.all([fetchWalletData(), refreshWalletPayments()]);
      setLoadedTabs((prev) => new Set([...prev, "wallet"]));
    } else if (activeTab === "referrals" && !loadedTabs.has("referrals")) {
      refreshReferrals();
      setLoadedTabs((prev) => new Set([...prev, "referrals"]));
    }
  }, [activeTab, loadedTabs, fetchWalletData, refreshWalletPayments, refreshReferrals]);

  // Refresh verification status when passport tab is active
  useEffect(() => {
    if (activeTab === "passport" && passportSubTab === "upcoming") {
      userHandler.getVerificationStatus().then(setUserVerificationStatus).catch(console.error);
    }
  }, [activeTab, passportSubTab]);

  const value: DashboardContextType = {
    activeTab,
    setActiveTab,
    flagships,
    companyProfile,
    profileLoading,
    flagshipsLoading,
    upcomingEvents,
    pastEvents,
    passportLoading,
    passportSubTab,
    setPassportSubTab,
    walletSummary,
    walletTransactions,
    walletLoading,
    walletNextCursor,
    walletPayments,
    walletPaymentsLoading,
    walletPaymentsCursor,
    loadMoreTransactions,
    refreshWalletPayments,
    loadMoreWalletPayments,
    requestTopup,
    creatingTopup,
    referralCode,
    verifiedByMe,
    referralsLoading,
    userVerificationStatus,
    refreshHome,
    refreshPassport,
    refreshReferrals,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
