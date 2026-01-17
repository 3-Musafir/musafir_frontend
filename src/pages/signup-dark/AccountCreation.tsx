import { ArrowLeft, User } from 'lucide-react'
import { useState } from 'react'

export default function AccountCreation() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 text-white">
        <button className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">Account Creation</h1>
        <button className="p-2">
          <User className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-3xl font-bold leading-tight">
            Never Fill Long Forms Again + Get Discounts On Future Flagships
          </h2>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-400">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-transparent text-brand-primary focus:ring-orange-500"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span className="text-sm text-gray-400">Show Password</span>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-white hover:bg-brand-primary-hover transition-colors"
            >
              Sign Up
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a1929] px-4 text-sm text-gray-400">OR</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-lg border border-brand-primary px-4 py-3 font-medium text-white hover:bg-brand-primary/10 transition-colors"
            >
              Sign Up with Google
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

