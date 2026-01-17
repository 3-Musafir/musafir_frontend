'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ROLES, ROUTES_CONSTANTS, steps } from '@/config/constants';
import { Flagship } from '@/interfaces/flagship';
import { showAlert } from '@/pages/alert';
import { currentFlagship } from '@/store';
import { HttpStatusCode } from 'axios';
import { useRecoilValue } from 'recoil';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import withAuth from '@/hoc/withAuth';
import ProgressBar from '@/components/progressBar';

function PaymentOptions() {
  const activeStep = 6;
  const router = useRouter();
  const action = useFlagshipHook();
  const flagshipData: Flagship = useRecoilValue(currentFlagship);
  // Selected bank and expanded states
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [expandedBank, setExpandedBank] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Bank accounts data
  const bankAccounts = [
    {
      id: '1',
      name: 'Standard Chartered',
      logo: '/sc.png',
      accountNumber: '1234-5678-9012-3456',
      accountTitle: 'John Doe',
      branch: 'Main Branch, City Center',
    },
    {
      id: '2',
      name: "Ali's Standard Charte",
      logo: '/db.png',
      accountNumber: '9876-5432-1098-7654',
      accountTitle: 'Ali Ahmed',
      branch: 'Downtown Branch',
    },
  ];

  // Toggle bank details
  const toggleBankDetails = (bankId: string) => {
    setExpandedBank(expandedBank === bankId ? null : bankId);
  };

  useEffect(() => {
    if (!flagshipData._id || !flagshipData.startDate) {
      showAlert('Create a Flagship', 'error');
      // router.push(ROUTES_CONSTANTS.FLAGSHIP.CREATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (flagshipData && flagshipData.selectedBank) {
      setSelectedBank(flagshipData.selectedBank);
    }
  }, [flagshipData]);

  // Handle form submission
  const handleSubmit = async () => {
    // Validate that a bank account is selected
    if (!selectedBank) {
      setError('Please select a bank account.');
      return;
    } else {
      setError('');
    }

    // Build payload (if additional data is required, add here)
    const formData = { selectedBank };
    console.log(formData, 'payload');

    try {
      const flagshipId = flagshipData._id || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await action.update(flagshipId, formData);
      if (res.statusCode === HttpStatusCode.Ok) {
        showAlert('Bank Selected!', 'success');
        router.push(ROUTES_CONSTANTS.FLAGSHIP.SUCCESS);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('There was an error processing your payment. Please try again.');
    }
  };

  return (
    <div className='min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0'>
      <div className='bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full'>
        {/* Title */}
        <div className='text-center py-4'>
          <h1 className='text-2xl font-bold'>Create a Flagship</h1>
        </div>

        {/* Progress bar */}
        <ProgressBar steps={steps} activeStep={activeStep} />

        {/* Main Content */}
        <div className='px-4 pb-20'>
          <h2 className='text-3xl font-bold mb-6'>7: Payment options</h2>

          {/* Bank Account Selection */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold mb-2'>Select Bank Account</h3>
            <p className='text-gray-500 mb-6'>
              Choose the bank account where you transferred the investment
            </p>

            {/* Bank Account List */}
            <div className='space-y-4'>
              {bankAccounts.map((bank) => (
                <div key={bank.id} className='border rounded-xl overflow-hidden'>
                  <div
                    className='flex items-center p-4 cursor-pointer hover:bg-gray-50'
                    onClick={() => {
                      setSelectedBank(bank.id);
                      toggleBankDetails(bank.id);
                    }}
                  >
                    {/* Radio Button */}
                    <div className='mr-4'>
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${selectedBank === bank.id ? 'border-blue-500' : 'border-gray-300'
                          } flex items-center justify-center`}
                      >
                        {selectedBank === bank.id && (
                          <div className='w-3 h-3 rounded-full bg-blue-500' />
                        )}
                      </div>
                    </div>

                    {/* Bank Logo */}
                    <div className='mr-3'>
                      <Image
                        src={bank.logo || '/placeholder.svg'}
                        alt={bank.name}
                        width={40}
                        height={40}
                        className='rounded-full'
                      />
                    </div>

                    {/* Bank Name */}
                    <div className='flex-1'>
                      <h4 className='text-lg font-medium'>{bank.name}</h4>
                    </div>

                    {/* Dropdown Icon */}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${expandedBank === bank.id ? 'rotate-180' : ''
                        }`}
                    />
                  </div>

                  {/* Bank Details (Expandable) */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${expandedBank === bank.id ? 'max-h-48' : 'max-h-0'
                      }`}
                  >
                    <div className='p-4 bg-gray-50 space-y-3'>
                      <div>
                        <p className='text-sm text-gray-500'>Account Number</p>
                        <p className='font-medium'>{bank.accountNumber}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Account Title</p>
                        <p className='font-medium'>{bank.accountTitle}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Branch</p>
                        <p className='font-medium'>{bank.branch}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {error && <p className='text-brand-error text-sm mt-2'>{error}</p>}
          </div>
        </div>

        {/* Back to Home Button */}
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

export default withAuth(PaymentOptions, { allowedRoles: [ROLES.ADMIN] });
