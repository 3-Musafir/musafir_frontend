import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSignupHook from '@/hooks/useSignUp';
import { SignupUser } from '@/interfaces/signup';
import { useRecoilState } from 'recoil';
import { currentUser } from '../../store';

export default function SetPassword() {
  const router = useRouter();
  const action = useSignupHook();
  const [, setCurrentUserState] = useRecoilState(currentUser);
  const [password, setPassword] = useState('Ahmad@123.');
  const [confirmPassword, setConfirmPassword] = useState('Ahmaade@123.');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
    console.log({ ...savedData, password });
    const payload: SignupUser = { ...savedData, password };
    const user = await action.register(payload);
    console.log(user, 'userrrrrr');
    setCurrentUserState(user);
    router.push('/signup/email-verify');
  };

  return (
    <div className='min-h-screen bg-white p-4'>
      <div className='bg-white w-full max-w-md mx-auto rounded-lg'>
        {/* Header */}
        <header className='flex items-center p-4 border-b'>
          <Link href='signup/create-account' className='p-2 hover:bg-gray-100 rounded-full'>
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <h1 className='text-center flex-1 text-xl font-semibold mr-7'>Account Creation</h1>
        </header>

        {/* Main Content */}
        <main className='p-4 max-w-md mx-auto'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold'>Set Up Your Password</h2>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <label htmlFor='password' className='block text-sm font-medium'>
                Password
              </label>
              <input
                type='password'
                id='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full input-field'
              />
              <p className='text-sm text-gray-500'>Password must be at least 8 characters</p>
            </div>

            <div className='space-y-2'>
              <label htmlFor='confirmPassword' className='block text-sm font-medium'>
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full input-field'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-md text-sm font-medium transition-colors'
            >
              On to Flagship Deeds
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
