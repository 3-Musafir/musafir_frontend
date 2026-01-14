"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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
import { IPayment, IRefund } from "@/services/types/payment";
import { TripsContainer } from "@/containers/tripsContainer";
import { UsersContainer } from "@/containers/usersContainer";
import { PaymentsContainer } from "@/containers/paymentsContainer";
import { RefundsContainer } from "@/containers/refundsContainer";
import withAuth from "@/hoc/withAuth";
import { ROLES } from "@/config/constants";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { currentUser } from "@/store/signup";

function AdminMainPage() {
  const router = useRouter();
  const userData = useRecoilValue(currentUser);
  const resetCurrentUser = useResetRecoilState(currentUser);
  const [activeTab, setActiveTab] = useState("trips");
  const [activeSection, setActiveSection] = useState("past");
  const [trips, setTrips] = useState<{
    past: IFlagship[];
    live: IFlagship[];
    upcoming: IFlagship[];
  }>({
    past: [],
    live: [],
    upcoming: [],
  });
  const [users, setUsers] = useState<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }>({
    unverified: [],
    pendingVerification: [],
    verified: [],
  });
  const [payments, setPayments] = useState<{
    pending: IPayment[];
    completed: IPayment[];
    refunds: IRefund[];
  }>({
    pending: [],
    completed: [],
    refunds: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingCreateFlagship, setLoadingCreateFlagship] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }>({
    unverified: [],
    pendingVerification: [],
    verified: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedUsersPagination, setVerifiedUsersPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });

  const ensureArray = <T,>(value: T[] | null | undefined): T[] =>
    Array.isArray(value) ? value : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          pastTrips,
          liveTrips,
          upcomingTrips,
          unverifiedUsers,
          pendingUsers,
          verifiedUsersResponse,
          pendingPayments,
          completedPayments,
          refunds,
        ] = await Promise.all([
          FlagshipService.getPastTrips(),
          FlagshipService.getLiveTrips(),
          FlagshipService.getUpcomingTrips(),
          UserService.getUnverifiedUsers(),
          UserService.getPendingVerificationUsers(),
          UserService.getVerifiedUsers(undefined, verifiedUsersPagination.page, verifiedUsersPagination.limit),
          PaymentService.getPendingPayments(),
          PaymentService.getCompletedPayments(),
          PaymentService.getRefunds(),
        ]);

        setTrips({
          past: ensureArray(pastTrips),
          live: ensureArray(liveTrips),
          upcoming: ensureArray(upcomingTrips),
        });

        // Check if verifiedUsersResponse is paginated
        const isPaginated = verifiedUsersResponse && 'data' in verifiedUsersResponse;

        setUsers({
          unverified: unverifiedUsers,
          pendingVerification: pendingUsers,
          verified: isPaginated ? verifiedUsersResponse.data : verifiedUsersResponse,
        });

        // Update pagination info if response is paginated
        if (isPaginated) {
          setVerifiedUsersPagination({
            page: verifiedUsersResponse.page,
            limit: verifiedUsersResponse.limit,
            total: verifiedUsersResponse.total,
            totalPages: verifiedUsersResponse.totalPages,
          });
        }

        setPayments({
          pending: pendingPayments,
          completed: completedPayments,
          refunds: refunds,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [verifiedUsersPagination.page]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await UserService.searchAllUsers(searchQuery.trim());
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
      // Clear persisted user so a stale localStorage value can't show up on next login
      resetCurrentUser();
      if (typeof window !== "undefined") {
        localStorage.removeItem("recoil-persist");
      }
      await signOut({
        callbackUrl: "/login",
      });
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

  const handleRefundAction = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      if (action === "approve") {
        await PaymentService.approveRefund(id);
      } else {
        await PaymentService.rejectRefund(id);
      }
      // Refresh refunds list
      const updatedRefunds = await PaymentService.getRefunds();
      setPayments((prev) => ({
        ...prev,
        refunds: updatedRefunds,
      }));
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  };

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
      <div className="sticky top-0 bg-white z-20 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800">{getAdminName()}</span>
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

      <header className="sticky top-[65px] bg-white z-10">
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
            }
          }}
        >
          <TabsList className="w-full grid grid-cols-4 h-12">
            <TabsTrigger
              value="trips"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "trips" && "border-b-2 border-black"
              )}
            >
              Trips
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "users" && "border-b-2 border-black"
              )}
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "payments" && "border-b-2 border-black"
              )}
            >
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="refunds"
              className={cn(
                "py-3 flex justify-center",
                activeTab === "refunds" && "border-b-2 border-black"
              )}
            >
              Refunds
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "trips" && (
          <>
            <div className="grid grid-cols-3 border-b">
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "past" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("past")}
              >
                Past
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "live" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("live")}
              >
                Live
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "upcoming" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("upcoming")}
              >
                Upcoming
              </button>
            </div>
            <div className="flex flex-row items-center justify-center p-4">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md w-full hover:bg-white hover:text-gray-700 hover:border-[1px] hover:border-gray-300"
                onClick={() => {
                  setLoadingCreateFlagship(true);
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
                  activeSection === "unverified" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("unverified")}
              >
                Unverified
                {searchQuery && (
                  <span className="ml-1 text-sm text-gray-500">
                    ({getUsersToDisplay().unverified.length})
                  </span>
                )}
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "pendingVerification" &&
                  "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("pendingVerification")}
              >
                Pending Verification
                {searchQuery && (
                  <span className="ml-1 text-sm text-gray-500">
                    ({getUsersToDisplay().pendingVerification.length})
                  </span>
                )}
              </button>
              <button
                className={cn(
                  "py-3 text-center font-medium",
                  activeSection === "verified" && "border-b-2 border-black"
                )}
                onClick={() => setActiveSection("verified")}
              >
                Verified
                {searchQuery && (
                  <span className="ml-1 text-sm text-gray-500">
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
                <p className="text-sm text-gray-500 mt-2">
                  {isSearching ? "Searching..." : `Search results for "${searchQuery}"`}
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
                activeSection === "pendingPayments" && "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("pendingPayments")}
            >
              Pending Payments
            </button>
            <button
              className={cn(
                "py-3 text-center font-medium",
                activeSection === "completedPayments" &&
                "border-b-2 border-black"
              )}
              onClick={() => setActiveSection("completedPayments")}
            >
              Approved Payments
            </button>
          </div>
        )}
      </header>

      <main className="p-4 space-y-6">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {activeTab === "trips" && (
              <TripsContainer
                trips={
                  activeSection === "past"
                    ? trips.past
                    : activeSection === "live"
                      ? trips.live
                      : trips.upcoming
                }
                activeSection={activeSection}
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
                {activeSection === "verified" && !searchQuery && verifiedUsersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-4">
                    <Button
                      variant="outline"
                      onClick={() => setVerifiedUsersPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={verifiedUsersPagination.page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {verifiedUsersPagination.page} of {verifiedUsersPagination.totalPages}
                      ({verifiedUsersPagination.total} total users)
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setVerifiedUsersPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={verifiedUsersPagination.page >= verifiedUsersPagination.totalPages}
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

            {activeTab === "refunds" && (
              <RefundsContainer
                refunds={payments.refunds}
                onRefundAction={handleRefundAction}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default withAuth(AdminMainPage, { allowedRoles: [ROLES.ADMIN] });
