"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Phone, X } from "lucide-react";
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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject" | "didntPick" | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openModal = (type: "approve" | "reject" | "didntPick") => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setComment("");
    setModalType(null);
  };

  const handleSubmit = async () => {
    if (!slug) return;

    setSubmitting(true);
    try {
      if (modalType === "approve") {
        await FlagshipService.approveRegistration(slug as string, comment);
        alert("Registration Approved Successfully");
        await fetchUsers();
      } else if (modalType === "reject") {
        await FlagshipService.rejectRegistration(slug as string, comment);
        alert("Registration Rejected");
        await fetchUsers();
      } else if (modalType === "didntPick") {
        await FlagshipService.didntPickRegistration(slug as string, comment);
        alert("Marked as Didn't Pick");
        await fetchUsers();
      }
      closeModal();
    } catch (error) {
      console.error(`Error ${modalType}ing registration:`, error);
      toast.error(`Failed to ${modalType} registration`);
    } finally {
      setSubmitting(false);
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

  return (
    <div className="max-w-md mx-auto pb-8 bg-white">
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500"
              disabled={submitting}
            >
              <X />
            </button>
            <h2 className="text-lg font-bold mb-4 capitalize">
              {modalType === 'didntPick' ? "Mark as Didn't Pick" : `${modalType} User`}
            </h2>
            <textarea
              placeholder="Optional Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 resize-none"
              rows={4}
              disabled={submitting}
            />
            <button
              onClick={handleSubmit}
              className={`w-full text-white py-2 rounded-lg ${modalType === "approve"
                ? "bg-orange-500 hover:bg-orange-600"
                : modalType === 'didntPick'
                  ? "bg-gray-700 hover:bg-gray-800"
                  : "bg-red-800 hover:bg-red-900"
                } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={submitting}
            >
              {submitting
                ? (modalType === "approve" ? "Approving..." : modalType === 'didntPick' ? "Marking..." : "Rejecting...")
                : (modalType === "approve" ? "Confirm Approval" : modalType === 'didntPick' ? "Confirm Mark as Didn't Pick" : "Confirm Rejection")}
            </button>
          </div>
        </div>
      )}

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
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
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
                <span className="font-medium">Dec 10, 2024</span>
              </div>

              {(registeredUser?.status === "pending" || registeredUser?.status === "didntPick") && (
                <>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('didntPick');
                      }}
                      className="border border-gray-300 rounded-lg py-3 px-4 font-medium"
                    >
                      Didn&apos;t Pick
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("reject");
                      }}
                      className="bg-red-800 text-white rounded-lg py-3 px-4 font-medium"
                    >
                      Reject
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("approve");
                    }}
                    className="w-full bg-orange-500 text-white rounded-lg py-3 px-4 font-medium"
                  >
                    Approve
                  </button>
                </>
              )}

              {registeredUser?.status === "accepted" && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium">
                  Registration Accepted
                </div>
              )}

              {registeredUser?.status === "rejected" && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-center font-medium">
                  Registration Rejected
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
