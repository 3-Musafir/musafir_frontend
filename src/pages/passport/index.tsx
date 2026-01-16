import { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import Header from "../../components/header";
import withAuth from "@/hoc/withAuth";
import PassportPastCard from "@/components/cards/PassportPastCard";
import PassportUpcomingCard from "@/components/cards/PassportUpcomingCard";
import useRegistrationHook from "@/hooks/useRegistrationHandler";
import { formatDate } from "@/utils/formatDate";
import useUserHandler from "@/hooks/useUserHandler";

function Passport() {
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [userVerificationStatus, setUserVerificationStatus] = useState<string | undefined>(undefined);
  const registrationHook = useRegistrationHook();
  const userHandler = useUserHandler();

  const fetchPastPassport = async () => {
    try {
      const data = await registrationHook.getPastPassport();
      setPastEvents(data);
    } catch (error) {
      console.error("Error fetching past passport data:", error);
    }
  };

  const fetchUpcomingPassport = async () => {
    try {
      const data = await registrationHook.getUpcomingPassport();
      setUpcomingEvents(data);
    } catch (error) {
      console.error("Error fetching upcoming passport data:", error);
    }
  };

  const fetchUserVerificationStatus = async () => {
    try {
      const status = await userHandler.getVerificationStatus();
      setUserVerificationStatus(status);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchPastPassport();
    fetchUpcomingPassport();
    fetchUserVerificationStatus();
  }, []);

  useEffect(() => {
    if (activeTab === "upcoming") {
      fetchUserVerificationStatus();
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocus = () => fetchUserVerificationStatus();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchUserVerificationStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "upcoming") return;
    if (
      userVerificationStatus !== "unverified" &&
      userVerificationStatus !== "pending" &&
      userVerificationStatus !== "rejected"
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      fetchUserVerificationStatus();
    }, 20_000);

    return () => window.clearInterval(intervalId);
  }, [activeTab, userVerificationStatus]);

  return (
    <div className='min-h-screen w-full bg-gray-50 flex flex-col'>
      <Header setSidebarOpen={() => { }} showMenuButton={false} />

      <div className='border-b flex justify-between mt-4'>
        <button
          className={`w-1/2 py-3 text-sm font-medium text-center ${
            activeTab === "past"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 border-b-2 border-gray-300"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
        <button
          className={`w-1/2 py-3 text-sm font-medium text-center ${
            activeTab === "upcoming"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 border-b-2 border-gray-300"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
      </div>

      <main className="space-y-4 p-4 pb-24">
        {activeTab === "past" && pastEvents.length > 0
          ? pastEvents.map((event) => (
              <PassportPastCard
                key={event._id}
                registrationId={event._id}
                title={event.flagshipId.tripName}
                date={formatDate(
                  event.flagshipId.startDate,
                  event.flagshipId.endDate
                )}
                location={event.flagshipId.destination}
                rating={event.ratingId?.rating}
                price={event.price}
                status={event.status}
              />
            ))
          : activeTab === "past" && (
              <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                <p className="text-center text-lg mb-2">
                  You haven't been on any trips yet.
                </p>
                <p className="text-center">
                  Time for an adventure - book your first trip now!
                </p>
              </div>
            )}
        {activeTab === "upcoming" && upcomingEvents.length > 0
          ? upcomingEvents.map((event) => (
              <PassportUpcomingCard
                key={event._id}
                registrationId={event._id}
                title={event.flagship.tripName}
                date={formatDate(
                  event.flagship.startDate,
                  event.flagship.endDate
                )}
                appliedDate={new Date(event.createdAt).toLocaleDateString()}
                location={event.flagship.destination}
                image={event.flagship.images[0]}
                status={event.status}
                paymentInfo={{
                  amount: event.price,
                  dueAmount: event.amountDue,
                }}
                detailedPlan={event?.flagship?.detailedPlan}
                userVerificationStatus={userVerificationStatus}
              />
            ))
          : activeTab === "upcoming" && (
              <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                <p className="text-center text-lg mb-2">
                  No upcoming trips scheduled!
                </p>
                <p className="text-center">
                  Explore our trips and plan your next adventure.
                </p>
              </div>
            )}
      </main>

      <Navigation />
    </div>
  );
}

export default withAuth(Passport);
