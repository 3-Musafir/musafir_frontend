"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PaymentService } from "@/services/paymentService";
import { useRouter } from "next/router";
import useRegistrationHook from "@/hooks/useRegistrationHandler";

const SuccessComponent = ({ refundAmount }: { refundAmount?: number }) => {
  const router = useRouter();
  return (
    <div className="max-w-md mx-auto bg-background text-foreground min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-heading flex items-center justify-center">
            <Check className="h-8 w-8 text-btn-secondary-text" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-brand-primary -m-1"></div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Form Submitted Successfully</h1>

        <p className="text-text mb-2">
          Thank you for submitting your refund request. Our team will review it
          and update you shortly.
        </p>
        {typeof refundAmount === "number" && (
          <p className="text-sm text-text-light mb-8">
            Estimated refund (policy-based): Rs.{refundAmount.toLocaleString()}
          </p>
        )}
      </div>

      <div className="p-4">
        <Button
          onClick={() => router.push("/passport")}
          className="w-full bg-brand-primary hover:bg-brand-primary-hover h-12 text-base text-btn-secondary-text"
        >
          Okay, Great
        </Button>
      </div>
    </div>
  );
};

export default function RefundForm() {
  const [reason, setReason] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [registration, setRegistration] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryAt, setRetryAt] = useState<string | null>(null);
  const router = useRouter();
  const { slug } = router.query;
  const registrationHook = useRegistrationHook();
  // const [reasonOption, setReasonOption] = useState("change-of-plans");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = () => {
    return (
      // reasonOption &&
      reason.trim().length > 0 && bankDetails.trim().length > 0 && rating > 0
    );
  };

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setQuoteLoading(true);
      try {
        const reg = await registrationHook.getRegistrationById(slug as string);
        setRegistration(reg);
        const q = await PaymentService.getRefundQuote(slug as string);
        setQuote(q);
      } catch (e) {
        // Backend will enforce, but we try to show quote when possible.
      } finally {
        setQuoteLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleCancelSeat = async () => {
    if (!slug) return;
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "You're about to cancel your registration. This will release your seat and cannot be undone. Continue?"
      );
      if (!confirmed) return;
    }
    setCancelling(true);
    setErrorMessage(null);
    try {
      const updated = await registrationHook.cancelSeat(slug as string);
      if (updated) {
        setRegistration(updated);
        const q = await PaymentService.getRefundQuote(slug as string);
        setQuote(q);
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "Failed to cancel seat.");
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setRetryAt(null);

    try {
      await PaymentService.requestRefund({
        registration: slug as string,
        bankDetails,
        reason,
        feedback,
        rating,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit refund request:", error);
      const code =
        (error as any)?.response?.data?.code ||
        (error as any)?.code;
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Failed to submit refund request.";
      const retryAtValue =
        (error as any)?.response?.data?.retryAt ||
        (error as any)?.response?.data?.data?.retryAt;

      setErrorMessage(message);
      if (retryAtValue) {
        setRetryAt(String(retryAtValue));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return <SuccessComponent refundAmount={quote?.refundAmount} />;
  }

  const status = String(registration?.status || "");
  const needsCancellation = status === "confirmed";
  const canSubmit = status === "cancelled";
  const isUnderReview = status === "refundProcessing";
  const isRefunded = status === "refunded";

  return (
    <div className="max-w-md mx-auto bg-background text-foreground min-h-screen pb-8">
      <header className="sticky top-0 bg-background z-10 border-b border-border">
        <div className="p-4 flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-4"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center">Refund Form</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {errorMessage && (
          <div className="rounded-md border border-brand-error bg-brand-error-light p-3 text-sm text-brand-error">
            {errorMessage}
            {retryAt && (
              <div className="mt-1 text-xs text-text-dark">
                Try again after{" "}
                {new Date(retryAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                .
              </div>
            )}
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-heading">
            Are you sure you want to let go off
          </h2>
          <p className="text-text">
            Unforeseen circumstances can arise and plans may change, hence
            we&apos;ve created this refund form.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-heading">Refund estimate</p>
            <Link
              href="/refundpolicyby3musafir"
              className="text-xs text-brand-primary hover:underline"
            >
              View policy
            </Link>
          </div>
          {quoteLoading ? (
            <p className="text-sm text-text-light">Calculating…</p>
          ) : quote ? (
            <>
              <p className="text-sm text-text">
                Estimated refund:{" "}
                <span className="font-semibold text-heading">
                  Rs.{Number(quote.refundAmount || 0).toLocaleString()}
                </span>
              </p>
              <p className="text-xs text-text-light">
                Includes PKR {Number(quote.processingFee || 500).toLocaleString()} processing fee.
              </p>
            </>
          ) : (
            <p className="text-sm text-text-light">Refund estimate unavailable.</p>
          )}
          {needsCancellation && (
            <div className="pt-2">
              <Button
                type="button"
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-btn-secondary-text"
                isLoading={cancelling}
                loadingText="Cancelling…"
                onClick={handleCancelSeat}
              >
                Cancel seat to continue
              </Button>
              <p className="mt-2 text-xs text-text-light">
                Seat cancellation is required before submitting a refund request.
              </p>
            </div>
          )}
          {isUnderReview && (
            <p className="text-sm text-text-light">Refund under review.</p>
          )}
          {isRefunded && (
            <p className="text-sm text-text-light">Refund completed.</p>
          )}
        </div>

        {/* <div className="space-y-3">
          <Label className="text-base font-medium">
            What changed your mind?
          </Label>
          <RadioGroup value={reasonOption} onValueChange={setReasonOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="change-of-plans"
                id="change-of-plans"
                className="border-2"
              />
              <Label htmlFor="change-of-plans" className="font-normal">
                Change of plans
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="family-errands"
                id="family-errands"
                className="border-2"
              />
              <Label htmlFor="family-errands" className="font-normal">
                Family errands
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="health-reasons"
                id="health-reasons"
                className="border-2"
              />
              <Label htmlFor="health-reasons" className="font-normal">
                Health reasons
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="financial-constraints"
                id="financial-constraints"
                className="border-2"
              />
              <Label htmlFor="financial-constraints" className="font-normal">
                Financial constraints
              </Label>
            </div>
          </RadioGroup>
        </div> */}

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="reason" className="text-base font-medium">
              Reason
            </Label>
            <span className="text-sm text-text-light">{reason.length}/100</span>
          </div>
          <Input
            id="reason"
            placeholder="Change my mind"
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 100))}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bank-details" className="text-base font-medium">
              Bank Account Details
            </Label>
            <span className="text-sm text-text-light">
              {bankDetails.length}/100
            </span>
          </div>
          <Input
            id="bank-details"
            placeholder="Bank title | Bank Name | Account Number"
            value={bankDetails}
            onChange={(e) => setBankDetails(e.target.value.slice(0, 100))}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">Overall Experience</Label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    rating >= star
                      ? "fill-brand-warning text-brand-warning"
                      : "text-text-light"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="feedback" className="text-base font-medium">
              Anything else you&apos;d like to share with us?
            </Label>
            <span className="text-sm text-text-light">{feedback.length}/100</span>
          </div>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.slice(0, 100))}
            className="min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-primary-hover h-12 text-base text-btn-secondary-text disabled:bg-brand-primary-disabled disabled:cursor-not-allowed"
          disabled={
            !isFormValid() ||
            isLoading ||
            !canSubmit ||
            isUnderReview ||
            isRefunded ||
            needsCancellation
          }
          isLoading={isLoading}
          loadingText="Submitting..."
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
