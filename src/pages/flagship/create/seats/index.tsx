'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { currentFlagship } from '@/store';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { HttpStatusCode } from 'axios';
import { showAlert } from '@/pages/alert';
import { ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import { Flagship } from '@/interfaces/flagship';
import withAuth from '@/hoc/withAuth';
import { mapErrorToUserMessage } from '@/utils/errorMessages';
import ProgressBar from '@/components/progressBar';
import { FlagshipService } from '@/services/flagshipService';
import { getEditIdFromSearch, withEditId } from '@/lib/flagship-edit';

function SeatsAllocation() {
  const activeStep = 3;
  const router = useRouter();
  const action = useFlagshipHook();
  const flagshipData: Flagship = useRecoilValue(currentFlagship);
  const setCurrentFlagship = useSetRecoilState(currentFlagship);
  const [editId, setEditId] = useState<string | null | undefined>(undefined);
  const isEditMode = Boolean(editId);
  const flagshipLocations = flagshipData.locations || [];
  // Total capacity state
  const [totalSeats, setTotalSeats] = useState('');

  // Toggles
  const [genderSplitEnabled, setGenderSplitEnabled] = useState(true);
  const [citySplitEnabled, setCitySplitEnabled] = useState(true);
  const [mattressSplitEnabled, setMattressSplitEnabled] = useState(true);

  // Gender split state
  const [genderSplit, setGenderSplit] = useState(50);
  const [femaleSeats, setFemaleSeats] = useState('');
  const [maleSeats, setMaleSeats] = useState('');

  // Mattress-Bed split state
  const [bedMattressSplit, setBedMattressSplit] = useState(50);
  const [bedSeats, setBedSeats] = useState('');
  const [mattressSeats, setMattressSeats] = useState('');
  const [mattressPriceDelta, setMattressPriceDelta] = useState('');
  // Mounted state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  // City split state
  const [citySeats, setCitySeats] = useState<{ [key: string]: number }>({});

  // Error state for validations
  const [errors, setErrors] = useState<{
    totalSeats: string;
    citySeats: { [key: string]: string };
    gender: string;
    mattress: string;
  }>({ totalSeats: '', citySeats: {}, gender: '', mattress: '' });

  // When locations change, update citySeats for enabled locations
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    setEditId(getEditIdFromSearch(window.location.search));
  }, []);

  useEffect(() => {
    const loadFlagship = async () => {
      if (!editId) return;
      if (flagshipData?._id === editId) return;
      try {
        const data = await FlagshipService.getFlagshipByID(editId);
        setCurrentFlagship(data);
      } catch (error) {
        console.error('Failed to load flagship for edit:', error);
        showAlert(mapErrorToUserMessage(error), 'error');
        router.push(ROUTES_CONSTANTS.ADMIN_DASHBOARD);
      }
    };
    loadFlagship();
  }, [editId, flagshipData?._id, router, setCurrentFlagship]);

  useEffect(() => {
    if (editId === undefined) return;
    if (isEditMode) return;
    if (!flagshipData._id || !flagshipData.tripName) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    if (flagshipData?.locations?.length === 0) {
      showAlert('Fill Pricing Data First', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.PRICING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagshipData?._id, flagshipData?.tripName, flagshipData?.locations?.length, isEditMode]);

  // useEffect to update state on page load if flagshipData is available
  useEffect(() => {
    if (flagshipData) {
      if (flagshipData.genderSplitEnabled === false) setGenderSplitEnabled(false);
      if (flagshipData.citySplitEnabled === false) setCitySplitEnabled(false);
      if (flagshipData.mattressSplitEnabled === false) setMattressSplitEnabled(false);

      // For discounts, basePrice, citySeats, gender splits, etc.
      if (flagshipData?.maleSeats && flagshipData?.femaleSeats) {
        const male = Number(flagshipData.maleSeats);
        const female = Number(flagshipData.femaleSeats);
        const total = male + female;
        if (total > 0) {
          const initialGenderSplit = Math.round((female / total) * 100);
          setGenderSplit(initialGenderSplit);
        }
      }

      if (flagshipData?.bedSeats && flagshipData?.mattressSeats) {
        const bed = Number(flagshipData.bedSeats);
        const mattress = Number(flagshipData.mattressSeats);
        const total = bed + mattress;
        if (total > 0) {
          const initialBedSplit = Math.round((bed / total) * 100);
          setBedMattressSplit(initialBedSplit);
        }
      }

      if (flagshipData.totalSeats) setTotalSeats(String(flagshipData.totalSeats));
      if (flagshipData.citySeats) setCitySeats(flagshipData.citySeats as { [key: string]: number });
      if (flagshipData.maleSeats) setMaleSeats(String(flagshipData.maleSeats));
      if (flagshipData.femaleSeats) setFemaleSeats(String(flagshipData.femaleSeats));
      if (flagshipData.bedSeats) setBedSeats(String(flagshipData.bedSeats));
      if (flagshipData.mattressSeats) setMattressSeats(String(flagshipData.mattressSeats));
      if (flagshipData.mattressPriceDelta) setMattressPriceDelta(String(flagshipData.mattressPriceDelta));
    }
  }, [flagshipData]);

  useEffect(() => {
    if (!citySplitEnabled) {
      setCitySeats({});
    }
  }, [citySplitEnabled]);

  useEffect(() => {
    if (!genderSplitEnabled) {
      setErrors((prev) => ({ ...prev, gender: '' }));
    }
  }, [genderSplitEnabled]);

  useEffect(() => {
    if (!mattressSplitEnabled) {
      setErrors((prev) => ({ ...prev, mattress: '' }));
      setMattressPriceDelta('');
    }
  }, [mattressSplitEnabled]);

  // Update gender seats when total or split changes
  useEffect(() => {
    if (!genderSplitEnabled) {
      setFemaleSeats('');
      setMaleSeats('');
      return;
    }
    const total = Number.parseInt(totalSeats) || 0;
    setFemaleSeats(Math.round((genderSplit / 100) * total).toString());
    setMaleSeats(Math.round(((100 - genderSplit) / 100) * total).toString());
  }, [totalSeats, genderSplit, genderSplitEnabled]);

  // Update bed/mattress seats when total or split changes
  useEffect(() => {
    if (!mattressSplitEnabled) {
      setBedSeats('');
      setMattressSeats('');
      return;
    }
    const total = Number.parseInt(totalSeats) || 0;
    setBedSeats(Math.round((bedMattressSplit / 100) * total).toString());
    setMattressSeats(Math.round(((100 - bedMattressSplit) / 100) * total).toString());
  }, [totalSeats, bedMattressSplit, mattressSplitEnabled]);

  // Handle city seat changes
  const updateCitySeats = (city: keyof typeof citySeats, increment: boolean) => {
    const currentValue = citySeats[city] || 0;
    const newValue = increment ? currentValue + 1 : currentValue - 1;
    if (newValue >= 0) {
      setCitySeats({
        ...citySeats,
        [city]: newValue,
      });
    }
  };

  // Validate fields before submitting
  const validateFields = (): boolean => {
    let isValid = true;
    const newErrors: {
      totalSeats: string;
      citySeats: { [key: string]: string };
      gender: string;
      mattress: string;
    } = {
      totalSeats: '',
      citySeats: {},
      gender: '',
      mattress: '',
    };

    const total = Number(totalSeats);
    if (!totalSeats.trim() || Number.isNaN(total) || total <= 0) {
      newErrors.totalSeats = 'Total capacity is required';
      isValid = false;
    }

    if (citySplitEnabled) {
      let totalCitySeats = 0;
      for (const city in citySeats) {
        const value = citySeats[city];
        if (value === undefined || value === null || Number.isNaN(Number(value))) {
          newErrors.citySeats[city] = `${city} seats is required and must be a number`;
          isValid = false;
        } else {
          totalCitySeats += Number(value);
        }
      }
      if (isValid && totalCitySeats !== total) {
        newErrors.citySeats['global'] = 'Sum of all city seats should equal total seats';
        isValid = false;
      }
    }

    if (genderSplitEnabled) {
      const male = Number(maleSeats);
      const female = Number(femaleSeats);
      if (Number.isNaN(male) || Number.isNaN(female)) {
        newErrors.gender = 'Gender seats must be valid numbers';
        isValid = false;
      } else if (male + female !== total) {
        newErrors.gender = 'Male + Female must equal total seats';
        isValid = false;
      }
    }

    if (mattressSplitEnabled) {
      const bed = Number(bedSeats);
      const mattress = Number(mattressSeats);
      if (Number.isNaN(bed) || Number.isNaN(mattress)) {
        newErrors.mattress = 'Bed/Mattress seats must be valid numbers';
        isValid = false;
      } else if (bed + mattress !== total) {
        newErrors.mattress = 'Bed + Mattress must equal total seats';
        isValid = false;
      }
      if (mattressPriceDelta && Number.isNaN(Number(mattressPriceDelta))) {
        newErrors.mattress = 'Mattress price delta must be a number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateFields()) return;

    const formData: any = {
      totalSeats: Number(totalSeats),
      citySplitEnabled,
      genderSplitEnabled,
      mattressSplitEnabled,
      mattressPriceDelta: mattressSplitEnabled && mattressPriceDelta ? Number(mattressPriceDelta) : null,
      updatedAt: flagshipData?.updatedAt,
    };

    if (genderSplitEnabled) {
      formData.femaleSeats = Number(femaleSeats);
      formData.maleSeats = Number(maleSeats);
    } else {
      formData.femaleSeats = null;
      formData.maleSeats = null;
    }

    if (citySplitEnabled) {
      formData.citySeats = citySeats;
    } else {
      formData.citySeats = null;
    }

    if (mattressSplitEnabled) {
      formData.bedSeats = Number(bedSeats);
      formData.mattressSeats = Number(mattressSeats);
    } else {
      formData.bedSeats = null;
      formData.mattressSeats = null;
    }

    try {
      const flagshipId = flagshipData._id || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Seats info Added!', 'success');
        router.push(withEditId(ROUTES_CONSTANTS.FLAGSHIP.IMP_DATES, editId));
      }
    } catch (error) {
      console.error('API Error:', error);
      showAlert(mapErrorToUserMessage(error), 'error');
    }
  };

  if (!mounted) return null; // avoid hydration issues

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
          <h2 className='text-3xl font-bold mb-6'>4: Seats Allocation</h2>

          {/* Total Capacity */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Total Capacity</h3>
            <div className='border-2 border-black rounded-xl overflow-hidden'>
              <input
                value={totalSeats}
                min={0}
                onChange={(e) => setTotalSeats(e.target.value)}
                className='w-full px-4 py-3 focus:outline-none text-lg'
                placeholder='Enter total seats'
              />
            </div>
            {errors.totalSeats && <p className='text-brand-error text-sm mt-1'>{errors.totalSeats}</p>}
          </div>

          {/* Gender Split */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-xl font-bold'>Gender Split</h3>
              <label className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={genderSplitEnabled}
                  onChange={(e) => setGenderSplitEnabled(e.target.checked)}
                />
                Enable
              </label>
            </div>
            <p className='text-sm text-gray-600 mb-3'>
              When disabled, seats are pooled without gender limits.
            </p>
            {genderSplitEnabled && (
              <>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={genderSplit}
                  onChange={(e) => setGenderSplit(Number.parseInt(e.target.value))}
                  className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black'
                />
                <div className='flex justify-between mt-4 gap-4'>
                  <div className='flex-1'>
                    <p className='mb-2'>Female Seats</p>
                    <input
                      type='number'
                      min={0}
                      value={femaleSeats}
                      readOnly
                      className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='mb-2'>Male Seats</p>
                    <input
                      type='number'
                      min={0}
                      value={maleSeats}
                      readOnly
                      className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                    />
                  </div>
                </div>
                {errors.gender && <p className='text-brand-error text-sm mt-1'>{errors.gender}</p>}
              </>
            )}
          </div>

          {/* City-wise Split */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-xl font-bold'>City-wise Split</h3>
              <label className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={citySplitEnabled}
                  onChange={(e) => setCitySplitEnabled(e.target.checked)}
                />
                Enable
              </label>
            </div>
            <p className='text-sm text-gray-600 mb-3'>
              When disabled, all seats share one pool; per-city limits are ignored.
            </p>
            {citySplitEnabled &&
              flagshipLocations?.length !== 0 &&
              flagshipLocations.map((city, index) => {
                const cityKey = city.name.toLowerCase();
                return (
                  <div key={index} className='mb-4'>
                    <p className='mb-2'>
                      {cityKey.charAt(0).toUpperCase() + cityKey.slice(1)} Seats
                    </p>
                    <div className='flex items-center gap-4'>
                      <button
                        onClick={() => updateCitySeats(cityKey, false)}
                        className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'
                      >
                        <Minus className='w-6 h-6' />
                      </button>
                      <input
                        type='text'
                        min={0}
                        value={citySeats[cityKey] || 0}
                        onChange={(e) =>
                          setCitySeats({ ...citySeats, [cityKey]: Number(e.target.value) })
                        }
                        required
                        className='flex-1 px-4 py-3 border rounded-xl focus:outline-none text-lg'
                      />
                      <button
                        onClick={() => updateCitySeats(cityKey, true)}
                        className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'
                      >
                        <Plus className='w-6 h-6' />
                      </button>
                    </div>
                  </div>
                );
              })}
            {citySplitEnabled && errors.citySeats && errors.citySeats['global'] && (
              <p className='text-brand-error text-sm mt-1'>{errors.citySeats['global']}</p>
            )}
          </div>

          {/* Mattress - Bed Split */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-xl font-bold'>Mattress - Bed Split</h3>
              <label className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={mattressSplitEnabled}
                  onChange={(e) => setMattressSplitEnabled(e.target.checked)}
                />
                Enable
              </label>
            </div>
            <p className='text-sm text-gray-600 mb-3'>
              When disabled, all seats use the base price and no bed/mattress choice is enforced.
            </p>
            {mattressSplitEnabled && (
              <>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={bedMattressSplit}
                  onChange={(e) => setBedMattressSplit(Number.parseInt(e.target.value))}
                  className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black'
                />
                <div className='flex justify-between mt-4 gap-4'>
                  <div className='flex-1'>
                    <p className='mb-2'>Bed</p>
                    <input
                      type='number'
                      min={0}
                      value={bedSeats}
                      readOnly
                      className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='mb-2'>Mattress</p>
                    <input
                      type='number'
                      min={0}
                      value={mattressSeats}
                      readOnly
                      className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <p className='mb-2'>Mattress Price Delta (amount deducted from base seat price)</p>
                  <input
                    type='number'
                    min={0}
                    value={mattressPriceDelta}
                    onChange={(e) => setMattressPriceDelta(e.target.value)}
                    className='w-full px-4 py-3 border rounded-xl focus:outline-none text-lg'
                    placeholder='e.g., 2000'
                  />
                  <p className='text-xs text-gray-600 mt-1'>
                    Mattress price = base seat price - this delta. Shown to users during selection.
                  </p>
                </div>
                {errors.mattress && <p className='text-brand-error text-sm mt-1'>{errors.mattress}</p>}
              </>
            )}
          </div>
        </div>

        {/* Next Button */}
            <button
              onClick={handleSubmit}
              className='w-full bg-brand-primary text-black py-4 rounded-xl font-bold text-lg'
            >
              Next
            </button>
      </div>
    </div>
  );
}

export default withAuth(SeatsAllocation, { allowedRoles: [ROLES.ADMIN] });
