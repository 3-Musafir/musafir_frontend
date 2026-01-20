import { useEffect, useMemo, useState } from "react";
import { PaymentService } from "@/services/paymentService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WalletBalanceDoc = {
  _id: string;
  userId:
    | string
    | {
        _id: string;
        fullName?: string;
        email?: string;
        phone?: string;
        referralID?: string;
        verification?: { status?: string } | null;
      };
  balance: number;
  currency?: string;
  updatedAt?: string;
};

type WalletTxDoc = {
  _id: string;
  createdAt?: string;
  type: string;
  direction: "credit" | "debit";
  amount: number;
  status: "posted" | "void";
  expiresAt?: string;
  metadata?: Record<string, any>;
};

type TopupRequestDoc = {
  _id: string;
  userId:
    | string
    | {
        _id: string;
        fullName?: string;
        email?: string;
        phone?: string;
        referralID?: string;
      };
  packageAmount: number;
  status: "pending" | "processed" | "rejected";
  createdAt?: string;
  processedAt?: string;
  processedBy?: { _id: string; fullName?: string; email?: string } | string;
};

export const WalletAdminContainer = () => {
  const [tab, setTab] = useState<"wallets" | "topups">("wallets");

  const [wallets, setWallets] = useState<WalletBalanceDoc[]>([]);
  const [walletsPage, setWalletsPage] = useState(1);
  const [walletsLimit] = useState(20);
  const [walletSearch, setWalletSearch] = useState("");
  const [walletsLoading, setWalletsLoading] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTxDoc[]>([]);
  const [txCursor, setTxCursor] = useState<string | null>(null);
  const [txLoading, setTxLoading] = useState(false);

  const [topups, setTopups] = useState<TopupRequestDoc[]>([]);
  const [topupStatus, setTopupStatus] = useState<
    "pending" | "processed" | "rejected" | "all"
  >("pending");
  const [topupsPage, setTopupsPage] = useState(1);
  const [topupsLimit] = useState(20);
  const [topupsTotalPages, setTopupsTotalPages] = useState<number | null>(null);
  const [topupsLoading, setTopupsLoading] = useState(false);

  const debouncedSearch = useMemo(() => walletSearch.trim(), [walletSearch]);

  useEffect(() => {
    if (tab !== "wallets") return;
    const fetchWallets = async () => {
      setWalletsLoading(true);
      try {
        const res: any = await PaymentService.adminListWallets({
          page: walletsPage,
          limit: walletsLimit,
          search: debouncedSearch || undefined,
          includeEmpty: debouncedSearch ? true : undefined,
        });
        const data = res?.wallets || res?.data?.wallets || [];
        setWallets(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load wallets:", e);
      } finally {
        setWalletsLoading(false);
      }
    };
    fetchWallets();
  }, [tab, walletsPage, walletsLimit, debouncedSearch]);

  const fetchTransactions = async (userId: string, cursor?: string | null) => {
    setTxLoading(true);
    try {
      const res: any = await PaymentService.adminListWalletTransactions(userId, {
        limit: 20,
        cursor: cursor || undefined,
      });
      const newTxs: WalletTxDoc[] = res?.transactions || res?.data?.transactions || [];
      const nextCursor: string | null =
        res?.nextCursor ?? res?.data?.nextCursor ?? null;

      setTransactions((prev) => (cursor ? [...prev, ...newTxs] : newTxs));
      setTxCursor(nextCursor);
    } catch (e) {
      console.error("Failed to load transactions:", e);
    } finally {
      setTxLoading(false);
    }
  };

  const openWallet = async (wallet: WalletBalanceDoc) => {
    const user =
      typeof wallet.userId === "string" ? wallet.userId : wallet.userId?._id;
    if (!user) return;
    setSelectedUserId(user);
    setTransactions([]);
    setTxCursor(null);
    await fetchTransactions(user, null);
  };

  useEffect(() => {
    if (tab !== "topups") return;
    const fetchTopups = async () => {
      setTopupsLoading(true);
      try {
        const res: any = await PaymentService.adminListTopups({
          status: topupStatus === "all" ? undefined : topupStatus,
          page: topupsPage,
          limit: topupsLimit,
        });
        const payload = res?.data ?? res;
        const data = payload?.topups ?? payload;
        setTopups(Array.isArray(data) ? data : []);
        setTopupsTotalPages(
          typeof payload?.totalPages === "number" ? payload.totalPages : null
        );
      } catch (e) {
        console.error("Failed to load topups:", e);
        setTopupsTotalPages(null);
      } finally {
        setTopupsLoading(false);
      }
    };
    fetchTopups();
  }, [tab, topupStatus, topupsPage, topupsLimit]);

  const markTopupCredited = async (id: string) => {
    try {
      await PaymentService.adminMarkTopupCredited(id);
      const updated: any = await PaymentService.adminListTopups({
        status: topupStatus === "all" ? undefined : topupStatus,
        page: topupsPage,
        limit: topupsLimit,
      });
      const payload = updated?.data ?? updated;
      const data = payload?.topups ?? payload;
      setTopups(Array.isArray(data) ? data : []);
      setTopupsTotalPages(
        typeof payload?.totalPages === "number" ? payload.totalPages : null
      );
    } catch (e) {
      console.error("Failed to mark credited:", e);
    }
  };

  const rejectTopup = async (id: string) => {
    const reason = window?.prompt?.("Reason (optional):") || undefined;
    try {
      await PaymentService.adminRejectTopup(id, reason);
      const updated: any = await PaymentService.adminListTopups({
        status: topupStatus === "all" ? undefined : topupStatus,
        page: topupsPage,
        limit: topupsLimit,
      });
      const payload = updated?.data ?? updated;
      const data = payload?.topups ?? payload;
      setTopups(Array.isArray(data) ? data : []);
      setTopupsTotalPages(
        typeof payload?.totalPages === "number" ? payload.totalPages : null
      );
    } catch (e) {
      console.error("Failed to reject topup:", e);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="topups">Top-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <div className="space-y-2">
            <Input
              value={walletSearch}
              onChange={(e) => {
                setWalletsPage(1);
                setWalletSearch(e.target.value);
              }}
              placeholder="Search wallets by name/email/phone/referral..."
              className="bg-background"
            />
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setWalletsPage((p) => Math.max(1, p - 1))}
                disabled={walletsPage === 1 || walletsLoading}
              >
                Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {walletsPage}
              </span>
              <Button
                variant="outline"
                onClick={() => setWalletsPage((p) => p + 1)}
                disabled={walletsLoading || wallets.length < walletsLimit}
              >
                Next
              </Button>
            </div>
          </div>

          {walletsLoading ? (
            <div className="text-sm text-muted-foreground">Loading wallets…</div>
          ) : wallets.length === 0 ? (
            <div className="text-sm text-muted-foreground">No wallets found.</div>
          ) : (
            <div className="space-y-3">
              {wallets.map((w) => {
                const user = typeof w.userId === "string" ? null : w.userId;
                const userId = typeof w.userId === "string" ? w.userId : w.userId?._id;
                const isSelected = selectedUserId && userId === selectedUserId;
                return (
                  <Card
                    key={w._id}
                    className={cn(
                      "border-border",
                      isSelected && "border-brand-primary"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-heading font-semibold">
                            {user?.fullName || user?.email || userId}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user?.email || user?.phone || user?.referralID || ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Verification: {user?.verification?.status || "unknown"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-heading font-semibold">
                            Rs. {Number(w.balance || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {w.currency || "PKR"}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openWallet(w)}
                        disabled={!userId}
                      >
                        View transactions
                      </Button>

                      {isSelected && (
                        <div className="space-y-2">
                          {transactions.length === 0 && !txLoading ? (
                            <div className="text-sm text-muted-foreground">
                              No transactions.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {transactions.map((t) => (
                                <div
                                  key={t._id}
                                  className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
                                >
                                  <div className="min-w-0">
                                    <div className="text-sm text-heading font-medium truncate">
                                      {t.type}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {t.createdAt
                                        ? new Date(t.createdAt).toLocaleString()
                                        : ""}
                                      {t.status === "void" ? " • void" : ""}
                                      {t.expiresAt
                                        ? ` • expires ${new Date(
                                            t.expiresAt
                                          ).toLocaleDateString()}`
                                        : ""}
                                    </div>
                                  </div>
                                  <div
                                    className={cn(
                                      "text-sm font-semibold",
                                      t.direction === "credit"
                                        ? "text-brand-primary"
                                        : "text-brand-error"
                                    )}
                                  >
                                    {t.direction === "credit" ? "+" : "-"}Rs.{" "}
                                    {Number(t.amount || 0).toLocaleString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {txCursor && (
                            <Button
                              variant="outline"
                              className="w-full"
                              disabled={txLoading}
                              onClick={() => fetchTransactions(userId!, txCursor)}
                            >
                              {txLoading ? "Loading…" : "Load more"}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="topups" className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {(["pending", "processed", "rejected", "all"] as const).map((s) => (
              <Button
                key={s}
                variant="outline"
                className={cn(
                  "w-full",
                  topupStatus === s && "border-brand-primary text-brand-primary"
                )}
                onClick={() => {
                  setTopupStatus(s);
                  setTopupsPage(1);
                }}
                disabled={topupsLoading}
              >
                {s === "all" ? "All" : s}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setTopupsPage((p) => Math.max(1, p - 1))}
              disabled={topupsPage === 1 || topupsLoading}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {topupsPage}
              {topupsTotalPages !== null ? ` of ${topupsTotalPages}` : ""}
            </span>
            <Button
              variant="outline"
              onClick={() => setTopupsPage((p) => p + 1)}
              disabled={
                topupsLoading ||
                (topupsTotalPages !== null
                  ? topupsPage >= topupsTotalPages
                  : topups.length < topupsLimit)
              }
            >
              Next
            </Button>
          </div>

          {topupsLoading ? (
            <div className="text-sm text-muted-foreground">Loading top-ups…</div>
          ) : topups.length === 0 ? (
            <div className="text-sm text-muted-foreground">No top-ups found.</div>
          ) : (
            <div className="space-y-3">
              {topups.map((t) => {
                const user = typeof t.userId === "string" ? null : t.userId;
                return (
                  <Card key={t._id} className="border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-heading font-semibold">
                            {user?.fullName || user?.email || String(t.userId)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user?.email || user?.phone || user?.referralID || ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Status:{" "}
                            <span
                              className={cn(
                                "font-medium",
                                t.status === "pending"
                                  ? "text-brand-warning"
                                  : t.status === "processed"
                                  ? "text-brand-primary"
                                  : "text-brand-error"
                              )}
                            >
                              {t.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-heading font-semibold">
                            Rs. {Number(t.packageAmount || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t.createdAt
                              ? new Date(t.createdAt).toLocaleString()
                              : ""}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {t.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-btn-secondary-text"
                            onClick={() => markTopupCredited(t._id)}
                          >
                            Mark credited
                          </Button>
                          <Button
                            className="flex-1 bg-brand-error hover:bg-brand-error-hover text-btn-secondary-text"
                            onClick={() => rejectTopup(t._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {t.processedAt
                            ? `Processed at ${new Date(t.processedAt).toLocaleString()}`
                            : ""}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
