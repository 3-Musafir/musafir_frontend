"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FlagshipService } from "@/services/flagshipService";
import { IFlagship } from "@/services/types/flagship";
import { UserService } from "@/services/userService";
import { IUser } from "@/services/types/user";
import { PaymentService } from "@/services/paymentService";
import { IPayment } from "@/services/types/payment";
import { TripsContainer } from "@/containers/tripsContainer";
import { UsersContainer } from "@/containers/usersContainer";
import { PaymentsContainer } from "@/containers/paymentsContainer";
import { RefundsAdminContainer } from "@/containers/refundsAdminContainer";
import { WalletAdminContainer } from "@/containers/walletAdminContainer";
import withAuth from "@/hoc/withAuth";
import { ROLES } from "@/config/constants";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { currentUser } from "@/store/signup";
import { currentFlagship } from "@/store";
import { clearDraft } from "@/lib/flagship-draft";

const FOCUS_COOLDOWN_MS = 30_000; // 30s cooldown on window-focus refetch

function AdminMainPage() {
  const router = useRouter();
  const userData = useRecoilValue(currentUser);
  const resetCurrentUser = useResetRecoilState(currentUser);
  const resetCurrentFlagship = useResetRecoilState(currentFlagship);
  const [activeTab, setActiveTab] = useState("trips");
  const [activeSection, setActiveSection] = useState("past");
  const lastFocusFetchRef = useRef<number>(0);

  // --- Trips state ---
  const [trips, setTrips] = useState<{
    past: IFlagship[];
    live: IFlagship[];
    upcoming: IFlagship[];
  }>({ past: [], live: [], upcoming: [] });
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsLoaded, setTripsLoaded] = useState({
    past: false,
    live: false,
    upcoming: false,
  });
  const [loadingCreateFlagship, setLoadingCreateFlagship] = useState(false);

  // --- Users state ---
  const [users, setUsers] = useState<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }>({ unverified: [], pendingVerification: [], verified: [] });
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }>({ unverified: [], pendingVerification: [], verified: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedUsersPagination, setVerifiedUsersPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });

  // --- Payments state ---
  const [payments, setPayments] = useState<{
    pending: IPayment[];
    completed: IPayment[];
  }>({ pending: [], completed: [] });
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsLoaded, setPaymentsLoaded] = useState(false);

  const ensureArray = <T,>(value: T[] | null | undefined): T[] =>
    Array.isArray(value) ? value : [];

  // --- Trips fetcher (already lazy per section) ---
  const fetchTrips = useCallback(
    async (section: "past" | "live" | "upcoming", force = false) => {
      if (!force && tripsLoaded[section]) return;
      try {
        setTripsLoading(true);
        const data =
          section === "past"
            ? await FlagshipService.getPastTrips()
            : section === "live"
              ? await FlagshipService.getLiveTrips()
              : await FlagshipService.getUpcomingTrips();
        setTrips((prev) => ({ ...prev, [section]: ensureArray(data) }));
        setTripsLoaded((prev) => ({ ...prev, [section]: true }));
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setTripsLoading(false);
      }
    },
    [tripsLoaded]
  );

  // --- Users fetcher (lazy, only when users tab visited) ---
  const fetchUsers = useCallback(
    async (force = false) => {
      if (!force && usersLoaded) return;
      try {
        setUsersLoading(true);
        const [unverifiedUsers, pendingUsers, verifiedUsersResponse] =
          await Promise.all([
            UserService.getUnverifiedUsers(),
            UserService.getPendingVerificationUsers(),
            UserService.getVerifiedUsers(
              undefined,
              verifiedUsersPagination.page,
              verifiedUsersPagination.limit
            ),
          ]);

        const isPaginated =
          verifiedUsersResponse && "data" in verifiedUsersResponse;

        setUsers({
          unverified: unverifiedUsers,
          pendingVerification: pendingUsers,
          verified: isPaginated
            ? verifiedUsersResponse.data
            : verifiedUsersResponse,
        });

        if (isPaginated) {
          setVerifiedUsersPagination({
            page: verifiedUsersResponse.page,
            limit: verifiedUsersResponse.limit,
            total: verifiedUsersResponse.total,
            totalPages: verifiedUsersResponse.totalPages,
          });
        }

        setUsersLoaded(true);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    },
    [
      usersLoaded,
      verifiedUsersPagination.page,
      verifiedUsersPagination.limit,
    ]
  );

  // --- Payments fetcher (lazy, only when payments tab visited) ---
  const fetchPayments = useCallback(
    async (force = false) => {
      if (!force && paymentsLoaded) return;
      try {
        setPaymentsLoading(true);
        const [pendingPayments, completedPayments] = await Promise.all([
          PaymentService.getPendingPayments(),
          PaymentService.getCompletedPayments(),
        ]);
        setPayments({
          pending: pendingPayments,
          completed: completedPayments,
        });
        setPaymentsLoaded(true);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setPaymentsLoading(false);
      }
    },
    [paymentsLoaded]
  );

  // --- Active trip section ---
  const activeTripSection =
    activeSection === "past" ||
    activeSection === "live" ||
    activeSection === "upcoming"
      ? activeSection
      : "past";

  // --- Lazy-load data when tab changes ---
  useEffect(() => {
    if (activeTab === "trips") {
      fetchTrips(activeTripSection);
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "payments") {
      fetchPayments();
    }
    // Refunds and Wallet manage their own data internally
  }, [activeTab, activeTripSection, fetchTrips, fetchUsers, fetchPayments]);

  // --- Re-fetch users when pagination changes ---
  useEffect(() => {
    if (!usersLoaded) return; // skip initial mount
    fetchUsers(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifiedUsersPagination.page]);

  // --- Window focus refetch with cooldown ---
  useEffect(() => {
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusFetchRef.current < FOCUS_COOLDOWN_MS) return;
      lastFocusFetchRef.current = now;

      if (activeTab === "trips") {
        fetchTrips(activeTripSection, true);
      } else if (activeTab === "users") {
        fetchUsers(true);
      } else if (activeTab === "payments") {
        fetchPayments(true);
      }
      // Refunds and Wallet handle their own refresh
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [activeTab, activeTripSection, fetchTrips, fetchUsers, fetchPayments]);

  // --- User search (debounced, hits server for all users) ---
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await UserService.searchAllUsers(
            searchQuery.trim()
          );
          setSearchResults(results);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({
          unverified: [],
          pendingVerification: [],
          verified: [],
        });
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getUsersToDisplay = () => {
    if (searchQuery.trim()) {
      return {
        unverified: searchResults.unverified,
        pendingVerification: searchResults.pendingVerification,
        verified: searchResults.verified,
      };
    }
    return users;
  };

  const handleSignOut = async () => {
    try {
      resetCurrentUser();
      if (typeof window !== "undefined") {
        localStorage.removeItem("recoil-persist");
      }
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getAdminName = () => {
    type PersistedUser = {
      fullName?: string | null;
      email?: string | null;
    };
    const recoilUser = userData as unknown as PersistedUser;
    return recoilUser?.fullName || "Admin";
  };

  // --- Determine loading state per tab ---
  const isCurrentTabLoading =
    activeTab === "trips"
      ? tripsLoading
      : activeTab === "users"
        ? usersLoading
        : activeTab === "payments"
          ? paymentsLoading
          : false;

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-md mx-auto pb-8">
      {/* Admin Header */}
      <div className="sticky top-0 bg-background z-20 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-text" />
            <span className="font-medium text-heading">{getAdminName()}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      <header className="sticky top-[65px] bg-background z-10">
        <Tabs
          defaultValue="trips"
          className="w-full"
          onValueChange={(value: string) => {
            setActiveTab(value);
            if (value === "trips") {
              setActiveSection("past");
            } else if (value === "users") {
              setActiveSection("unverified");
            } else if (value === "payments") {
              setActiveSection("pendingPayments");
            } else if (value === "refunds") {
              setActiveSection("pending");
            } else if (value === "wallet") {
              setActiveSection("wallets");
            }
          }}
        >
          <TabsList className="w-full grid grid-cols-5 h-12">
            <TabsTrigger
              value="trips"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "trips" && "border-b-2 border-brand-primary"
              )}
            >
              Trips
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "users" && "border-b-2 border-brand-primary"
              )}
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "payments" && "border-b-2 border-brand-primary"
              )}
            >
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="refunds"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "refunds" && "border-b-2 border-brand-primary"
              )}
            >
              Refunds
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "wallet" && "border-b-2 border-brand-primary"
              )}
            >
              Wallet
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "trips" && (
          <>
            <div className="grid grid-cols-3 border-b">
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "past" && "border-b-2 border-brand-primary"
                )}
                onClick={() => setActiveSection("past")}
              >
                Past
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "live" && "border-b-2 border-brand-primary"
                )}
                onClick={() => setActiveSection("live")}
              >
                Live
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "upcoming" &&
                    "border-b-2 border-brand-primary"
                )}
                onClick={() => setActiveSection("upcoming")}
              >
                Upcoming
              </button>
            </div>
            <div className="flex flex-row items-center justify-center p-4">
              <button
                className="bg-brand-primary text-btn-secondary-text px-4 py-2 rounded-md w-full hover:bg-background hover:text-heading hover:border-[1px] hover:border-border"
                onClick={() => {
                  setLoadingCreateFlagship(true);
                  resetCurrentFlagship();
                  clearDraft("create");
                  router.push("/flagship/create");
                }}
                disabled={loadingCreateFlagship}
                aria-busy={loadingCreateFlagship || undefined}
              >
                {loadingCreateFlagship
                  ? "Opening Create Flagship"
                  : "Create Flagship"}
              </button>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div className="grid grid-cols-3 border-b">
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "unverified" &&
                    "border-b-2 border-brand-primary"
                )}
                onClick={() => setActiveSection("unverified")}
              >
                Unverified
                {searchQuery && (
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({getUsersToDisplay().unverified.length})
                  </span>
                )}
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "pendingVerification" &&
                    "border-b-2 border-brand-primary"
                )}
                onClick={() => setActiveSection("pendingVerification")}
              >
                Pending Verification
                {searchQuery && (
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({getUsersToDisplay().pendingVerification.length})
                  </span>
                )}
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "verified" &&
                    "border-b-2 border-brand-primary"
                )}
                onClick={() => setActiveSection("verified")}
              >
                Verified
                {searchQuery && (
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({getUsersToDisplay().verified.length})
                  </span>
                )}
              </button>
            </div>
            <div className="px-4 py-3">
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  {isSearching
                    ? "Searching..."
                    : `Search results for "${searchQuery}"`}
                </p>
              )}
            </div>
          </>
        )}

        {activeTab === "payments" && (
          <div className="grid grid-cols-2 border-b">
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "pendingPayments" &&
                  "border-b-2 border-brand-primary"
              )}
              onClick={() => setActiveSection("pendingPayments")}
            >
              Pending Payments
            </button>
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "completedPayments" &&
                  "border-b-2 border-brand-primary"
              )}
              onClick={() => setActiveSection("completedPayments")}
            >
              Approved Payments
            </button>
          </div>
        )}
      </header>

      <main className="p-4 space-y-6">
        {isCurrentTabLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {activeTab === "trips" && (
              <TripsContainer
                trips={
                  activeTripSection === "past"
                    ? trips.past
                    : activeTripSection === "live"
                      ? trips.live
                      : trips.upcoming
                }
                activeSection={activeTripSection}
              />
            )}

            {activeTab === "users" && (
              <>
                <UsersContainer
                  users={
                    activeSection === "unverified"
                      ? getUsersToDisplay().unverified
                      : activeSection === "pendingVerification"
                        ? getUsersToDisplay().pendingVerification
                        : getUsersToDisplay().verified
                  }
                  activeSection={activeSection}
                  searchQuery={searchQuery}
                  isSearching={isSearching}
                />
                {/* Pagination controls for verified users */}
                {activeSection === "verified" &&
                  !searchQuery &&
                  verifiedUsersPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setVerifiedUsersPagination((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }))
                        }
                        disabled={verifiedUsersPagination.page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {verifiedUsersPagination.page} of{" "}
                        {verifiedUsersPagination.totalPages} (
                        {verifiedUsersPagination.total} total users)
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setVerifiedUsersPagination((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }))
                        }
                        disabled={
                          verifiedUsersPagination.page >=
                          verifiedUsersPagination.totalPages
                        }
                      >
                        Next
                      </Button>
                    </div>
                  )}
              </>
            )}

            {activeTab === "payments" && (
              <PaymentsContainer
                payments={
                  activeSection === "pendingPayments"
                    ? payments.pending
                    : payments.completed
                }
                activeSection={activeSection}
              />
            )}

            {activeTab === "refunds" && <RefundsAdminContainer />}

            {activeTab === "wallet" && <WalletAdminContainer />}
          </>
        )}
      </main>
    </div>
  );
}

export default withAuth(AdminMainPage, { allowedRoles: [ROLES.ADMIN] });
