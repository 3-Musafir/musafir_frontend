import useCustomHook from '@/hooks/useFlagshipHandler';
import useRegistrationHook, { RegistrationCreationResponse } from '@/hooks/useRegistrationHandler';
import { BaseRegistration } from '@/interfaces/registration';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { resolveImageSrc } from '@/lib/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { showAlert } from '../alert';
import api from '@/lib/api';
import apiEndpoints from '@/config/apiEndpoints';
import { getErrorCode, mapErrorToUserMessage } from '@/utils/errorMessages';

function FlagshipRequirements() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [tripType, setTripType] = useState<'solo' | 'group' | 'partner'>('solo')
  const [city, setCity] = useState('')
  const [tiers, setTiers] = useState('');
  const [sleepPreference, setSleepPreference] = useState<'mattress' | 'bed'>('mattress');
  const [roomSharing, setRoomSharing] = useState<'default' | 'twin'>('default');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupMemberInput, setGroupMemberInput] = useState('');
  const [groupLinkStatus, setGroupLinkStatus] = useState<any>(null);
  const [tripTypeLocked, setTripTypeLocked] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [linkConflictEmails, setLinkConflictEmails] = useState<string[]>([]);
  const [groupDiscountInfo, setGroupDiscountInfo] = useState<RegistrationCreationResponse['groupDiscount'] | null>(null);
  const [expectations, setExpectations] = useState('')
  const action = useCustomHook();
  const [flagship, setFlagship] = useState<any>();
  const [price, setPrice] = useState(0);
  const [selectedLocationPrice, setSelectedLocationPrice] = useState(0);
  const [selectedTierPrice, setSelectedTierPrice] = useState(0);
  const [fromDetailsPage, setFromDetailsPage] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoomSharingPrice, setSelectedRoomSharingPrice] = useState(0);
  const registrationAction = useRegistrationHook();

  const parseAmount = (value: unknown) => {
    if (value === undefined || value === null) return 0;
    const numeric = value.toString().replace(/[^0-9.-]/g, "");
    const parsed = Number(numeric);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatPKR = (value: number) => {
    const amount = Number.isFinite(value) ? value : 0;
    return `PKR ${amount.toLocaleString('en-PK')}`;
  };

  const getPKDateISO = (value: Date | string) => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(date);
  };

  const formatPKDate = (value: Date | string) => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-PK', {
      timeZone: 'Asia/Karachi',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getEarlyBirdMeta = (data?: any) => {
    const basePrice = parseAmount(data?.basePrice);
    const earlyBirdPrice = parseAmount(data?.earlyBirdPrice);
    const deadlineValue = data?.earlyBirdDeadline;
    const todayPK = getPKDateISO(new Date());
    const deadlinePK = deadlineValue ? getPKDateISO(deadlineValue) : '';
    const hasValidDeadline = Boolean(deadlinePK);
    const isActive =
      basePrice > 0 &&
      earlyBirdPrice > 0 &&
      earlyBirdPrice < basePrice &&
      hasValidDeadline &&
      todayPK <= deadlinePK;
    const effectiveBasePrice = isActive ? earlyBirdPrice : basePrice;
    const savings = isActive ? Math.max(0, basePrice - earlyBirdPrice) : 0;
    const deadlineLabel = isActive ? formatPKDate(deadlineValue) : '';

    return {
      basePrice,
      earlyBirdPrice,
      isActive,
      effectiveBasePrice,
      savings,
      deadlineLabel,
    };
  };

  const resolveBasePrice = (data?: any) => {
    return getEarlyBirdMeta(data).effectiveBasePrice;
  };

  const getTwinSharingPrice = (data?: any) => {
    const preference = data?.roomSharingPreference?.find(
      (pref: any) => pref.name === "Twin Sharing"
    );
    return Number(preference?.price) || 0;
  };

  const earlyBirdMeta = getEarlyBirdMeta(flagship);

  const recalculateTotalPrice = () => {
    const basePrice = resolveBasePrice(flagship);
    const locationPrice = selectedLocationPrice;
    const tierPrice = selectedTierPrice;
    const isCoupleTrip = tripType === "partner";
    const twinSharingPrice = isCoupleTrip ? getTwinSharingPrice(flagship) : 0;
    const roomSharingPrice = isCoupleTrip && roomSharing === "twin" ? 0 : selectedRoomSharingPrice;
    const mattressPrice = sleepPreference === 'bed' ? Number(flagship?.mattressTiers?.[0]?.price || 0) : 0;

    const totalPrice = basePrice + locationPrice + tierPrice + roomSharingPrice + mattressPrice + twinSharingPrice;

    return totalPrice;
  };

  const normalizeEmailList = (value: string) => {
    return value
      .split(/[\s,;]+/)
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
  };

  const coerceEmailList = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.flatMap((entry) =>
        typeof entry === 'string' ? normalizeEmailList(entry) : []
      );
    }
    if (typeof value === 'string') {
      return normalizeEmailList(value);
    }
    return [];
  };

  const addGroupMembers = (value: string) => {
    const next = normalizeEmailList(value);
    if (!next.length) return;
    setGroupMembers((prev) => {
      const seen = new Set(prev.map((email) => email.toLowerCase()));
      const merged = [...prev];
      next.forEach((email) => {
        const key = email.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(email);
        }
      });
      return merged;
    });
  };

  const removeGroupMember = (email: string) => {
    setGroupMembers((prev) =>
      prev.filter((entry) => entry.toLowerCase() !== email.toLowerCase())
    );
  };

  const fetchCurrentUser = async () => {
    const res = await api.get(apiEndpoints.USER.GET_ME);
    return (res as any)?.data?.data ?? (res as any)?.data;
  };

  const buildReturnTo = () => {
    if (typeof window === 'undefined') {
      return '/flagship/flagship-requirement';
    }
    return `${window.location.pathname}${window.location.search}`;
  };

  const buildGroupMembersPayload = () => {
    if (tripType === 'partner') {
      return normalizeEmailList(partnerEmail).slice(0, 1);
    }
    if (tripType === 'group') {
      const merged = [
        ...groupMembers,
        ...normalizeEmailList(groupMemberInput),
      ];
      return Array.from(new Set(merged));
    }
    return [];
  };

  const getFlagship = async (flagshipId: any) => {
    const response = await action.getFlagship(flagshipId);
    const basePrice = resolveBasePrice(response);

    setFlagship(response);

    if (!city && response.locations && response.locations.length > 0) {
      const firstEnabledLocation = response.locations.find((loc: any) => loc.enabled);
      if (firstEnabledLocation) {
        console.log('Pre-selecting location:', firstEnabledLocation.name, 'Price:', firstEnabledLocation.price);
        setCity(firstEnabledLocation.name);
        setSelectedLocationPrice(Number(firstEnabledLocation.price) || 0);

        const locationPrice = Number(firstEnabledLocation.price) || 0;
        const totalPrice = basePrice + locationPrice;
        setPrice(totalPrice);
      }
    } else {
      setPrice(basePrice);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const flagshipId = searchParams?.get("id");
      const fromDetailsPage = searchParams?.get("fromDetailsPage") === "true";
      setFromDetailsPage(fromDetailsPage);

      if (flagshipId) {
        await getFlagship(flagshipId);
        localStorage.setItem("flagshipId", JSON.stringify(flagshipId));
        if (isAuthenticated) {
          const pendingInvite = await registrationAction.getPendingGroupInvite(flagshipId);
          if (pendingInvite) {
            setTripType("group");
            setTripTypeLocked(true);
            setGroupLinkStatus(pendingInvite);
            const inviteEmails =
              (pendingInvite.linkedContacts || []).map((contact: any) => contact.email) ||
              pendingInvite.groupMembers ||
              [];
            setGroupMembers(inviteEmails);
            setGroupMemberInput("");
          }
        }
      } else {
        const flagshipId = JSON.parse(localStorage.getItem("flagshipId") || "{}");
        await getFlagship(flagshipId);
      }
      const registration = JSON.parse(localStorage.getItem("registration") || "{}");
      if (registration && Object.keys(registration).length > 0) {
        setCity(registration.joiningFromCity);
        setTiers(registration.tier);
        setSleepPreference(registration.bedPreference);
        setRoomSharing(registration.roomSharing);
        const storedGroupMembers = coerceEmailList(registration.groupMembers);
        if (!isTripTypeLocked) {
          setTripType(registration.tripType);
          setGroupMembers(storedGroupMembers);
        }
        if (registration.tripType === 'partner') {
          setPartnerEmail(storedGroupMembers[0] || '');
        } else {
          setPartnerEmail('');
        }
        setGroupMemberInput('');
        setExpectations(registration.expectations);

        if (registration.joiningFromCity && flagship?.locations) {
          const locationPrice = Number(flagship.locations.find((loc: any) => loc.name === registration.joiningFromCity)?.price) || 0;
          setSelectedLocationPrice(locationPrice);
        }

        if (registration.tier && flagship?.tiers) {
          const tierPrice = Number(flagship.tiers.find((tier: any) => tier.name === registration.tier)?.price) || 0;
          setSelectedTierPrice(tierPrice);
        }

        if (registration.roomSharing && flagship?.roomSharingPreference) {
          const roomSharingPrice = Number(flagship.roomSharingPreference.find((pref: any) =>
            (pref.name === "Twin Sharing" ? "twin" : "default") === registration.roomSharing
          )?.price) || 0;
          setSelectedRoomSharingPrice(roomSharingPrice);
        }

        if (registration.price && Number(registration.price) > 0) {
          setPrice(Number(registration.price));
        } else {
          const basePrice = resolveBasePrice(flagship);
          const locationPrice = registration.joiningFromCity ?
            Number(flagship?.locations?.find((loc: any) => loc.name === registration.joiningFromCity)?.price) || 0 : 0;
          setPrice(basePrice + locationPrice);
        }
      }
    };

    fetchData();
  }, [searchParams]);

  const hasGroupLinks =
    groupMembers.length > 0 ||
    (Array.isArray(groupLinkStatus?.linkedContacts) &&
      groupLinkStatus.linkedContacts.length > 0) ||
    (Array.isArray(groupLinkStatus?.groupMembers) &&
      groupLinkStatus.groupMembers.length > 0);
  const isTripTypeLocked = tripTypeLocked || hasGroupLinks;

  useEffect(() => {
    setLinkConflictEmails([]);
    setGroupDiscountInfo(null);
  }, [tripType]);

  useEffect(() => {
    if (flagship && !tiers) {
      if (flagship.tiers && flagship.tiers.length > 0) {
        const firstTier = flagship.tiers[0];
        setTiers(firstTier.name);
        setSelectedTierPrice(Number(firstTier.price) || 0);
      } else {
        setTiers('Standard');
        setSelectedTierPrice(0);
      }
    }
  }, [flagship, tiers]);

  useEffect(() => {
    if (flagship) {
      const newPrice = recalculateTotalPrice();
      setPrice(newPrice);
    }
  }, [selectedLocationPrice, selectedTierPrice, selectedRoomSharingPrice, roomSharing, sleepPreference, flagship, tripType]);

  useEffect(() => {
    if (tripType === "partner") {
      setRoomSharing("twin");
      setSelectedRoomSharingPrice(0);
      return;
    }
  }, [tripType, roomSharing]);

  useEffect(() => {
    if (flagship && city && !selectedLocationPrice) {
      const locationPrice = Number(flagship.locations?.find((loc: any) => loc.name === city)?.price) || 0;
      if (locationPrice > 0) {
        setSelectedLocationPrice(locationPrice);
      }
    }
  }, [flagship, city, selectedLocationPrice]);

  const handleExpectationsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    if (text?.length <= 100) {
      setExpectations(text);
    }
  };

  const getGroupDiscountFeedback = (
    info: NonNullable<RegistrationCreationResponse['groupDiscount']>
  ) => {
    switch (info.status) {
      case 'applied':
        return {
          message: `Group discount applied: PKR ${info.perMember} off each (${info.groupSize} members).`,
          type: 'success' as const,
        };
      case 'not_eligible':
        return {
          message: `Group discount unlocks at 4 members. Current group size: ${info.groupSize}.`,
          type: 'error' as const,
        };
      case 'budget_exhausted':
        return {
          message: 'Your group qualifies, but the group discount budget is exhausted for this trip.',
          type: 'error' as const,
        };
      case 'disabled':
      default:
        return {
          message: 'Group discount is not enabled for this trip.',
          type: 'error' as const,
        };
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (fromDetailsPage && !policiesAccepted) {
      showAlert('Please confirm you have read the policies before continuing.', 'error');
      return;
    }
    if (flagship._id) {
      const resolvedGroupMembers = buildGroupMembersPayload();
      const registration: BaseRegistration = {
        flagshipId: flagship._id,
        isPaid: false,
        joiningFromCity: city,
        tier: tiers,
        bedPreference: sleepPreference,
        roomSharing,
        tripType,
        groupMembers: resolvedGroupMembers,
        expectations,
        price,
      };
      localStorage.setItem("registration", JSON.stringify(registration));

      // Unauthenticated (signup flow): save to localStorage and continue onboarding
      if (!isAuthenticated) {
        router.push('/signup/additionalinfo');
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        const isFlagshipReady = Boolean((currentUser as any)?.flagshipProfileComplete);
        if (!isFlagshipReady) {
          const returnTo = buildReturnTo();
          showAlert('Please complete your profile (gender, phone, city) to continue registration.', 'error');
          router.push(`/userSettings?forceEdit=true&returnTo=${encodeURIComponent(returnTo)}`);
          return;
        }
      } catch (error) {
        showAlert(mapErrorToUserMessage(error), 'error');
        return;
      }

      try {
        const response = await registrationAction.create(registration) as RegistrationCreationResponse;
        const registrationId = response.registrationId;
        localStorage.setItem("registrationId", JSON.stringify(registrationId));
        const conflictEmails = response?.linkConflicts?.map((conflict) => conflict.email) || [];
        if (conflictEmails.length) {
          setLinkConflictEmails(conflictEmails);
          showAlert(`Some members could not be linked: ${conflictEmails.join(', ')}`, 'error');
        }
        const feedbackPayload = {
          linkConflicts: response?.linkConflicts || [],
          groupDiscount: response?.groupDiscount || null,
        };
        if ((feedbackPayload.linkConflicts || []).length || feedbackPayload.groupDiscount) {
          localStorage.setItem("registrationFeedback", JSON.stringify(feedbackPayload));
        } else {
          localStorage.removeItem("registrationFeedback");
        }
        if (response?.alreadyRegistered) {
          const alertMessage = response.isPaid
            ? "You already have a confirmed registration for this flagship."
            : "You already registered. Continue on the payment page to secure your seat.";
          showAlert(alertMessage, response.isPaid ? 'success' : 'success');
        }
        localStorage.removeItem("registration");
        router.push(`/flagship/seats`);
      } catch (error) {
        const code = getErrorCode(error);
        if (code === 'PROFILE_INCOMPLETE') {
          const returnTo = buildReturnTo();
          showAlert('Please complete your profile (gender, phone, city) to continue registration.', 'error');
          router.push(`/userSettings?forceEdit=true&returnTo=${encodeURIComponent(returnTo)}`);
          return;
        }
        if (code === 'already_in_group_for_flagship') {
          showAlert(
            'You already belong to a group for this trip. Leave that group before joining another.',
            'error',
          );
          return;
        }
        if (code === 'trip_type_locked') {
          showAlert('Trip type is locked after invites are sent.', 'error');
          return;
        }
        showAlert(mapErrorToUserMessage(error), 'error');
      }
    } else {
      showAlert("Flagship not found.", "error");
    }
  };

  const fallbackImage = "/flowerFields.jpg";
  const imageUrls = (flagship?.images && flagship?.images?.length > 0
    ? flagship?.images
    : [fallbackImage]).map((image: string) => resolveImageSrc(image, fallbackImage));

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls?.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls?.length - 1 : prev - 1));
  };

  const isCoupleTrip = tripType === "partner";
  const twinSharingPrice = getTwinSharingPrice(flagship);
  const groupDiscountFeedback = groupDiscountInfo
    ? getGroupDiscountFeedback(groupDiscountInfo)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-lg lg:max-w-3xl mx-auto shadow-sm p-3 lg:p-8 lg:my-6 lg:rounded-xl">
        {/* Header */}
        <div className="">
          {/* Progress Steps */}
          {!fromDetailsPage && <div className="p-4 border-b">
            <div className="flex items-center mb-6">
              <button className="p-2 hover:bg-gray-100 rounded-full mr-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-center flex-grow">Onboarding</h1>
            </div>


            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-3 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10" onClick={() => router.push('/signup/registrationform')}>
                <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                  1
                </div>
                <span className="mt-2 text-sm font-medium">Basic</span>
              </div>

              {/* Line (centered absolutely) */}
              <div className="absolute left-6 right-6 top-1/4 transform -translate-y-1/2 z-0">
                <div className="w-full h-0.5 bg-[#F3F3F3]" />
              </div>

              {/* Step 2 (conditionally rendered) */}
              <>
                <div className="flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm">
                    2
                  </div>
                  <span className="mt-2 text-sm text-gray-600">Flagship</span>
                </div>
              </>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10" onClick={() => router.push('/signup/additionalinfo')}>
                <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                  3
                </div>
                <span className="mt-2 text-sm text-gray-600">Background</span>
              </div>
            </div>
          </div>}
        </div>

        <div className="relative h-52 lg:h-72 w-full lg:rounded-xl lg:overflow-hidden">
          <Image
            src={imageUrls[currentImageIndex]}
            alt={flagship?.tripName || 'Event image'}
            fill
            className="object-cover"
          />

          {imageUrls?.length > 1 && (
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
                    className={`h-1.5 rounded-full transition-all ${currentImageIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60' }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Form Content */}
        <div className="p-4 lg:p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-1">
            {flagship?.tripName || ""}
          </h2>
          {flagship?.startDate && flagship?.endDate && (
            <p className="text-gray-600 mb-6">
              {new Date(flagship.startDate).toLocaleDateString("en-US", {
                day: "numeric",
              })}{" "}
              -{" "}
              {new Date(flagship.endDate).toLocaleDateString("en-US", {
                day: "numeric",
              })}{" "}
              {new Date(flagship.endDate).toLocaleDateString("en-US", {
                month: "long",
              })}{" "}
              @{flagship.destination}
            </p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* City */}
            <div className="space-y-4">
              <label htmlFor="city" className="block text-sm font-medium">
                Departure City
              </label>
              {flagship?.locations?.map(
                (
                  location: { enabled: boolean; name: string; price: string },
                  index: number
                ) => {
                  const basePrice = resolveBasePrice(flagship);
                  const locationAddOn = Number(location.price) || 0;
                  const totalPrice = basePrice + locationAddOn;

                  return location.enabled && (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${ city === location.name ? "bg-brand-primary/10 border-brand-primary-light" : "hover:bg-gray-50 border-gray-200" }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="city"
                          value={location.name}
                          checked={city === location.name}
                          onChange={() => {
                            setCity(location.name);
                            setSelectedLocationPrice(locationAddOn);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                        <span className={city === location.name ? "font-semibold" : ""}>
                          {location.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${city === location.name ? "text-black" : "text-gray-700"}`}>
                          {formatPKR(totalPrice)}
                        </div>
                      </div>
                    </label>
                  );
                }
              )}
            </div>

            {/* Package/Ticket */}
            <div className="space-y-4">
              <label htmlFor="package" className="block text-sm font-medium">
                Package/Ticket
              </label>
              {flagship?.tiers?.length > 0 ? (
                flagship.tiers.map((tier: { name: string; price: string }, index: number) => {
                  const tierPrice = Number(tier.price) || 0;
                  return (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${ tiers === tier.name ? "bg-brand-primary/10 border-brand-primary-light" : "hover:bg-gray-50 border-gray-200" }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="tier"
                          value={tier.name}
                          checked={tiers === tier.name}
                          onChange={() => {
                            setTiers(tier.name);
                            setSelectedTierPrice(tierPrice);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                        <span className={tiers === tier.name ? "font-semibold" : ""}>{tier.name}</span>
                      </div>
                      <span className={`text-sm ${tiers === tier.name ? "font-bold text-black" : "text-gray-600"}`}>
                        {tierPrice === 0 ? 'Included' : `+ ${formatPKR(tierPrice)}`}
                      </span>
                    </label>
                  );
                })
              ) : (
                <label className="flex items-center justify-between p-3 border rounded-lg bg-brand-primary/10 border-brand-primary-light">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="tier"
                      value="Standard"
                      checked={tiers === "Standard"}
                      onChange={() => {
                        setTiers('Standard');
                        setSelectedTierPrice(0);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                    <span className="font-semibold">Standard</span>
                  </div>
                  <span className="text-sm font-bold">Included</span>
                </label>
              )}
            </div>

            {/* Solo/Group Selection */}
            <div className="space-y-4">
              <label htmlFor="package" className="block text-sm font-medium">
                Who are you joining with
              </label>
              <label
                className={`flex items-center space-x-2 ${tripType == "solo" ? "text-black" : "text-gray-600" }`}
              >
                <input
                  type="radio"
                  name="memberType"
                  value="solo"
                  checked={tripType === "solo"}
                  onChange={() => !isTripTypeLocked && setTripType("solo")}
                  disabled={isTripTypeLocked}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>Solo</span>
              </label>
              <label
                className={`flex items-center space-x-2 ${tripType == "group" ? "text-black" : "text-gray-600" }`}
              >
                <input
                  type="radio"
                  name="memberType"
                  value="group"
                  checked={tripType === "group"}
                  onChange={() => !isTripTypeLocked && setTripType("group")}
                  disabled={isTripTypeLocked}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>Group</span>
              </label>
              <label
                className={`flex items-center space-x-2 ${tripType == "partner" ? "text-black" : "text-gray-600" }`}
              >
                <input
                  type="radio"
                  name="memberType"
                  value="partner"
                  checked={tripType === "partner"}
                  onChange={() => !isTripTypeLocked && setTripType("partner")}
                  disabled={isTripTypeLocked}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>As a couple (twin room)</span>
              </label>
              {isTripTypeLocked && (
                <p className="text-xs text-amber-700">
                  Trip type is locked after invites are sent.
                </p>
              )}
            </div>

            {/* Group Members */}
            {tripType === "group" && (
              <div className="space-y-2">
                <label
                  htmlFor="groupMembers"
                  className="block text-sm font-small text-gray-500"
                >
                  Group member emails
                </label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 p-2">
                  {groupMembers.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {email}
                      {!isTripTypeLocked && (
                        <button
                          type="button"
                          onClick={() => removeGroupMember(email)}
                          className="text-gray-500 hover:text-gray-800"
                          aria-label={`Remove ${email}`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  <input
                    type="text"
                    id="groupMembers"
                    value={groupMemberInput}
                    onChange={(e) => setGroupMemberInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addGroupMembers(groupMemberInput);
                        setGroupMemberInput('');
                      }
                    }}
                    onBlur={() => {
                      if (groupMemberInput.trim()) {
                        addGroupMembers(groupMemberInput);
                        setGroupMemberInput('');
                      }
                    }}
                    onPaste={(e) => {
                      const text = e.clipboardData.getData('text');
                      if (!text) return;
                      e.preventDefault();
                      addGroupMembers(text);
                      setGroupMemberInput('');
                    }}
                    placeholder="Add emails and press Enter"
                    className="min-w-[180px] flex-1 border-0 bg-transparent p-1 text-sm text-gray-700 outline-none"
                    disabled={isTripTypeLocked}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter multiple emails separated by commas or spaces.
                </p>
                {groupLinkStatus && (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                    <p className="font-semibold">Group link status</p>
                    {Array.isArray(groupLinkStatus.linkedContacts) && groupLinkStatus.linkedContacts.length > 0 ? (
                      <div className="mt-1 space-y-1">
                        {groupLinkStatus.linkedContacts.map((contact: any) => (
                          <div key={contact.email} className="flex justify-between">
                            <span>{contact.email}</span>
                            <span className="capitalize">{contact.status}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-gray-500">No linked members yet.</p>
                    )}
                    {!groupLinkStatus.allLinked && (
                      <p className="mt-2 text-amber-700">
                        Link incomplete. All invited members must register to unlock group benefits.
                      </p>
                    )}
                  </div>
                )}
                {linkConflictEmails.length > 0 && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    Some members could not be linked: {linkConflictEmails.join(', ')}.
                  </div>
                )}
                {groupDiscountFeedback && (
                  <div
                    className={`rounded-md border px-3 py-2 text-xs ${
                      groupDiscountFeedback.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-amber-200 bg-amber-50 text-amber-800'
                    }`}
                  >
                    {groupDiscountFeedback.message}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Group discounts unlock at 4 registered members and require all links to be complete.
                </p>
              </div>
            )}

            {/* Couple Field */}
            {tripType === "partner" && (
              <div className="space-y-2">
                <label
                  htmlFor="partnerEmail"
                  className="block text-sm font-small text-gray-500"
                >
                  Partner email
                </label>
                <input
                  type="email"
                  id="partnerEmail"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="partner@email.com"
                  className="w-full input-field"
                />
                {linkConflictEmails.length > 0 && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    This partner could not be linked.
                  </div>
                )}
              </div>
            )}

            {/* Room sharing preference */}
            <div className="space-y-4">
              <label htmlFor="package" className="block text-sm font-medium">
                Room sharing preference
              </label>
              {!isCoupleTrip && (
                <label
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${ roomSharing === "default" ? "bg-brand-primary/10 border-brand-primary-light" : "hover:bg-gray-50 border-gray-200" }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="roomSharing"
                      value="default"
                      checked={roomSharing === "default"}
                      onChange={() => {
                        setRoomSharing('default');
                        setSelectedRoomSharingPrice(0);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                    <span className={roomSharing === "default" ? "font-semibold" : ""}>Default (3-4 sharing)</span>
                  </div>
                  <span className={`text-sm ${roomSharing === "default" ? "font-bold text-black" : "text-gray-600"}`}>
                    Included
                  </span>
                </label>
              )}
              {flagship?.roomSharingPreference
                ?.filter((preference: { name: string }) =>
                  isCoupleTrip ? preference.name === "Twin Sharing" : true
                )
                .map((preference: { name: string; price: string }, index: number) => {
                  const prefPrice = Number(preference.price) || 0;
                  return (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${ roomSharing === (preference.name === "Twin Sharing" ? "twin" : "default") ? "bg-brand-primary/10 border-brand-primary-light" : "hover:bg-gray-50 border-gray-200" }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="roomSharing"
                          value={preference.name}
                          checked={roomSharing === (preference.name === "Twin Sharing" ? "twin" : "default")}
                          onChange={() => {
                            setRoomSharing(preference.name === "Twin Sharing" ? "twin" : "default");
                            setSelectedRoomSharingPrice(prefPrice);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                        <span className={roomSharing === (preference.name === "Twin Sharing" ? "twin" : "default") ? "font-semibold" : ""}>
                          {preference.name}
                        </span>
                      </div>
                      <span className={`text-sm ${roomSharing === (preference.name === "Twin Sharing" ? "twin" : "default") ? "font-bold text-black" : "text-gray-600"}`}>
                        + {formatPKR(prefPrice)}
                      </span>
                    </label>
                  );
                })}
            </div>

            {/* Expectations */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <label
                  htmlFor="expectations"
                  className="block text-sm font-medium"
                >
                  Expectations of the trip (optional)
                </label>
                <span className="text-sm text-gray-500">
                  {expectations?.length}/100
                </span>
              </div>
              <textarea
                id="expectations"
                value={expectations}
                onChange={handleExpectationsChange}
                rows={3}
                placeholder="What are you hoping to experience on this trip?"
                className="w-full input-field resize-none"
              />
            </div>

            {/* Hint */}
            <div className="space-y-2">
              <label
                htmlFor="hint"
                className="block text-sm font-medium text-gray-600"
              >
                Hint: Anything we can do to help
              </label>
            </div>

            {earlyBirdMeta.isActive && (
              <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-2 text-blue-900">Price Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-700">Today&apos;s price</span>
                    <span className="text-base font-semibold text-blue-900">
                      {formatPKR(earlyBirdMeta.effectiveBasePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Regular price</span>
                    <span aria-label="Regular price" className="line-through">
                      {formatPKR(earlyBirdMeta.basePrice)}
                    </span>
                  </div>
                  {earlyBirdMeta.savings > 0 && earlyBirdMeta.deadlineLabel && (
                    <div className="text-xs text-emerald-700">
                      You save {formatPKR(earlyBirdMeta.savings)} if you book before{" "}
                      {earlyBirdMeta.deadlineLabel} (PKT)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-3 text-blue-900">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    {earlyBirdMeta.isActive ? "Base price (early-bird today):" : "Base price:"}
                  </span>
                  <span className="font-medium">{formatPKR(earlyBirdMeta.effectiveBasePrice)}</span>
                </div>
                {selectedLocationPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>+ {city} (City):</span>
                    <span>{formatPKR(selectedLocationPrice)}</span>
                  </div>
                )}
                {selectedTierPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>+ {tiers} (Tier):</span>
                    <span>{formatPKR(selectedTierPrice)}</span>
                  </div>
                )}
                {selectedRoomSharingPrice > 0 && (!isCoupleTrip || roomSharing !== "twin") && (
                  <div className="flex justify-between text-gray-600">
                    <span>+ Room Sharing:</span>
                    <span>{formatPKR(selectedRoomSharingPrice)}</span>
                  </div>
                )}
                {isCoupleTrip && twinSharingPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>+ Twin Room (Couple):</span>
                    <span>{formatPKR(twinSharingPrice)}</span>
                  </div>
                )}
                {sleepPreference === 'bed' && (
                  <div className="flex justify-between text-gray-600">
                    <span>+ Bed Upgrade:</span>
                    <span>{formatPKR(Number(flagship?.mattressTiers?.[0]?.price || 0))}</span>
                  </div>
                )}
                <div className="border-t border-blue-300 pt-2 mt-2 flex justify-between font-bold text-base">
                  <span className="text-blue-900">Total Amount:</span>
                  <span className="text-brand-primary-hover">{formatPKR(price)}</span>
                </div>
              </div>
            </div>


            {fromDetailsPage && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={policiesAccepted}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setPoliciesAccepted(checked);
                      try {
                        localStorage.setItem('policiesAccepted', checked ? 'true' : 'false');
                      } catch {
                        // ignore
                      }
                    }}
                  />
                  <span>
                    I have read and agree to the 
                    <Link href="/refundpolicyby3musafir" className="text-brand-primary hover:underline">
                      Refund Policy
                    </Link>
                    , 
                    <Link href="/musafircommunityequityframework" className="text-brand-primary hover:underline">
                      Community Equity Framework
                    </Link>
                    , and 
                    <Link href="/terms&conditonsby3musafir" className="text-brand-primary hover:underline">
                      Terms &amp; Conditions
                    </Link>
                    .
                  </span>
                </label>
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full mt-8"
            >
              {fromDetailsPage ? "Submit Form" : "Get Verified"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FlagshipRequirements;
