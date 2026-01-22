import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Unauthorized() {
  const router = useRouter();

  const handleSignOut = async () => {
    const base = process.env.NEXT_PUBLIC_AUTH_URL?.trim();
    const callbackUrl = base ? `${base}/login` : '/login';
    await signOut({ callbackUrl });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='h-screen bg-white w-full max-w-md mx-auto rounded-lg shadow-sm'>
        {/* Header */}
        <header className='flex items-center p-4 border-b'>
          <button className='p-2 hover:bg-gray-100 rounded-full' onClick={handleGoBack}>
            {/* <a className='p-2 hover:bg-gray-100 rounded-full'> */}
            <ArrowLeft className='h-5 w-5' />
            {/* </a> */}
          </button>
          <h1 className='flex-1 text-center text-xl font-semibold'>Unauthorized</h1>
        </header>

        {/* Main Content */}
        <main className='p-4'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold mb-2'>Access Denied</h2>
            <p className='text-gray-600'>
              You do not have permission to access this page. Please contact your administrator for
              access.
            </p>
          </div>

          <div className='flex flex-col gap-4'>
            <button
              onClick={handleSignOut}
              className='w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-md text-sm font-medium transition-colors'
            >
              Sign Out
            </button>
            <button
              onClick={handleGoBack}
              className='w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-md text-sm font-medium transition-colors'
            >
              Go Back
            </button>
            <button
              onClick={handleSignOut}
              className='w-full text-center border border-gray-300 hover:bg-gray-50 py-4 rounded-md text-sm font-medium transition-colors'
            >
              {/* <a className='w-full text-center border border-gray-300 hover:bg-gray-50 py-4 rounded-md text-sm font-medium transition-colors'> */}
              Return to Login
              {/* </a> */}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
