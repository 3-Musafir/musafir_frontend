'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navigation } from '../navigation';
import Header from '../../components/header';
import HomeEventCard from '@/components/cards/HomeEventCard';
import PassportUpcomingCard from '@/components/cards/PassportUpcomingCard';
import useFlagshipHook from '../../hooks/useFlagshipHandler';
import useRegistrationHook from '@/hooks/useRegistrationHandler';
import useCompanyProfile from '@/hooks/useCompanyProfile';
import useUserHandler from '@/hooks/useUserHandler';
import { CompanyProfile } from '@/services/types/companyProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/formatDate';

function Home() {
  const router = useRouter();
  const actionFlagship = useFlagshipHook();
  const registrationHook = useRegistrationHook();
  const userHandler = useUserHandler();
  const { getProfile } = useCompanyProfile();
  const [flagships, setFlagships] = useState<any[]>([]);
  const [upcomingRegistrations, setUpcomingRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userVerificationStatus, setUserVerificationStatus] = useState<string | undefined>(undefined);
  const fallbackLogo = '/3mwinterlogo.png';

  const fetchFlagships = async () => {
    try {
      setIsLoading(true);
      const data = await actionFlagship.getAllFlagships();
      if (data) {
        setFlagships(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching flagships:', error);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      setProfileLoading(true);
      const profile = await getProfile();
      setCompanyProfile(profile);
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchUpcomingRegistrations = async () => {
    try {
      const data = await registrationHook.getUpcomingPassport();
      if (data) {
        setUpcomingRegistrations(data);
      }
    } catch (error) {
      console.error('Error fetching upcoming registrations:', error);
    }
  };

  const fetchUserVerificationStatus = async () => {
    try {
      const status = await userHandler.getVerificationStatus();
      setUserVerificationStatus(status);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  useEffect(() => {
    fetchFlagships();
    fetchCompanyProfile();
    fetchUpcomingRegistrations();
    fetchUserVerificationStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const flagshipId = router.query?.flagshipId;
    if (typeof flagshipId === 'string' && flagshipId.length > 0) {
      localStorage.setItem('flagshipId', JSON.stringify(flagshipId));
    } else {
      localStorage.removeItem('flagshipId');
    }
  }, [router.isReady, router.query]);

  const actionableRegistrations = upcomingRegistrations.filter((event) => {
    if (!event?.flagship) return false;
    const dueAmount = Number(event.amountDue || 0);
    if (event.status === 'pending' || event.status === 'notReserved') return true;
    if (event.status === 'confirmed' && dueAmount > 0) return true;
    return false;
  });

  return (
    <div className='min-h-screen w-full bg-gray-50 flex flex-col'>
      <Header setSidebarOpen={() => {}} showMenuButton={false} />

      <main className='flex-1 overflow-y-auto p-4 bg-gray-50 space-y-6'>
        <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#515778] via-[#3e425f] to-[#2c3047] p-6 shadow-sm'>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl' />
            <div className='absolute right-0 -bottom-20 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl' />
          </div>
          <div className='relative flex flex-col items-center text-center space-y-4'>
            <div className='w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-transparent shadow-none'>
              {profileLoading ? (
                <Skeleton className='h-16 w-16 rounded-full' />
              ) : companyProfile?.logoUrl ? (
                <img
                  src={companyProfile.logoUrl}
                  alt={companyProfile.name || 'Company logo'}
                  className='h-full w-full object-cover'
                  width={112}
                  height={112}
                />
              ) : (
                <img
                  src={fallbackLogo}
                  alt='3Musafir logo'
                  className='h-full w-full object-cover'
                  width={112}
                  height={112}
                />
              )}
            </div>
            {profileLoading ? (
              <div className='space-y-3 w-full flex flex-col items-center'>
                <Skeleton className='h-7 w-52' />
                <Skeleton className='h-5 w-80' />
              </div>
            ) : (
              <div className='space-y-2 max-w-3xl'>
                <h1 className='text-3xl font-bold text-white leading-tight'>
                  {companyProfile?.name || '3Musafir'}
                </h1>
                <p className='text-base text-white/90'>
                  {companyProfile?.description ||
                    'A Founder Institute certified platform making community-led travel safe and sustainable for Asians globally.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {actionableRegistrations.length > 0 && (
          <section className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>Complete your payment</h2>
              <span className='text-sm text-gray-500'>Finish payment to confirm your seat</span>
            </div>
            <div className='space-y-4'>
              {actionableRegistrations.map((event) => (
                <PassportUpcomingCard
                  key={event._id}
                  registrationId={event._id}
                  title={event.flagship?.tripName}
                  date={formatDate(event.flagship?.startDate, event.flagship?.endDate)}
                  appliedDate={new Date(event.createdAt).toLocaleDateString()}
                  location={event.flagship?.destination}
                  image={event.flagship?.images?.[0]}
                  status={event.status}
                  paymentInfo={{
                    price: event.price,
                    dueAmount: event.amountDue,
                    discountApplied: event.discountApplied,
                  }}
                  detailedPlan={event.flagship?.detailedPlan}
                  userVerificationStatus={userVerificationStatus}
                  hasPaymentSubmitted={Boolean(event.paymentId)}
                  paymentStatus={
                    event.paymentId && typeof event.paymentId === 'object'
                      ? event.paymentId.status
                      : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section className='space-y-4 pb-16'>
          <div className='space-y-4'>
            {flagships.length > 0 ? (
              flagships.map((event) => {
                return <HomeEventCard key={event._id} {...event} />;
              })
            ) : isLoading ? (
              <div className='text-center text-gray-500 py-8'>
                <p className='text-xl font-medium mb-2'>Loading Flagships For You</p>
              </div>
            ) : (
              <div className='text-center text-gray-500 py-8'>
                <p className='text-xl font-medium mb-2'>No Flagships Available Yet</p>
                <p className='text-lg'>
                  Stay tuned! We&apos;re working on bringing exciting new flagships your way.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom navigation without Settings */}
      <Navigation />
    </div>
  );
}
export default Home;
