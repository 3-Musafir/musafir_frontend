import Header from "@/components/header";
import Navigation from "@/pages/navigation";
import useFlagshipHook from "@/hooks/useFlagshipHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RemainingSeats() {
  const [flagship, setFlagship] = useState<any>({});
  const action = useFlagshipHook();
  const router = useRouter();
  const [registrationId, setRegistrationId] = useState<string>('');

  const getFlagship = async (flagshipId: any) => {
    const response = await action.getFlagship(flagshipId);
    setFlagship(response);
  };

  useEffect(() => {
    const flagshipId = JSON.parse(localStorage.getItem("flagshipId") || "null");
    if (flagshipId) {
      getFlagship(flagshipId);
    }

    const registrationId = JSON.parse(localStorage.getItem("registrationId") || "null");
    if (registrationId) {
      setRegistrationId(registrationId);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    router.push(`/musafir/payment/${registrationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-6">
      <Header setSidebarOpen={() => {}} showMenuButton={false} />
      <div className="bg-white min-h-screen w-full rounded-lg shadow-sm p-3 lg:p-6 mt-4 lg:mt-6">
        <h2 className="text-xl lg:text-2xl font-bold text-center pt-2 mb-4">
          Flagship Registration
        </h2>

        <main className="p-4 lg:max-w-2xl lg:mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-700">
              Remaining Seat For <br /> {flagship.tripName}
            </h1>
          </div>

          <div className="mb-8">
            <div className="border border-gray-400 rounded-lg p-4 relative w-1/2 mx-auto bg-gray-100">
              <div className="text-lg text-gray-600 mb-2 text-center">
                Remaining Tickets
              </div>
              <div className="text-6xl font-bold text-center">{flagship.totalSeats ? flagship.totalSeats : 0}</div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary w-full"
          >
            Make Payment
          </button>
        </main>
      </div>
      <Navigation />
    </div>
  );
}
