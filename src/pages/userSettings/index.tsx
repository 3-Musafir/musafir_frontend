"use client";
import { useState, useEffect } from "react";
import Navigation from "../navigation";
import withAuth from "@/hoc/withAuth";
import useUserHandler from "@/hooks/useUserHandler";
import { LogOut, Key, Edit, Save, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/interfaces/login";
import { useToast } from "@/hooks/use-toast";

function UserSettings() {
  const [userData, setUserData] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: "",
    phone: "",
    cnic: "",
    city: "",
    university: "",
    socialLink: "",
    gender: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const userHandler = useUserHandler();
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEdit = searchParams?.get("forceEdit") === "true";
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/login` || "/login",
    });
  };

  const handleResetPassword = () => {
    router.push("/change-password");
  };

  const handleEdit = () => {
    setEditData({
      fullName: userData.fullName || "",
      phone: userData.phone || "",
      cnic: userData.cnic || "",
      city: userData.city || "",
      university: userData.university || "",
      socialLink: userData.socialLink || "",
      gender: userData.gender || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (forceEdit) return; // cannot exit edit when forced
    setIsEditing(false);
    setEditData({
      fullName: "",
      phone: "",
      cnic: "",
      city: "",
      university: "",
      socialLink: "",
      gender: "",
    });
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const updatedUser = await userHandler.updateUser(editData);
      setUserData(updatedUser);
      if (!forceEdit) {
        setIsEditing(false);
        setEditData({
          fullName: "",
          phone: "",
          cnic: "",
          city: "",
          university: "",
          socialLink: "",
          gender: "",
        });
      }
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("Failed to update user data");
      
      // Show error toast
      toast({
        title: "Update Failed",
        description: "Failed to update user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await userHandler.getMe();
      setUserData(response);
      setEditData({
        fullName: response.fullName || "",
        phone: response.phone || "",
        cnic: response.cnic || "",
        city: response.city || "",
        university: response.university || "",
        socialLink: response.socialLink || "",
        gender: response.gender || "",
      });
      if (forceEdit || !(response as any)?.profileComplete) {
        setIsEditing(true);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
      setIsLoading(false);
      
      // Show error toast
      toast({
        title: "Load Failed",
        description: "Failed to load user data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white md:flex md:items-center md:justify-center p-0">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg h-screen">
        <Navigation />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-white h-full">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {(forceEdit || !(userData as any)?.profileComplete) && (
              <div className="mb-4 mx-6 p-4 bg-yellow-100 text-yellow-800 rounded-md">
                Please complete your profile to continue. Editing is required.
              </div>
            )}
            <header className="flex items-center justify-center p-2 mt-2">
              <h1 className="text-2xl font-semibold">User Settings</h1>
            </header>
            <form className="space-y-6 h-full p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={isEditing ? editData.fullName : (userData.fullName || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, fullName: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ""}
                  disabled
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={isEditing ? editData.phone : (userData.phone || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, phone: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  CNIC
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={isEditing ? editData.cnic : (userData.cnic || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, cnic: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={isEditing ? editData.city : (userData.city || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, city: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University / Workplace
                </label>
                <input
                  type="text"
                  name="university"
                  value={isEditing ? editData.university : (userData.university || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, university: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Link
                </label>
                <input
                  type="text"
                  name="socialLink"
                  value={isEditing ? editData.socialLink : (userData.socialLink || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, socialLink: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={isEditing ? editData.gender : (userData.gender || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, gender: e.target.value as User["gender"] })}
                  disabled={!isEditing}
                  required
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100 bg-white"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral ID
                </label>
                <input
                  type="text"
                  name="referralID"
                  value={userData.referralID || ""}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Musafirs Verified
                </label>
                <input
                  type="text"
                  name="musafirsVerified"
                  value={
                    userData.verificationStats?.verifiedByMe !== undefined
                      ? userData.verificationStats.verifiedByMe
                      : 0
                  }
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Status
                </label>
                <input
                  type="text"
                  name="verificationStatus"
                  value={
                    userData.verification?.status ? "Verified" : "Not Verified"
                  }
                  disabled
                  className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                />
              </div>
            </form>
            <div className="flex flex-col gap-3 px-6 mt-4">
              <button
                onClick={handleResetPassword}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
              >
                <Key className="w-5 h-5" />
                Reset Password
              </button>
              
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:bg-green-300 rounded-md transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                  {!forceEdit && (
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  )}
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-orange-500 hover:text-white rounded-md transition-colors mb-10"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default withAuth(UserSettings);
