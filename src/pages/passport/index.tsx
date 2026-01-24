'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '@/hoc/withAuth';

// Passport page now redirects to the unified Dashboard with passport tab
function Passport() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home with passport tab selected
    router.replace('/home?tab=passport');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

export default withAuth(Passport);
