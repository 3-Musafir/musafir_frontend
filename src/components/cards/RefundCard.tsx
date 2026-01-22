import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RefundCardProps {
  id: string;
  bookingId: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string;
  customerName: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const RefundCard = ({
  id,
  bookingId,
  amount,
  reason,
  status,
  requestedAt,
  processedAt,
  customerName,
  onApprove,
  onReject,
}: RefundCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Refund #{id}</CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Booking ID</span>
            <span className="text-sm font-medium">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Customer</span>
            <span className="text-sm font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-sm font-medium">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Requested At</span>
            <span className="text-sm font-medium">{requestedAt}</span>
          </div>
          {processedAt && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Processed At
              </span>
              <span className="text-sm font-medium">{processedAt}</span>
            </div>
          )}
          <div className="pt-2">
            <span className="text-sm text-muted-foreground">Reason</span>
            <p className="text-sm mt-1">{reason}</p>
          </div>
        </div>
      </CardContent>
      {status === "pending" && onApprove && onReject && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="default" size="sm" onClick={onApprove}>
            Approve
          </Button>
          <Button variant="destructive" size="sm" onClick={onReject}>
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RefundCard;
