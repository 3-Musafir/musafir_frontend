import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FlagshipService } from "@/services/flagshipService";
import { IRegistration } from "@/interfaces/trip/trip";
import { useRouter } from "next/router";
import { IUser } from "@/services/types/user";

export const RegistrationsList = () => {
  const [registeredUsers, setRegisteredUsers] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { slug } = router.query;

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
          <Link href={`/admin/user-details/${r._id}`} key={r.id}>
            <div className="border rounded-lg p-4 flex items-center relative mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {(r.user as IUser).fullName}
                </h3>
                <p className="text-sm text-gray-500">{`Joining from ${
                  (r.user as IUser).city
                }`}</p>
                {(r.status === "rejected" || r.status === "accepted" || r.status === "didntPick") && (<p className="text-sm text-gray-500">{`Status: ${
                  r.status === "rejected"? "Rejected": r.status === "accepted"? "Accepted": r.status === "didntPick"? "Didn't Pick": ""
                }`}</p>)}
              </div>
              <div className="absolute top-4 right-4">
                <Image
                  src="/star_shield.png"
                  alt="Verified Shield"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};
