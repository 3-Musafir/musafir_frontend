import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRefund } from "@/services/types/payment";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { FlagshipService } from "@/services/flagshipService";
import { IFlagship } from "@/services/types/flagship";
import { IPayment, IRegistration, IUser } from "@/interfaces/trip/trip";

interface RefundsContainerProps {
  refunds: IRefund[];
  onRefundAction?: (id: string, action: "approve" | "reject") => Promise<void>;
  flagshipId?: string;
}

export const RefundsContainer = ({
  refunds,
  onRefundAction,
  flagshipId,
}: RefundsContainerProps) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [flagship, setFlagship] = useState<IFlagship | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFlagship = async () => {
      if (flagshipId) {
        try {
          const flagshipData = await FlagshipService.getFlagshipByID(
            flagshipId
          );
          setFlagship(flagshipData);
        } catch (error) {
          console.error("Error fetching flagship:", error);
        }
      }
    };

    fetchFlagship();
  }, [flagshipId]);

  const pendingRefunds = refunds.filter(
    (refund) => refund.status === "pending"
  );
  const clearedRefunds = refunds.filter(
    (refund) => refund.status === "cleared" || refund.status === "rejected"
  );

  const handleViewDetails = (paymentId: string) => {
    router.push(`/admin/payment/${paymentId}`);
  };

  return (
    <div className="space-y-4">
      {flagship && (
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">{flagship.tripName} Refunds</h1>
        </div>
      )}
      <Tabs
        defaultValue="pending"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="pending">Pending Refunds</TabsTrigger>
          <TabsTrigger value="cleared">Cleared Refunds</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="space-y-6">
            {pendingRefunds.map((refund) => (
              <Card
                key={refund._id}
                className="overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">
                    {((refund?.registration as IRegistration)?.user as IUser)
                      ?.fullName || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {refund?.createdAt
                      ? new Date(refund.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Amount</span>
                      <span className="font-medium">
                        Rs.{" "}
                        {(
                          (refund?.registration as IRegistration)
                            ?.paymentId as unknown as IPayment
                        )?.amount?.toLocaleString() || "0"}
                      </span>
                    </div>
                    {(
                      (refund?.registration as IRegistration)
                        ?.paymentId as unknown as IPayment
                    )?.discount &&
                      (
                        (refund?.registration as IRegistration)
                          ?.paymentId as unknown as IPayment
                      )?.discount !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Discount Applied
                          </span>
                          <span className="font-medium text-brand-primary">
                            Rs.{" "}
                            {(
                              (refund?.registration as IRegistration)
                                ?.paymentId as unknown as IPayment
                            )?.discount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date</span>
                      <span className="font-medium">
                        {(
                          (refund?.registration as IRegistration)
                            ?.paymentId as unknown as IPayment
                        )?.createdAt
                          ? new Date(
                            (
                              (refund?.registration as IRegistration)
                                ?.paymentId as unknown as IPayment
                            ).createdAt
                          ).toLocaleDateString()
                          : "N/A"}
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
                            <span className="font-medium">
                              {refund?.rating || "N/A"}/5
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reason</span>
                            <span className="font-medium">
                              {refund?.reason || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank Details</span>
                            <span className="font-medium">
                              {refund?.bankDetails || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Feedback</span>
                            <span className="font-medium">
                              {refund?.feedback || "N/A"}
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-brand-primary"
                      onClick={() => onRefundAction?.(refund._id, "approve")}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-brand-error"
                      onClick={() => onRefundAction?.(refund._id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const paymentId = (
                        (refund?.registration as IRegistration)
                          ?.paymentId as unknown as IPayment
                      )?._id;
                      if (paymentId) {
                        handleViewDetails(paymentId);
                      }
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {pendingRefunds.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No pending refunds found
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="cleared">
          <div className="space-y-6">
            {clearedRefunds.map((refund) => (
              <Card
                key={refund._id}
                className="overflow-hidden transition-all duration-200 hover:shadow-lg"
                onClick={() => {
                  const paymentId = (
                    (refund?.registration as IRegistration)
                      ?.paymentId as unknown as IPayment
                  )?._id;
                  if (paymentId) {
                    handleViewDetails(paymentId);
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">
                    {((refund?.registration as IRegistration)?.user as IUser)
                      ?.fullName || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {refund?.createdAt
                      ? new Date(refund.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Amount</span>
                      <span className="font-medium">
                        Rs.{" "}
                        {(
                          (refund?.registration as IRegistration)
                            ?.paymentId as unknown as IPayment
                        )?.amount?.toLocaleString() || "0"}
                      </span>
                    </div>
                    {(
                      (refund?.registration as IRegistration)
                        ?.paymentId as unknown as IPayment
                    )?.discount !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount Applied</span>
                          <span className="font-medium text-brand-primary">
                            Rs.{" "}
                            {(
                              (refund?.registration as IRegistration)
                                ?.paymentId as unknown as IPayment
                            )?.discount?.toLocaleString() || "0"}
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date</span>
                      <span className="font-medium">
                        {(
                          (refund?.registration as IRegistration)
                            ?.paymentId as unknown as IPayment
                        )?.createdAt
                          ? new Date(
                            (
                              (refund?.registration as IRegistration)
                                ?.paymentId as unknown as IPayment
                            ).createdAt
                          ).toLocaleDateString()
                          : "N/A"}
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
                            <span className="font-medium">
                              {refund?.rating || "N/A"}/5
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reason</span>
                            <span className="font-medium">
                              {refund?.reason || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank Details</span>
                            <span className="font-medium">
                              {refund?.bankDetails || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Feedback</span>
                            <span className="font-medium">
                              {refund?.feedback || "N/A"}
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      refund.status === "cleared" && "text-brand-primary",
                      refund.status === "rejected" && "text-brand-error"
                    )}
                  >
                    {refund.status}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
            {clearedRefunds.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No cleared refunds found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
