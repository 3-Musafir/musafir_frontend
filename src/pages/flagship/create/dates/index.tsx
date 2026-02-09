import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { Flagship } from '@/interfaces/flagship';
import { HttpStatusCode } from 'axios';
import { showAlert } from '@/pages/alert';
import { ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import dayjs from 'dayjs';
import withAuth from '@/hoc/withAuth';
import { mapErrorToUserMessage } from '@/utils/errorMessages';
import ProgressBar from '@/components/progressBar';
import { FlagshipService } from '@/services/flagshipService';
import { getEditIdFromSearch, withEditId } from '@/lib/flagship-edit';
import { ensureSilentUpdate, getContentVersionToken } from '@/lib/flagshipWizard';
import { loadDraft, saveDraft } from '@/lib/flagship-draft';

function ImportantDates() {
  const activeStep = 4;
  const router = useRouter();
  const action = useFlagshipHook();
  const [flagshipData, setFlagshipData] = useState<Flagship>({} as Flagship);
  const [editId, setEditId] = useState<string | null | undefined>(undefined);
  const isEditMode = Boolean(editId);
  // Date states
  const [tripDates, setTripDates] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [advancePaymentDeadline, setAdvancePaymentDeadline] = useState('');
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState('');

  interface FormErrors {
    tripDates: string;
    registrationDeadline: string;
    advancePaymentDeadline: string;
    earlyBirdDeadline: string;
  }

  const [errors, setErrors] = useState<FormErrors>({
    tripDates: '',
    registrationDeadline: '',
    advancePaymentDeadline: '',
    earlyBirdDeadline: '',
  });

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
    if (!flagshipData._id || !flagshipData.startDate) {
      showAlert('Create a Flagship', 'error');
      router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagshipData?._id, flagshipData?.startDate, isEditMode]);

  useEffect(() => {
    if (flagshipData) {
      // For tripDates (stored as a string)
      setTripDates(flagshipData.tripDates || '');

      // For dates, convert them to ISO string format (or any desired format) if available
      setRegistrationDeadline(
        flagshipData.registrationDeadline
          ? new Date(flagshipData.registrationDeadline).toISOString().slice(0, 10)
          : ''
      );
      setAdvancePaymentDeadline(
        flagshipData.advancePaymentDeadline
          ? new Date(flagshipData.advancePaymentDeadline).toISOString().slice(0, 10)
          : ''
      );
      setEarlyBirdDeadline(
        flagshipData.earlyBirdDeadline
          ? new Date(flagshipData.earlyBirdDeadline).toISOString().slice(0, 10)
          : ''
      );
    }
  }, [flagshipData]);

  // Extract and format trip dates when flagshipData changes
  useEffect(() => {
    if (flagshipData.startDate && flagshipData.endDate) {
      const start = dayjs(flagshipData.startDate);
      const end = dayjs(flagshipData.endDate);
      // Example format: "23 Feb - 25 Feb"
      setTripDates(`${start.format('DD MMM')} - ${end.format('DD MMM')}`);
    }
  }, [flagshipData.startDate, flagshipData.endDate]);

  const validateDeadline = (deadline: string, fieldName: string): string => {
    if (!deadline.trim()) {
      return `${fieldName} is required`;
    }
    const deadlineDate = dayjs(deadline);
    const startDate = dayjs(flagshipData.startDate);
    if (!deadlineDate.isBefore(startDate)) {
      return `${fieldName} must be before the flagship start date`;
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      tripDates: '',
      registrationDeadline: '',
      advancePaymentDeadline: '',
      earlyBirdDeadline: '',
    };

    if (!tripDates.trim()) {
      newErrors.tripDates = 'Trip Dates are required';
    }
    newErrors.registrationDeadline = validateDeadline(
      registrationDeadline,
      'Registration Deadline'
    );
    newErrors.advancePaymentDeadline = validateDeadline(
      advancePaymentDeadline,
      'Advance Payment Deadline'
    );
    newErrors.earlyBirdDeadline = validateDeadline(earlyBirdDeadline, 'Early Bird Deadline');

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formData = {
      tripDates,
      registrationDeadline: new Date(registrationDeadline),
      advancePaymentDeadline: new Date(advancePaymentDeadline),
      earlyBirdDeadline: new Date(earlyBirdDeadline),
      contentVersion: getContentVersionToken(flagshipData),
    };
    ensureSilentUpdate(formData);

    try {
      const flagshipId = flagshipData._id || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Dates Added!', 'success');
        if (res?.data) {
          setFlagshipData(res.data);
          saveDraft(editId ? 'edit' : 'create', editId ?? null, res.data);
        }
        router.push(withEditId(ROUTES_CONSTANTS.FLAGSHIP.DISCOUNTS, editId));
      }
    } catch (error) {
      console.error('Network error', error);
      showAlert(mapErrorToUserMessage(error), 'error');
    }
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
          <h2 className='text-3xl font-bold mb-6'>5: Imp Dates</h2>

          {/* Trip Dates */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Trip Dates</h3>
            <div className='bg-gray-100 rounded-xl p-4'>
              <input
                type='text'
                value={tripDates}
                onChange={(e) => setTripDates(e.target.value)}
                className='w-full bg-transparent focus:outline-none text-lg'
                placeholder='23-24th Feb'
                disabled
              />
            </div>
            {errors.tripDates && <p className='text-brand-error text-sm'>{errors.tripDates}</p>}
          </div>

          {/* Registration Deadline */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Registration Deadline</h3>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <div>
                  <input
                    type='date'
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className='w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-lg'
                    placeholder='MM/DD/YYYY'
                  />
                </div>
                {errors.registrationDeadline && (
                  <p className='text-brand-error text-sm'>{errors.registrationDeadline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Advance Payment Deadline */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Advance Payment Deadline</h3>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <div>
                  <input
                    type='date'
                    value={advancePaymentDeadline}
                    onChange={(e) => setAdvancePaymentDeadline(e.target.value)}
                    className='w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-lg'
                    placeholder='MM/DD/YYYY'
                  />
                </div>
                {errors.advancePaymentDeadline && (
                  <p className='text-brand-error text-sm'>{errors.advancePaymentDeadline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Early Bird Deadline */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-3'>Early Bird Deadline</h3>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <input
                  type='date'
                  value={earlyBirdDeadline}
                  onChange={(e) => setEarlyBirdDeadline(e.target.value)}
                  className='w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none text-lg'
                  placeholder='MM/DD/YYYY'
                />
              </div>
            </div>
            {errors.earlyBirdDeadline && (
              <p className='text-brand-error text-sm'>{errors.earlyBirdDeadline}</p>
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

export default withAuth(ImportantDates, { allowedRoles: [ROLES.ADMIN] });
