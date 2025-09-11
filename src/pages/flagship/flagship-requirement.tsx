import { useState, useEffect } from 'react'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import useCustomHook from '@/hooks/useFlagshipHandler';
import { BaseRegistration } from '@/interfaces/registration';
import { showAlert } from '../alert';
import Image from 'next/image';
import withAuth from '@/hoc/withAuth';
import { ROLES } from '@/config/constants';
import useRegistrationHook from '@/hooks/useRegistrationHandler';

function FlagshipRequirements() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tripType, setTripType] = useState<'solo' | 'group' | 'partner'>('solo')
  const [city, setCity] = useState('')
  const [tiers, setTiers] = useState('');
  const [sleepPreference, setSleepPreference] = useState<'mattress' | 'bed'>('mattress');
  const [roomSharing, setRoomSharing] = useState<'default' | 'twin'>('default');
  const [groupMembers, setGroupMembers] = useState('')
  const [expectations, setExpectations] = useState('')
  const action = useCustomHook();
  const [flagship, setFlagship] = useState<any>();
  const [price, setPrice] = useState(0);
  const [selectedLocationPrice, setSelectedLocationPrice] = useState(0);
  const [selectedTierPrice, setSelectedTierPrice] = useState(0);
  const [fromDetailsPage, setFromDetailsPage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoomSharingPrice, setSelectedRoomSharingPrice] = useState(0);
  const registrationAction = useRegistrationHook();

  const recalculateTotalPrice = () => {
    const basePrice = Number(flagship?.basePrice) || 0;
    const locationPrice = selectedLocationPrice;
    const tierPrice = selectedTierPrice;
    const roomSharingPrice = selectedRoomSharingPrice;
    const mattressPrice = sleepPreference === 'bed' ? Number(flagship?.mattressTiers?.[0]?.price || 0) : 0;

    const totalPrice = basePrice + locationPrice + tierPrice + roomSharingPrice + mattressPrice;

    return totalPrice;
  };

  const getFlagship = async (flagshipId: any) => {
    const response = await action.getFlagship(flagshipId);
    const basePrice = Number(response.basePrice) || 0;

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
      const flagshipId = searchParams.get("id");
      const fromDetailsPage = searchParams.get("fromDetailsPage") === "true";
      setFromDetailsPage(fromDetailsPage);

      if (flagshipId) {
        await getFlagship(flagshipId);
        localStorage.setItem("flagshipId", JSON.stringify(flagshipId));
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
        setTripType(registration.tripType);
        setGroupMembers(registration.groupMembers);
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
          const basePrice = Number(flagship?.basePrice) || 0;
          const locationPrice = registration.joiningFromCity ?
            Number(flagship?.locations?.find((loc: any) => loc.name === registration.joiningFromCity)?.price) || 0 : 0;
          setPrice(basePrice + locationPrice);
        }
      }
    };

    fetchData();
  }, [searchParams]);

  useEffect(() => {
    if (flagship) {
      const newPrice = recalculateTotalPrice();
      setPrice(newPrice);
    }
  }, [selectedLocationPrice, selectedTierPrice, selectedRoomSharingPrice, sleepPreference, flagship]);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (flagship._id) {
      const registration: BaseRegistration = {
        flagshipId: flagship._id,
        isPaid: false,
        joiningFromCity: city,
        tier: tiers,
        bedPreference: sleepPreference,
        roomSharing,
        tripType,
        groupMembers,
        expectations,
        price,
      };

      if (fromDetailsPage) {
        const { registrationId, message } = await registrationAction.create(registration) as { registrationId: string, message: string };
        localStorage.setItem("registrationId", JSON.stringify(registrationId));
        router.push(`/flagship/seats`);
      } else {
        localStorage.setItem("registration", JSON.stringify(registration));
        router.push("/signup/additionalinfo");
      }
    } else {
      showAlert("Flagship not found.", "error");
    }
  };

  const imageUrls = flagship?.images && flagship?.images?.length > 0 ? flagship?.images : [];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls?.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls?.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center">
      <div className="bg-white w-full max-w-md mx-auto shadow-sm p-3">
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

        <div className="relative h-52 w-full">
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
                    className={`h-1.5 rounded-full transition-all ${currentImageIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Form Content */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-1">
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
                Joining from city (Base Price)
              </label>
              {flagship?.locations?.map(
                (
                  location: { enabled: boolean; name: string; price: string },
                  index: number
                ) =>
                  location.enabled && (
                    <label
                      key={index}
                      className={`flex items-center space-x-2 ${city === location.name ? "text-black" : "text-gray-600"
                        }`}
                    >
                      <input
                        type="radio"
                        name="city"
                        value={location.name}
                        checked={city === location.name}
                        onChange={() => {
                          setCity(location.name);
                          setSelectedLocationPrice(Number(location.price));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                      <span>
                        {location.name} Rs.{location.price}
                      </span>
                    </label>
                  )
              )}
            </div>

            {/* Package/Ticket */}
            <div className="space-y-4">
              <label htmlFor="package" className="block text-sm font-medium">
                Package/Ticket
              </label>
              {flagship?.tiers?.length > 0 ? (
                flagship.tiers.map((tier: { name: string; price: string }, index: number) => (
                  <label key={index} className={`flex items-center space-x-2 ${tiers === tier.name ? 'text-black' : 'text-gray-600'}`}>
                    <input
                      type="radio"
                      name="tier"
                      value={tier.name}
                      checked={tiers === tier.name}
                      onChange={() => {
                        setTiers(tier.name);
                        setSelectedTierPrice(Number(tier.price));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                    <span>{tier.name} Rs.{tier.price}</span>
                  </label>
                ))
              ) : (
                <label className="flex items-center space-x-2 text-black">
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
                  <span>Standard Rs.0</span>
                </label>
              )}
            </div>

            {/* Room sharing preference */}
            <div className="space-y-4">
              <label htmlFor="package" className="block text-sm font-medium">
                Room sharing preference
              </label>
              <label className={`flex items-center space-x-2 ${roomSharing === "default" ? 'text-black' : 'text-gray-600'}`}>
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
                <span>Default (3-4 sharing)</span>
              </label>
              {flagship?.roomSharingPreference?.map((preference: { name: string; price: string }, index: number) => (
                <label key={index} className={`flex items-center space-x-2 ${roomSharing === preference.name ? 'text-black' : 'text-gray-600'}`}>
                  <input
                    type="radio"
                    name="roomSharing"
                    value={preference.name}
                    checked={roomSharing === (preference.name === "Twin Sharing" ? "twin" : "default")}
                    onChange={() => {
                      setRoomSharing(preference.name === "Twin Sharing" ? "twin" : "default");
                      setSelectedRoomSharingPrice(Number(preference.price));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                  <span>{preference.name} (+ Rs.{preference.price})</span>
                </label>
              ))}
            </div>

            {/* Sleeping preference */}
            <div className="space-y-4">
              <label htmlFor="package" className="block text-sm font-medium">
                Sleeping preference
              </label>
              <label
                className={`flex items-center space-x-2 ${sleepPreference == "mattress" ? "text-black" : "text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="sleepPreference"
                  value="mattress"
                  checked={sleepPreference === "mattress"}
                  onChange={() => {
                    setSleepPreference("mattress");
                  }}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>Mattress (Rs. 0)</span>
              </label>
              <label
                className={`flex items-center space-x-2 ${sleepPreference == "bed" ? "text-black" : "text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="sleepPreference"
                  value="bed"
                  checked={sleepPreference === "bed"}
                  onChange={() => {
                    setSleepPreference("bed");
                  }}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>Bed (+ Rs.{flagship?.mattressTiers?.[0]?.price || 0})</span>
              </label>
            </div>

            {/* Solo/Group Selection */}
            <div className="space-y-4">
              <label htmlFor="package" className="block text-sm font-medium">
                Who are you joining with
              </label>
              <label
                className={`flex items-center space-x-2 ${tripType == "solo" ? "text-black" : "text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="memberType"
                  value="solo"
                  checked={tripType === "solo"}
                  onChange={() => setTripType("solo")}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>Solo</span>
              </label>
              <label
                className={`flex items-center space-x-2 ${tripType == "group" ? "text-black" : "text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="memberType"
                  value="group"
                  checked={tripType === "group"}
                  onChange={() => setTripType("group")}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>Group</span>
              </label>
              <label
                className={`flex items-center space-x-2 ${tripType == "partner" ? "text-black" : "text-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="memberType"
                  value="partner"
                  checked={tripType === "partner"}
                  onChange={() => setTripType("partner")}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-4 peer-checked:border-black"></div>
                <span>As a couple (twin room)</span>
              </label>
            </div>

            {/* Group Members */}
            {(tripType === "group" || tripType === "partner") && (
              <div className="space-y-2">
                <label
                  htmlFor="groupMembers"
                  className="block text-sm font-small text-gray-500"
                >
                  Their names
                </label>
                <input
                  type="text"
                  id="groupMembers"
                  value={groupMembers}
                  onChange={(e) => setGroupMembers(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            )}

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
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

            {/* Ticket Price */}
            <div className="flex space-y-2 items-center justify-between">
              <label className="block text-sm font-medium text-gray-600">
                Your Ticket Price
              </label>
              <label className="block text-xl font-medium text-gray-600">
                Rs. <span className="font-bold">{price}</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-md text-sm font-medium transition-colors mt-8"
            >
              {fromDetailsPage ? "Make Payment" : "Get Verified"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(FlagshipRequirements, { allowedRoles: [ROLES.MUSAFIR] });

