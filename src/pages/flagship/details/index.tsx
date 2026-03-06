import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import { resolveImageSrc } from "@/lib/image";
import { flagshipState } from "@/recoil/flagshipState";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import { IoLocationOutline } from "react-icons/io5";
import {
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiChevronDown,
} from "react-icons/hi";
import ReviewCard from "@/components/cards/ReviewCard";
import { formatDate } from "@/utils/formatDate";
import Navigation from "../../navigation";
import { showAlert } from "@/pages/alert";
import { mapErrorToUserMessage } from "@/utils/errorMessages";
import useFaqHook from "@/hooks/useFaqHandler";
import useRatingHook from "@/hooks/useRatingHandler";
import useSignUpHook from "@/hooks/useSignUp";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { IFlagship } from "@/services/types/flagship";
import {
  formatPhoneForApi,
  inputFromStoredPhone,
  sanitizePhoneInput,
  validatePhoneDigits,
} from "@/utils/phone";

export default function FlagshipDetails() {
  type FaqItem = { question: string; answer: string };
  type Review = {
    userId?: { fullName?: string };
    flagshipId?: { destination?: string; tripName?: string };
    rating?: number;
    review?: string;
  };

  const router = useRouter();
  const { id } = router.query;
  const { getFaq } = useFaqHook();
  const { getTopFiveRating } = useRatingHook();
  const { getFlagship, sendTripQuery } = useFlagshipHook();

  const [flagship, setFlagship] = useState<IFlagship | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showQueryInput, setShowQueryInput] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [rating, setRating] = useState<Review[]>([]);
  const existingFlagship =
    useRecoilValue(flagshipState) as unknown as IFlagship | null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Onboarding modal state
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const signUpAction = useSignUpHook();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<"question" | "email" | "password" | "basicInfo">("question");
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [passwordLoading, setPasswordLoading] = useState(false);
  // Basic info fields (inline signup for new users)
  const [emailPreFilled, setEmailPreFilled] = useState(false);
  const [basicGender, setBasicGender] = useState("female");
  const [basicFullName, setBasicFullName] = useState("");
  const [basicPhone, setBasicPhone] = useState("");
  const [basicSameWhatsapp, setBasicSameWhatsapp] = useState(true);
  const [basicWhatsapp, setBasicWhatsapp] = useState("");
  const [basicPhoneError, setBasicPhoneError] = useState<string | null>(null);
  const [basicWhatsappError, setBasicWhatsappError] = useState<string | null>(null);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const basePath = "/flagship/details";
  const idParam = typeof id === "string" ? id : undefined;
  const canonicalUrl = idParam
    ? `${siteUrl}${basePath}?id=${encodeURIComponent(idParam)}`
    : `${siteUrl}${basePath}`;
  const title = flagship?.tripName
    ? `${flagship.tripName} — 3Musafir`
    : "Flagship details — 3Musafir";
  const description =
    flagship?.detailedPlan ||
    (flagship?.destination
      ? `Explore a community-led journey to ${flagship.destination} with 3Musafir.`
      : "Explore a 3Musafir flagship journey designed around safety, comfort, and community-led travel.");
  const ogImage = resolveImageSrc(flagship?.images?.[0], "/flowerFields.jpg");
  const ogImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${siteUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/home`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Flagship details",
        item: canonicalUrl,
      },
    ],
  };

  const fetchFaq = async () => {
    const faqItems = (await getFaq()) as unknown as FaqItem[];
    setFaq(faqItems);
  };

  const fetchRating = async () => {
    if (!id) return;
    const ratingItems = (await getTopFiveRating(id as string)) as unknown as Review[];
    setRating(ratingItems);
  };

  const fetchFlagshipDetails = async () => {
    if (!id) return;
    try {
      if (existingFlagship && existingFlagship.id === id) {
        setFlagship(existingFlagship);
      } else {
        const data = (await getFlagship(id as string)) as unknown as IFlagship;
        setFlagship(data);
      }
    } catch (err) {
      console.error("Error fetching flagship details:", err);
    }
  };

  const calculateTimeLeft = () => {
    if (!flagship?.endDate) return;
    const deadline = new Date(flagship.endDate);
    const now = new Date();
    const difference = deadline.getTime() - now.getTime();
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }
  };

  useEffect(() => {
    fetchFlagshipDetails();
    fetchFaq();
    fetchRating();
  }, [id, existingFlagship]);

  useEffect(() => {
    if (!flagship) return;
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [flagship]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPosition = window.scrollY;
        const triggerPosition = contentRef.current.offsetTop + 200;
        setIsButtonVisible(scrollPosition > triggerPosition);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!flagship) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleSubmitQuery = async () => {
    if (queryText.trim() === "") {
      setShowQueryInput(!showQueryInput);
      return;
    } else {
      try {
        const res = await sendTripQuery(queryText, id as string);
        if (res?.statusCode === 200) {
          setQueryText("");
          showAlert("Trip query sent successfully", "success");
          setShowQueryInput(false);
        } else {
          showAlert("Failed to send trip query", "error");
        }
      } catch {
        // apiService already shows an error toast; this avoids unhandled rejections
        showAlert("Failed to send trip query", "error");
      }
    }
  };
  const defaultImage = "/flowerFields.jpg";
  const imageUrls = (flagship.images && flagship.images.length > 0
    ? flagship.images
    : [defaultImage]).map((image) => resolveImageSrc(image, defaultImage));

  const parseAmount = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return 0;
    const numeric = value.toString().replace(/[^0-9.-]/g, "");
    const parsed = Number(numeric);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const resolveBasePrice = (data?: IFlagship | null) => {
    const basePrice = parseAmount(data?.basePrice);
    const earlyBirdPrice = parseAmount(data?.earlyBirdPrice);
    const deadlineValue = data?.earlyBirdDeadline;
    if (earlyBirdPrice > 0 && deadlineValue) {
      const deadline = new Date(deadlineValue);
      if (!Number.isNaN(deadline.getTime()) && new Date() <= deadline) {
        return earlyBirdPrice;
      }
    }
    return basePrice;
  };

  const baseAmount = resolveBasePrice(flagship);

  const isEarlyBirdExpired = (data?: IFlagship | null) => {
    const earlyBirdPrice = parseAmount(data?.earlyBirdPrice);
    const deadlineValue = data?.earlyBirdDeadline;
    if (earlyBirdPrice <= 0 || !deadlineValue) return false;
    const deadline = new Date(deadlineValue);
    if (Number.isNaN(deadline.getTime())) return false;
    return new Date() > deadline;
  };

  const formatLocationPrice = (locationPrice: string | number) => {
    const surcharge = parseAmount(locationPrice);
    // If base is missing, fall back to whatever was provided.
    if (baseAmount <= 0) return surcharge.toLocaleString();
    // If the provided price already looks like a full fare, don't double add.
    if (surcharge >= baseAmount) return surcharge.toLocaleString();
    return (baseAmount + surcharge).toLocaleString();
  };

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      router.push(`/flagship/flagship-requirement?id=${id}&fromDetailsPage=true`);
    } else {
      setShowOnboardingModal(true);
      setOnboardingStep("question");
      setEmailInput("");
    }
  };

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setEmailLoading(true);

    try {
      const normalizedEmail = emailInput.trim().toLowerCase();
      const isAvailable = await signUpAction.checkEmailAvailability(normalizedEmail);

      if (!isAvailable) {
        // Email exists — generate a temporary password and email it
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/send-login-password`, {
          email: normalizedEmail,
        });
        setOtpDigits(["", "", "", "", "", ""]);
        setOnboardingStep("password");
      } else {
        // Email not found — collect basic info inline
        setEmailPreFilled(true);
        setOnboardingStep("basicInfo");
      }
    } catch (error) {
      showAlert(mapErrorToUserMessage(error), "error");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 6) return;
    setPasswordLoading(true);

    try {
      const result = await signIn("credentials", {
        email: emailInput.trim().toLowerCase(),
        password: otp,
        redirect: false,
      });

      if (result?.status === 200) {
        setShowOnboardingModal(false);
        router.push(`/flagship/flagship-requirement?id=${id}&fromDetailsPage=true`);
      } else if (result?.error) {
        showAlert("Invalid password. Please check your email and try again.", "error");
      }
    } catch (error) {
      showAlert(mapErrorToUserMessage(error), "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResendPassword = async () => {
    setEmailLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/send-login-password`, {
        email: emailInput.trim().toLowerCase(),
      });
      showAlert("A new password has been sent to your email.", "success");
    } catch (error) {
      showAlert(mapErrorToUserMessage(error), "error");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleOnboardingGoogleSignIn = async () => {
    const callbackUrl = `/flagship/flagship-requirement?id=${id}&fromDetailsPage=true`;
    await signIn("google", { callbackUrl });
  };

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhoneDigits(basicPhone, "Phone");
    const whatsappErr = basicSameWhatsapp ? null : validatePhoneDigits(basicWhatsapp, "Whatsapp");
    setBasicPhoneError(phoneErr);
    setBasicWhatsappError(whatsappErr);
    if (phoneErr || whatsappErr) {
      showAlert("Please fix the highlighted phone fields.", "error");
      return;
    }

    const formattedPhone = formatPhoneForApi(basicPhone);
    const formattedWhatsapp = basicWhatsapp ? formatPhoneForApi(basicWhatsapp) : formattedPhone;
    const formData = {
      email: emailInput.trim().toLowerCase(),
      gender: basicGender,
      fullName: basicFullName,
      phone: formattedPhone,
      whatsappPhone: basicSameWhatsapp ? formattedPhone : formattedWhatsapp,
    };

    localStorage.setItem("formData", JSON.stringify(formData));
    localStorage.setItem("flagshipId", JSON.stringify(id));
    setShowOnboardingModal(false);
    router.push(`/flagship/flagship-requirement?id=${id}&fromDetailsPage=true`);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
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
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:image" content={ogImageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    <div className="w-full bg-white min-h-screen pb-8 relative">
      {/* Sticky Register Button */}
      {isButtonVisible && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white lg:hidden">
          <div className="p-1">
            <button
              onClick={handleRegisterClick}
              className="w-full py-3 bg-brand-primary text-heading font-semibold rounded-md"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Header with back button and title */}
      <div className="px-4 py-3 flex items-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 flex items-center text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold w-full text-center">
          {flagship.tripName}
        </h1>
      </div>

      {/* Hero Image - Full width on desktop */}
      <div className="relative h-52 md:h-72 lg:h-[450px] w-full lg:px-8">
        <div className="relative h-full w-full lg:rounded-xl lg:overflow-hidden">
        <Image
          src={imageUrls[currentImageIndex]}
          alt={flagship.tripName || "Event image"}
          fill
          className="object-cover"
        />

        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {imageUrls.map((_: string, index: number) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${ currentImageIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/60" }`}
                />
              ))}
            </div>
          </>
        )}
        </div>
      </div>

      {/* Trip Info - Full width on desktop */}
      <div className="px-4 py-4 pb-10 lg:px-8" ref={contentRef}>
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">{flagship.tripName}</h2>

        {/* Desktop: Info and buttons in grid | Mobile: Stacked */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          <div className="space-y-3 mb-5 lg:mb-0">
            <div className="flex items-center">
              <IoLocationOutline className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 mr-2" />
              <span className="lg:text-lg">{flagship.destination}</span>
            </div>

            <div className="flex items-center">
              <HiOutlineCalendar className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 mr-2" />
              <span className="lg:text-lg">{formatDate(flagship.startDate, flagship.endDate)}</span>
            </div>

            <div className="flex items-center">
              <HiOutlineCurrencyDollar className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 mr-2" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="lg:text-lg">Starts Rs.{baseAmount.toLocaleString()}</span>
                {isEarlyBirdExpired(flagship) && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
                    Early bird expired
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buttons - side by side on desktop */}
          <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-4">
            {/* Register Button */}
            <button
              onClick={handleRegisterClick}
              className="w-full lg:flex-1 py-3 lg:py-4 bg-brand-primary text-heading font-semibold rounded-md hover:bg-brand-primary-hover transition-colors"
            >
              Register
            </button>

            {/* View Detailed Plan Button */}
            <button
              onClick={() => setShowPdfModal(true)}
              className="w-full lg:flex-1 py-3 lg:py-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
              View Detailed Travel Plans
            </button>
          </div>
        </div>
        <div className="mt-4">
        </div>

        {/* Countdown Timer */}
        <div className="mt-6 lg:mt-10">
          <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4 lg:text-center">Time left to register</h3>
          <div className="flex justify-center gap-x-4 lg:gap-x-8">
            <div className="flex flex-col items-center">
              <div className="bg-black text-white w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-xl lg:text-3xl font-bold">
                {timeLeft.days}
              </div>
              <span className="text-sm lg:text-base mt-1 lg:mt-2">Days</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white text-black w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-xl lg:text-3xl font-bold border border-black">
                {timeLeft.hours}
              </div>
              <span className="text-sm lg:text-base mt-1 lg:mt-2">Hrs</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white text-black w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-xl lg:text-3xl font-bold border border-black">
                {timeLeft.minutes}
              </div>
              <span className="text-sm lg:text-base mt-1 lg:mt-2">Min</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white text-black w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-xl lg:text-3xl font-bold border border-black">
                {timeLeft.seconds}
              </div>
              <span className="text-sm lg:text-base mt-1 lg:mt-2">Sec</span>
            </div>
          </div>
        </div>

        {/* Past Reviews */}
        {rating.length > 0 && (
          <div className="mt-6 lg:mt-10">
            <h3 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">Past Reviews</h3>
            {/* Mobile: Horizontal scroll | Desktop: Grid */}
            <div
              className="flex overflow-x-auto space-x-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0 lg:overflow-visible"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {rating.map((review: Review, index: number) => (
                <div key={index} className="flex-shrink-0 w-72 lg:w-auto">
                  <ReviewCard
                    name={review?.userId?.fullName ?? ""}
                    location={review?.flagshipId?.destination ?? ""}
                    rating={review?.rating ?? 0}
                    eventName={review?.flagshipId?.tripName ?? ""}
                    comment={review?.review ?? ""}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Starting Prices */}
        <div className="mt-6 lg:mt-10">
          <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">Starting prices</h3>
          <div className="overflow-hidden lg:grid lg:grid-cols-2 lg:gap-3">
            {flagship.locations &&
              flagship.locations.map(
                (
                  location: { name: string; price: string; enabled: boolean },
                  index: number
                ) =>
                  location.enabled && (
                    <div
                      key={index}
                      className="bg-brand-error-light px-4 py-3 lg:px-6 lg:py-4 flex justify-between mb-[3px] lg:mb-0 lg:rounded-lg"
                    >
                      <span className="font-medium lg:text-lg">From {location.name}</span>
                      <span className="font-medium lg:text-lg">
                        {formatLocationPrice(location.price)}
                      </span>
                    </div>
                  )
              )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-6 lg:mt-10">
          {faq.length > 0 && (
            <>
              <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                {faq.map((faq: FaqItem, index: number) => (
                  <div key={index} className="border-b border-gray-200 lg:border lg:rounded-lg lg:border-gray-200">
                    <button
                      className="w-full py-4 px-2 lg:px-4 flex justify-between items-center text-left"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="font-medium lg:text-lg">{faq.question}</span>
                      <HiChevronDown
                        className={`w-5 h-5 transition-transform ${ expandedFAQ === index ? "transform rotate-180" : "" }`}
                      />
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-2 lg:px-4 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Ask a Question */}
          <div className="mt-6 lg:mt-10 lg:max-w-2xl">
            <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-4">
              Still have a question? Ask away
            </h3>
            {showQueryInput && (
              <div className="my-3">
                <div className="flex">
                  <input
                    type="text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Enter your question here..."
                    className="flex-grow p-2 lg:p-3 lg:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => handleSubmitQuery()}
              className={`w-full py-3 lg:py-4 border-2 text-black font-semibold rounded-lg transition-colors ${queryText.length > 0 ? "bg-brand-primary text-heading hover:bg-brand-primary-hover" : "border-black hover:bg-gray-100"}`}
            >
              {queryText.length > 0 ? "Send Trip Query" : "Trip Query Button"}
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center">
          <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl p-6 space-y-5 relative">
            <button
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-heading" />
            </button>

            {/* Step: Question */}
            {onboardingStep === "question" && (
              <>
                <h3 className="text-xl font-bold text-heading pr-8">
                  Have you ever registered for a 3Musafir flagship before?
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setOnboardingStep("email")}
                    className="btn-primary w-full"
                  >
                    Yes, I have
                  </button>
                  <button
                    onClick={() => setOnboardingStep("basicInfo")}
                    className="btn-outline w-full"
                  >
                    No, I&apos;m new
                  </button>
                </div>
              </>
            )}

            {/* Step: Email */}
            {onboardingStep === "email" && (
              <>
                <div>
                  <h3 className="text-xl font-bold text-heading pr-8">
                    Hey hey, Musafir!
                  </h3>
                  <p className="text-text text-sm mt-1">
                    Enter your email to claim your Musafir ID
                  </p>
                </div>

                <form onSubmit={handleEmailCheck} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="onboarding-email" className="block text-sm font-medium text-heading">
                      Email
                    </label>
                    <input
                      type="email"
                      id="onboarding-email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full input-field"
                      required
                      disabled={emailLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="btn-primary w-full flex items-center justify-center"
                    aria-busy={emailLoading || undefined}
                  >
                    {emailLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Checking...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-text">OR</span>
                  </div>
                </div>

                <button
                  onClick={handleOnboardingGoogleSignIn}
                  disabled={emailLoading}
                  className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-3"
                  aria-busy={emailLoading || undefined}
                >
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                    <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                    <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                    <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => setOnboardingStep("question")}
                  className="btn-ghost w-full text-sm"
                >
                  Back
                </button>
              </>
            )}

            {/* Step: Password */}
            {onboardingStep === "password" && (
              <>
                <div>
                  <h3 className="text-xl font-bold text-heading pr-8">
                    Check your email
                  </h3>
                  <p className="text-text text-sm mt-2">
                    We&apos;ve sent a temporary password to <strong className="text-heading">{emailInput}</strong>.
                    Enter it below to continue.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-heading">
                      Enter code
                    </label>
                    <div className="flex justify-between gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          disabled={passwordLoading}
                          autoComplete={idx === 0 ? "one-time-code" : "off"}
                          className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (!val && !digit) return;
                            const next = [...otpDigits];
                            // Handle paste of full OTP
                            if (val.length > 1) {
                              const chars = val.slice(0, 6).split("");
                              chars.forEach((c, i) => { if (idx + i < 6) next[idx + i] = c; });
                              setOtpDigits(next);
                              const focusIdx = Math.min(idx + chars.length, 5);
                              otpRefs.current[focusIdx]?.focus();
                              return;
                            }
                            next[idx] = val;
                            setOtpDigits(next);
                            if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
                              const next = [...otpDigits];
                              next[idx - 1] = "";
                              setOtpDigits(next);
                              otpRefs.current[idx - 1]?.focus();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                            if (!pasted) return;
                            const next = [...otpDigits];
                            pasted.split("").forEach((c, i) => { if (i < 6) next[i] = c; });
                            setOtpDigits(next);
                            const focusIdx = Math.min(pasted.length, 5);
                            otpRefs.current[focusIdx]?.focus();
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading || otpDigits.join("").length !== 6}
                    className="btn-primary w-full flex items-center justify-center"
                    aria-busy={passwordLoading || undefined}
                  >
                    {passwordLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <button
                  onClick={handleResendPassword}
                  disabled={emailLoading}
                  className="btn-ghost w-full text-sm"
                >
                  {emailLoading ? "Sending..." : "Didn\u0027t receive it? Resend password"}
                </button>
              </>
            )}

            {/* Step: Basic Info (new user inline signup) */}
            {onboardingStep === "basicInfo" && (
              <form onSubmit={handleBasicInfoSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-heading pr-8">
                    You seem to be new here&hellip; let&apos;s get to know you first!
                  </h3>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="basicEmail" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="basicEmail"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={emailPreFilled}
                    className={`w-full input-field ${emailPreFilled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Gender</label>
                  <div className="flex gap-3">
                    {["male", "female", "other"].map((value) => (
                      <label
                        key={value}
                        className={`px-4 py-2 rounded-full cursor-pointer text-sm ${
                          basicGender === value
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="basicGender"
                          value={value}
                          checked={basicGender === value}
                          onChange={(e) => setBasicGender(e.target.value)}
                          className="sr-only"
                        />
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="basicFullName" className="block text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="basicFullName"
                      required
                      value={basicFullName}
                      onChange={(e) => setBasicFullName(e.target.value)}
                      className="w-full input-field"
                      placeholder="Enter your full name"
                    />
                    {basicFullName && (
                      <button
                        type="button"
                        onClick={() => setBasicFullName("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="basicPhone" className="block text-sm font-medium">
                    Phone
                  </label>
                  <div className="flex gap-2 items-start">
                    <select className="w-[100px] h-11 input-field">
                      <option value="+92">+92</option>
                    </select>
                    <div className="flex-1">
                      <input
                        type="tel"
                        id="basicPhone"
                        value={basicPhone}
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        onChange={(e) => {
                          const value = sanitizePhoneInput(e.target.value);
                          setBasicPhone(value);
                          if (value.length === 10) setBasicPhoneError(null);
                        }}
                        placeholder="3XXXXXXXXX"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          basicPhoneError
                            ? "border-brand-error focus:ring-red-500"
                            : "border-gray-300 focus:ring-gray-400"
                        }`}
                      />
                      {basicPhoneError && (
                        <p className="text-xs text-brand-error mt-1">{basicPhoneError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Same Whatsapp checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="basicSameWhatsapp"
                    checked={basicSameWhatsapp}
                    onChange={() => setBasicSameWhatsapp(!basicSameWhatsapp)}
                    className="mr-2 accent-black"
                  />
                  <label htmlFor="basicSameWhatsapp" className="text-sm font-medium">
                    I use the same number for my Whatsapp
                  </label>
                </div>

                {/* Whatsapp */}
                <div className="space-y-2">
                  <label htmlFor="basicWhatsapp" className="block text-sm font-medium">
                    Whatsapp
                  </label>
                  <div className="flex gap-2 items-start">
                    <select
                      className={`w-[100px] h-11 input-field ${
                        basicSameWhatsapp ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                      }`}
                      disabled={basicSameWhatsapp}
                    >
                      <option value="+92">+92</option>
                    </select>
                    <div className="flex-1">
                      <input
                        type="tel"
                        id="basicWhatsapp"
                        value={basicWhatsapp}
                        required={!basicSameWhatsapp}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        onChange={(e) => {
                          const value = sanitizePhoneInput(e.target.value);
                          setBasicWhatsapp(value);
                          if (value.length === 10) setBasicWhatsappError(null);
                        }}
                        placeholder="3XXXXXXXXX"
                        disabled={basicSameWhatsapp}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          basicSameWhatsapp
                            ? "bg-gray-100 cursor-not-allowed"
                            : basicWhatsappError
                            ? "border-brand-error focus:ring-red-500"
                            : "border-gray-300 focus:ring-gray-400"
                        }`}
                      />
                      {!basicSameWhatsapp && basicWhatsappError && (
                        <p className="text-xs text-brand-error mt-1">{basicWhatsappError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn-primary w-full">
                  Flagship Preferences
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && flagship?.detailedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="text-md font-semibold">Detailed Travel Plan</h3>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={flagship.detailedPlan}
                className="w-full h-full"
                title="Detailed Travel Plan"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation />
    </div>
    </>
  );
}
