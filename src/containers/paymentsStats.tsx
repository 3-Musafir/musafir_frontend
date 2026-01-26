import { Card } from "@/components/card";

export const PaymentStatsContainer = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Days to Trip */}
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">Days to Trip</div>
        <div className="text-4xl font-bold">
          05 <span className="text-sm font-normal">Days</span>
        </div>
      </div>

      {/* Seats Filled */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">56 Of 120 seats filled</div>
        <div className="h-6 flex rounded-sm overflow-hidden mb-1">
          <div className="bg-pink-500 w-[44%]"></div>
          <div className="bg-blue-700 w-[56%]"></div>
        </div>
        <div className="flex justify-between text-sm">
          <div>44% F</div>
          <div>M: 56%</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Total Seats</div>
          <div className="text-3xl font-bold">05</div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Isb Count</div>
          <div className="text-3xl font-bold">
            25 <span className="text-sm font-normal text-gray-500">of 50</span>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Lahore Count</div>
          <div className="text-3xl font-bold">
            40 <span className="text-sm font-normal text-gray-500">of 50</span>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Khi Count</div>
          <div className="text-3xl font-bold">
            40 <span className="text-sm font-normal text-gray-500">of 50</span>
          </div>
        </Card>
      </div>

      {/* Gender Seats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-pink-50">
          <div className="text-sm text-gray-600">Female Seats</div>
          <div className="text-3xl font-bold">
            20 <span className="text-sm font-normal text-gray-500">of 30</span>
          </div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="text-sm text-gray-600">Male Seats</div>
          <div className="text-3xl font-bold">
            35 <span className="text-sm font-normal text-gray-500">of 70</span>
          </div>
        </Card>
      </div>

      {/* Payments */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium mb-1">Payments</div>
        <div className="text-3xl font-bold">3,500,000</div>
        <div className="text-sm text-gray-500 mb-2">of 7,899,000</div>

        <div className="flex items-center mb-4">
          <div className="flex-1 h-2 bg-gray-200 rounded-full mr-3">
            <div className="h-2 bg-brand-primary rounded-full w-[56%]"></div>
          </div>
          <div className="text-sm font-medium">56%</div>
        </div>

        <div className="h-6 flex rounded-sm overflow-hidden mb-4">
          <div className="bg-emerald-500 w-[10%]"></div>
          <div className="bg-red-500 w-[5%]"></div>
          <div className="bg-blue-700 w-[85%]"></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-4 h-12 bg-blue-700 mr-3"></div>
            <div className="flex-1">
              <div className="font-medium">Standard Charter 5674</div>
            </div>
            <div className="font-medium">3,450,000</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-12 bg-red-500 mr-3"></div>
            <div className="flex-1">
              <div className="font-medium">Alfa 6889</div>
            </div>
            <div className="font-medium">198,900</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-12 bg-emerald-500 mr-3"></div>
            <div className="flex-1">
              <div className="font-medium">Cash</div>
            </div>
            <div className="font-medium">450,000</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-12 bg-gray-200 mr-3"></div>
            <div className="flex-1">
              <div className="font-medium">Remaining</div>
            </div>
            <div className="font-medium">4,506,000</div>
          </div>
        </div>
      </div>

      {/* Discounts Given */}
      <div>
        <h3 className="font-medium mb-4">Discounts Given</h3>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="font-medium">Group</div>
            <div className="font-medium">
              2000{" "}
              <span className="text-sm font-normal text-gray-500">
                of 34000
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Musafir Community</div>
            <div className="font-medium">
              20050{" "}
              <span className="text-sm font-normal text-gray-500">
                of 34000
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Solo Female</div>
            <div className="font-medium">
              2000{" "}
              <span className="text-sm font-normal text-gray-500">
                of 34000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
