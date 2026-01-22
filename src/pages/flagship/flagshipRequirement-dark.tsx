import { ArrowLeft, User } from 'lucide-react'
import { useState } from 'react'

export default function FlagshipRequirementsDark() {
  const [tripType, setTripType] = useState<'solo' | 'group'>('solo')

  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 text-white">
        <button className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">FLAGSHIP FORM</h1>
        <button className="p-2">
          <User className="h-6 w-6" />
        </button>
      </header>

      {/* Form */}
      <main className="px-4 py-6">
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="text-gray-400">Step 3 of 3</div>

          {/* Title */}
          <h2 className="text-2xl font-bold">
            Flagship Requirements
          </h2>

          {/* Form fields */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm text-gray-400">
                City Joining From
              </label>
              <input
                type="text"
                id="city"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your city"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="package" className="block text-sm text-gray-400">
                Package/Ticket
              </label>
              <input
                type="text"
                id="package"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Select your package"
              />
            </div>

            <div className="space-y-2">
              <div className="flex gap-8">
                <label className="flex items-center space-x-2">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      className="peer h-4 w-4 opacity-0"
                      checked={tripType === 'solo'}
                      onChange={() => setTripType('solo')}
                    />
                    <div className={`absolute h-4 w-4 rounded-full border ${
                      tripType === 'solo' ? 'border-brand-primary' : 'border-gray-600'
                    }`}>
                      {tripType === 'solo' && (
                        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm">Solo</span>
                </label>
                <label className="flex items-center space-x-2">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      className="peer h-4 w-4 opacity-0"
                      checked={tripType === 'group'}
                      onChange={() => setTripType('group')}
                    />
                    <div className={`absolute h-4 w-4 rounded-full border ${
                      tripType === 'group' ? 'border-brand-primary' : 'border-gray-600'
                    }`}>
                      {tripType === 'group' && (
                        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm">Group</span>
                </label>
              </div>
            </div>

            {tripType === 'group' && (
              <div className="space-y-2">
                <label htmlFor="members" className="block text-sm text-gray-400">
                  Group Members
                </label>
                <input
                  type="text"
                  id="members"
                  className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                  placeholder="Enter group members"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="expectations" className="block text-sm text-gray-400">
                Expectations of the trip (optional)
              </label>
              <textarea
                id="expectations"
                rows={4}
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your expectations"
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-white hover:bg-brand-primary-hover transition-colors"
            >
              Get Verified
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

