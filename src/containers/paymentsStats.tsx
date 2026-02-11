import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/card";
import { FlagshipService } from "@/services/flagshipService";
import { IPaymentStats } from "@/services/types/flagship";

const formatAmount = (value: number) =>
  Math.max(0, Math.floor(Number(value) || 0)).toLocaleString();

export const PaymentStatsContainer = () => {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const [stats, setStats] = useState<IPaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    setStats(null);

    FlagshipService.getPaymentStats(slug)
      .then((data) => {
        const payload = (data as any)?.data ?? data;
        setStats(payload || null);
      })
      .catch((err) => {
        console.error("Failed to fetch payment stats:", err);
        setError("Failed to load payment stats.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">{error}</div>;
  }

  if (!stats) {
    return <div className="p-4 text-sm text-gray-500">No stats available yet.</div>;
  }

  const totalSeats = Number(stats.totalSeats || 0);
  const seatsFilled = Number(stats.seatsFilled || 0);
  const seatsPct = totalSeats > 0 ? Math.round((seatsFilled / totalSeats) * 100) : 0;

  const maleSeats = Number(stats.maleSeats || 0);
  const femaleSeats = Number(stats.femaleSeats || 0);
  const genderTotal = maleSeats + femaleSeats;
  const femalePct = genderTotal > 0 ? Math.round((femaleSeats / genderTotal) * 100) : 0;
  const malePct = genderTotal > 0 ? 100 - femalePct : 0;

  const cityCounts = stats.cityCounts || {
    islamabad: 0,
    lahore: 0,
    karachi: 0,
    other: 0,
  };

  const totalPaid = Number(stats.totalPaid || 0);
  const totalTarget = Number(stats.totalTarget ?? totalPaid + Number(stats.totalDue || 0));
  const remaining = Math.max(0, totalTarget - totalPaid);
  const paidPct = totalTarget > 0 ? Math.round((totalPaid / totalTarget) * 100) : 0;

  const methodTotals = stats.paymentMethodTotals || {
    bank_transfer: 0,
    wallet_only: 0,
    wallet_plus_bank: 0,
  };
  const methodTotalPaid = Object.values(methodTotals).reduce((sum, val) => sum + Number(val || 0), 0);

  const methodWidth = (value: number) =>
    methodTotalPaid > 0 ? `${Math.round((value / methodTotalPaid) * 100)}%` : "0%";

  const discountTotals = stats.discountTotals || {
    group: 0,
    musafir: 0,
    soloFemale: 0,
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">Days to Trip</div>
        <div className="text-4xl font-bold">
          {Math.max(0, Number(stats.daysUntilStart || 0))}{" "}
          <span className="text-sm font-normal">Days</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">
          {seatsFilled} of {totalSeats || 0} seats filled
        </div>
        <div className="h-6 flex rounded-sm overflow-hidden mb-1 bg-gray-200">
          <div className="bg-pink-500" style={{ width: `${femalePct}%` }} />
          <div className="bg-blue-700" style={{ width: `${malePct}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <div>{femalePct}% F</div>
          <div>M: {malePct}%</div>
        </div>
        <div className="mt-2 text-xs text-gray-500">{seatsPct}% of total seats</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Total Seats</div>
          <div className="text-3xl font-bold">{totalSeats}</div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Isb Count</div>
          <div className="text-3xl font-bold">{cityCounts.islamabad}</div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Lahore Count</div>
          <div className="text-3xl font-bold">{cityCounts.lahore}</div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="text-sm text-gray-600">Khi Count</div>
          <div className="text-3xl font-bold">{cityCounts.karachi}</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-pink-50">
          <div className="text-sm text-gray-600">Female Seats</div>
          <div className="text-3xl font-bold">{femaleSeats}</div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="text-sm text-gray-600">Male Seats</div>
          <div className="text-3xl font-bold">{maleSeats}</div>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium mb-1">Payments</div>
        <div className="text-3xl font-bold">{formatAmount(totalPaid)}</div>
        <div className="text-sm text-gray-500 mb-2">of {formatAmount(totalTarget)}</div>

        <div className="flex items-center mb-4">
          <div className="flex-1 h-2 bg-gray-200 rounded-full mr-3">
            <div className="h-2 bg-brand-primary rounded-full" style={{ width: `${paidPct}%` }} />
          </div>
          <div className="text-sm font-medium">{paidPct}%</div>
        </div>

        <div className="h-6 flex rounded-sm overflow-hidden mb-4 bg-gray-200">
          <div className="bg-blue-700" style={{ width: methodWidth(methodTotals.bank_transfer) }} />
          <div className="bg-emerald-500" style={{ width: methodWidth(methodTotals.wallet_only) }} />
          <div className="bg-amber-500" style={{ width: methodWidth(methodTotals.wallet_plus_bank) }} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-4 h-12 bg-blue-700 mr-3" />
            <div className="flex-1">
              <div className="font-medium">Bank transfer</div>
            </div>
            <div className="font-medium">{formatAmount(methodTotals.bank_transfer)}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-12 bg-emerald-500 mr-3" />
            <div className="flex-1">
              <div className="font-medium">Wallet only</div>
            </div>
            <div className="font-medium">{formatAmount(methodTotals.wallet_only)}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-12 bg-amber-500 mr-3" />
            <div className="flex-1">
              <div className="font-medium">Wallet + bank</div>
            </div>
            <div className="font-medium">{formatAmount(methodTotals.wallet_plus_bank)}</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-12 bg-gray-200 mr-3" />
            <div className="flex-1">
              <div className="font-medium">Remaining</div>
            </div>
            <div className="font-medium">{formatAmount(remaining)}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Discounts Given</h3>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="font-medium">Group</div>
            <div className="font-medium">{formatAmount(discountTotals.group)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Musafir Community</div>
            <div className="font-medium">{formatAmount(discountTotals.musafir)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Solo Female</div>
            <div className="font-medium">{formatAmount(discountTotals.soloFemale)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
