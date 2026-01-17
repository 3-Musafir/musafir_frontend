import { ArrowLeft, User, Video, Camera } from 'lucide-react'

export default function GetVerified() {
  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 text-white">
        <button className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">Get Verified</h1>
        <button className="p-2">
          <User className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="space-y-8">
          {/* Referral Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Add 2 Referral Codes</h2>
            <p className="text-sm text-gray-400">
              Get instant verification if two community members vouch for you! You may ask them for a referral code
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="referral1" className="block text-sm text-gray-400">
                  Referral 1
                </label>
                <input
                  type="text"
                  id="referral1"
                  className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                  placeholder="Enter referral code"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="referral2" className="block text-sm text-gray-400">
                  Referral 2
                </label>
                <input
                  type="text"
                  id="referral2"
                  className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                  placeholder="Enter referral code"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a1929] px-4 text-sm text-gray-400">OR</span>
            </div>
          </div>

          {/* Video Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Add a Video (Max Time: {'<'}1min)</h2>
            <p className="text-sm text-gray-400">
              Include a video or record one for additional info or clarification
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center rounded-lg bg-[#0f2942] p-6 hover:bg-[#163454] transition-colors">
                <Video className="h-8 w-8 mb-2" />
                <span className="text-sm">+ Upload Video</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg bg-[#0f2942] p-6 hover:bg-[#163454] transition-colors">
                <Camera className="h-8 w-8 mb-2" />
                <span className="text-sm">Record Video</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a1929] px-4 text-sm text-gray-400">OR</span>
            </div>
          </div>

          {/* Call Button */}
          <button className="w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-white hover:bg-brand-primary-hover transition-colors">
            Get a Verification Call
          </button>
        </div>
      </main>
    </div>
  )
}

