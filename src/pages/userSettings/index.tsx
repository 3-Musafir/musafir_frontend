"use client";
import { useState, useEffect, useMemo } from "react";
import classNames from "classnames";
import Navigation from "../navigation";
import Header from "../../components/header";
import withAuth from "@/hoc/withAuth";
import useUserHandler from "@/hooks/useUserHandler";
import { LogOut, Key, Edit, Save, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/interfaces/login";
import { useToast } from "@/hooks/use-toast";
import {
  formatPhoneForApi,
  inputFromStoredPhone,
  sanitizePhoneInput,
  validatePhoneDigits,
} from "@/utils/phone";
import { cnicDigits, formatCnicInput, validateCnicFormat } from "@/utils/cnic";

const employmentOptions = [
  { value: "student", label: "Student", placeholder: "University" },
  { value: "employed", label: "Employed", placeholder: "Workplace" },
  { value: "selfEmployed", label: "Business/Self Employed", placeholder: "Business Name" },
  { value: "unemployed", label: "Living in my unemployment era", placeholder: "" },
];

const blinkStyle = `
@keyframes blink-required {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); }
  50% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25); }
}
.blink-required {
  animation: blink-required 1.2s ease-in-out infinite;
  border-color: #ef4444 !important;
}
`;

function UserSettings() {
  const [userData, setUserData] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    fullName: string;
    phone: string;
    cnic: string;
    city: string;
    university: string;
    employmentStatus: "student" | "employed" | "selfEmployed" | "unemployed";
    socialLink: string;
    gender: User["gender"] | "";
    profileImg: string;
  }>({
    fullName: "",
    phone: "",
    cnic: "",
    city: "",
    university: "",
    employmentStatus: "unemployed",
    socialLink: "",
    gender: "",
    profileImg: "",
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [cnicError, setCnicError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const userHandler = useUserHandler();
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEdit = searchParams?.get("forceEdit") === "true";
  const profileStatus = (userData as any)?.profileStatus;
  const { toast } = useToast();
  const hasIncompleteProfile = forceEdit; // only force when explicitly requested
  const missingFields: string[] = profileStatus?.missing || [];
  const highlightMissing = forceEdit;
  const initials = useMemo(() => {
    const name = userData.fullName || userData.email || "";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return (name[0] || "U").toUpperCase();
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [userData.fullName, userData.email]);

  const isEmpty = (val?: string | null) => !val || val.trim().length === 0;

  const handleProfileImgFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEditData((prev) => ({ ...prev, profileImg: result || "" }));
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    const base = process.env.NEXT_PUBLIC_AUTH_URL?.trim();
    const callbackUrl = base ? `${base}/login` : "/login";
    await signOut({ callbackUrl });
  };

  const handleResetPassword = () => {
    router.push("/change-password");
  };

  const handleEdit = () => {
    setEditData({
      fullName: userData.fullName || "",
      phone: inputFromStoredPhone(userData.phone || ""),
      cnic: formatCnicInput(userData.cnic || ""),
      city: userData.city || "",
      university: userData.university || "",
      employmentStatus: (userData as any).employmentStatus || "unemployed",
      socialLink: userData.socialLink || "",
      gender: userData.gender || "",
      profileImg: userData.profileImg || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (forceEdit) return; // cannot exit edit when forced
    setIsEditing(false);
    setEditData({
      fullName: userData.fullName || "",
      phone: inputFromStoredPhone(userData.phone || ""),
      cnic: formatCnicInput(userData.cnic || ""),
      city: userData.city || "",
      university: userData.university || "",
      employmentStatus: (userData as any).employmentStatus || "unemployed",
      socialLink: userData.socialLink || "",
      gender: userData.gender || "",
      profileImg: userData.profileImg || "",
    });
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      const phoneValidationError = validatePhoneDigits(editData.phone, 'Phone');
      setPhoneError(phoneValidationError);
      if (phoneValidationError) {
        setIsUpdating(false);
        return;
      }
      if (!editData.employmentStatus) {
        setIsUpdating(false);
        toast({
          title: "Validation Error",
          description: "Employment status is required.",
          variant: "destructive",
        });
        return;
      }
      const requiresWorkDetail = editData.employmentStatus !== "unemployed";
      if (requiresWorkDetail && !editData.university) {
        setIsUpdating(false);
        toast({
          title: "Validation Error",
          description: "Please provide the required detail for your employment status.",
          variant: "destructive",
        });
        return;
      }
      const cnicValidationError = validateCnicFormat(editData.cnic);
      setCnicError(cnicValidationError);
      if (cnicValidationError) {
        setIsUpdating(false);
        return;
      }
      
      const payload = {
        ...editData,
        phone: formatPhoneForApi(editData.phone),
        cnic: cnicDigits(editData.cnic),
        university: requiresWorkDetail ? editData.university : "",
        // Don't send profileImg if it's empty to avoid validation error
        ...(editData.profileImg ? { profileImg: editData.profileImg } : {}),
      };

      const updatedUser = await userHandler.updateUser(payload);
      setUserData(updatedUser);
      if (!forceEdit) {
        setIsEditing(false);
        setEditData({
          fullName: "",
          phone: "",
          cnic: "",
          city: "",
          university: "",
          employmentStatus: "unemployed",
          socialLink: "",
          gender: "",
          profileImg: "",
        });
      }
      setPhoneError(null);
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
    } catch (err: any) {
      console.error("Error updating user data:", err);
      
      // Extract the actual error message from backend
      const errorMessage = err?.response?.data?.message 
        ? (Array.isArray(err.response.data.message) 
            ? err.response.data.message.join(', ') 
            : err.response.data.message)
        : "Failed to update user data. Please try again.";
      
      // Only show toast, don't set error state to avoid duplicate messages
      toast({
        title: "Update Failed",
        description: errorMessage,
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
      if (!response) {
        setUserData({} as User);
        setIsLoading(false);
        toast({
          title: "Load Failed",
          description: "User data is unavailable. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }
      setUserData(response);
      setEditData({
        fullName: response.fullName || "",
        phone: inputFromStoredPhone(response.phone || ""),
        cnic: formatCnicInput(response.cnic || ""),
        city: response.city || "",
        university: response.university || "",
        employmentStatus: (response as any).employmentStatus || "unemployed",
        socialLink: response.socialLink || "",
        gender: response.gender || "",
        profileImg: response.profileImg || "",
      });
      if (forceEdit) {
        setIsEditing(true);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setIsLoading(false);
      
      // Only show toast, don't set error state to avoid duplicate messages
      toast({
        title: "Load Failed",
        description: "Failed to load user data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const verificationStatus =
    (userData as any)?.verification?.status || "";
  const verificationLabel =
    verificationStatus === "verified"
      ? "Verified"
      : verificationStatus === "pending"
        ? "Pending"
        : verificationStatus === "rejected"
          ? "Rejected"
          : "Not Verified";

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
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <style>{blinkStyle}</style>
      <Header setSidebarOpen={() => { }} showMenuButton={false} />

      <main className="flex-1 overflow-y-auto bg-white h-full px-2 pb-24 pt-4">
        {(forceEdit || missingFields.length > 0) && (
          <div className="mb-4 mx-2 p-4 bg-brand-warning-light text-yellow-800 rounded-md flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {forceEdit ? "Please complete your profile to continue." : "Profile incomplete"}
                </p>
                {missingFields.length > 0 && (
                  <p className="text-sm">
                    Missing: {missingFields.join(", ")}.
                  </p>
                )}
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md"
                >
                  Edit now
                </button>
              )}
            </div>
          </div>
        )}
        <header className="flex items-center justify-center p-2 mt-2">
          <h1 className="text-2xl font-semibold">User Settings</h1>
        </header>
        <form className="space-y-6 h-full p-4">
          <div className="flex items-center gap-4">
            {(() => {
              const previewImg = isEditing ? editData.profileImg : (editData.profileImg || userData.profileImg || "");
              // Only show image if it's a valid URL or data URL
              const isValidImageUrl = previewImg && (
                previewImg.startsWith('http://') || 
                previewImg.startsWith('https://') || 
                previewImg.startsWith('data:image/')
              );
              return (
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-lg overflow-hidden relative">
                  {isValidImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewImg} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              );
            })()}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Profile image</label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProfileImgFile(e.target.files?.[0])}
                  className="text-sm"
                />
                <button
                  type="button"
                  onClick={() => setEditData((prev) => ({ ...prev, profileImg: "" }))}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
              <input
                type="url"
                name="profileImg"
                placeholder="https://example.com/avatar.jpg"
                value={editData.profileImg}
                onChange={(e) => setEditData({ ...editData, profileImg: e.target.value })}
                className="w-full input-field"
              />
              <p className="text-xs text-gray-500">Upload an image or paste a URL (JPEG/PNG recommended).</p>
            </div>
          </div>

              <div className={classNames({
                "blink-required": highlightMissing && isEmpty(isEditing ? editData.fullName : userData.fullName),
              })}>
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
                  className="w-full input-field"
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
                  className="w-full input-field"
                />
              </div>
              <div className={classNames({
                "blink-required": highlightMissing && isEmpty(isEditing ? editData.phone : userData.phone),
              })}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="flex gap-2 items-start">
                  <select
                    className="w-[100px] h-11 input-field"
                    disabled
                  >
                    <option value="+92">+92</option>
                  </select>
                  <div className="flex-1">
                    <input
                      type="tel"
                      name="phone"
                      value={
                        isEditing
                          ? editData.phone
                          : (userData.phone || "")
                      }
                      onChange={(e) => {
                        if (!isEditing) return;
                        const value = sanitizePhoneInput(e.target.value);
                        setEditData({ ...editData, phone: value });
                        if (value.length === 10) {
                          setPhoneError(null);
                        }
                      }}
                      disabled={!isEditing}
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="3XXXXXXXXX"
                      className={`w-full input-field focus:outline-none focus:ring-2 ${ phoneError ? "border-brand-error focus:ring-red-500" : "border-gray-300 focus:ring-gray-400" }`}
                      aria-invalid={phoneError ? "true" : "false"}
                      aria-describedby={phoneError ? "phone-error" : undefined}
                    />
                    {phoneError && (
                      <p id="phone-error" className="text-xs text-brand-error mt-1">
                        {phoneError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className={classNames({
                "blink-required": highlightMissing && isEmpty(isEditing ? editData.cnic : userData.cnic),
              })}>
                <label className="block text-gray-700 mb-1">
                  CNIC
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={isEditing ? editData.cnic : formatCnicInput(userData.cnic || "")}
                  onChange={(e) => {
                    if (!isEditing) return;
                    const formatted = formatCnicInput(e.target.value);
                    setEditData({ ...editData, cnic: formatted });
                    if (!validateCnicFormat(formatted)) {
                      setCnicError(null);
                    }
                  }}
                  disabled={!isEditing}
                  required
                  maxLength={15}
                  placeholder="12345-1234567-1"
                  className={`w-full input-field ${ cnicError ? "border-brand-error focus:ring-red-500" : "" }`}
                  aria-invalid={cnicError ? "true" : "false"}
                  aria-describedby={cnicError ? "cnic-error" : undefined}
                />
                {cnicError && (
                  <p id="cnic-error" className="text-xs text-brand-error mt-1">
                    {cnicError}
                  </p>
                )}
              </div>
              <div className={classNames({
                "blink-required": highlightMissing && isEmpty(isEditing ? editData.city : userData.city),
              })}>
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
                  className="w-full input-field"
                />
              </div>
              <div className={classNames({
                "blink-required": highlightMissing && isEmpty(isEditing ? editData.employmentStatus : (userData as any).employmentStatus),
              })}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Status
                </label>
                <select
                  name="employmentStatus"
                  value={isEditing ? editData.employmentStatus : ((userData as any).employmentStatus || "unemployed")}
                  onChange={(e) => {
                    if (!isEditing) return;
                    const value = e.target.value as typeof editData.employmentStatus;
                    setEditData({
                      ...editData,
                      employmentStatus: value,
                      university: value === "unemployed" ? "" : editData.university,
                    });
                  }}
                  disabled={!isEditing}
                  required
                  className="w-full input-field bg-white"
                >
                  <option value="" disabled>Select status</option>
                  {employmentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              { (isEditing ? editData.employmentStatus : (userData as any).employmentStatus) !== "unemployed" && (
                <div className={classNames({
                  "blink-required": highlightMissing && isEmpty(isEditing ? editData.university : userData.university),
                })}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {employmentOptions.find(o => o.value === (isEditing ? editData.employmentStatus : (userData as any).employmentStatus))?.placeholder || "Details"}
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={isEditing ? editData.university : (userData.university || "")}
                    onChange={(e) => isEditing && setEditData({ ...editData, university: e.target.value })}
                    disabled={!isEditing}
                    required
                    placeholder={
                      employmentOptions.find(o => o.value === (isEditing ? editData.employmentStatus : (userData as any).employmentStatus))?.placeholder || ""
                    }
                    className="w-full input-field"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Handle/Link
                </label>
                <input
                  type="text"
                  name="socialLink"
                  value={isEditing ? editData.socialLink : (userData.socialLink || "")}
                  onChange={(e) => isEditing && setEditData({ ...editData, socialLink: e.target.value })}
                  disabled={!isEditing}
                  placeholder="@username or instagram.com/username"
                  className="w-full input-field"
                />
              </div>
              <div className={classNames({
                "blink-required": highlightMissing && isEmpty(isEditing ? editData.gender : userData.gender),
              })}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={isEditing ? (editData.gender ?? "") : (userData.gender ?? "")}
                  onChange={
                    isEditing
                      ? (e) => setEditData({ ...editData, gender: (e.target.value as User["gender"]) || "" })
                      : undefined
                  }
                  disabled={!isEditing}
                  required
                  className="w-full input-field bg-white"
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
                  className="w-full input-field"
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
                  className="w-full input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Status
                </label>
                <input
                  type="text"
                  name="verificationStatus"
                  value={verificationLabel}
                  disabled
                  className="w-full input-field"
                />
              </div>
        </form>
        <div className="flex flex-col gap-3 px-6 mt-4">
          <button
            onClick={handleResetPassword}
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-colors"
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
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-brand-primary hover:text-white rounded-md transition-colors mb-10"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </main>

      <Navigation />
    </div>
  );
}

export default withAuth(UserSettings);
