'use client';

import Dashboard from '@/components/dashboard/Dashboard';

// The home page now uses the unified Dashboard component
// which provides tab-based navigation between Home, Passport, Wallet, and Referrals
function Home() {
  return <Dashboard />;
}

export default Home;
