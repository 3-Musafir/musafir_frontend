"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";
import { IUser } from "@/services/types/user";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User,
  Mail,
  Phone,
  IdCard,
  Calendar,
  GraduationCap,
  MapPin,
  Link,
  Hash,
  LucideIcon,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/router";

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const userId = id as string;
  const registrationId =
    typeof router.query.registrationId === "string"
      ? router.query.registrationId
      : undefined;
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const data = await UserService.getUserById(userId);
        setUser({
          ...data,
          verification: data.verification ?? {
            status: "unverified",
            RequestCall: false,
          },
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast, userId]);

  const handleApproveUser = async () => {
    if (!user) return;

    setProcessing(true);
    try {
      await UserService.updateVerificationStatus(user._id, "verified", {
        registrationId,
      });
      toast({
        title: "Success",
        description: "User approved successfully",
      });
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectUser = async () => {
    if (!user) return;

    setProcessing(true);
    try {
      await UserService.rejectUser(user._id);
      toast({
        title: "Success",
        description: "User rejected successfully",
      });
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleVerification = async () => {
    if (!user) return;
    const nextStatus =
      user.verification.status === "verified" ? "unverified" : "verified";

    setToggleLoading(true);
    try {
      const updatedUser = await UserService.updateVerificationStatus(
        user._id,
        nextStatus,
        { registrationId }
      );
      const normalizedUser = {
        ...updatedUser,
        verification: updatedUser.verification ?? {
          status: "unverified",
          RequestCall: false,
        },
      };
      setUser(normalizedUser);
      toast({
        title: "Success",
        description:
          nextStatus === "verified"
            ? "User verified successfully"
            : "User marked as unverified",
      });
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>User not found</p>
      </div>
    );
  }

  const getVerificationBadge = () => {
    const status = user?.verification?.status ?? "unverified";
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-brand-warning-light text-yellow-800">
            Pending
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="default" className="bg-brand-primary/10 text-green-800">
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-brand-error-light text-red-800">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unverified</Badge>;
    }
  };

  const InfoCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="w-full max-w-md mx-auto bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: LucideIcon;
    label: string;
    value: string | number | boolean;
  }) => (
    <div className="flex items-start space-x-3 py-2">
      <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-900">{value?.toString()}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  aria-label="Back to users"
                  className="hover:bg-blue-100 text-gray-700"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {user.fullName}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                </div>
              </div>
              {getVerificationBadge()}
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <InfoCard title="Personal Information">
          <div className="space-y-4">
            <InfoItem icon={Phone} label="Phone" value={user.phone} />
            <InfoItem icon={IdCard} label="CNIC" value={user.cnic} />
            <InfoItem icon={User} label="Gender" value={user.gender} />
            <InfoItem
              icon={Calendar}
              label="Date of Birth"
              value={user.dateOfBirth}
            />
          </div>
        </InfoCard>

        {/* Academic Information */}
        <InfoCard title="Academic Information">
          <div className="space-y-4">
            <InfoItem
              icon={GraduationCap}
              label="University"
              value={user.university}
            />
            <InfoItem icon={MapPin} label="City" value={user.city} />
            <InfoItem
              icon={Link}
              label="Social Link"
              value={user.socialLink || "Not provided"}
            />
            <InfoItem
              icon={Hash}
              label="Referral ID"
              value={user.referralID || "Not provided"}
            />
          </div>
        </InfoCard>

        {/* Verification Status */}
        <InfoCard title="Verification Status">
          <div className="space-y-4">
            <InfoItem
              icon={Mail}
              label="Email Verified"
              value={user.emailVerified ? "Yes" : "No"}
            />
            <InfoItem
              icon={Phone}
              label="Request Call"
              value={user.verification.RequestCall ? "Yes" : "No"}
            />
            {user.verification.videoLink && (
              <div className="flex items-start space-x-3 py-2">
                <Link className="h-5 w-5 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Video Link
                  </p>
                  <a
                    href={user.verification.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {user.verification.videoLink}
                  </a>
                </div>
              </div>
            )}
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleToggleVerification}
                disabled={toggleLoading}
                isLoading={toggleLoading}
                className="w-full justify-center"
              >
                {user.verification.status === "verified"
                  ? "Mark as Unverified"
                  : "Mark as Verified"}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Admin override — toggle between verified and unverified.
              </p>
            </div>
          </div>
        </InfoCard>

        {/* Action Buttons */}
        {user.verification.status === "pending" && (
          <Card className="w-full max-w-md mx-auto bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleApproveUser}
                  disabled={processing}
                  isLoading={processing}
                  className="w-full sm:w-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm"
                >
                  Approve User
                </Button>
                <Button
                  onClick={handleRejectUser}
                  disabled={processing}
                  isLoading={processing}
                  className="w-full sm:w-1/2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm"
                >
                  Reject User
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
