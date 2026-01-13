import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../pages/api';
import apiEndpoints from '../../config/apiEndpoints';
import { showAlert } from '../../pages/alert';

interface UserData {
    user: {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        city: string;
    };
    trips: string[];
}

export default function MusafirSignupConfirm() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isNewEmail, setIsNewEmail] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem('musafirUserData');
        if (!storedData) {
            router.push('/musafir-signup');
            return;
        }

        try {
            const parsedData = JSON.parse(storedData);
            setUserData(parsedData);
            setEmail(parsedData.user.email);
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/musafir-signup');
        }
    }, [router]);

    const handleVerifyEmail = async () => {
        if (!userData) return;

        setIsLoading(true);
        try {
            if (isNewEmail) {
                // Update existing user's email
                await api.post(apiEndpoints.VERIFY_MUSAFIR_EMAIL, {
                    email: email,
                    updateExisting: true,
                    userId: userData.user._id
                });
            } else {
                // Use existing user's email
                await api.post(apiEndpoints.VERIFY_MUSAFIR_EMAIL, { email: userData.user.email });
            }

            // Store the email that was actually used for verification
            localStorage.setItem('verificationEmail', email);

            // Navigate to password verification page
            router.push('/musafir-signup/verify-password');
        } catch (error: any) {
            console.error('Error verifying email:', error);
            showAlert('Failed to send verification email. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFillForm = () => {
        router.push('/signup/create-account');
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value || '';
        setEmail(newEmail);
        setIsNewEmail(newEmail !== userData?.user.email);
    };

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0">
            <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
                {/* Header */}
                <header className="flex items-center p-4 border-b">
                    <Link href="/musafir-signup" className="p-2 hover:bg-gray-100 rounded-full">
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

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter your email"
                        />
                        {isNewEmail && (
                            <p className="text-sm text-blue-600 mt-1">
                                New email detected. We'll update your account with this email.
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Is this you?</h3>

                        <div className="border border-gray-300 rounded-lg p-4 bg-white">
                            <div className="mb-2">
                                <h4 className="font-semibold text-lg">{userData.user.fullName}</h4>
                            </div>

                            <hr className="my-3 border-t border-gray-200" />

                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Trips attended:</p>
                                <div className="flex flex-wrap gap-1">
                                    {userData.trips.map((trip, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
                                        >
                                            {trip}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleFillForm}
                            disabled={isLoading}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-md text-sm font-medium transition-colors"
                            aria-busy={isLoading || undefined}
                        >
                            Not me, I'll fill form
                        </button>

                        <button
                            onClick={handleVerifyEmail}
                            disabled={isLoading || !email?.trim()}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                            aria-busy={isLoading || undefined}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sending Email...
                                </>
                            ) : (
                                "Yes, verify my email"
                            )}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
} 
