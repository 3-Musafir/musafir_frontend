import type React from 'react';
import { ArrowLeft, Camera, Trash, Video, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useVerificationHook from '../../hooks/useVerificationHandler';

import { showAlert } from '../alert';
import { Navigation } from '../navigation';
import { ROLES } from '@/config/constants';
import withAuth from '@/hoc/withAuth';
import useUserHandler from '@/hooks/useUserHandler';

function GetVerified() {
  const router = useRouter();
  const { getMe } = useUserHandler();
  const [verificationStatus, setVerificationStatus] = useState<string | undefined>(undefined);
  const [fallbackPath, setFallbackPath] = useState<string>('/home');
  const [returnToPath, setReturnToPath] = useState<string | null>(null);
  const [referral1, setReferral1] = useState('');
  const [referral2, setReferral2] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [flagshipId, setFlagshipId] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [requestCall, setRequestCall] = useState(false);
  const action = useVerificationHook();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const safeExitPath = returnToPath ? '/passport' : '/home';

  useEffect(() => {
    const flagshipId = localStorage.getItem('flagshipId');
    if (flagshipId) {
      setFlagshipId(JSON.parse(flagshipId));
    }

    // Compute a fallback path based on referrer, else default to home
    if (typeof window !== 'undefined') {
      try {
        const ref = document.referrer;
        if (ref && ref.startsWith(window.location.origin)) {
          const url = new URL(ref);
          setFallbackPath(url.pathname || '/home');
        }
      } catch (err) {
        setFallbackPath('/home');
      }

      try {
        const rt = localStorage.getItem('verificationReturnTo');
        if (rt) setReturnToPath(rt);
      } catch (err) {
        setReturnToPath(null);
      }
    }

    const ensureNotVerified = async () => {
      try {
        const user = await getMe();
        const status = (user as any)?.verification?.status;
        setVerificationStatus(status);
        if (status === 'verified') {
          let rt: string | null = null;
          try {
            rt = typeof window !== 'undefined' ? localStorage.getItem('verificationReturnTo') : null;
          } catch (e) {
            rt = null;
          }
          if (rt) {
            try {
              localStorage.removeItem('verificationReturnTo');
            } catch (e) {
              // ignore
            }
            router.replace(rt);
          } else {
            router.replace('/home');
          }
        }
      } catch (err) {
        console.error('Failed to fetch user for verification check', err);
      }
    };

    ensureNotVerified();
  }, []);

  // Function to check if any verification method is selected
  const isFormValid = () => {
    return (referral1 || referral2) || videoLink || requestCall || videoFile;
  };

  // Function to check which verification method is selected
  const getSelectedMethod = () => {
    if (referral1 || referral2) return 'referral';
    if (videoLink || videoFile) return 'video';
    if (requestCall) return 'call';
    return null;
  };
  
  // Function to check if a method should be disabled
  const isMethodDisabled = (method: string) => {
    const selected = getSelectedMethod();
    return selected !== null && selected !== method;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      showAlert('Please fulfill at least one verification method.', 'error');
      return;
    }

    // Check if only one referral code is provided
    if ((referral1 && !referral2) || (!referral1 && referral2)) {
      showAlert('Please provide both referral codes for referral verification.', 'error');
      return;
    }

    const formData = new FormData();
    if (referral1) formData.append('referral1', referral1);
    if (referral2) formData.append('referral2', referral2);
    if (videoLink) formData.append('videoUrl', videoLink);
    if (videoFile) formData.append('video', videoFile);
    if (requestCall) formData.append('requestCall', requestCall.toString());
    if (flagshipId) formData.append('flagshipId', flagshipId);

    try {
      setIsSubmitting(true);
      const res: any = await action.requestVerification(formData);
      if (res?.statusCode === 200) {
        if (returnToPath) {
          // If user came here because of a gated flow (e.g., payment), keep them on this page and show pending state.
          setVerificationStatus('pending');
          return;
        }
        flagshipId ? router.push('flagship/seats') : router.push('/home');
      } else {
        showAlert('Verification request failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Verification request failed:', error);
      showAlert('Verification request failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestCameraPermission = async () => {
    if (typeof window === 'undefined') return false;
    if (!window.isSecureContext) {
      showAlert('Camera access requires a secure (HTTPS) connection.', 'error');
      return false;
    }
    if (!navigator?.mediaDevices?.getUserMedia) {
      showAlert('Camera access is not supported in this browser.', 'error');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      const err = error as { name?: string };
      switch (err?.name) {
        case 'NotAllowedError':
          showAlert('Camera permission denied. Please allow access and try again.', 'error');
          break;
        case 'NotFoundError':
          showAlert('No camera device found. Please connect a camera and try again.', 'error');
          break;
        case 'NotReadableError':
          showAlert('Camera is in use by another application.', 'error');
          break;
        default:
          showAlert('Could not access camera. Please check permissions.', 'error');
      }
      return false;
    }
  };

  const handleRecordVideo = async () => {
    try {
      setIsRecording(true);
      // Clear other verification methods
      setReferral1('');
      setReferral2('');
      setRequestCall(false);
      setVideoLink('');

      const granted = await requestCameraPermission();
      if (!granted) {
        return;
      }

      // Here you would implement the actual video recording functionality
      // For now, just showing that this method was selected
    } catch (error) {
      console.error('Error accessing camera:', error);
      showAlert('Could not access camera. Please check permissions.', 'error');
    } finally {
      setIsRecording(false);
    }
  }

  const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear other verification methods
      setReferral1('');
      setReferral2('');
      setRequestCall(false);
      setVideoLink('');
      // Set the video file
      setVideoFile(file);
    }
  };

  const handleRemoveFile = () => {
    setVideoFile(null);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    // This doesn't clear other verification methods since removing a file
    // should just reset the video upload, not switch to another method
  };

  return (
    <div className='min-h-screen bg-white p-3 pb-24'>
      {/* Header */}
      <header className='flex items-center p-4 border-b'>
        <button
          type='button'
          onClick={() => {
            router.push(safeExitPath);
          }}
          className='p-2 hover:bg-gray-100 rounded-full'
        >
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='text-center flex-1 text-xl font-semibold mr-7'>Verification</h1>
      </header>

      {/* Main Content */}
      <main className='p-4 max-w-md mx-auto'>
        {verificationStatus === 'pending' && (
          <section className='mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Verification in review</h2>
            <p className='text-sm text-gray-600 mt-2'>
              We’re reviewing your submission. We’ll notify you as soon as it’s done.
            </p>
            <div className='mt-4 flex gap-2'>
              <button
                type='button'
                onClick={() => router.push(safeExitPath)}
                className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'
              >
                {returnToPath ? 'Back to passport' : 'Back to home'}
              </button>
            </div>
          </section>
        )}

        {verificationStatus === 'rejected' && (
          <section className='mb-8 rounded-lg border border-red-200 bg-red-50 p-4'>
            <h2 className='text-lg font-semibold text-red-800'>Verification not approved</h2>
            <p className='text-sm text-brand-error mt-2'>
              Please resubmit your verification. You can use referral codes, a video link, or request a call.
            </p>
          </section>
        )}

        {(verificationStatus === 'unverified' || verificationStatus === 'rejected' || !verificationStatus) && (
          <>
            {/* Referral Codes Section */}
            <section className='mb-8'>
              <h2 className='text-2xl font-bold mb-1'>Referral Codes</h2>
              <p className='text-gray-500 text-sm mb-4'>Instant</p>
              <p className='text-gray-500 mb-6'>
                You need <span className='font-medium'>2 musafirs</span> from the community to vouch for
                you. Ask them for their referral code
              </p>

              <div className='grid grid-cols-2 gap-4 mb-8'>
                <div>
                  <label htmlFor='referral1' className='block text-sm font-medium mb-2'>
                    Referral 1
                  </label>
                  <div className="relative">
                    <input
                      type='text'
                      id='referral1'
                      placeholder='paste code here'
                      value={referral1}
                      onChange={(e) => {
                        const value = e.target.value;
                        setReferral1(value);
                        // If entering a referral code, clear other verification methods
                        if (value) {
                          setVideoLink('');
                          setVideoFile(null);
                          setRequestCall(false);
                        }
                      }}
                      disabled={isMethodDisabled('referral')}
                      title={isMethodDisabled('referral') ? 'Only one verification method can be chosen at a time' : ''}
                      className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${isMethodDisabled('referral') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {referral1 && (
                      <button
                        type="button"
                        onClick={() => setReferral1('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor='referral2' className='block text-sm font-medium mb-2'>
                    Referral 2
                  </label>
                  <div className="relative">
                    <input
                      type='text'
                      id='referral2'
                      placeholder='paste code here'
                      value={referral2}
                      onChange={(e) => {
                        const value = e.target.value;
                        setReferral2(value);
                        // If entering a referral code, clear other verification methods
                        if (value) {
                          setVideoLink('');
                          setVideoFile(null);
                          setRequestCall(false);
                        }
                      }}
                      disabled={isMethodDisabled('referral')}
                      title={isMethodDisabled('referral') ? 'Only one verification method can be chosen at a time' : ''}
                      className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${isMethodDisabled('referral') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {referral2 && (
                      <button
                        type="button"
                        onClick={() => setReferral2('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-bold">OR</span>
              </div>
            </div>

            {/* Intro Video Section */}
            <section className='mb-8'>
              <h2 className='text-2xl font-bold mb-1'>Intro Video</h2>
              <p className='text-gray-500 text-sm mb-4'>Quick (upto 36 hours)</p>
              <p className='text-gray-600 mb-6'>
                Include a video or record one for additional info or clarification. (Preferable a minute
                long but can be longer)
              </p>

              <div className='space-y-4'>
                <div>
                  <label htmlFor='videoLink' className='block text-sm font-medium mb-2'>
                    Video Link
                  </label>
                  <div className="relative">
                    <input
                      type='text'
                      id='videoLink'
                      placeholder='paste link here'
                      value={videoLink}
                      onChange={(e) => {
                        const value = e.target.value;
                        setVideoLink(value);
                        // If entering a video link, clear other verification methods
                        if (value) {
                          setReferral1('');
                          setReferral2('');
                          setVideoFile(null);
                          setRequestCall(false);
                        }
                      }}
                      disabled={isMethodDisabled('video')}
                      title={isMethodDisabled('video') ? 'Only one verification method can be chosen at a time' : ''}
                      className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${isMethodDisabled('video') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {videoLink && (
                      <button
                        type="button"
                        onClick={() => setVideoLink('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleRecordVideo} 
                    disabled={isMethodDisabled('video') || isRecording}
                    title={isMethodDisabled('video') ? 'Only one verification method can be chosen at a time' : ''}
                    className={`p-8 bg-white rounded-lg flex flex-col items-center justify-center gap-2 ${!isMethodDisabled('video') ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'} transition-colors`}
                    aria-busy={isRecording || undefined}
                  >
                    <Video className="h-6 w-6" />
                    <span className="text-sm font-medium">
                      {isRecording ? 'Opening Camera...' : 'Record Video'}
                    </span>
                  </button>
                  <label 
                    title={isMethodDisabled('video') ? 'Only one verification method can be chosen at a time' : ''}
                    className={`p-8 bg-white rounded-lg flex flex-col items-center justify-center gap-2 ${!isMethodDisabled('video') ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'} transition-colors`}>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleUploadVideo}
                      className="hidden"
                      title={isMethodDisabled('video') ? 'Only one verification method can be chosen at a time' : ''}
                      disabled={isUploading || isMethodDisabled('video')}
                    />
                    <Camera className="h-6 w-6" />
                    <span className="text-sm font-medium">
                      {isUploading ? 'Uploading...' : 'Upload Video'}
                    </span>
                  </label>
                </div>
                {videoFile && (
                  <div className="flex items-center justify-between">
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {videoFile.name}
                    </div>
                    <button onClick={handleRemoveFile} className="text-brand-error hover:text-brand-error p-3">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </section>

            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-bold">OR</span>
              </div>
            </div>

            {/* Verification Call Section */}
            <section className='mb-8'>
              <h2 className='text-2xl font-bold mb-1'>Get a verification call</h2>
              <p className='text-gray-500 text-sm mb-4'>Slower (upto 3 working days)</p>
              <p className='text-gray-600 mb-4'>
                Someone from the onboarding team will call you and check your vibe. This is to ensure if
                you fit the right musafir persona
              </p>

              <label 
                title={isMethodDisabled('call') ? 'Only one verification method can be chosen at a time' : ''}
                className={`flex items-center space-x-2 ${!isMethodDisabled('call') ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                <input
                  type='checkbox'
                  checked={requestCall}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRequestCall(checked);
                    // If requesting a call, clear other verification methods
                    if (checked) {
                      setReferral1('');
                      setReferral2('');
                      setVideoLink('');
                      setVideoFile(null);
                    }
                  }}
                  disabled={isMethodDisabled('call')}
                  title={isMethodDisabled('call') ? 'Only one verification method can be chosen at a time' : ''}
                  className='h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-orange-500 accent-black'
                />
                <span className='text-black'>I want verification call</span>
              </label>
            </section>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className='w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-md text-base font-medium transition-colors'
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </>
        )}
      </main>
      <Navigation />
    </div>
  );
}

export default withAuth(GetVerified, { allowedRoles: [ROLES.MUSAFIR] });
