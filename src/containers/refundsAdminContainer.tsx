"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PaymentService } from "@/services/paymentService";
import { IRefund } from "@/services/types/payment";
import { IPayment, IRegistration, IUser } from "@/interfaces/trip/trip";
import { FlagshipService } from "@/services/flagshipService";
import { IFlagship } from "@/services/types/flagship";

type RefundGroup = "pending" | "approved_not_credited" | "credited" | "rejected";

const getRegistrationTripName = (registration: IRegistration | string | undefined) => {
  if (!registration || typeof registration === "string") return null;
  const trip: any = (registration as any)?.flagship || (registration as any)?.flagshipId;
  if (!trip || typeof trip === "string") return null;
  return trip?.tripName || null;
};

const getRegistrationPaymentId = (registration: IRegistration | string | undefined) => {
  if (!registration || typeof registration === "string") return null;
  const payment = registration?.paymentId as unknown as IPayment | string | undefined;
  if (!payment || typeof payment === "string") return null;
  return payment?._id || null;
};

export const RefundsAdminContainer = ({ flagshipId }: { flagshipId?: string }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RefundGroup>("pending");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [refunds, setRefunds] = useState<IRefund[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [flagship, setFlagship] = useState<IFlagship | null>(null);

  useEffect(() => {
    const fetchFlagship = async () => {
      if (!flagshipId) {
        setFlagship(null);
        return;
      }
      try {
        const flagshipData = await FlagshipService.getFlagshipByID(flagshipId);
        setFlagship(flagshipData);
      } catch (error) {
        console.error("Error fetching flagship:", error);
        setFlagship(null);
      }
    };
    fetchFlagship();
  }, [flagshipId]);

  useEffect(() => {
    let cancelled = false;
    const fetchRefunds = async () => {
      setLoading(true);
      try {
        const res: any = await PaymentService.getRefunds({
          group: activeTab,
          page,
          limit,
          flagshipId,
        });
        const payload = res?.data ?? res;
        const list = payload?.refunds ?? payload;
        const nextRefunds = Array.isArray(list) ? (list as IRefund[]) : [];
        if (cancelled) return;
        setRefunds(nextRefunds);
        setTotalPages(typeof payload?.totalPages === "number" ? payload.totalPages : null);
      } catch (error) {
        console.error("Error fetching refunds:", error);
        if (cancelled) return;
        setRefunds([]);
        setTotalPages(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRefunds();
    return () => {
      cancelled = true;
    };
  }, [activeTab, page, limit, reloadToken]);

  const visibleRefunds = useMemo(() => {
    if (!flagshipId) return refunds;
    return refunds.filter((r) => {
      const reg = r?.registration as unknown as IRegistration;
      const regFlagship: any = (reg as any)?.flagship || (reg as any)?.flagshipId;
      const regFlagshipId = typeof regFlagship === "string" ? regFlagship : regFlagship?._id;
      return regFlagshipId ? String(regFlagshipId) === String(flagshipId) : false;
    });
  }, [refunds, flagshipId]);

  const canGoNext = totalPages !== null ? page < totalPages : visibleRefunds.length >= limit;

  const handleAction = async (
    refundId: string,
    action: "approve_and_credit" | "approve_defer_credit" | "post_credit" | "post_bank" | "reject",
  ) => {
    try {
      if (action === "approve_and_credit") await PaymentService.approveRefund(refundId);
      else if (action === "approve_defer_credit") await PaymentService.approveRefundNoCredit(refundId);
      else if (action === "post_credit") await PaymentService.postRefundCredit(refundId);
      else if (action === "post_bank") await PaymentService.postRefundBank(refundId);
      else await PaymentService.rejectRefund(refundId);
    } catch (error) {
      console.error("Refund action failed:", error);
    } finally {
      setReloadToken((t) => t + 1);
    }
  };

  return (
    <div className="space-y-4">
      {flagship ? (
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-heading">{flagship.tripName} Refunds</h1>
        </div>
      ) : null}

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(v) => {
          setActiveTab(v as RefundGroup);
          setPage(1);
        }}
      >
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved_not_credited">Not Credited</TabsTrigger>
          <TabsTrigger value="credited">Credited</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page}
                {totalPages !== null ? ` of ${totalPages}` : ""}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!canGoNext || loading}
              >
                Next
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading refunds…</div>
            ) : visibleRefunds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No refunds found</div>
            ) : (
              <div className="space-y-6">
                {visibleRefunds.map((refund) => {
                  const registration = refund?.registration as unknown as IRegistration;
                  const user = (registration?.user as IUser) || null;
                  const tripName = getRegistrationTripName(registration);

                  const paymentId = getRegistrationPaymentId(registration);
                  const amountPaid = Number(refund?.amountPaid || 0);
                  const refundAmount = Number(refund?.refundAmount || 0);
                  const processingFee = Number(
                    typeof refund?.processingFee === "number" ? refund.processingFee : 500
                  );
                  const refundPercent = Number(refund?.refundPercent || 0);
                  const tierLabel = refund?.tierLabel || "—";
                  const settlementStatus = refund?.settlement?.status || "—";
                  const settlementMethod = refund?.settlement?.method || "—";

                  const badgeText =
                    activeTab === "approved_not_credited"
                      ? "not credited"
                      : activeTab.replaceAll("_", " ");

                  return (
                    <Card key={refund._id} className="overflow-hidden transition-all hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-heading">
                              {user?.fullName || user?.email || "Unknown User"}
                            </h3>
                            {tripName ? (
                              <p className="text-sm text-muted-foreground">{tripName}</p>
                            ) : null}
                            <p className="text-sm text-muted-foreground">
                              {refund?.createdAt ? new Date(refund.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize",
                              activeTab === "credited" && "text-brand-primary",
                              activeTab === "rejected" && "text-brand-error"
                            )}
                          >
                            {badgeText}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount paid</span>
                            <span className="font-medium text-heading">Rs. {amountPaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Refund (policy)</span>
                            <span className="font-medium text-heading">Rs. {refundAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tier</span>
                            <span className="font-medium text-heading">
                              {tierLabel} ({refundPercent}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Processing fee</span>
                            <span className="font-medium text-heading">Rs. {processingFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Settlement</span>
                            <span className="font-medium text-heading">
                              {settlementStatus}
                              {settlementMethod !== "—" ? ` (${settlementMethod.replace("_", " ")})` : ""}
                            </span>
                          </div>
                        </div>

                        <Accordion type="single" collapsible className="mt-4">
                          <AccordionItem value="details">
                            <AccordionTrigger className="text-sm">Details</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rating</span>
                                  <span className="font-medium text-heading">{refund?.rating || "N/A"}/5</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Reason</span>
                                  <span className="font-medium text-heading">{refund?.reason || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Bank details</span>
                                  <span className="font-medium text-heading">{refund?.bankDetails || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Feedback</span>
                                  <span className="font-medium text-heading">{refund?.feedback || "N/A"}</span>
                                </div>
                                {refund?.policyLink ? (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Policy</span>
                                    <a
                                      className="font-medium text-brand-primary underline"
                                      href={refund.policyLink}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      View
                                    </a>
                                  </div>
                                ) : null}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {activeTab === "pending" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-brand-primary"
                                onClick={() => handleAction(refund._id, "approve_and_credit")}
                              >
                                Approve & Credit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-brand-primary"
                                onClick={() => handleAction(refund._id, "approve_defer_credit")}
                              >
                                Approve (Defer)
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-brand-error"
                                onClick={() => handleAction(refund._id, "reject")}
                              >
                                Reject
                              </Button>
                            </>
                          ) : null}

                          {activeTab === "approved_not_credited" ? (
                            settlementMethod === "bank_refund" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-brand-primary"
                                onClick={() => handleAction(refund._id, "post_bank")}
                              >
                                Mark bank paid
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-brand-primary"
                                onClick={() => handleAction(refund._id, "post_credit")}
                              >
                                Credit now
                              </Button>
                            )
                          ) : null}
                        </div>

                        {paymentId ? (
                          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/payment/${paymentId}`)}>
                            View payment
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            No payment
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
