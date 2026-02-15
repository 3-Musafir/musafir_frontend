"use client";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { PaymentService } from "@/services/paymentService";
import { formatDate } from "@/utils/formatDate";
import { Camera, ChevronDown, ChevronUp, Copy } from "lucide-react";
import Image from "next/image";
import { resolveImageSrc } from "@/lib/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

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

export default function TripPayment() {
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] =
    useState<BankKey>("faysal-bank");
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
  const [partialAmount, setPartialAmount] = useState<number>(0);
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
  const registrationHook = useRegistrationHook();
  const [registration, setRegistration] = useState<any>(null);

  const tripPrice = registration?.price || 0;
  const amountDue =
    typeof registration?.amountDue === "number" ? registration.amountDue : tripPrice;
  const discountApplied =
    typeof registration?.discountApplied === "number"
      ? registration.discountApplied
      : 0;
  const paymentStatus =
    registration?.paymentId && typeof registration.paymentId === "object"
      ? registration.paymentId.status
      : undefined;

  const pendingDiscount = discountApplied > 0 ? 0 : selectedDiscountAmount;
  const discountRemaining = Math.max(0, pendingDiscount);
  const finalAmount = Math.max(0, amountDue - pendingDiscount);
  const paymentPendingApproval = paymentStatus === "pendingApproval";
  const noPaymentDue = finalAmount <= 0;
  const walletBalance =
    typeof walletSummary?.balance === "number" ? walletSummary.balance : 0;
  const maxWalletUsable = Math.max(0, Math.min(walletBalance, finalAmount));
  const effectiveWalletToUse = Math.max(0, Math.min(walletToUse, maxWalletUsable));
  const cashToPayNow =
    paymentType === "full"
      ? Math.max(0, finalAmount - effectiveWalletToUse)
      : Math.max(0, partialAmount);
  const requiresScreenshot = cashToPayNow > 0;
  const submitDisabled =
    isSubmitting ||
    paymentPendingApproval ||
    noPaymentDue ||
    (requiresScreenshot && !file) ||
    (paymentType === "partial" && cashToPayNow <= 0 && effectiveWalletToUse <= 0) ||
    (paymentType === "partial" && effectiveWalletToUse + cashToPayNow > finalAmount);

  const discountOptions = [
    { key: "soloFemale", label: "Solo Female Discount", data: eligibleDiscounts?.soloFemale },
    { key: "group", label: "Group Discount", data: eligibleDiscounts?.group },
    { key: "musafir", label: "Musafir Discount", data: eligibleDiscounts?.musafir },
  ] as const;
  const hasEligibleDiscounts = discountOptions.some((option) => option.data?.eligible);
  const discountSelectionLocked = discountApplied > 0;

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
    const registration = await registrationHook.getRegistrationById(registrationId);
    if (registration) {
      setRegistration(registration);
    };
  }

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

  const handleSelectDiscount = (type: "soloFemale" | "group" | "musafir") => {
    if (!eligibleDiscounts) return;
    const selected = (eligibleDiscounts as any)?.[type];
    if (!selected?.eligible) return;
    setSelectedDiscountType(type);
    setSelectedDiscountAmount(Number(selected.amount) || 0);
  };

  const handleSubmit = async () => {
    if (paymentPendingApproval) {
      toast({
        title: "Payment already submitted",
        description: "Your payment is pending approval. Please wait for an update.",
        variant: "destructive",
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

    const cashAmount =
      paymentType === "full"
        ? Math.max(0, finalAmount - effectiveWalletToUse)
        : Math.max(0, partialAmount);

    if (paymentType === "partial" && cashAmount <= 0 && effectiveWalletToUse <= 0) {
      toast({
        title: "Please enter an amount",
        description: "Add wallet credits and/or a partial amount to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (paymentType === "partial" && effectiveWalletToUse + cashAmount > finalAmount) {
      toast({
        title: "Amount too high",
        description: "Wallet + partial amount cannot exceed the remaining payable amount.",
        variant: "destructive",
      });
      return;
    }

    if (cashAmount > 0 && !file) {
      toast({
        title: "Please Upload Screenshot",
        variant: "destructive",
      });
      return;
    }

    if (paymentType === "partial" && (!partialAmount || partialAmount <= 0)) {
      toast({
        title: "Please Enter A Valid Partial Amount",
        variant: "destructive",
      });
      return;
    }
    if (paymentType === "partial" && cashAmount > finalAmount) {
      toast({
        title: "Partial amount too high",
        description: "Partial amount cannot exceed the remaining payable amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const walletUseId =
        effectiveWalletToUse > 0
          ? (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? (crypto as any).randomUUID()
            : `${Date.now()}-${Math.random()}`)
          : undefined;
      const selectedBankAccountId =
        cashAmount > 0 ? bankDetails[selectedBank]?.id : undefined;
      const selectedBankLabel =
        cashAmount > 0 ? bankDetails[selectedBank]?.title : undefined;
      const discountToUse =
        discountApplied > 0 ? discountApplied : selectedDiscountAmount;
      const discountTypeToUse =
        discountApplied > 0 ? registration?.discountType : selectedDiscountType;

      if (cashAmount > 0 && !selectedBankAccountId && !selectedBankLabel) {
        toast({
          title: "Select a bank account",
          description: "Please choose a bank account before submitting.",
          variant: "destructive",
        });
        return;
      }

      const res: any = await PaymentService.createPayment({
        registration: registrationId,
        bankAccount: selectedBankAccountId,
        bankAccountLabel: selectedBankLabel,
        paymentType: paymentType === "full" ? "fullPayment" : "partialPayment",
        amount: cashAmount,
        discount: discountToUse,
        discountType: discountTypeToUse ?? undefined,
        walletAmount: effectiveWalletToUse,
        walletUseId,
        screenshot: cashAmount > 0 ? file ?? undefined : undefined,
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

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
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
            <p className="text-muted-foreground lg:text-lg">{formatDate(registration?.flagship?.startDate, registration?.flagship?.endDate)}</p>
          </div>

          {/* Price and Payment Type */}
          <div className="bg-card border border-border rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-text">Trip Price</span>
                <span className="font-bold text-xl text-heading">
                  Rs. {tripPrice?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text">Remaining Due</span>
                <span className="font-bold text-xl text-heading">
                  Rs. {amountDue?.toLocaleString()}
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
                  disabled={paymentPendingApproval || noPaymentDue}
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
                  disabled={paymentPendingApproval || noPaymentDue}
                />
                <label htmlFor="partialPayment" className="text-text">
                  Partial Payment
                </label>
              </div>
            </div>

            {paymentPendingApproval && (
              <p className="mt-3 text-sm text-muted-foreground">
                Payment already submitted and pending approval.
              </p>
            )}
            {noPaymentDue && !paymentPendingApproval && (
              <p className="mt-3 text-sm text-muted-foreground">
                No remaining payment due.
              </p>
            )}

            {paymentType === "partial" && (
              <div className="mt-4">
                <label
                  htmlFor="partialAmount"
                  className="block text-sm text-text mb-1"
                >
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground">
                    Rs.
                  </span>
                  <input
                    type="text"
                    id="partialAmount"
                    value={partialAmount || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/^0+/, "");
                      setPartialAmount(value ? Number(value) : 0);
                    }}
                    min="0"
                    max={finalAmount}
                    disabled={paymentPendingApproval || noPaymentDue}
                    className="w-full pl-10 pr-4 py-2 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter amount"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                </div>
                {partialAmount > finalAmount && (
                  <p className="text-brand-error text-sm mt-1">
                    Amount cannot exceed remaining payable amount
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Discount Section */}
          <div className="bg-card border border-border rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discounts</span>
                {discountApplied > 0 ? (
                  <span className="font-semibold text-brand-primary">
                    Applied: Rs. {discountApplied.toLocaleString()}
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
                            Rs. {Number(option.data.amount || 0).toLocaleString()}
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

              {discountRemaining > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Discount Applied:</span>
                  <span className="font-semibold text-brand-primary">
                    Rs. {discountRemaining.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount to Pay Now:</span>
                <span className="font-bold text-xl text-brand-primary-hover">
                  Rs. {finalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Credits */}
          <div className="rounded-lg mx-4 lg:mx-6 p-4 lg:p-6 mb-6 border border-border bg-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-heading">Use Wallet</h3>
              <Link href="/wallet" className="text-sm text-brand-primary hover:underline">
                Top up
              </Link>
            </div>
            <p className="mt-1 text-sm text-text">
              Balance: Rs.{walletBalance.toLocaleString()} (max usable: Rs.{maxWalletUsable.toLocaleString()})
            </p>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={maxWalletUsable}
                value={walletToUse}
                onChange={(e) => setWalletToUse(Number(e.target.value || 0))}
                disabled={paymentPendingApproval || noPaymentDue || maxWalletUsable <= 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Wallet amount"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setWalletToUse(maxWalletUsable)}
                disabled={paymentPendingApproval || noPaymentDue || maxWalletUsable <= 0}
              >
                Max
              </Button>
            </div>

            <div className="mt-3 space-y-1 text-sm text-text">
              <div className="flex justify-between">
                <span>Wallet applied</span>
                <span className="font-semibold text-heading">
                  Rs.{effectiveWalletToUse.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cash to pay now</span>
                <span className="font-semibold text-heading">
                  Rs.
                  {(
                    paymentType === "full"
                      ? Math.max(0, finalAmount - effectiveWalletToUse)
                      : Math.max(0, partialAmount)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {requiresScreenshot ? (
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
          )}

          {/* Confirm Payment */}
          <div className="px-4 lg:px-6 mt-auto mb-6">
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
