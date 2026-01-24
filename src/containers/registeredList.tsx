import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FlagshipService } from "@/services/flagshipService";
import { IRegistration } from "@/interfaces/trip/trip";
import { useRouter } from "next/router";
import { IUser } from "@/services/types/user";
import { useToast } from "@/hooks/use-toast";

export const RegistrationsList = () => {
  const [registeredUsers, setRegisteredUsers] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [deletingRegistrationId, setDeletingRegistrationId] = useState<string | null>(null);
  const { slug } = router.query;

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "new":
        return "New";
      case "onboarding":
        return "Onboarding";
      case "payment":
        return "Payment";
      case "waitlisted":
        return "Waitlisted";
      case "confirmed":
        return "Confirmed";
      default:
        return status || "Unknown";
    }
  };

  const fetchUsers = async (query: string = "") => {
    try {
      const response = await FlagshipService.getRegisteredUsers(
        slug as string,
        query
      );
      setRegisteredUsers(response);
    } catch (error) {
      console.error("Failed to fetch registered users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchUsers();
    }
  }, [slug]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchUsers(value);
  };

  const handleDeleteRegistration = async (registration: IRegistration) => {
    if (!registration?._id) return;
    const fullName = (registration.user as IUser)?.fullName || "this user";
    window.alert(
      "Warning: deleting a registration permanently removes the user’s seat, related payment, and will notify the traveler—this cannot be undone."
    );
    const confirmed = window.confirm(
      `Are you sure you want to delete ${fullName}'s registration? This action cannot be undone.`,
    );
    if (!confirmed) return;
    const reasonInput = window.prompt(
      "Optional reason for the user (this will be included in the email/notification):",
      "",
    );
    const reason = reasonInput?.trim();
    try {
      setDeletingRegistrationId(registration._id);
      await FlagshipService.deleteRegistration(registration._id, reason || undefined);
      toast({
        title: "Registration deleted",
        description: `${fullName} can re-register if they wish.`,
      });
      fetchUsers(searchQuery);
    } catch (error: any) {
      console.error("Failed to delete registration:", error);
      toast({
        title: "Delete failed",
        description: error?.message || "Unable to delete registration right now.",
        variant: "destructive",
      });
    } finally {
      setDeletingRegistrationId(null);
    }
  };

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Search Field */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by name..."
        className="w-full border rounded-md p-2 mb-4"
      />

      {/* Registered Users List */}
      {registeredUsers.length === 0 ? (
        <p>No registered users found.</p>
      ) : (
        registeredUsers.map((r) => (
          <Link href={`/admin/user-details/${r._id}`} key={r._id}>
            <div className="border rounded-lg p-4 flex flex-col relative mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {(r.user as IUser).fullName}
                </h3>
                <p className="text-sm text-gray-500">{`Joining from ${
                  (r.user as IUser).city
                }`}</p>
                <p className="text-sm text-gray-500">{`Status: ${getStatusLabel(r.status)}`}</p>
                {((r.user as IUser)?.verification?.status) && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="uppercase tracking-wide font-semibold">
                      Verification:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${
                        (r.user as IUser)?.verification?.status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : (r.user as IUser)?.verification?.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {(r.user as IUser)?.verification?.status}
                    </span>
                  </p>
                )}
                {r.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(r.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <Image
                  src="/star_shield.png"
                  alt="Verified Shield"
                  width={40}
                  height={40}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleDeleteRegistration(r);
                  }}
                  disabled={deletingRegistrationId === r._id}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {deletingRegistrationId === r._id ? "Removing…" : "Delete registration"}
                </button>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};
