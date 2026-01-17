import { useState } from "react"
import { ArrowLeft, User } from 'lucide-react'

export default function MusafirForm() {
  const [gender, setGender] = useState('');

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-white">
            {/* Header */}
      {/* <Header/> */}
      <header className="flex items-center justify-between p-4 text-white">
        <button className="p-2">
        <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">Musafir ID Form</h1>
        <button className="p-2">
        <User className="h-6 w-6" />
        </button>
      </header>
      {/* Form */}
      <main className="px-4 py-6">
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="text-gray-400">Step 1 of 3</div>

          {/* Title */}
          <h2 className="text-2xl font-bold">
            No worries, let&apos;s get to know you first!
          </h2>

          {/* Form fields */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Gender</label>
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-gray-600 p-1">
                {['Male', 'Female', 'Other'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-md px-4 py-2 text-sm transition-colors ${
                      gender === option.toLowerCase()
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setGender(option.toLowerCase())}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm text-gray-400">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-white hover:bg-brand-primary-hover transition-colors"
            >
              Next
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

