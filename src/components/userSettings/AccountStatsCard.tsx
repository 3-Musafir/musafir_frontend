import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccountStatsCardProps {
  referralID: string;
  musafirsVerified: number;
}

export default function AccountStatsCard({ referralID, musafirsVerified }: AccountStatsCardProps) {
  const { toast } = useToast();

  const copyReferral = () => {
    if (!referralID) return;
    navigator.clipboard.writeText(referralID);
    toast({ title: "Copied!", description: "Referral ID copied to clipboard.", variant: "success" });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Referral & Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Referral ID</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-medium text-heading">
              {referralID || "—"}
            </span>
            {referralID && (
              <button
                type="button"
                onClick={copyReferral}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Copy referral ID"
              >
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Musafirs Verified</p>
          <span className="text-sm font-medium text-heading">
            {musafirsVerified}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
