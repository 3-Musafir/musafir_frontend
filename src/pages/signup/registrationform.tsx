import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function RegistrationForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [gender, setGender] = useState('female')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [flagshipId, setFlagshipId] = useState('');
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  
  useEffect(() => {
    const flagshipId = localStorage.getItem('flagshipId');
    if (flagshipId) {
      setFlagshipId(JSON.parse(flagshipId));
    }

    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
    if (savedData) {
      setGender(savedData?.gender || '');
      setFullName(savedData?.fullName || '');
      setPhone(savedData?.phone || '');
    }

    // Pre-fill form with Google OAuth data if available
    if (session?.user) {
      setFullName(session.user.name || savedData?.fullName || '');
    }
  }, [status, session, router]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formatedPhone = `0${phone}`;
    const formatedWhatsapp = whatsappPhone? `0${whatsappPhone}` : whatsappPhone;
    const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
    const formData = { ...savedData, gender, fullName, phone: formatedPhone, whatsappPhone: formatedWhatsapp };

    localStorage.setItem("formData", JSON.stringify(formData));
    router.push(flagshipId ? '/flagship/flagship-requirement' : '/signup/additionalinfo')
  };

  // Show loading state while session is being loaded
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center p-0">
      <div className="bg-white w-full max-w-md mx-auto shadow-sm p-3">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl font-semibold text-center flex-grow">Onboarding</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-3 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm">
                1
              </div>
              <span className="mt-2 text-sm font-medium">Basic</span>
            </div>

            {/* Line (centered absolutely) */}
            <div className="absolute left-6 right-6 top-1/4 transform -translate-y-1/2 z-0">
              <div className="w-full h-0.5 bg-[#F3F3F3]" />
            </div>

            {/* Step 2 (conditionally rendered) */}
            {flagshipId && (
              <>
                <div className="flex flex-col items-center z-10" onClick={() => router.push('/flagship/flagship-requirement')}>
                  <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                    2
                  </div>
                  <span className="mt-2 text-sm text-gray-600">Flagship</span>
                </div>
              </>
            )}

            {/* Step 3 */}
            <div className="flex flex-col items-center z-10" onClick={() => router.push('/signup/additionalinfo')}>
              <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#A6A6A6] flex items-center justify-center text-sm">
                {flagshipId ? 3 : 2}
              </div>
              <span className="mt-2 text-sm text-gray-600">Background</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 text-[#2B2D42]">Lets get to know you first!</h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Gender</label>
              <div className="flex gap-3">
                {['male', 'female', 'other'].map((value) => (
                  <label
                    key={value}
                    className={`px-4 py-2 rounded-full cursor-pointer ${gender === value ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={value}
                      checked={gender === value}
                      onChange={(e) => setGender(e.target.value)}
                      className="sr-only"
                      required
                    />
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter your full name"
                />
                {fullName && (
                  <button
                    type="button"
                    onClick={() => setFullName('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone
              </label>
              <div className="flex gap-2">
                <select
                  className="w-[100px] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="+92">+92</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  required
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  placeholder="3XXXXXXXXX"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Checkbox to show second phone number */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showSecondPhone"
                onChange={() => {
                  setShowWhatsapp(!showWhatsapp)
                }}
                className="mr-2 accent-black"
              />
              <label htmlFor="showSecondPhone" className="text-sm font-medium">
                I use the same number for my Whatsapp
              </label>
            </div>
            <div className="space-y-2">
              <label htmlFor="secondPhone" className="block text-sm font-medium">
                Whatsapp
              </label>
              <div className="flex gap-2">
                <select
                  className="w-[100px] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled={showWhatsapp}
                >
                  <option value="+92">+92</option>
                </select>
                <input
                  type="tel"
                  id="secondPhone"
                  value={whatsappPhone}
                  required
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setWhatsappPhone(value);
                    }
                  }}
                  placeholder="3XXXXXXXXX"
                  disabled={showWhatsapp}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-md text-sm font-medium transition-colors"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

