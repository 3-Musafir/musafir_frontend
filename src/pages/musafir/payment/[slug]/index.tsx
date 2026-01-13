"use client";
import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Camera, ChevronDown, ChevronUp, Copy } from "lucide-react";
import Image from "next/image";
import { PaymentService } from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/formatDate";

const bankDetails = {
  "standard-chartered": {
    id: "67fe5f79662980c34fa1bc2b",
    title: "Standard Chartered Bank",
    accountNumber: "1234567890",
    iban: "PK36SCBL0000001234567890",
  },
  "dubai-islamic": {
    id: "67fe5f79662980c34fa1bc2c",
    title: "Dubai Islamic Bank",
    accountNumber: "0987654321",
    iban: "PK36DIBL0000000987654321",
  },
};

export default function TripPayment() {
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] =
    useState<string>("standard-chartered");
  const router = useRouter();
  const params = useParams();
  const registrationId = params?.slug as string;
  const [expandedBank, setExpandedBank] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registrationHook = useRegistrationHook();
  const [registration, setRegistration] = useState<any>(null);

  const totalAmount = registration?.price;
  const finalAmount = Math.max(0, totalAmount - discountAmount)

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

  // Calculate discount when registration is loaded
  useEffect(() => {
    if (registration?.user?._id) {
      // Calculate discount based on user's past trips
      calculateUserDiscount(registration.user._id);
    }
  }, [registration]);

  // Function to calculate discount based on user's past trips
  const calculateUserDiscount = async (userId: string) => {
    try {
      // Get user discount by registration ID
      const discount = await PaymentService.getUserDiscountByRegistration(registrationId);
      setDiscountAmount(discount);
    } catch (error) {
      console.error('Error calculating discount:', error);
      setDiscountAmount(0);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
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

    try {
      setIsSubmitting(true);
      await PaymentService.createPayment({
        registration: registrationId,
        bankAccount: "680929fef52e643c2a724217",
        paymentType: paymentType === "full" ? "fullPayment" : "partialPayment",
        amount: paymentType === "full" ? finalAmount : partialAmount,
        discount: discountAmount,
        screenshot: file,
      });

      toast({
        title: "Success",
        description: "Payment submitted successfully!",
      });

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
      console.error("Payment submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      {registrationId && <div className="w-full max-w-md">
        <div className="flex flex-col min-h-screen bg-white">
          {/* Header */}
          <div className="px-4 py-2 text-center">
            <h1 className="text-2xl font-bold">Trip Payment</h1>
          </div>

          {/* Avocado Illustration */}
          <div className="w-full h-48 bg-[#E6E8F5] rounded-lg mx-auto mb-4 overflow-hidden">
            <Image
              src={registration?.flagship?.images.length > 0 ? registration?.flagship?.images[0] : "/payments-cover.png"}
              alt="Payments Cover"
              height={192}
              width={768}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Details */}
          <div className="px-4 mb-6">
            <h2 className="text-2xl font-bold">{registration?.flagship?.tripName}</h2>
            <p className="text-gray-600">{formatDate(registration?.flagship?.startDate, registration?.flagship?.endDate)}</p>
          </div>

          {/* Price and Payment Type */}
          <div className="bg-gray-100 rounded-lg mx-4 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Total Amount</span>
              <span className="font-bold text-xl">
                Rs. {totalAmount?.toLocaleString()}
              </span>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fullPayment"
                  name="paymentType"
                  checked={paymentType === "full"}
                  onChange={() => setPaymentType("full")}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="fullPayment" className="text-gray-700">
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
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="partialPayment" className="text-gray-700">
                  Partial Payment
                </label>
              </div>
            </div>

            {paymentType === "partial" && (
              <div className="mt-4">
                <label
                  htmlFor="partialAmount"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter amount"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                </div>
                {partialAmount > finalAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    Amount cannot exceed final amount
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Discount Section */}
          <div className="bg-gray-100 rounded-lg mx-4 p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount Amount:</span>
                <span className="font-semibold text-green-600">Rs. {discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Final Amount:</span>
                <span className="font-bold text-xl text-orange-600">
                  Rs. {finalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Transfer Amount */}
          <div className="px-4 mb-6">
            <h3 className="text-xl font-bold mb-2">Step 1: Transfer Amount</h3>
            <p className="text-gray-600 text-sm mb-4">
              Transfer to one of these Bank accounts and share your receipt
              below
            </p>

            <RadioGroup
              value={selectedBank}
              onValueChange={setSelectedBank}
              className="space-y-3"
            >
              {Object.entries(bankDetails).map(([bankId, details]) => (
                <div
                  key={bankId}
                  className="border border-gray-200 rounded-lg overflow-hidden"
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
                        <span className="text-sm text-gray-500">
                          Account Title
                        </span>
                        <span className="font-medium">{details.title}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">
                          Account Number
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
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
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">IBAN</span>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{details.iban}</span>
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
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Step 2: Upload Screenshot */}
          <div className="px-4 mb-10">
            <h3 className="text-xl font-bold mb-2">
              Step 2: Upload Screenshot
            </h3>
            <p className="text-gray-600 text-sm mb-4">
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
              className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center mb-3 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {file ? (
                <div className="text-center">
                  <p className="text-gray-700 mb-2">File uploaded:</p>
                  <p className="font-medium">{fileName}</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 mb-2">
                    Drop files here to upload...
                  </p>
                  <Button variant="outline" className="bg-white">
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

          {/* Confirm Payment */}
          <div className="px-4 mt-auto mb-6">
            <Button
              className={`w-full py-6 ${file
                ? "bg-orange-500 text-white hover:bg-white hover:text-black"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              disabled={!file || isSubmitting}
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
  );
}
