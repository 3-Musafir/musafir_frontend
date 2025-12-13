import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import MusafirLogo from './../../assets/musafir-logo.svg';

export default function LaunchScreen() {
  const router = useRouter()

  useEffect(() => {
    const queryParams = router.query;
    if (Object.keys(queryParams).length > 0) {
      localStorage.setItem('flagshipId', JSON.stringify(queryParams?.flagshipId));
      console.log('Query parameters saved:', queryParams);
    } else {
      localStorage.removeItem('flagshipId');
      console.log('Query parameters cleared');
    }
  }, [router.query]);
  return (
    <div className="min-h-screen bg-white md:flex md:items-center md:justify-center p-4">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-sm">
        {/* Login Button at Top */}
        <div className="flex justify-between items-center p-4 mt-4">
          <span className="text-md text-gray-600">Already have an account?</span>
          <button
            onClick={() => router.push('/login')}
            className="text-md text-gray-600 underline hover:text-orange-600 transition-colors"
          >
            Login
          </button>
        </div>

        {/* Content */}
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-[#2B2D42]">
          {/* Logo */}
          <div className="mb-8">
            <Image src={MusafirLogo} alt="Musafir Logo" className="h-16 w-16" />
          </div>

          {/* Question Text */}
          <h1 className="mb-12 text-center text-3xl font-bold leading-tight md:text-4xl">
            Have you ever registered for a 3Musafir flagship before?
          </h1>

          {/* Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button onClick={() => router.push('/musafir-signup')} className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600">
              Yes
            </button>
            <button onClick={() => router.push('/signup/create-account')} className="w-full rounded-lg border-2 border-orange-500 px-6 py-3 font-semibold text-[#2B2D42] transition-colors hover:bg-orange-500/10">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

