"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FlagshipService } from "@/services/flagshipService";
import { useRouter } from "next/router";
import { IRegistration, IUser } from "@/interfaces/trip/trip";
import { differenceInYears, parseISO } from "date-fns";
import { toast } from "sonner";

export default function UserDetails() {
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    info: false,
    verification: true,
  });

  const [registeredUser, setRegisteredUser] = useState<IRegistration>();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { slug } = router.query;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "new":
        return "New";
      case "onboarding":
        return "Onboarding";
      case "payment":
        return "Payment";
      case "waitlisted":
        return "Waitlisted";
      case "confirmed":
        return "Confirmed";
      default:
        return status || "Unknown";
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await FlagshipService.getRegistrationByID(
        slug as string
      );
      setRegisteredUser(response);
    } catch (error) {
      console.error("Failed to fetch registered users:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchUsers();
    }
  }, [slug]);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  const registrationStatus = registeredUser?.status;
  const statusLabel = getStatusLabel(registrationStatus);
  const userId =
    typeof registeredUser?.user === "string"
      ? registeredUser?.user
      : (registeredUser?.user as IUser)?._id;
  const paymentObject =
    typeof registeredUser?.paymentId === "string"
      ? null
      : (registeredUser?.paymentId as any);
  const paymentId =
    typeof registeredUser?.paymentId === "string"
      ? registeredUser?.paymentId
      : paymentObject?._id;
  const paymentStatus = paymentObject?.status;
  const verification = (registeredUser?.user as IUser)?.verification;
  const verificationDate =
    verification?.verificationDate || (verification as any)?.VerificationDate;
  const formattedVerificationDate = verificationDate
    ? new Date(verificationDate).toLocaleDateString()
    : "N/A";

  return (
    <div className="max-w-md mx-auto pb-8 bg-white">

      <header className="sticky top-0 bg-white z-10">
        <div className="p-4 border-b flex items-center">
          <Link
            href={`/admin/trip/${registeredUser?.flagship}`}
            className="mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold flex-1 text-center">User Details</h1>
        </div>
      </header>

      <div className="p-4 flex items-center">
        <div className="h-16 w-16 mr-4 overflow-hidden rounded-full bg-gray-200">
          <img
            src={
              (registeredUser?.user as IUser).profileImg ||
              "/anonymous-user.png"
            }
            alt={
              (registeredUser?.user as IUser).profileImg
                ? (registeredUser?.user as IUser).fullName
                : "Anonymous User"
            }
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {(registeredUser?.user as IUser).fullName}
          </h2>
          <p className="text-sm text-gray-500">
            Joining From: {(registeredUser?.user as IUser).city}
          </p>
        </div>
        <div className="relative">
          <Image
            src="/blue-shield.png"
            alt="Verified Shield"
            width={40}
            height={40}
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="px-4 py-2">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <button
            onClick={() => toggleSection("contact")}
            className="flex justify-between items-center w-full"
          >
            <h3 className="font-bold">Contact Information</h3>
            {expandedSections.contact ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {expandedSections.contact && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">
                  {(registeredUser?.user as IUser).email}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">
                  {(registeredUser?.user as IUser).phone}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Social Link</span>
                <span className="font-medium">
                  {(registeredUser?.user as IUser).socialLink}
                </span>
              </div>

              <div className="flex gap-4 mt-4">
                {/* Use an anchor with tel: so mobile devices open the dialer. Preserve button styles. */}
                {(() => {
                  const phone = ((registeredUser?.user as IUser).phone || "").toString();
                  // sanitize phone for tel: (remove spaces, parentheses)
                  const sanitized = phone.replace(/[^+0-9]/g, '');
                  const hasPhone = sanitized.length > 0;
                  return (
                    <a
                      href={hasPhone ? `tel:${sanitized}` : undefined}
                      onClick={(e) => {
                        if (!hasPhone) {
                          e.preventDefault();
                        }
                      }}
                      className={`flex-1 border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${!hasPhone ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      aria-disabled={!hasPhone}
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                        <Phone className="h-3 w-3 text-white" />
                      </div>
                      <span>Cell Phone</span>
                    </a>
                  );
                })()}

                {(() => {
                  const phoneRaw = ((registeredUser?.user as IUser).phone || "").toString();
                  // wa.me expects only digits with country code, no + or spaces
                  const sanitizedWa = phoneRaw.replace(/[^0-9]/g, '');
                  const hasWa = sanitizedWa.length > 0;
                  const defaultMsg = '';
                  const waHref = hasWa
                    ? `https://wa.me/${sanitizedWa}?text=${encodeURIComponent(defaultMsg)}`
                    : undefined;

                  return (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!hasWa) e.preventDefault();
                      }}
                      className={`flex-1 bg-black text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${!hasWa ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      aria-disabled={!hasWa}
                    >
                      <Image
                        src="/whatsapp.png"
                        alt="WhatsApp"
                        width={20}
                        height={20}
                      />
                      <span>WhatsApp</span>
                    </a>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info/Details Section */}
      <div className="px-4 py-2">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <button
            className="flex justify-between items-center w-full"
            onClick={() => toggleSection("info")}
          >
            <h3 className="font-bold">Info/ Details</h3>
            {expandedSections.info ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {expandedSections.info && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">
                  {(registeredUser?.user as IUser).fullName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium">
                  {(registeredUser?.user as IUser).gender}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Age</span>
                <span className="font-medium">
                  {" "}
                  {(registeredUser?.user as IUser).dateOfBirth
                    ? differenceInYears(
                      new Date(),
                      parseISO((registeredUser?.user as IUser).dateOfBirth)
                    )
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium">
                  {(registeredUser?.user as IUser).university}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Methods Section */}
      <div className="px-4 py-2">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <button
            className="flex justify-between items-center w-full"
            onClick={() => toggleSection("verification")}
          >
            <h3 className="font-bold">Verification Methods</h3>
            {expandedSections.verification ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {expandedSections.verification && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Verification Choice</span>
                <span className="font-medium">
                  {(() => {
                    const user = registeredUser?.user as IUser;
                    if (!user || !user.verification) return "Not specified";

                    const verification = user.verification;
                    if (verification.videoLink) return "Video";
                    if (
                      verification.referralIDs &&
                      verification.referralIDs.length > 0
                    ) {
                      return `${verification.referralIDs.length} Referral${verification.referralIDs.length > 1 ? "s" : ""
                        }`;
                    }
                    if (verification.RequestCall) return "Request Call";
                    return "Not specified";
                  })()}
                </span>
              </div>

              {(registeredUser?.user as IUser)?.verification?.videoLink && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Video Link</span>
                  <a
                    href={
                      (registeredUser?.user as IUser).verification.videoLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View Video
                  </a>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Verification Date</span>
                <span className="font-medium">{formattedVerificationDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Registration Status</span>
                <span className="font-medium">{statusLabel}</span>
              </div>

              {paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="font-medium capitalize">{paymentStatus}</span>
                </div>
              )}

              <div className="mt-4 space-y-3">
                {registrationStatus === "onboarding" && userId && (
                  <Link
                    href={`/admin/user/${userId}`}
                    className="w-full block text-center bg-brand-primary text-white rounded-lg py-3 px-4 font-medium"
                  >
                    Review Verification
                  </Link>
                )}

                {registrationStatus === "payment" && paymentId && (
                  <Link
                    href={`/admin/payment/${paymentId}`}
                    className="w-full block text-center bg-blue-700 text-white rounded-lg py-3 px-4 font-medium"
                  >
                    Review Payment
                  </Link>
                )}

                {registrationStatus === "payment" && !paymentId && (
                  <p className="text-sm text-gray-600">Awaiting payment submission.</p>
                )}

                {registrationStatus === "waitlisted" && (
                  <p className="text-sm text-gray-600">User is on the waitlist.</p>
                )}

                {registrationStatus === "confirmed" && (
                  <p className="text-sm text-gray-600">Seat confirmed.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
