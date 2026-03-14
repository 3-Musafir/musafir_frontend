"use client";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { PaymentService } from "@/services/paymentService";
import { Camera, ChevronDown, ChevronUp, Copy, CreditCard, Landmark, Wallet } from "lucide-react";
import Image from "next/image";
import { resolveImageSrc } from "@/lib/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackClarityEvent } from "@/lib/analytics/clarity";
import { CLARITY_EVENTS } from "@/lib/analytics/events";
import { IPaymentHistoryItem } from "@/services/types/payment";

const bankDetails = {
  "faysal-bank": {
    id: "67fe5f79662980c34fa1bc2b",
    title: "Faysal Bank (Ahmed Bin Abrar)",
    accountNumber: "PK32FAYS3077436000006884",
    iban: "—",
  },
  "alfalah-ali-hassan": {
    id: "67fe5f79662980c34fa1bc2c",
    title: "Alfalah Bank (Ali Hassan)",
    accountNumber: "PK34ALFH5617005002276965",
    iban: "—",
  },
  "alfalah-hameez-rizwan": {
    id: "68f2c0e3a1b2c3d4e5f60718",
    title: "Alfalah Bank (Muhammad Hameez Rizwan)",
    accountNumber: "55015000960473",
    iban: "—",
  },
} as const;

type BankKey = keyof typeof bankDetails;

const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatTripDate = (start?: string, end?: string) => {
  if (!start || !end) return "—";
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return "—";
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const month = endDate.toLocaleString("default", { month: "long" });
  const year = endDate.getFullYear();
  return `${startDay}-${endDay}${getDaySuffix(endDay)} ${month} ${year}`;
};

const formatCurrency = (value: unknown) => {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString()
    : "—";
};

const skeletonBlinkStyle = `
@keyframes skeleton-blink {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}
.skeleton-blink {
  animation: skeleton-blink 1.2s ease-in-out infinite;
}
`;

function TripPaymentSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{skeletonBlinkStyle}</style>
      <div className="w-full">
        <div className="flex flex-col min-h-screen bg-card lg:my-6 lg:rounded-xl lg:min-h-0 lg:border lg:border-border">
          <div className="px-4 py-2 lg:py-4 text-center">
            <Skeleton className="h-8 w-48 mx-auto animate-none skeleton-blink" />
          </div>
          <div className="h-48 lg:h-64 mx-4 mb-4 overflow-hidden">
            <Skeleton className="h-full w-full rounded-lg animate-none skeleton-blink" />
          </div>
          <div className="px-4 lg:px-6 mb-6 space-y-2">
            <Skeleton className="h-7 w-3/5 animate-none skeleton-blink" />
            <Skeleton className="h-5 w-2/5 animate-none skeleton-blink" />
          </div>
          <div className="mx-4 lg:mx-6 p-4 lg:p-6 mb-6 border border-border rounded-lg space-y-3">
            <Skeleton className="h-5 w-1/3 animate-none skeleton-blink" />
            <Skeleton className="h-5 w-1/2 animate-none skeleton-blink" />
            <Skeleton className="h-10 w-full animate-none skeleton-blink" />
          </div>
          <div className="mx-4 lg:mx-6 p-4 lg:p-6 mb-6 border border-border rounded-lg space-y-3">
            <Skeleton className="h-5 w-1/3 animate-none skeleton-blink" />
            <Skeleton className="h-10 w-full animate-none skeleton-blink" />
            <Skeleton className="h-10 w-full animate-none skeleton-blink" />
          </div>
          <div className="mx-4 lg:mx-6 p-4 lg:p-6 mb-6 border border-border rounded-lg space-y-3">
            <Skeleton className="h-5 w-1/4 animate-none skeleton-blink" />
            <Skeleton className="h-10 w-full animate-none skeleton-blink" />
          </div>
          <div className="px-4 lg:px-6 mt-auto mb-6">
            <Skeleton className="h-12 w-full animate-none skeleton-blink" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripPayment() {
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] =
    useState<BankKey>("faysal-bank");
  const [selectedMethod, setSelectedMethod] = useState<"bank" | "wallet" | "card">("bank");
  const router = useRouter();
  const params = useParams();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const path =
    typeof window === "undefined"
      ? "/musafir/payment"
      : (router.asPath.split("?")[0] || "/musafir/payment").split("#")[0];
  const canonicalUrl = `${siteUrl}${path}`;
  const title = "Trip payment — 3Musafir";
  const description =
    "Complete your trip payment securely with 3Musafir and confirm your seat.";
  const registrationId = params?.slug as string;
  const [expandedBank, setExpandedBank] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibleDiscounts, setEligibleDiscounts] = useState<any>(null);
  const [selectedDiscountType, setSelectedDiscountType] = useState<
    "soloFemale" | "group" | "musafir" | null
  >(null);
  const [selectedDiscountAmount, setSelectedDiscountAmount] = useState<number>(0);
  const [authRequired, setAuthRequired] = useState(false);
  const [walletSummary, setWalletSummary] = useState<any>(null);
  const [walletToUse, setWalletToUse] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const quoteEventFired = useRef(false);
  const registrationHook = useRegistrationHook();
  const [registration, setRegistration] = useState<any>(null);
  const [paymentQuote, setPaymentQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const initialQuoteLoadedRef = useRef(false);
  const [paymentHistory, setPaymentHistory] = useState<IPaymentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const tripPrice = registration?.price || 0;
  const paymentStatus =
    registration?.paymentId && typeof registration.paymentId === "object"
      ? registration.paymentId.status
      : undefined;
  const walletBalance =
    typeof walletSummary?.balance === "number" ? walletSummary.balance : 0;
  const amountDue =
    typeof paymentQuote?.amountDue === "number"
      ? paymentQuote.amountDue
      : typeof registration?.amountDue === "number"
        ? registration.amountDue
        : tripPrice;
  const discountApplied =
    typeof paymentQuote?.discountApplied === "number"
      ? paymentQuote.discountApplied
      : typeof registration?.discountApplied === "number"
        ? registration.discountApplied
        : 0;
  const persistedDiscountApplied =
    typeof registration?.discountApplied === "number" ? registration.discountApplied : 0;
  const persistedDiscountType = registration?.discountType;
  const noPaymentDue = amountDue <= 0;
  const maxWalletUsable =
    typeof paymentQuote?.maxWalletUsable === "number" ? paymentQuote.maxWalletUsable : 0;
  const walletApplied =
    typeof paymentQuote?.walletApplied === "number" ? paymentQuote.walletApplied : 0;
  const cashToPayNow =
    typeof paymentQuote?.cashDue === "number" ? paymentQuote.cashDue : 0;
  const requiresScreenshot = Boolean(paymentQuote?.requiresScreenshot);
  const quoteErrors = Array.isArray(paymentQuote?.errors) ? paymentQuote.errors : [];
  const walletError =
    quoteErrors.find(
      (err: any) =>
        err?.code === "wallet_amount_exceeds_due" ||
        err?.code === "wallet_insufficient_balance"
    ) || null;
  const walletErrorCodes = new Set([
    "wallet_amount_exceeds_due",
    "wallet_insufficient_balance",
  ]);
  const errorPriority = [
    "registration_not_payable",
    "registration_cancelled",
    "registration_refund_locked",
    "no_payment_due",
    "discount_already_selected",
    "discount_not_eligible",
    "discount_exhausted",
    "wallet_not_allowed",
    "payment_amount_required",
    "payment_amount_must_match_due",
  ];
  const nonWalletErrors = quoteErrors.filter(
    (err: any) => err?.code && !walletErrorCodes.has(err.code)
  );
  const prioritizedError =
    errorPriority
      .map((code) => nonWalletErrors.find((err: any) => err?.code === code))
      .find(Boolean) || nonWalletErrors[0] || null;
  const submitDisabled =
    isSubmitting ||
    quoteLoading ||
    noPaymentDue ||
    (requiresScreenshot && !file) ||
    selectedMethod === "card" ||
    quoteErrors.length > 0;

  const discountOptions = [
    { key: "soloFemale", label: "Solo Female Discount", data: eligibleDiscounts?.soloFemale },
    { key: "group", label: "Group Discount", data: eligibleDiscounts?.group },
    { key: "musafir", label: "Musafir Discount", data: eligibleDiscounts?.musafir },
  ] as const;
  const hasEligibleDiscounts = discountOptions.some((option) => option.data?.eligible);
  const discountSelectionLocked =
    persistedDiscountApplied > 0 || Boolean(persistedDiscountType);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const fetchRegistration = async () => {
    if (!registrationId) return;
    setRegistrationLoading(true);
    setRegistrationError(null);
    try {
      const registration = await registrationHook.getRegistrationById(registrationId);
      if (registration) {
        setRegistration(registration);
      } else {
        setRegistrationError("Registration not found.");
      }
    } catch (e) {
      setRegistrationError("Failed to load registration.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistration();
  }, [registrationId]);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const summary = await PaymentService.getWalletSummary();
        setWalletSummary(summary);
      } catch (e) {
        // wallet is optional; ignore errors
      }
    };
    loadWallet();
  }, []);

  useEffect(() => {
    if (!registrationId || typeof window === "undefined") return;
    try {
      const rt = localStorage.getItem("verificationReturnTo");
      if (rt === `/musafir/payment/${registrationId}`) {
        localStorage.removeItem("verificationReturnTo");
      }
    } catch (e) {
      // ignore
    }
  }, [registrationId]);

  useEffect(() => {
    const loadEligibleDiscounts = async () => {
      if (!registrationId) return;
      try {
        const res = await PaymentService.getEligibleDiscounts(registrationId);
        const data = (res as any)?.data ?? res;
        if (data) {
          setEligibleDiscounts(data);
          setAuthRequired(false);
        }
        if (registration?.discountType && registration?.discountApplied > 0) {
          setSelectedDiscountType(registration.discountType);
          setSelectedDiscountAmount(registration.discountApplied);
        }
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 401 && typeof window !== "undefined") {
          const returnTo = `/musafir/payment/${registrationId}`;
          localStorage.setItem("returnTo", returnTo);
          router.push(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
          setAuthRequired(true);
          return;
        }
        console.error("Failed to load eligible discounts:", error);
      }
    };
    loadEligibleDiscounts();
  }, [registrationId, registration?.discountType, registration?.discountApplied]);

  const loadQuote = useCallback(async () => {
    if (!registrationId) return;
    setQuoteLoading(true);
    setQuoteError(null);
    try {
      const resolvedPaymentMode =
        paymentType === "partial"
          ? "partial"
          : selectedMethod === "wallet"
            ? "wallet_only"
            : selectedMethod === "bank"
              ? (walletToUse > 0 ? "wallet_plus_bank" : "bank_transfer")
              : "bank_transfer";
      const payload = {
        registration: registrationId,
        walletAmount: walletToUse,
        discountType: selectedDiscountType || undefined,
        paymentMode: resolvedPaymentMode,
      } as any;
      const res = await PaymentService.getPaymentQuote(payload);
      const data = (res as any)?.data ?? res;
      setPaymentQuote(data);
      initialQuoteLoadedRef.current = true;
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        router.push("/home");
        return;
      }
      setPaymentQuote(null);
      setQuoteError("Unable to load payment details.");
    } finally {
      setQuoteLoading(false);
    }
  }, [registrationId, walletToUse, paymentType, selectedDiscountType, selectedMethod, router]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  useEffect(() => {
    if (paymentQuote && !quoteEventFired.current) {
      trackClarityEvent(CLARITY_EVENTS.PAYMENT_QUOTE_LOADED);
      quoteEventFired.current = true;
    }
  }, [paymentQuote]);

  useEffect(() => {
    if (!registrationId) return;
    setHistoryLoading(true);
    PaymentService.getPaymentHistoryByRegistration(registrationId)
      .then((res: any) => {
        const data = res?.items ?? res?.data?.items ?? [];
        setPaymentHistory(Array.isArray(data) ? data : []);
      })
      .catch((error: any) => {
        console.error("Failed to load payment history:", error);
        setPaymentHistory([]);
      })
      .finally(() => setHistoryLoading(false));
  }, [registrationId]);

  const handleSelectDiscount = (type: "soloFemale" | "group" | "musafir") => {
    if (!eligibleDiscounts) return;
    const selected = (eligibleDiscounts as any)?.[type];
    if (!selected?.eligible) return;
    setSelectedDiscountType(type);
    setSelectedDiscountAmount(Number(selected.amount) || 0);
  };

  useEffect(() => {
    if (discountSelectionLocked) return;
    if (!eligibleDiscounts) return;
    if (selectedDiscountType) return;
    const eligible = discountOptions
      .map((option) => ({
        key: option.key,
        amount: Number(option.data?.amount ?? 0),
        eligible: Boolean(option.data?.eligible),
      }))
      .filter((option) => option.eligible);
    if (eligible.length === 0) return;
    const lowest = eligible.reduce((min, current) =>
      current.amount < min.amount ? current : min,
    );
    setSelectedDiscountType(lowest.key);
    setSelectedDiscountAmount(Number.isFinite(lowest.amount) ? lowest.amount : 0);
  }, [
    discountOptions,
    discountSelectionLocked,
    eligibleDiscounts,
    selectedDiscountType,
  ]);

  const handleSubmit = async () => {
    if (selectedMethod === "card") {
      toast({
        title: "Card payments coming soon",
        description: "Please choose bank transfer or wallet to continue.",
      });
      return;
    }

    if (noPaymentDue) {
      toast({
        title: "No payment due",
        description: "There is no remaining payment due for this trip.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentQuote) {
      toast({
        title: "Loading payment details",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    if (quoteErrors.length > 0) {
      toast({
        title: "Please review your payment",
        description:
          prioritizedError?.message || "Fix the highlighted issues to continue.",
        variant: "destructive",
      });
      return;
    }

    if (requiresScreenshot && !file) {
      toast({
        title: "Please upload a payment screenshot",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const walletUseId =
        walletApplied > 0
          ? (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? (crypto as any).randomUUID()
            : `${Date.now()}-${Math.random()}`)
          : undefined;
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? (crypto as any).randomUUID()
          : `${Date.now()}-${Math.random()}`;
      const selectedBankAccountId =
        cashToPayNow > 0 ? bankDetails[selectedBank]?.id : undefined;
      const selectedBankLabel =
        cashToPayNow > 0 ? bankDetails[selectedBank]?.title : undefined;
      const discountToUse =
        discountApplied > 0 ? discountApplied : selectedDiscountAmount;
      const discountTypeToUse =
        discountApplied > 0
          ? (registration?.discountType ?? selectedDiscountType)
          : selectedDiscountType;

      if (cashToPayNow > 0 && !selectedBankAccountId && !selectedBankLabel) {
        toast({
          title: "Select a bank account",
          description: "Please choose a bank account before submitting.",
          variant: "destructive",
        });
        return;
      }

      const res: any = await PaymentService.createPayment({
        registration: registrationId,
        idempotencyKey,
        bankAccount: selectedBankAccountId,
        bankAccountLabel: selectedBankLabel,
        paymentType: paymentType === "full" ? "fullPayment" : "partialPayment",
        amount: cashToPayNow,
        discount: discountToUse,
        discountType: discountTypeToUse ?? undefined,
        walletAmount: walletApplied,
        walletUseId,
        screenshot: cashToPayNow > 0 ? file ?? undefined : undefined,
      });

      const successMessage =
        res?.message ||
        (res?.data?.pendingApproval
          ? "Payment submitted for approval."
          : "Payment submitted successfully!");

      toast({
        title: "Success",
        description: successMessage,
      });

      trackClarityEvent(CLARITY_EVENTS.PAYMENT_SUBMIT_SUCCESS);

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
      trackClarityEvent(CLARITY_EVENTS.PAYMENT_SUBMIT_FAILED);
      console.error("Payment submission error:", error);

      const code =
        (error as any)?.response?.data?.code ||
        (error as any)?.code;

      if (
        code === "verification_required" ||
        code === "verification_pending" ||
        code === "verification_rejected"
      ) {
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "verificationReturnTo",
              `/musafir/payment/${registrationId}`,
            );
            const flagshipId = registration?.flagship?._id;
            if (flagshipId) {
              localStorage.setItem("flagshipId", JSON.stringify(flagshipId));
            }
          }
        } catch (e) {
          console.error("Failed to persist verification redirect context", e);
        }

        router.push("/verification");
        return;
      }

      toast({
        title: "Error",
        description:
          (error as any)?.message ||
          "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageLoading =
    !registrationId ||
    registrationLoading ||
    (!registration && !registrationError) ||
    (quoteLoading && !paymentQuote);

  if (pageLoading) {
    return <TripPaymentSkeleton />;
  }

  if (registrationError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="max-w-md w-full mx-4 rounded-lg border border-border bg-card p-6 text-center space-y-4">
          <h1 className="text-xl font-semibold text-heading">Unable to load payment</h1>
          <p className="text-sm text-muted-foreground">{registrationError}</p>
          <Link href="/home">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>
    <div className="min-h-screen bg-background text-foreground">
      {registrationId && <div className="w-full">
        <div className="flex flex-col min-h-screen bg-card lg:my-6 lg:rounded-xl lg:min-h-0 lg:border lg:border-border">
          {/* Header */}
          <div className="px-4 py-2 lg:py-4 text-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-heading">Trip Payment</h1>
          </div>

          {/* Trip Image */}
          <div className="h-48 lg:h-64 bg-muted rounded-lg mx-4 mb-4 overflow-hidden">
            <Image
              src={resolveImageSrc(registration?.flagship?.images?.[0], "/payments-cover.png")}
              alt="Payments Cover"
              height={192}
              width={768}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Details */}
          <div className="px-4 lg:px-6 mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-heading">{registration?.flagship?.tripName}</h2>
            <p className="text-muted-foreground lg:text-lg">
              {formatTripDate(registration?.flagship?.startDate, registration?.flagship?.endDate)}
            </p>
          </div>

          {/* Choose Payment Method */}
          <div className="px-4 lg:px-6 mb-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-heading">Choose a payment method</h3>
            <p className="text-muted-foreground text-sm lg:text-base mt-1">
              Greyed ones aren't available for you at the moment.
            </p>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => setSelectedMethod("bank")}
                className={`w-full rounded-2xl border px-4 py-4 flex items-center justify-between transition ${
                  selectedMethod === "bank" ? "border-brand-primary bg-brand-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Landmark className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold text-heading">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground">Transfer to a 3Musafir account</p>
                  </div>
                </div>
                <span
                  className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                    selectedMethod === "bank" ? "border-brand-primary" : "border-border"
                  }`}
                >
                  {selectedMethod === "bank" && <span className="h-3 w-3 rounded-full bg-brand-primary" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("wallet")}
                className={`w-full rounded-2xl border px-4 py-4 flex items-center justify-between transition ${
                  selectedMethod === "wallet" ? "border-brand-primary bg-brand-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold text-heading">Use my credits</p>
                    <p className="text-xs text-muted-foreground">Pay from your wallet balance</p>
                  </div>
                </div>
                <span
                  className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                    selectedMethod === "wallet" ? "border-brand-primary" : "border-border"
                  }`}
                >
                  {selectedMethod === "wallet" && <span className="h-3 w-3 rounded-full bg-brand-primary" />}
                </span>
              </button>

              <div className="w-full rounded-2xl border px-4 py-4 flex items-center justify-between opacity-50 border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold text-heading">Credit/Debit Card</p>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </div>
                </div>
                <span className="h-6 w-6 rounded-full border border-border" />
              </div>
            </div>
          </div>

          {/* Total Due + Next */}
          <div className="mx-4 lg:mx-6 mb-6 rounded-2xl border border-border bg-card px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total due amount</p>
              <p className="text-2xl font-bold text-heading">Rs. {formatCurrency(amountDue)}</p>
              <button
                type="button"
                onClick={() => {
                  setTimeout(() => breakdownRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                }}
                className="text-sm text-brand-primary hover:underline mt-1"
              >
                See breakdown
              </button>
            </div>
            <Button
              type="button"
              className="bg-brand-primary text-btn-secondary-text"
              onClick={() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Next
            </Button>
          </div>

          <div ref={breakdownRef}>
            {paymentType === "partial" && typeof paymentQuote?.partialDue === "number" && (
              <div className="bg-card border border-border rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Minimum to save your seat</p>
                    <p className="text-xs text-muted-foreground">(30% of total amount)</p>
                  </div>
                  <p className="text-lg font-semibold text-brand-primary">
                    Rs. {formatCurrency(paymentQuote.partialDue)}
                  </p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-brand-primary"
                    style={{
                      width: `${Math.min(
                        100,
                        (paymentQuote.partialDue / Math.max(amountDue, 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Rs. {formatCurrency(amountDue - paymentQuote.partialDue)} remaining</span>
                  <span>Total: Rs. {formatCurrency(amountDue)}</span>
                </div>
              </div>
            )}

            {/* Price and Payment Type */}
            <div className="bg-card border border-border rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-text">Trip Price</span>
                <span className="font-bold text-xl text-heading">
                  Rs. {formatCurrency(tripPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text">Remaining Due</span>
                <span className="font-bold text-xl text-heading">
                  Rs. {formatCurrency(amountDue)}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fullPayment"
                  name="paymentType"
                  checked={paymentType === "full"}
                  onChange={() => setPaymentType("full")}
                  className="h-4 w-4 text-brand-primary focus:ring-brand-primary"
                  disabled={noPaymentDue}
                />
                <label htmlFor="fullPayment" className="text-text">
                  Full Payment
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="partialPayment"
                  name="paymentType"
                  checked={paymentType === "partial"}
                  onChange={() => setPaymentType("partial")}
                  className="h-4 w-4 text-brand-primary focus:ring-brand-primary"
                  disabled={noPaymentDue}
                />
                <label htmlFor="partialPayment" className="text-text">
                  Partial Payment
                </label>
              </div>
            </div>

            {noPaymentDue && (
              <p className="mt-3 text-sm text-muted-foreground">
                No remaining payment due.
              </p>
            )}

            {paymentType === "partial" && (
              <p className="mt-3 text-xs text-muted-foreground">
                Partial payment is fixed at 30% of remaining due. You can pay with wallet and/or bank transfer.
              </p>
            )}
            </div>

            {/* Discount Section */}
            <div className="bg-card border border-border rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discounts</span>
                {discountApplied > 0 ? (
                  <span className="font-semibold text-brand-primary">
                    Applied: Rs. {formatCurrency(discountApplied)}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Select one discount
                  </span>
                )}
              </div>

              {!discountSelectionLocked && (
                <div className="space-y-2">
                  {authRequired && (
                    <p className="text-sm text-amber-700">
                      Login required to view eligible discounts.
                    </p>
                  )}
                  {hasEligibleDiscounts ? (
                    discountOptions.map((option) => {
                      if (!option.data?.eligible) return null;
                      return (
                        <label
                          key={option.key}
                          className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${
                            selectedDiscountType === option.key
                              ? "border-brand-primary"
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="discountType"
                              checked={selectedDiscountType === option.key}
                              onChange={() => handleSelectDiscount(option.key)}
                              className="h-4 w-4 text-brand-primary focus:ring-brand-primary"
                            />
                            <span className="text-sm text-heading">{option.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-brand-primary">
                            Rs. {formatCurrency(Number(option.data.amount || 0))}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        No discounts available for this registration.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Looks like discounts are gone for this trip — registering and paying early helps secure them next time.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {discountSelectionLocked && (
                <div className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                  Discount applied and locked for this registration.
                </div>
              )}

              {discountApplied > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Discount Applied:</span>
                  <span className="font-semibold text-brand-primary">
                    Rs. {formatCurrency(discountApplied)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount to Pay Now:</span>
                <span className="font-bold text-xl text-brand-primary-hover">
                  Rs. {formatCurrency(
                    paymentType === "partial" && typeof paymentQuote?.partialDue === "number"
                      ? paymentQuote.partialDue
                      : paymentQuote?.payableNow ?? amountDue
                  )}
                </span>
              </div>
              {quoteError && (
                <div className="rounded-md border border-brand-error/30 bg-brand-error/5 p-3 text-xs text-brand-error flex items-center justify-between">
                  <span>{quoteError}</span>
                  <Button variant="ghost" size="sm" onClick={loadQuote}>
                    Retry
                  </Button>
                </div>
              )}
              {quoteLoading && initialQuoteLoadedRef.current && (
                <p className="text-xs text-muted-foreground">Updating payment details…</p>
              )}
            </div>
            </div>

            {/* Previous Transactions */}
            <div className="bg-card border border-border rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-heading">Previous Transactions</h4>
                <span className="text-sm text-muted-foreground">
                  {paymentHistory.length} payment(s)
                </span>
              </div>
              {historyLoading ? (
                <p className="text-sm text-muted-foreground">Loading payments…</p>
              ) : paymentHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No previous payments found.</p>
              ) : (
                <Accordion type="single" collapsible>
                  {paymentHistory.map((item) => {
                    const walletValue =
                      typeof item.walletApplied === "number"
                        ? item.walletApplied
                        : typeof item.walletRequested === "number"
                          ? item.walletRequested
                          : 0;
                    const totalPaid =
                      (typeof item.amount === "number" ? item.amount : 0) + Math.max(0, walletValue);
                    return (
                      <AccordionItem key={item._id} value={item._id}>
                        <AccordionTrigger className="text-sm">
                          <div className="flex w-full items-center justify-between pr-4">
                            <div>
                              <p className="font-semibold text-heading">Rs. {formatCurrency(totalPaid)}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                item.status === "approved"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : item.status === "pendingApproval"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {item.status === "pendingApproval" ? "Pending" : item.status}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {walletValue > 0 && (
                              <div className="flex justify-between">
                                <span>Wallet applied</span>
                                <span>Rs. {formatCurrency(walletValue)}</span>
                              </div>
                            )}
                            {typeof item.amount === "number" && item.amount > 0 && (
                              <div className="flex justify-between">
                                <span>Bank transfer</span>
                                <span>Rs. {formatCurrency(item.amount)}</span>
                              </div>
                            )}
                            {item.rejectionPublicNote && (
                              <p className="text-xs text-brand-error">{item.rejectionPublicNote}</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>

          <div ref={detailsRef}>
          {/* Wallet Credits */}
          {selectedMethod !== "card" && (
          <div className="rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6 border border-border bg-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-heading">Use Wallet</h3>
              <Link href="/wallet" className="text-sm text-brand-primary hover:underline">
                Top up
              </Link>
            </div>
            <p className="mt-1 text-sm text-text">
              Balance: Rs.{formatCurrency(walletBalance)} (max usable: Rs.{formatCurrency(maxWalletUsable)})
            </p>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={maxWalletUsable}
                value={walletToUse}
                onChange={(e) => setWalletToUse(Number(e.target.value || 0))}
                disabled={noPaymentDue || maxWalletUsable <= 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Wallet amount"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setWalletToUse(maxWalletUsable)}
                disabled={noPaymentDue || maxWalletUsable <= 0}
              >
                Max
              </Button>
            </div>
            {walletError && (
              <p className="mt-2 text-xs text-brand-error">
                {walletError.message || "Wallet amount can’t exceed remaining due."}
              </p>
            )}

            <div className="mt-3 space-y-1 text-sm text-text">
              <div className="flex justify-between">
                <span>Wallet applied</span>
                <span className="font-semibold text-heading">
                  Rs.{formatCurrency(walletApplied)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cash to pay now</span>
                <span className="font-semibold text-heading">
                  Rs.{formatCurrency(cashToPayNow)}
                </span>
              </div>
            </div>
          </div>
          )}

          {selectedMethod === "bank" ? (
          requiresScreenshot ? (
            <>
              {/* Step 1: Transfer Amount */}
              <div className="px-4 lg:px-6 mb-6">
                <h3 className="text-xl lg:text-2xl font-bold mb-2 text-heading">Step 1: Transfer Amount</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Transfer to one of these Bank accounts and share your receipt
                  below
                </p>
                <RadioGroup
                  value={selectedBank}
                  onValueChange={(value) => setSelectedBank(value as BankKey)}
                  className="space-y-3"
                >
                  {Object.entries(bankDetails).map(([bankId, details]) => (
                    <div
                      key={bankId}
                      className="border border-border bg-card rounded-lg overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() =>
                          setExpandedBank(expandedBank === bankId ? null : bankId)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={bankId} id={bankId} />
                          <Label htmlFor={bankId} className="flex items-center">
                            <Image
                              src={
                                bankId === "standard-chartered"
                                  ? "/sc.png"
                                  : "/db.png"
                              }
                              alt={details.title}
                              width={24}
                              height={24}
                              className="mr-3"
                            />
                            <span>{details.title}</span>
                          </Label>
                        </div>
                        {expandedBank === bankId ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>

                      {expandedBank === bankId && (
                        <div className="px-4 pb-4 space-y-3">
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm text-muted-foreground">
                              Account Title
                            </span>
                            <span className="font-medium text-heading">{details.title}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm text-muted-foreground">
                              {String(details.accountNumber || "").startsWith("PK")
                                ? "IBAN"
                                : "Account Number"}
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-heading">
                                {details.accountNumber}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleCopy(details.accountNumber)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {details.iban && details.iban !== "—" ? (
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm text-muted-foreground">IBAN</span>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-heading">{details.iban}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => handleCopy(details.iban)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Step 2: Upload Screenshot */}
              <div className="px-4 lg:px-6 mb-10">
                <h3 className="text-xl lg:text-2xl font-bold mb-2">
                  Step 2: Upload Screenshot
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Transfer to one of these Bank accounts and share your receipt
                  below
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center mb-3 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {file ? (
                    <div className="text-center">
                      <p className="text-text mb-2">File uploaded:</p>
                      <p className="font-medium text-heading">{fileName}</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-2">
                        Drop files here to upload...
                      </p>
                      <Button variant="outline" className="bg-background">
                        Browse files
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center py-6"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  <span>Or take a picture</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="mx-4 lg:mx-6 mb-6 rounded-lg border border-border bg-card p-4 lg:p-6">
              <p className="text-sm lg:text-base text-text">
                No bank transfer is required. You're paying using wallet credits.
              </p>
            </div>
          )
          ) : selectedMethod === "wallet" ? (
            <div className="mx-4 lg:mx-6 mb-6 rounded-lg border border-border bg-card p-4 lg:p-6">
              <p className="text-sm lg:text-base text-text">
                You're paying using wallet credits.
              </p>
            </div>
          ) : null}
          </div>

          {/* Confirm Payment */}
          <div className="px-4 lg:px-6 mt-auto mb-6">
            {prioritizedError && (
              <p className="mb-2 text-xs text-brand-error">
                {prioritizedError.message || "Please fix the highlighted issues to continue."}
              </p>
            )}
            <Button
              className="w-full py-6 bg-brand-primary hover:bg-brand-primary-hover text-btn-secondary-text disabled:bg-brand-primary-disabled disabled:cursor-not-allowed"
              disabled={submitDisabled}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      </div>}
    </div>
    </>
  );
}
