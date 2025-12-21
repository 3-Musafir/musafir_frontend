'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navigation } from '../navigation';
import Header from '../../components/header';
import HomeEventCard from '@/components/cards/HomeEventCard';
import useFlagshipHook from '../../hooks/useFlagshipHandler';

function Home() {
  const router = useRouter();
  const actionFlagship = useFlagshipHook();
  const [flagships, setFlagships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchFlagships();
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

      <main className='flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50'>
        <section className='mb-6'>
          <h1 className='text-2xl font-semibold mb-2'>Home</h1>
          <h2 className='text-3xl font-bold text-[#2B2D42]'>Upcoming Flagships</h2>
        </section>

        <div className='space-y-4 pb-16 md:pb-6'>
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
              <p className='text-lg '>
                Stay tuned! We&apos;re working on bringing exciting new flagships your way.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom navigation without Settings */}
      <Navigation />
    </div>
  );
}
export default Home;
