import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/services/types/user";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UsersContainerProps {
  users: IUser[];
  activeSection: string;
  searchQuery?: string;
  isSearching?: boolean;
}

export function UsersContainer({ users, activeSection, searchQuery, isSearching }: UsersContainerProps) {
  const router = useRouter();

  const handleViewUserDetails = (userId: string) => {
    router.push(`/admin/user/${userId}`);
  };

  if (isSearching) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-xl font-medium mb-2">Searching...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {users?.length > 0 ? users.map((user) => (
        <Card
          key={user._id}
          className="overflow-hidden transition-all duration-200 hover:shadow-lg"
          onClick={() => handleViewUserDetails(user._id)}
        >
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">{user.fullName}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">University</span>
                <span className="font-medium">{user.university}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                user.verification.status === "unverified" && "text-brand-error",
                user.verification.status === "pending" && "text-brand-warning",
                user.verification.status === "verified" && "text-brand-primary"
              )}
            >
              {user.verification.status}
            </Badge>
          </CardFooter>
        </Card>
      )) : (
        <div className="text-center text-gray-500 py-8">
          <p className="text-xl font-medium mb-2">
            {searchQuery
              ? `No ${activeSection} users found for "${searchQuery}"`
              : "No Users Available Yet"
            }
          </p>
        </div>
      )}
    </div>
  );
}
