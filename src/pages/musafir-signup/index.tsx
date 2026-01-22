import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../pages/api';
import apiEndpoints from '../../config/apiEndpoints';
import { showAlert } from '../../pages/alert';

export default function MusafirSignup() {
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post(apiEndpoints.FIND_USER, { emailOrPhone });

            // Store user data for next step
            localStorage.setItem('musafirUserData', JSON.stringify(response));

            // Navigate to confirmation page
            router.push('/musafir-signup/confirm');
        } catch (error: any) {
            console.error('Error finding user:', error);
            if (error.response?.status === 409) {
                // Account already exists with password - show specific message and login button
                setError('Your account already exists. Please login.');
            } else if (error.response?.status === 404) {
                // User not found
                setError('Email and phone number both not found.');
            } else {
                // Show the actual error message from backend if available
                const errorMessage = error || 'Something went wrong. Please try again.';
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFillForm = () => {
        router.push('/signup/create-account');
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen w-full bg-white p-0">
            <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
                {/* Header */}
                <header className="flex items-center p-4 border-b">
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-center flex-1 text-xl font-semibold mr-7">
                        Account Creation
                    </h1>
                </header>

                {/* Main Content */}
                <main className="p-4 max-w-md mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">
                            Enter Your Email
                        </h2>
                        <p className="text-gray-600">
                            No need to re-enter your information. Just make sure you're using the same email address as before and we'll fetch your details for you!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="emailOrPhone" className="block text-sm font-medium">
                                Email or Phone Number
                            </label>
                            <input
                                type="text"
                                id="emailOrPhone"
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                placeholder="Enter your email or phone number"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${error ? 'border-brand-error' : 'border-gray-300' }`}
                                disabled={isLoading}
                                required
                            />
                            {error && (
                                <p className="text-brand-error text-sm">{error}</p>
                            )}
                        </div>

                        {!error.includes('already exists') && (
                            <button
                                type="submit"
                                disabled={isLoading || !emailOrPhone.trim()}
                                className="btn-primary w-full flex items-center justify-center"
                                aria-busy={isLoading || undefined}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Finding Account...
                                    </>
                                ) : (
                                    "Find My Account"
                                )}
                            </button>
                        )}
                    </form>

                    {error && (
                        <div className="mt-6">
                            {error.includes('already exists') ? (
                                // Show login button for existing accounts
                                <button
                                    onClick={handleLogin}
                                    className="btn-primary w-full"
                                >
                                    Login
                                </button>
                            ) : (
                                // Show fill form option for other errors
                                <>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Problems in fetching details? No worries, you can always provide your updated details:
                                    </p>
                                    <button
                                        onClick={handleFillForm}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Fill Form
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
} 
