import { ArrowLeft, User, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function PasswordSetup() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showError, setShowError] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (confirmPassword) {
      setShowError(e.target.value !== confirmPassword)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setShowError(e.target.value !== password)
  }

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
          <h2 className="text-3xl font-bold">
            Set up your password
          </h2>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-400">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="Enter your password"
              />
              <p className="text-xs text-gray-400">
                Password must be at least 8 characters, including a capital letter
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm text-gray-400">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full rounded-lg border ${
                    showError ? 'border-brand-error' : 'border-gray-600'
                  } bg-transparent px-4 py-3 text-white focus:border-brand-primary focus:outline-none`}
                  placeholder="Confirm your password"
                />
                {showError && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="h-5 w-5 text-brand-error" />
                  </div>
                )}
              </div>
              {showError && (
                <p className="text-xs text-brand-error">
                  Your password is incorrect...
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-white hover:bg-brand-primary-hover transition-colors"
            >
              On to Flagship Deeds
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

