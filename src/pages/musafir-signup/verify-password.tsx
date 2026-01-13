import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { showAlert } from '../../pages/alert';

export default function MusafirSignupVerifyPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem('musafirUserData');
        if (!storedData) {
            router.push('/musafir-signup');
            return;
        }

        try {
            const parsedData = JSON.parse(storedData);
            // Use the email that was actually used for verification (could be new or existing)
            const email = localStorage.getItem('verificationEmail') || parsedData.user.email;
            setUserEmail(email);
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/musafir-signup');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: userEmail,
                password: password,
                redirect: false,
            });

            if (result?.status === 200) {
                showAlert('Successfully logged in!', 'success');
                // Clear stored data
                localStorage.removeItem('musafirUserData');
                localStorage.removeItem('verificationEmail');
                // Redirect to home
                router.push('/home');
            } else {
                showAlert('Invalid password. Please check your email and try again.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Something went wrong. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0">
            <div className="bg-white max-w-md mx-auto rounded-lg h-screen p-3 w-full">
                {/* Header */}
                <header className="flex items-center p-4 border-b">
                    <Link href="/musafir-signup/confirm" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-center flex-1 text-xl font-semibold mr-7">
                        Onboarding
                    </h1>
                </header>

                {/* Main Content */}
                <main className="p-4 max-w-md mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">
                            Check your email
                        </h2>
                        <p className="text-gray-600">
                            We've sent you a password to login to your account. If you can't find it; check the spam folder. You can later change this.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter the password from your email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password.trim()}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                            aria-busy={isLoading || undefined}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Verifying...
                                </>
                            ) : (
                                "On to Flagship Registration"
                            )}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
} 
