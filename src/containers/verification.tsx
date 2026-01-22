import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Card } from "@/components/card";
import Image from "next/image";
import { FlagshipService } from "../services/flagshipService";
import { useRouter } from "next/router";
import { IRegistration } from "@/interfaces/trip/trip";
import Link from "next/link";
import { IUser } from "@/services/types/user";

export const VerificationList = () => {
  const [verificationUsers, setVerificationUsers] = useState<IRegistration[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await FlagshipService.getPendingVerificationUsers(
          slug as string
        ); // call service function
        setVerificationUsers(response); // assuming you return data directly
      } catch (error) {
        console.error("Failed to fetch verification users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="p-4 space-y-4">
      {verificationUsers.map((registration: IRegistration) => (
        <Link
          href={`/admin/user/${(registration.user as IUser)._id}`}
          key={registration.id}
        >
          <Card key={registration.id} className="p-4 flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <img
                src={
                  (registration.user as IUser).profileImg ||
                  "/anonymous-user.png"
                }
                alt={
                  (registration.user as IUser).profileImg
                    ? (registration.user as IUser).fullName
                    : "Anonymous User"
                }
                className="h-full w-full object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                {(registration.user as IUser).fullName}
              </h3>
              <p className="text-sm text-gray-500">
                Joining From: {(registration.user as IUser).city}
              </p>
            </div>
            {
              <Image
                src="/star_shield.png"
                alt="Verified Shield"
                width={40}
                height={40}
              />
            }
          </Card>
        </Link>
      ))}
    </div>
  );
};
