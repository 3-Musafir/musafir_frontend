'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '@/hoc/withAuth';

// Wallet page now redirects to the unified Dashboard with wallet tab
function Wallet() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home with wallet tab selected
    router.replace('/home?tab=wallet');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

export default withAuth(Wallet);
