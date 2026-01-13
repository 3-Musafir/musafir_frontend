'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { showAlert } from '@/pages/alert';
import { DESTINATIONS, ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import withAuth from '@/hoc/withAuth';
import { HttpStatusCode } from 'axios';
import ProgressBar from '@/components/progressBar';
import { currentFlagship } from '@/store';
import { useRecoilValue } from 'recoil';

function CreateFlagship() {
  const activeStep = 0;
  const router = useRouter();
  const action = useFlagshipHook();
  const flagshipData = useRecoilValue(currentFlagship);
  // Basic fields state
  const [tripName, setTripName] = useState('');
  const [category, setCategory] = useState('flagship');
  const [visibility, setVisibility] = useState('public');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  // Error state for validations
  const [errors, setErrors] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    category: '',
    visibility: '',
  });

  // useEffect to update state on page load if flagshipData is available
  useEffect(() => {
    if (flagshipData) {
      setTripName(flagshipData.tripName || '');
      setCategory(flagshipData.category || 'flagship');
      setVisibility(flagshipData.visibility || 'public');
      setDestination(flagshipData.destination || '');
      setStartDate(
        flagshipData.startDate
          ? new Date(flagshipData.startDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setEndDate(
        flagshipData.endDate
          ? new Date(flagshipData.endDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
    }
  }, [flagshipData]);

  // Validate fields and return if valid
  const validate = (): boolean => {
    let valid = true;
    const newErrors = {
      tripName: '',
      destination: '',
      startDate: '',
      endDate: '',
      category: '',
      visibility: '',
    };

    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required';
      valid = false;
    }
    if (!destination) {
      newErrors.destination = 'Destination is required';
      valid = false;
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
      valid = false;
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required';
      valid = false;
    }
    // If both dates are provided, check if endDate is after startDate
    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      if (eDate <= sDate) {
        newErrors.endDate = 'End date must be after start date';
        valid = false;
      }
    }
    if (!category) {
      newErrors.category = 'Category is required';
      valid = false;
    }
    if (!visibility) {
      newErrors.visibility = 'Trip view is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission: validate then call API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNext = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      tripName,
      category,
      visibility,
      destination,
      startDate,
      endDate,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.create(payload);
      if (res.statusCode === HttpStatusCode.Created) {
        router.push(ROUTES_CONSTANTS.FLAGSHIP.CONTENT);
      }
    } catch (error: any) {
      console.error('Error:', error);
      // Extract the actual error message from the API response
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || 'Something went wrong while creating the flagship.';
      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full'>
        {/* Header */}
        <div className='text-center py-4'>
          <h1 className='text-2xl font-bold'>Create a Flagship</h1>
        </div>

        {/* Progress bar */}
        <ProgressBar steps={steps} activeStep={activeStep} />

        {/* Main Content */}
        <div className='px-4 pb-20'>
          <form className='space-y-6' onSubmit={handleNext}>
            <div>
              <h2 className='text-3xl font-bold mb-6'>1: Basics</h2>
              {/* Trip Name */}
              <div className='mb-8'>
                <label className='block text-lg mb-2' htmlFor='tripName'>
                  Name of the trip
                </label>
                <input
                  id='tripName'
                  type='text'
                  placeholder='Trip Name'
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className='w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400'
                />
                {errors.tripName && <p className='text-red-500 text-sm'>{errors.tripName}</p>}
              </div>

              {/* Destination */}
              <div className='mb-8'>
                <label className='block text-lg mb-2' htmlFor='destination'>
                  Search the destination
                </label>
                <div className='relative'>
                  <select
                    id='destination'
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className='w-full p-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-gray-400'
                  >
                    <option value=''>Select Destination</option>
                    {DESTINATIONS.map((dest) => (
                      <option key={dest.value} value={dest.value}>
                        {dest.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500' />
                </div>
                {errors.destination && <p className='text-red-500 text-sm'>{errors.destination}</p>}
              </div>

              {/* Dates */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div>
                  <label className='block text-lg mb-2' htmlFor='startDate'>
                    Start date
                  </label>
                  <div className='relative'>
                    <input
                      id='startDate'
                      type='date'
                      value={startDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setStartDate(e.target.value)}
                      className='w-full p-3 bg-gray-100 rounded-lg focus:outline-none'
                    />
                  </div>
                  {errors.startDate && <p className='text-red-500 text-sm'>{errors.startDate}</p>}
                </div>
                <div>
                  <label className='block text-lg mb-2' htmlFor='endDate'>
                    End date
                  </label>
                  <div className='relative'>
                    <input
                      id='endDate'
                      type='date'
                      value={endDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setEndDate(e.target.value)}
                      className='w-full p-3 bg-gray-100 rounded-lg focus:outline-none'
                    />
                  </div>
                  {errors.endDate && <p className='text-red-500 text-sm'>{errors.endDate}</p>}
                </div>
              </div>

              {/* Category */}
              <div className='mb-8'>
                <label className='block text-lg mb-2'>Category</label>
                <div className='flex flex-wrap gap-2'>
                  {['Detox', 'Flagship', 'Adventure', 'Student'].map((cat) => (
                    <button
                      key={cat}
                      type='button'
                      onClick={() => setCategory(cat.toLowerCase())}
                      className={`px-4 py-2 rounded-full ${category === cat.toLowerCase() ? 'bg-black text-white' : 'bg-gray-100'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && <p className='text-red-500 text-sm'>{errors.category}</p>}
              </div>

              {/* Trip View */}
              <div className='mb-8'>
                <label className='block text-lg mb-2'>Trip View</label>
                <div className='flex gap-2'>
                  {['Public', 'Private'].map((view) => (
                    <button
                      key={view}
                      type='button'
                      onClick={() => setVisibility(view.toLowerCase())}
                      className={`px-4 py-2 rounded-full ${visibility === view.toLowerCase() ? 'bg-black text-white' : 'bg-gray-100'
                        }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
                {errors.visibility && <p className='text-red-500 text-sm'>{errors.visibility}</p>}
              </div>
            </div>
            {/* Fixed Next Button */}

            <button
              type='submit'
              className={`w-full bg-orange-500 text-black py-4 rounded-lg text-lg font-medium transition-colors ${loading ? 'bg-gray-300 cursor-not-allowed' : ''
                }`}
              disabled={loading}
              aria-busy={loading || undefined}
            >
              {loading ? 'Processing...' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CreateFlagship, { allowedRoles: [ROLES.ADMIN] });
