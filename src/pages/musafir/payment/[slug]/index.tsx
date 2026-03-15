"use client";
import Head from "next/head";
import { Button } from "@/components/ui/button";
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
import { Camera, Copy, CreditCard, Landmark, Wallet } from "lucide-react";
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
  const [selectedBank, setSelectedBank] = useState<BankKey | null>(null);
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
  const [currentStep, setCurrentStep] = useState<"method" | "proof" | "amount" | "account">("method");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [manualAmountTouched, setManualAmountTouched] = useState(false);
  const [walletAmountTouched, setWalletAmountTouched] = useState(false);

  const tripPrice = registration?.price || 0;
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
  const payableNow =
    paymentType === "partial" && typeof paymentQuote?.partialDue === "number"
      ? paymentQuote.partialDue
      : typeof paymentQuote?.payableNow === "number"
        ? paymentQuote.payableNow
        : amountDue;
  const requiredBankAmount = selectedMethod === "bank" ? cashToPayNow : 0;
  const bankAmountMismatch =
    selectedMethod === "bank" &&
    manualAmount > 0 &&
    Math.floor(manualAmount) !== Math.floor(requiredBankAmount);
  const walletAmountMismatch =
    selectedMethod === "wallet" &&
    walletToUse > 0 &&
    Math.floor(walletToUse) !== Math.floor(payableNow);

  const discountOptions = [
    { key: "soloFemale", label: "Solo Female Discount", data: eligibleDiscounts?.soloFemale },
    { key: "group", label: "Group Discount", data: eligibleDiscounts?.group },
    { key: "musafir", label: "Musafir Discount", data: eligibleDiscounts?.musafir },
  ] as const;
  const hasEligibleDiscounts = discountOptions.some((option) => option.data?.eligible);
  const discountSelectionLocked =
    persistedDiscountApplied > 0 || Boolean(persistedDiscountType);

  type StepKey = "method" | "proof" | "amount" | "account";
  const stepSequence: StepKey[] = selectedMethod === "bank"
    ? ["method", "proof", "amount", "account"]
    : selectedMethod === "wallet"
      ? ["method", "amount"]
      : ["method"];
  const stepIndex = Math.max(0, stepSequence.indexOf(currentStep));
  const isFirstStep = stepIndex === 0;

  const goNext = () => {
    const nextIndex = Math.min(stepIndex + 1, stepSequence.length - 1);
    setCurrentStep(stepSequence[nextIndex]);
  };

  const goBack = () => {
    const prevIndex = Math.max(stepIndex - 1, 0);
    setCurrentStep(stepSequence[prevIndex]);
  };

  const isAmountRequiredError = prioritizedError?.code === "payment_amount_required";
  const hasBlockingError = Boolean(prioritizedError && !isAmountRequiredError);
  const walletAmountInvalid =
    selectedMethod === "wallet" &&
    (walletToUse <= 0 || Boolean(walletError) || walletAmountMismatch);
  const methodNextDisabled =
    selectedMethod === "card" || noPaymentDue || hasBlockingError || quoteLoading || !paymentQuote;
  const proofNextDisabled =
    selectedMethod === "bank" && !file;
  const amountNextDisabled =
    hasBlockingError ||
    noPaymentDue ||
    quoteLoading ||
    !paymentQuote ||
    (selectedMethod === "wallet"
      ? walletAmountInvalid
      : manualAmount <= 0 || bankAmountMismatch);
  const accountNextDisabled =
    hasBlockingError ||
    noPaymentDue ||
    quoteLoading ||
    !paymentQuote ||
    (selectedMethod === "bank" && !selectedBank);

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
    setCurrentStep("method");
    setManualAmountTouched(false);
    setWalletAmountTouched(false);
  }, [selectedMethod]);

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
      const walletAmountForQuote = selectedMethod === "wallet" ? walletToUse : 0;
      const resolvedPaymentMode =
        paymentType === "partial"
          ? "partial"
          : selectedMethod === "wallet"
            ? "wallet_only"
            : selectedMethod === "bank"
              ? "bank_transfer"
              : "bank_transfer";
      const payload = {
        registration: registrationId,
        walletAmount: walletAmountForQuote,
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
    if (selectedMethod !== "bank") return;
    if (manualAmountTouched) return;
    if (typeof cashToPayNow === "number" && cashToPayNow > 0) {
      setManualAmount(cashToPayNow);
    }
  }, [selectedMethod, cashToPayNow, manualAmountTouched]);

  useEffect(() => {
    if (selectedMethod !== "wallet") return;
    if (walletAmountTouched) return;
    if (walletToUse > 0) return;
    setWalletToUse(0);
  }, [selectedMethod, walletAmountTouched, walletToUse]);

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

    if (selectedMethod === "bank" && !file) {
      toast({
        title: "Please upload a payment screenshot",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const walletAmountToSubmit = selectedMethod === "wallet" ? walletToUse : 0;
      const walletUseId =
        walletAmountToSubmit > 0
          ? (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? (crypto as any).randomUUID()
            : `${Date.now()}-${Math.random()}`)
          : undefined;
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? (crypto as any).randomUUID()
          : `${Date.now()}-${Math.random()}`;
      const selectedBankAccountId =
        selectedMethod === "bank" && manualAmount > 0 && selectedBank
          ? bankDetails[selectedBank]?.id
          : undefined;
      const selectedBankLabel =
        selectedMethod === "bank" && manualAmount > 0 && selectedBank
          ? bankDetails[selectedBank]?.title
          : undefined;
      const discountToUse =
        discountApplied > 0 ? discountApplied : selectedDiscountAmount;
      const discountTypeToUse =
        discountApplied > 0
          ? (registration?.discountType ?? selectedDiscountType)
          : selectedDiscountType;

      if (selectedMethod === "bank" && manualAmount > 0 && !selectedBankAccountId && !selectedBankLabel) {
        toast({
          title: "Select a bank account",
          description: "Please choose a bank account before submitting.",
          variant: "destructive",
        });
        return;
      }

      const amountToSubmit = selectedMethod === "bank" ? manualAmount : 0;

      const res: any = await PaymentService.createPayment({
        registration: registrationId,
        idempotencyKey,
        bankAccount: selectedBankAccountId,
        bankAccountLabel: selectedBankLabel,
        paymentType: paymentType === "full" ? "fullPayment" : "partialPayment",
        amount: amountToSubmit,
        discount: discountToUse,
        discountType: discountTypeToUse ?? undefined,
        walletAmount: walletAmountToSubmit,
        walletUseId,
        screenshot: selectedMethod === "bank" && amountToSubmit > 0 ? file ?? undefined : undefined,
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
        {registrationId && (
          <div className="w-full">
            <div className="flex flex-col min-h-screen bg-card lg:my-6 lg:rounded-xl lg:min-h-0 lg:border lg:border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <button
                  type="button"
                  onClick={() => (isFirstStep ? router.back() : goBack())}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-border text-heading"
                >
                  {isFirstStep ? "×" : "←"}
                </button>
                <h1 className="text-lg font-semibold text-heading">Trip Payment</h1>
                <div className="h-9 w-9" />
              </div>

              <div className="px-4 pt-4 pb-2 text-center">
                <p className="text-sm text-muted-foreground">
                  {registration?.flagship?.tripName || "Trip"}{" "}
                  {formatTripDate(registration?.flagship?.startDate, registration?.flagship?.endDate)}
                </p>
              </div>

              <div className="flex-1 px-4 lg:px-6 pb-6">
                {currentStep === "method" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-heading">Choose a payment method</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Greyed ones aren't available for you at the moment.
                      </p>
                    </div>

                    <div className="space-y-3">
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

                    <div className="rounded-2xl border border-border bg-card px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total due amount</p>
                          <p className="text-2xl font-bold text-heading">Rs. {formatCurrency(amountDue)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBreakdown((prev) => !prev)}
                          className="text-sm text-brand-primary hover:underline"
                        >
                          {showBreakdown ? "Hide breakdown" : "See breakdown"}
                        </button>
                      </div>
                    </div>

                    {showBreakdown && (
                      <div className="space-y-4">
                        {paymentType === "partial" && typeof paymentQuote?.partialDue === "number" && (
                          <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
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

                        <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
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
                              Partial payment is fixed at 30% of remaining due.
                            </p>
                          )}
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
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
                                Rs. {formatCurrency(payableNow)}
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

                        <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
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
                    )}

                    <Button
                      type="button"
                      className="w-full py-6 bg-brand-primary text-btn-secondary-text"
                      onClick={goNext}
                      disabled={methodNextDisabled}
                    >
                      Next
                    </Button>
                    {prioritizedError && (
                      <p className="text-xs text-brand-error text-center">
                        {prioritizedError.message || "Please fix the highlighted issues to continue."}
                      </p>
                    )}
                  </div>
                )}

                {currentStep === "proof" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-heading">Upload payment proof</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Transfer to one of these accounts and upload your receipt below.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(bankDetails).map(([bankId, details]) => (
                        <div key={bankId} className="rounded-xl border border-border bg-card p-4 space-y-2">
                          <p className="font-semibold text-heading">{details.title}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {String(details.accountNumber || "").startsWith("PK") ? "IBAN" : "Account Number"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-heading">{details.accountNumber}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => handleCopy(details.accountNumber)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {details.iban && details.iban !== "—" ? (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">IBAN</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-heading">{details.iban}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() => handleCopy(details.iban)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div
                      className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
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
                          <p className="text-muted-foreground mb-2">Drop files here to upload…</p>
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

                    <Button
                      type="button"
                      className="w-full py-6 bg-brand-primary text-btn-secondary-text"
                      onClick={goNext}
                      disabled={proofNextDisabled}
                    >
                      Next
                    </Button>
                  </div>
                )}

                {currentStep === "amount" && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h3 className="text-2xl font-bold text-heading">How much did you pay?</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please make sure you enter the accurate amount as per payment proof attached.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={selectedMethod === "wallet" ? walletToUse : manualAmount}
                        onChange={(e) => {
                          const nextValue = Number(e.target.value || 0);
                          if (selectedMethod === "wallet") {
                            setWalletToUse(nextValue);
                            setWalletAmountTouched(true);
                          } else {
                            setManualAmount(nextValue);
                            setManualAmountTouched(true);
                          }
                        }}
                        className="w-full text-center text-5xl font-bold text-heading bg-transparent outline-none"
                        placeholder="0"
                      />
                      <div className="inline-flex items-center justify-center rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                        In PKR
                      </div>
                    </div>

                    {selectedMethod === "wallet" && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Wallet balance: Rs. {formatCurrency(walletBalance)}</p>
                        <p>Max usable: Rs. {formatCurrency(maxWalletUsable)}</p>
                        {walletError && (
                          <p className="text-brand-error">{walletError.message}</p>
                        )}
                        {!walletError && walletAmountMismatch && (
                          <p className="text-brand-error">
                            Amount must match Rs. {formatCurrency(payableNow)}.
                          </p>
                        )}
                      </div>
                    )}

                    {selectedMethod === "bank" && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Required amount: Rs. {formatCurrency(requiredBankAmount)}</p>
                        {bankAmountMismatch && (
                          <p className="text-brand-error">
                            Amount must match Rs. {formatCurrency(requiredBankAmount)}.
                          </p>
                        )}
                      </div>
                    )}

                    {prioritizedError && (
                      <p className="text-xs text-brand-error">
                        {prioritizedError.message || "Please fix the highlighted issues to continue."}
                      </p>
                    )}

                    <Button
                      type="button"
                      className="w-full py-6 bg-brand-primary text-btn-secondary-text"
                      onClick={() => {
                        if (selectedMethod === "wallet") {
                          handleSubmit();
                        } else {
                          goNext();
                        }
                      }}
                      disabled={amountNextDisabled || isSubmitting}
                      aria-busy={isSubmitting || undefined}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        selectedMethod === "wallet" ? "Confirm" : "Next"
                      )}
                    </Button>
                  </div>
                )}

                {currentStep === "account" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-heading">Which account did you pay to?</h3>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(bankDetails).map(([bankId, details]) => (
                        <label
                          key={bankId}
                          htmlFor={`bank-${bankId}`}
                          className={`flex items-center justify-between rounded-xl border px-4 py-4 cursor-pointer ${
                            selectedBank === bankId ? "border-brand-primary" : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <Landmark className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-base font-semibold text-heading">{details.title}</p>
                            </div>
                          </div>
                          <input
                            id={`bank-${bankId}`}
                            type="radio"
                            name="bankAccount"
                            value={bankId}
                            checked={selectedBank === bankId}
                            onChange={() => setSelectedBank(bankId as BankKey)}
                            className="h-5 w-5 text-brand-primary"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>You paid</span>
                      <span className="text-lg font-semibold text-heading">Rs. {formatCurrency(manualAmount)}</span>
                    </div>

                    <Button
                      type="button"
                      className="w-full py-6 bg-brand-primary text-btn-secondary-text"
                      onClick={handleSubmit}
                      disabled={accountNextDisabled || isSubmitting}
                      aria-busy={isSubmitting || undefined}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Confirm Payment"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
