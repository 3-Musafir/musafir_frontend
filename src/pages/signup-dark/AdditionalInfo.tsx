import { ArrowLeft, User } from 'lucide-react'

export default function AdditionalInfo() {
  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      {/* Header */}
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
          <div className="text-gray-400">Step 2 of 3</div>

          {/* Title */}
          <h2 className="text-2xl font-bold">
            Additional Information
          </h2>

          {/* Form fields */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="cnic" className="block text-sm text-gray-400">
                CNIC
              </label>
              <input
                type="text"
                id="cnic"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your CNIC number"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="institution" className="block text-sm text-gray-400">
                University/Workplace/Institute
              </label>
              <input
                type="text"
                id="institution"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your institution"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="social" className="block text-sm text-gray-400">
                Socials Handle/Insta
              </label>
              <input
                type="text"
                id="social"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your social media handle"
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-white hover:bg-brand-primary-hover transition-colors"
            >
              Flagship Preferences
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

