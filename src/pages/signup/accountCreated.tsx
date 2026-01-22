// "use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function AccountCreated() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 p-0">
            <div className="bg-white min-h-screen w-full max-w-md mx-auto rounded-lg shadow-sm p-3 flex flex-col items-center justify-center">
                <div className="item-center mx-10">
                    <div className="mb-4 item-center">
                        <img
                            src="/successBadge.png"
                            alt="Success Badge"
                            className="w-260 h-20 object-contain ml-4"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center">Account Created on Musafir App</h1>
                    <p className="mt-2 text-gray-600 text-center">
                        You wouldn’t have to enter these details again while trip registrations
                    </p>
                </div>
            </div>
        </div>
    )
}

