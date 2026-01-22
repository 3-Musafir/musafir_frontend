import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IBankAccount, IPayment, IRefund } from "@/services/types/payment";
import { IUser } from "@/services/types/user";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { IRegistration } from "@/interfaces/trip/trip";

interface PaymentsContainerProps {
  payments: IPayment[] | IRefund[];
  activeSection: string;
  onRefundAction?: (id: string, action: "approve" | "reject") => void;
}

export function PaymentsContainer({
  payments,
  activeSection,
  onRefundAction,
}: PaymentsContainerProps) {
  const router = useRouter();

  const isRefund = (item: IPayment | IRefund): item is IRefund => {
    return "reason" in item;
  };

  // Helper functions to safely access nested properties
  const getSafeUserName = (item: IPayment | IRefund): string => {
    const registration = item.registration;
    if (typeof registration === 'string') {
      return 'User ID: ' + registration;
    }
    const user = registration.user;
    if (typeof user === 'string') {
      return 'User ID: ' + user;
    }
    return user?.fullName || 'Unknown User';
  };

  const getSafePaymentAmount = (item: IRefund): string => {
    const registration = item.registration;
    if (typeof registration === 'string') {
      return 'N/A';
    }
    const payment = registration.payment;
    if (typeof payment === 'string') {
      return 'N/A';
    }
    return payment?.amount?.toLocaleString() || 'N/A';
  };

  const getSafePaymentDate = (item: IRefund): string => {
    const registration = item.registration;
    if (typeof registration === 'string') {
      return 'N/A';
    }
    const payment = registration.payment;
    if (typeof payment === 'string') {
      return 'N/A';
    }
    return payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A';
  };

  const getSafeBankName = (item: IPayment): string => {
    const bankAccount = item.bankAccount;
    if (typeof bankAccount === 'string') {
      return 'N/A';
    }
    return bankAccount?.bankName || 'N/A';
  };

  const handleViewDetails = (paymentId: string) => {
    router.push(`/admin/payment/${paymentId}`);
  };

  return (
    <div className="space-y-6">
      {payments?.length > 0 ? payments.map((item) => (
        <Card
          key={item._id}
          className="overflow-hidden transition-all duration-200 hover:shadow-lg"
          onClick={() => handleViewDetails(item._id)}
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">
              {getSafeUserName(item)}
            </h3>
            <p className="text-sm text-gray-500">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </CardHeader>
          <CardContent>
            {isRefund(item) ? (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Amount</span>
                    <span className="font-medium">
                      Rs.{" "}
                      {getSafePaymentAmount(item)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-medium">
                      {getSafePaymentDate(item)}
                    </span>
                  </div>
                </div>
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-sm">
                      Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-medium">{item.rating || 'N/A'}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reason</span>
                          <span className="font-medium">{item.reason || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank Details</span>
                          <span className="font-medium">
                            {item.bankDetails || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Feedback</span>
                          <span className="font-medium">{item.feedback || 'N/A'}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">
                    Rs. {item.amount?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium">
                    {getSafeBankName(item)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">
                    {item.paymentType || 'N/A'}
                  </span>
                </div>
                {/* {item.discount && item.discount > 0 && ( */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount Applied</span>
                  <span className="font-medium text-brand-primary">
                    Rs. {item.discount?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                {/* )} */}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {isRefund(item) && onRefundAction ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-brand-primary"
                  onClick={() => onRefundAction(item._id, "approve")}
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-brand-error"
                  onClick={() => onRefundAction(item._id, "reject")}
                >
                  Reject
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    item.status === "pending" && "text-brand-warning",
                    item.status === "approved" && "text-brand-primary",
                    item.status === "rejected" && "text-brand-error"
                  )}
                >
                  {item.status}
                </Badge>
              </div>
            )}
          </CardFooter>
        </Card>
      )) : (
        <div className="text-center text-gray-500 py-8">
          <p className="text-xl font-medium mb-2">No Payments Available Yet</p>
        </div>
      )}
    </div>
  );
}
