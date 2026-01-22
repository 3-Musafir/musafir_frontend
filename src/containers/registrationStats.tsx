import { Card } from "../components/card";
import { useEffect, useState } from "react";
import { FlagshipService } from "@/services/flagshipService";
import { IRegistrationStats } from "@/services/types/flagship";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

interface AgeData {
  range: string;
  count: number;
}

export const RegistrationStatsContainer = () => {
  const [stats, setStats] = useState<IRegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const fetchStats = async () => {
      if (slug) {
        try {
          const data = await FlagshipService.getRegistrationStats(
            slug as string
          );
          setStats(data);
        } catch (error) {
          console.error("Failed to fetch registration stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [slug]);

  if (loading || !stats) {
    return <div className="p-4">Loading...</div>;
  }

  // Calculate percentages for the progress bars
  const total = stats.totalRegistrations;
  const pendingPercentage = (stats.pendingCount / total) * 100;
  const acceptedPercentage = (stats.acceptedCount / total) * 100;
  const rejectedPercentage = (stats.rejectedCount / total) * 100;
  const paidPercentage = (stats.paidCount / total) * 100;
  const remainingPercentage =
    100 -
    (pendingPercentage +
      acceptedPercentage +
      rejectedPercentage +
      paidPercentage);

  // Calculate gender percentages
  const malePercentage = (stats.maleCount / total) * 100;
  const femalePercentage = (stats.femaleCount / total) * 100;

  // Transform age distribution data for Recharts
  const ageData: AgeData[] = Object.entries(stats.ageDistribution).map(
    ([range, count]) => ({
      range,
      count,
    })
  );

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium">{`${payload[0].value} registrations`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Days to Trip */}
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">Days to Trip</div>
        <div className="text-4xl font-bold">
          {stats.daysUntilStart > 0 ? stats.daysUntilStart : 0}{" "}
          <span className="text-sm font-normal">Days</span>
        </div>
      </div>

      {/* Registrations */}
      <div>
        <div className="flex justify-between mb-2">
          <div className="text-sm font-medium">
            {stats.totalRegistrations} registrations
          </div>
        </div>
        <div className="h-6 flex rounded-sm overflow-hidden mb-4">
          <div
            className="bg-emerald-500"
            style={{ width: `${paidPercentage}%` }}
          ></div>
          <div
            className="bg-red-500"
            style={{ width: `${rejectedPercentage}%` }}
          ></div>
          <div
            className="bg-blue-700"
            style={{ width: `${acceptedPercentage}%` }}
          ></div>
          <div
            className="bg-brand-primary"
            style={{ width: `${pendingPercentage}%` }}
          ></div>
          <div
            className="bg-gray-200"
            style={{ width: `${remainingPercentage}%` }}
          ></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-brand-primary mr-2"></div>
            <div className="flex-1">Pending</div>
            <div className="font-medium">{stats.pendingCount}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-700 mr-2"></div>
            <div className="flex-1">Accepted</div>
            <div className="font-medium">{stats.acceptedCount}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <div className="flex-1">Rejected</div>
            <div className="font-medium">{stats.rejectedCount}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 mr-2"></div>
            <div className="flex-1">Paid</div>
            <div className="font-medium">{stats.paidCount}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Team Seats</div>
          <div className="text-3xl font-bold">{stats.teamSeats}</div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Isb Count</div>
          <div className="text-3xl font-bold">{stats.islamabadSeats}</div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Lahore Count</div>
          <div className="text-3xl font-bold">{stats.lahoreSeats}</div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Khi Count</div>
          <div className="text-3xl font-bold">{stats.karachiSeats}</div>
        </Card>
      </div>

      {/* Gender Distribution */}
      <div>
        <h3 className="font-medium mb-2">Gender Distribution</h3>
        <div className="h-6 flex rounded-sm overflow-hidden mb-4">
          <div
            className="bg-blue-700"
            style={{ width: `${malePercentage}%` }}
          ></div>
          <div
            className="bg-pink-500"
            style={{ width: `${femalePercentage}%` }}
          ></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-700 mr-2"></div>
            <div className="flex-1">Male</div>
            <div className="font-medium">{stats.maleCount}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-500 mr-2"></div>
            <div className="flex-1">Female</div>
            <div className="font-medium">{stats.femaleCount}</div>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div>
        <h3 className="font-medium mb-4">Age Distribution</h3>
        <div className="h-[300px] bg-white p-4 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ageData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="#1e40af"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Universities */}
      <div>
        <h3 className="font-medium mb-2">Top Universities</h3>
        <div className="space-y-2">
          {stats.topUniversities.map(({ university, count }, index) => (
            <div key={university} className="flex items-center">
              <div
                className={`w-4 h-4 mr-2 ${index === 0
                    ? "bg-amber-500"
                    : index === 1
                      ? "bg-gray-400"
                      : index === 2
                        ? "bg-amber-700"
                        : "bg-blue-700"
                  }`}
              ></div>
              <div className="flex-1">{university}</div>
              <div className="font-medium">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Musafir */}
      <div>
        <h3 className="font-medium mb-2">Musafir</h3>
        <div className="h-6 flex rounded-sm overflow-hidden mb-4">
          <div className="bg-blue-700 w-[45%]"></div>
          <div className="bg-brand-primary w-[55%]"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-700 mr-2"></div>
            <div className="flex-1">New Musafir</div>
            <div className="font-medium">{stats.newUsersCount}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-brand-primary mr-2"></div>
            <div className="flex-1">Returning Musafir</div>
            <div className="font-medium">{stats.returningUsersCount}</div>
          </div>
        </div>
      </div>
      {/* 
      {/* Occupation */}
      {/* <div>
        <h3 className="font-medium mb-2">Occupation</h3>
        <div className="h-6 flex rounded-sm overflow-hidden mb-4">
          <div className="bg-emerald-500 w-[17%]"></div>
          <div className="bg-gray-300 w-[2%]"></div>
          <div className="bg-blue-700 w-[30%]"></div>
          <div className="bg-brand-primary w-[51%]"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 mr-2"></div>
            <div className="flex-1">Student</div>
            <div className="font-medium">25</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 mr-2"></div>
            <div className="flex-1">Living my employed era</div>
            <div className="font-medium">3</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-700 mr-2"></div>
            <div className="flex-1">Employed Job</div>
            <div className="font-medium">45</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-brand-primary mr-2"></div>
            <div className="flex-1">Self Employed/Business</div>
            <div className="font-medium">74</div>
          </div>
        </div>
      </div> */}

      {/* Joining as */}
      {/* <div>
        <h3 className="font-medium mb-2">Joining as</h3>
        <div className="h-6 flex rounded-sm overflow-hidden mb-4">
          <div className="bg-pink-500 w-[2%]"></div>
          <div className="bg-blue-700 w-[37%]"></div>
          <div className="bg-brand-primary w-[61%]"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-brand-primary mr-2"></div>
            <div className="flex-1">With other Musafirs</div>
            <div className="font-medium">74</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-700 mr-2"></div>
            <div className="flex-1">Solo Male</div>
            <div className="font-medium">45</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-500 mr-2"></div>
            <div className="flex-1">Solo Female</div>
            <div className="font-medium">3</div>
          </div>
        </div>
      </div> */}

      {/* Onboarding Team Stats */}
      {/* <div>
        <h3 className="font-medium mb-2">Onboarding Team Stats</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>Manahil</div>
            <div className="font-medium">500</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Soha</div>
            <div className="font-medium">125</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Rida</div>
            <div className="font-medium">56</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Auto/ App</div>
            <div className="font-medium">56</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
