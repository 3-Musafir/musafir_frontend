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

const SuccessComponent = () => {
  const router = useRouter();
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
            <Check className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-orange-500 -m-1"></div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Form Submitted Successfully</h1>

        <p className="text-gray-600 mb-8">
          Thank you for submitting your refund request. Our team will review it
          and get back to you shortly.
        </p>
      </div>

      <div className="p-4">
        <Button
          onClick={() => router.push("/passport")}
          className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-base"
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
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligible, setEligible] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    const checkEligibility = async () => {
      if (!slug) return;
      try {
        const registration = await registrationHook.getRegistrationById(slug as string);
        const status = String(registration?.status || "");
        const amountDue =
          typeof registration?.amountDue === "number"
            ? registration.amountDue
            : typeof registration?.price === "number"
              ? registration.price
              : undefined;

        const ok = status === "confirmed" && typeof amountDue === "number" && amountDue <= 0;
        setEligible(ok);
        if (!ok) {
          setErrorMessage(
            "Refunds can only be requested after your payment is approved and your seat is confirmed.",
          );
        }
      } catch (e) {
        // If we can't check eligibility, keep the form usable and let the backend decide.
        setEligible(true);
      } finally {
        setEligibilityChecked(true);
      }
    };
    checkEligibility();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

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

      if (
        code === "refund_not_eligible" ||
        code === "refund_payment_not_approved" ||
        code === "refund_already_requested"
      ) {
        setEligible(false);
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return <SuccessComponent />;
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-8">
      <header className="sticky top-0 bg-white z-10">
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold flex-1 text-center">Refund Form</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {errorMessage && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Are you sure you want to let go off
          </h2>
          <p className="text-gray-500">
            Unforeseen circumstances can arise and plans may change, hence
            we&apos;ve created this refund form.
          </p>
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
            <span className="text-sm text-gray-500">{reason.length}/100</span>
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
            <span className="text-sm text-gray-500">
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
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
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
            <span className="text-sm text-gray-500">{feedback.length}/100</span>
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
          className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={
            !isFormValid() ||
            isLoading ||
            (eligibilityChecked && !eligible)
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
