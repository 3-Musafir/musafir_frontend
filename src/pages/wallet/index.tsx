'use client';

import React, { useState } from 'react';
import { Navigation } from '../navigation';
import Header from '../../components/header';
import withAuth from '@/hoc/withAuth';

function Wallet() {
  return (
    <div className='min-h-screen w-full bg-gray-50 flex flex-col'>
      <Header setSidebarOpen={() => { }} showMenuButton={false} />

      <main className='flex-1 overflow-y-auto px-4 pb-24 pt-16 md:pt-6'>
        <h1 className='text-2xl font-semibold mb-6'>Wallet</h1>
        <div className='flex flex-col items-center justify-center h-60 text-gray-400'>
          <p className='text-center text-xl mb-2'>Coming Soon!</p>
          <p className='text-justify'>
            We're working on something exciting! Soon you'll be able to manage your travel funds, track all your expenses, and make seamless transactions all in one place. Stay tuned for this amazing feature!
          </p>
        </div>
      </main>

      <Navigation />
    </div>
  );
}

export default withAuth(Wallet);
