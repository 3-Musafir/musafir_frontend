'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navigation } from '../navigation';
import Header from '../../components/header';
import HomeEventCard from '@/components/cards/HomeEventCard';
import useFlagshipHook from '../../hooks/useFlagshipHandler';
import useCompanyProfile from '@/hooks/useCompanyProfile';
import { CompanyProfile } from '@/services/types/companyProfile';
import { Skeleton } from '@/components/ui/skeleton';

function Home() {
  const router = useRouter();
  const actionFlagship = useFlagshipHook();
  const { getProfile } = useCompanyProfile();
  const [flagships, setFlagships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
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

  useEffect(() => {
    fetchFlagships();
    fetchCompanyProfile();
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
