/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { HttpStatusCode } from 'axios';
import { showAlert } from '@/pages/alert';
import { ROLES, ROUTES_CONSTANTS, steps, CITIES } from '@/config/constants';
import withAuth from '@/hoc/withAuth';
import ProgressBar from '@/components/progressBar';
import { mapErrorToUserMessage } from '@/utils/errorMessages';
import { FlagshipService } from '@/services/flagshipService';
import { getEditIdFromSearch, withEditId } from '@/lib/flagship-edit';
import { ensureSilentUpdate } from '@/lib/flagshipWizard';
import { Flagship } from '@/interfaces/flagship';
import { loadDraft, saveDraft } from '@/lib/flagship-draft';

function PricingPage() {
  const activeStep = 2;
  const router = useRouter();
  const action = useFlagshipHook();
  const [flagshipData, setFlagshipData] = useState<Flagship>({} as Flagship);
  const [editId, setEditId] = useState<string | null | undefined>(undefined);
  const isEditMode = Boolean(editId);
  // Base price state
  const [basePrice, setBasePrice] = useState('');
  const [earlyBirdPrice, setEarlyBirdPrice] = useState('');

  // Locations state
  const [locations, setLocations] = useState([
    { id: 1, name: 'Islamabad', enabled: true, price: '0' },
    { id: 2, name: 'Lahore', enabled: true, price: '0' },
  ]);

  // State to hold the new location name typed by user
  const [newLocationName, setNewLocationName] = useState('');

  const [newTierName, setNewTierName] = useState('');
  const [newMatressTierName, setNewMatressTierName] = useState('');

  // Tier based add-ons state
  const [tierEnabled, setTierEnabled] = useState(true);
  const [tiers, setTiers] = useState([{ id: 1, name: 'Standard', price: '0' }]);

  // Mattress tier state
  const [mattressTierEnabled, setMattressTierEnabled] = useState(true);
  const [mattressTiers, setMattressTiers] = useState([
    { id: 2, name: 'Bed Add-On', price: '3000' },
  ]);

  const [roomSharingEnabled, setRoomSharingEnabled] = useState(true);
  const [roomSharingPreference, setRoomSharingPreference] = useState([
    { id: 2, name: 'Twin Sharing', price: '0' },
  ]);

  // Error state
  const [errors, setErrors] = useState({
    basePrice: '',
    locations: '',
    tiers: '',
    mattressTiers: '',
    roomSharingPreference: '',
    earlyBirdPrice: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setEditId(getEditIdFromSearch(window.location.search));
  }, []);

  useEffect(() => {
    if (editId === undefined) return;
    if (!editId) {
      const draft = loadDraft<Flagship>('create');
      if (draft) {
        setFlagshipData(draft);
      }
      return;
    }
    const loadFlagship = async () => {
      try {
        const data = await FlagshipService.getFlagshipByID(editId);
        setFlagshipData(data);
        saveDraft('edit', editId, data);
      } catch (error) {
        console.error('Failed to load flagship for edit:', error);
        showAlert(mapErrorToUserMessage(error), 'error');
        router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
      }
    };
    loadFlagship();
  }, [editId, router]);

  useEffect(() => {
    if (editId === undefined) return;
    if (isEditMode) return;
    if (!flagshipData._id || !flagshipData.tripName) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagshipData?._id, flagshipData?.tripName, isEditMode]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. If you leave, your form data will be lost.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted, isDirty]);

  // useEffect to update state on page load if flagshipData is available
  useEffect(() => {
    if (flagshipData) {
      if (flagshipData?.locations?.length) {
        const mapped = flagshipData.locations.map(
          (loc: { name: any; enabled: any; price: any }, i: number) => ({
            id: i + 1,
            name: loc.name,
            enabled: loc.enabled,
            price: loc.price,
          })
        );
        setLocations(mapped);
      }
      if (flagshipData?.tiers?.length) {
        const mappedTiers = flagshipData.tiers.map(
          (tier: { name: any; price: any }, i: number) => ({
            id: i + 1,
            name: tier.name,
            price: tier.price,
          })
        );
        setTiers(mappedTiers);
      } else {
        setTierEnabled(false);
      }
      if (flagshipData?.mattressTiers?.length) {
        const mappedMattressTiers = flagshipData.mattressTiers.map(
          (mt: { name: any; price: any }, i: number) => ({
            id: i + 1,
            name: mt.name,
            price: mt.price,
          })
        );
        setMattressTiers(mappedMattressTiers);
      } else {
        setMattressTierEnabled(false);
      }
      // For discounts, basePrice, citySeats, gender splits, etc.
      if (flagshipData.basePrice) setBasePrice(flagshipData.basePrice);
      if (flagshipData.earlyBirdPrice) setEarlyBirdPrice(String(flagshipData.earlyBirdPrice));
    }
  }, [flagshipData]);

  // Toggle location enabled/disabled
  const toggleLocation = (id: number) => {
    setLocations(
      locations.map((location) =>
        location.id === id ? { ...location, enabled: !location.enabled } : location
      )
    );
  };

  // Update location price
  const updateLocationPrice = (id: number, price: string) => {
    setLocations(
      locations.map((location) => (location.id === id ? { ...location, price: price } : location))
    );
  };

  // Update tier price
  const updateTierPrice = (id: number, price: string) => {
    setTiers(tiers.map((tier) => (tier.id === id ? { ...tier, price: price } : tier)));
  };

  // Update mattress tier price
  const updateMattressTierPrice = (id: number, price: string) => {
    setMattressTiers(
      mattressTiers.map((tier) => (tier.id === id ? { ...tier, price: price } : tier))
    );
  };

  const updateRoomSharingPreferencePrice = (id: number, price: string) => {
    setRoomSharingPreference(
      roomSharingPreference.map((tier) => (tier.id === id ? { ...tier, price: price } : tier))
    );
  };

  // Add new location
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addLocation = (e: any) => {
    e.preventDefault();
    if (!newLocationName) return;

    // Check if location already exists
    const locationExists = locations.some(loc => loc.name === newLocationName);
    if (locationExists) {
      showAlert(`${newLocationName} is already added`, 'error');
      return;
    }

    const maxId = locations.length > 0 ? Math.max(...locations.map((loc) => loc.id)) : 0;
    const newId = maxId + 1;

    setLocations([...locations, { id: newId, name: newLocationName, enabled: true, price: '0' }]);
    setNewLocationName('');
  };

  // Add new tier
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addTier = (e: any) => {
    e.preventDefault();
    const maxId = tiers.length > 0 ? Math.max(...tiers.map((loc) => loc.id)) : 0;
    const newId = maxId + 1;
    const tierName = newTierName.trim() ? newTierName : `Tier ${newId}`;
    setTiers([...tiers, { id: newId, name: tierName, price: '0' }]);
    setNewTierName('');
  };

  // Add new mattress tier
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addMattressTier = (e: any) => {
    e.preventDefault();
    const maxId = mattressTiers.length > 0 ? Math.max(...mattressTiers.map((loc) => loc.id)) : 0;
    const newId = maxId + 1;
    const mattressName = newMatressTierName.trim() ? newMatressTierName : `Mattress ${newId}`;
    setMattressTiers([...mattressTiers, { id: newId, name: mattressName, price: '0' }]);
    setNewMatressTierName('');
  };

  const deleteLocation = (id: number) => {
    setLocations(locations.filter((location) => location.id !== id));
  };

  const deleteTier = (id: number) => {
    setTiers(tiers.filter((tier) => tier.id !== id));
  };

  const deleteMattressTier = (id: number) => {
    setMattressTiers(mattressTiers.filter((tier) => tier.id !== id));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateFields()) return;

    const formData = {
      basePrice,
      locations: locations.filter((loc) => loc.enabled).map(({ id, ...rest }) => rest),
      tiers: tierEnabled ? tiers.map(({ id, ...rest }) => rest) : [],
      mattressTiers: mattressTierEnabled ? mattressTiers.map(({ id, ...rest }) => rest) : [],
      roomSharingPreference: roomSharingEnabled ? roomSharingPreference.map(({ id, ...rest }) => rest) : [],
      earlyBirdPrice: earlyBirdPrice ? Number(earlyBirdPrice) : undefined,
    };
    ensureSilentUpdate(formData);
    try {
      const flagshipId = flagshipData?._id;
      if (!flagshipId) {
        showAlert('Create a Flagship first', 'error');
        return;
      }
      const res: any = await action.updateWithLatestVersion(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        setIsSubmitted(true);
        setIsDirty(false);
        showAlert('Pricing Added!', 'success');
        if (res?.data) {
          setFlagshipData(res.data);
          saveDraft(editId ? 'edit' : 'create', editId ?? null, res.data);
        }
        router.push(withEditId(ROUTES_CONSTANTS.FLAGSHIP.SEATS, editId));
      }
    } catch (error) {
      showAlert(mapErrorToUserMessage(error), 'error');
    }
  };

  // Validate fields before submit
  const validateFields = (): boolean => {
    let isValid = true;
    const newErrors = {
      basePrice: '',
      locations: '',
      tiers: '',
      mattressTiers: '',
      roomSharingPreference: '',
      earlyBirdPrice: '',
    };

    if (!basePrice.trim()) {
      newErrors.basePrice = 'Base price is required';
      isValid = false;
    }

    // Validate at least one location enabled with non-empty price
    const enabledLocations = locations.filter((loc) => loc.enabled);
    if (enabledLocations.length === 0) {
      newErrors.locations = 'At least one departure location must be enabled';
      isValid = false;
    } else if (enabledLocations.some((loc) => !loc.price.trim())) {
      newErrors.locations = 'All enabled locations must have a price';
      isValid = false;
    }

    if (tierEnabled) {
      if (tiers.length === 0) {
        newErrors.tiers = 'At least one tier must be provided';
        isValid = false;
      } else if (tiers.some((tier) => !tier.price.trim())) {
        newErrors.tiers = 'All tiers must have a price';
        isValid = false;
      }
    }

    if (mattressTierEnabled) {
      if (mattressTiers.length === 0) {
        newErrors.mattressTiers = 'At least one mattress tier must be provided';
        isValid = false;
      } else if (mattressTiers.some((tier) => !tier.price.trim())) {
        newErrors.mattressTiers = 'All mattress tiers must have a price';
        isValid = false;
      }
    }

    if (roomSharingEnabled) {
      if (roomSharingPreference.length === 0) {
        newErrors.roomSharingPreference = 'At least one room sharing preference must be provided';
        isValid = false;
      } else if (roomSharingPreference.some((tier) => !tier.price.trim())) {
        newErrors.roomSharingPreference = 'All room sharing preferences must have a price';
        isValid = false;
      }
    }

    if (earlyBirdPrice) {
      const eb = Number(earlyBirdPrice);
      const base = Number(basePrice);
      if (Number.isNaN(eb) || eb <= 0) {
        newErrors.earlyBirdPrice = 'Enter a valid early-bird price';
        isValid = false;
      } else if (!Number.isNaN(base) && eb > base) {
        newErrors.earlyBirdPrice = 'Early-bird price should be <= base price';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full'>
        {/* Title */}
        <div className='text-center py-4'>
          <h1 className='text-2xl font-bold'>
            {isEditMode ? 'Edit a Flagship' : 'Create a Flagship'}
          </h1>
        </div>

        {/* Progress bar */}
        <ProgressBar steps={steps} activeStep={activeStep} />

        {/* Main Content */}
        <div className='px-4 pb-20'>
          <h2 className='text-3xl font-bold mb-6'>3: Pricing</h2>

          {/* Base Price Section */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Set a base ticket price</h3>
            <div className='border-2 border-black rounded-xl overflow-hidden'>
              <input
                min={0}
                value={basePrice}
                onChange={(e) => {
                  setBasePrice(e.target.value);
                  setIsDirty(true);
                }}
                className='w-full px-4 py-3 focus:outline-none text-lg'
                placeholder='Enter base price'
              />
            </div>
            {errors.basePrice && <p className='text-brand-error text-sm mt-1'>{errors.basePrice}</p>}
            <p className='text-gray-600 mt-2 text-sm'>
              This is the &quot;Starting from&quot; price. Location and tier add-ons will be added on top of this base price.
            </p>
          </div>

          {/* Early Bird Price */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold mb-2'>Early-bird price (override)</h3>
              <p className='text-xs text-gray-600'>Applies until Early Bird Deadline (Step 5)</p>
            </div>
            <div className='border-2 border-black rounded-xl overflow-hidden'>
              <input
                min={0}
                value={earlyBirdPrice}
                onChange={(e) => {
                  setEarlyBirdPrice(e.target.value);
                  setIsDirty(true);
                }}
                className='w-full px-4 py-3 focus:outline-none text-lg'
                placeholder='Optional early-bird price (<= base price)'
              />
            </div>
            {errors.earlyBirdPrice && (
              <p className='text-brand-error text-sm mt-1'>{errors.earlyBirdPrice}</p>
            )}
            <p className='text-gray-600 mt-2 text-sm'>
              Users will see this lower price before adding city/tier adjustments when registering before the deadline.
            </p>
          </div>

          {/* Departure Points Section */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-2'>Departure City Add-Ons</h3>
            <p className='text-sm text-gray-600 mb-4'>
              These prices will be <span className='font-semibold'>added to the base price</span>. Set to 0 if included in base price.
            </p>
            {locations?.length !== 0 &&
              locations?.map((location) => (
                <div key={location.id} className='mb-6'>
                  <div className='w-full'>
                    <div className='flex justify-between items-center mb-2'>
                      <h4 className='text-lg font-bold'>{location.name}</h4>
                      <div
                        className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                          location.enabled ? 'bg-black' : 'bg-gray-300'
                        }`}
                        onClick={() => {
                          toggleLocation(location.id);
                          setIsDirty(true);
                        }}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                            location.enabled ? 'translate-x-7' : ''
                          }`}
                        ></div>
                      </div>
                    </div>

                    {location?.enabled && (
                      <div>
                        <p className='mb-2'>Add-on price</p>
                        <div className='flex border-2 border-black rounded-xl overflow-hidden'>
                          <input
                            min={0}
                            value={location.price}
                            onChange={(e) => {
                              updateLocationPrice(location.id, e.target.value);
                              setIsDirty(true);
                            }}
                            className='w-full px-4 py-3 focus:outline-none text-lg'
                            placeholder='0'
                          />
                          {locations.length > 1 ? (
                            <button
                              onClick={() => deleteLocation(location.id)}
                              className='ml-2 text-brand-error hover:text-brand-error mr-2'
                            >
                              <X className='w-5 h-5' />
                            </button>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {errors.locations && <p className='text-brand-error text-sm mb-2'>{errors.locations}</p>}
            <div>
              <span className='text-sm font-bold'>Add Another Location</span>
              <form
                className='w-full flex items-center justify-between text-sm font-bold py-2'
                onSubmit={addLocation}
              >
                <select
                  id='newLocation'
                  value={newLocationName}
                  onChange={(e) => {
                    setNewLocationName(e.target.value);
                    setIsDirty(true);
                  }}
                  className='w-full py-2 border rounded-lg focus:outline-none px-2 mx-4'
                  required
                >
                  <option value=''>Select a city</option>
                  {CITIES.filter(city => !locations.some(loc => loc.name === city)).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <button
                  type='submit'
                  className='w-8 h-8 rounded-full border-2 border-black flex items-center justify-center px-2'
                  disabled={!newLocationName}
                >
                  <Plus className='w-5 h-5' />
                </button>
              </form>
            </div>
          </div>

          {/* Tier Based Add-Ons */}
          <div className='border-t pt-6 mb-8'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold'>Tier Based Add-Ons</h3>
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  tierEnabled ? 'bg-black' : 'bg-gray-300'
                }`}
                onClick={() => setTierEnabled(!tierEnabled)}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    tierEnabled ? 'translate-x-7' : ''
                  }`}
                ></div>
              </div>
            </div>

            {tierEnabled && (
              <>
                {tiers?.length !== 0 &&
                  tiers?.map((tier) => (
                    <div key={tier.id} className='mb-4'>
                      <p className='mb-2'>{tier.name}</p>
                      <div className='flex border-2 border-black rounded-xl overflow-hidden'>
                        <input
                          min={0}
                          value={tier.price}
                          onChange={(e) => {
                            updateTierPrice(tier.id, e.target.value);
                            setIsDirty(true);
                          }}
                          className='w-full px-4 py-3 focus:outline-none text-lg'
                          placeholder='0'
                        />
                        {tiers.length > 1 ? (
                          <button
                            onClick={() => deleteTier(tier.id)}
                            className='ml-2 text-brand-error hover:text-brand-error mr-2'
                          >
                            <X className='w-5 h-5' />
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ))}
                {errors.tiers && <p className='text-brand-error text-sm mb-2'>{errors.tiers}</p>}
                <div>
                  <span className='text-sm font-bold'>Add Another Tier</span>
                  <form
                    className='w-full flex items-center justify-between text-sm font-bold py-2'
                    onSubmit={addTier}
                  >
                    <input
                      type='text'
                      id='newtier'
                      value={newTierName}
                      onChange={(e) => {
                        setNewTierName(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder='Enter Tier name'
                      className='w-full py-2 border rounded-lg focus:outline-none px-2 mx-4'
                      required
                    />
                    <button
                      type='submit'
                      className='w-8 h-8 rounded-full border-2 border-black flex items-center justify-center px-2'
                    >
                      <Plus className='w-5 h-5' />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

          {/* Mattress Tier */}
          <div className='border-t pt-6 mb-8'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold'>Mattress Tier</h3>
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  mattressTierEnabled ? 'bg-black' : 'bg-gray-300'
                }`}
                onClick={() => setMattressTierEnabled(!mattressTierEnabled)}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    mattressTierEnabled ? 'translate-x-7' : ''
                  }`}
                ></div>
              </div>
            </div>

            {mattressTierEnabled && (
              <>
                {mattressTiers?.length !== 0 &&
                  mattressTiers?.map((tier) => (
                    <div key={tier.id} className='mb-4'>
                      <p className='mb-2'>{tier.name}</p>
                      <div className='flex border-2 border-black rounded-xl overflow-hidden'>
                        <input
                          min={0}
                          value={tier.price}
                          onChange={(e) => {
                            updateMattressTierPrice(tier.id, e.target.value);
                            setIsDirty(true);
                          }}
                          className='w-full px-4 py-3 focus:outline-none text-lg'
                          placeholder='0'
                        />
                        {mattressTiers.length > 1 ? (
                          <button
                            onClick={() => deleteMattressTier(tier.id)}
                            className='ml-2 text-brand-error hover:text-brand-error mr-2'
                          >
                            <X className='w-5 h-5' />
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ))}
                {errors.mattressTiers && (
                  <p className='text-brand-error text-sm mb-2'>{errors.mattressTiers}</p>
                )}
                <div>
                  <span className='text-sm font-bold'>Add Another Mattress Tier</span>
                  <form
                    className='w-full flex items-center justify-between text-sm font-bold py-2'
                    onSubmit={addMattressTier}
                  >
                    <input
                      type='text'
                      id='newmattresstier'
                      value={newMatressTierName}
                      onChange={(e) => {
                        setNewMatressTierName(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder='Enter Mattress Tier name'
                      className='w-full py-2 border rounded-lg focus:outline-none px-2 mx-4'
                      required
                    />
                    <button
                      type='submit'
                      className='w-8 h-8 rounded-full border-2 border-black flex items-center justify-center px-2'
                    >
                      <Plus className='w-5 h-5' />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
          <div className='border-t pt-6 mb-8'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold'>Room Sharing Preference</h3>
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                  roomSharingEnabled ? 'bg-black' : 'bg-gray-300'
                }`}
                onClick={() => setRoomSharingEnabled(!roomSharingEnabled)}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    roomSharingEnabled ? 'translate-x-7' : ''
                  }`}
                ></div>
              </div>
            </div>

            {roomSharingEnabled && (
              <>
                {roomSharingPreference?.length !== 0 &&
                  roomSharingPreference?.map((tier) => (
                    <div key={tier.id} className='mb-4'>
                      <p className='mb-2'>{tier.name}</p>
                      <div className='flex border-2 border-black rounded-xl overflow-hidden'>
                        <input
                          min={0}
                          value={tier.price}
                          onChange={(e) => {
                            updateRoomSharingPreferencePrice(tier.id, e.target.value);
                            setIsDirty(true);
                          }}
                          className='w-full px-4 py-3 focus:outline-none text-lg'
                          placeholder='0'
                        />
                      </div>
                    </div>
                  ))}
                {errors.roomSharingPreference && (
                  <p className='text-brand-error text-sm mb-2'>{errors.roomSharingPreference}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Next Button */}
          <button
            onClick={handleSubmit}
            className='btn-primary w-full rounded-xl text-lg font-bold'
          >
            Next
          </button>
      </div>
    </div>
  );
}

export default withAuth(PricingPage, { allowedRoles: [ROLES.ADMIN] });
