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
    const flagshipId = JSON.parse(localStorage.getItem("flagshipId") || "");
    if (flagshipId) {
      getFlagship(flagshipId);
    };

    const registrationId = JSON.parse(localStorage.getItem("registrationId")||"");
    if(registrationId){
      setRegistrationId(registrationId);
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    router.push(`/musafir/payment/${registrationId}`);
  };

  // const [discountCode, setDiscountCode] = useState("3Musafir@786");

  return (
    <div className="min-h-screen bg-gray-50 md:flex md:items-center md:justify-center p-0 m4">
      <div className="bg-white min-h-screen w-full max-w-md mx-auto rounded-lg shadow-sm p-3">
        <h2 className="text-xl font-bold text-center pt-2 mb-4">
          Flagship Registration
        </h2>

        <main className="p-4 max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-700">
              Remaining Seat For <br /> {flagship.tripName}
            </h1>
            <p className="text-gray-600">First come services...</p>
          </div>

          {/* Remaining Tickets */}
          <div className="mb-8">
            <div className="border border-gray-400 rounded-lg p-4 relative w-1/2 mx-auto bg-gray-100">
              <div className="text-lg text-gray-600 mb-2 text-center">
                Remaining Tickets
              </div>
              <div className="text-6xl font-bold text-center">{flagship.totalSeats ? flagship.totalSeats : 0}</div>
            </div>
          </div>

          {/* Discount Section */}
          {/* <div className="space-y-6 mb-8">
            <h2 className="font-medium">Remaining Open Discounts</h2>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            /> */}

            {/* Community Coupon */}
            {/* <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-700">
                  Community Coupon
                </div>
                <div className="text-xl font-bold">
                  1000{" "}
                  <span className="text-sm font-normal text-gray-600">
                    PKR/OFF
                  </span>
                </div>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition-colors">
                Add
              </button>
            </div> */}

            {/* Early Bird Discount */}
            {/* </main><div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-700">
                  Early Bird Discount
                </div>
                <div className="text-xl font-bold">
                  1000{" "}
                  <span className="text-sm font-normal text-gray-600">
                    PKR/OFF
                  </span>
                </div>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition-colors">
                Add
              </button>
            </div>
          </div> */}

          {/* Make Payment Button */}
          <button
            onClick={handleSubmit}
            className="btn-primary w-full"
          >
            Make Payment
          </button>
        </main>
      </div>
    </div>
  );
}
