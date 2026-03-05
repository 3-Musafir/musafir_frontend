"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { User } from "@/interfaces/login";
import { useToast } from "@/hooks/use-toast";
import useUserHandler from "@/hooks/useUserHandler";
import {
  formatPhoneForApi,
  inputFromStoredPhone,
  sanitizePhoneInput,
  validatePhoneDigits,
} from "@/utils/phone";
import { cnicDigits, formatCnicInput, validateCnicFormat } from "@/utils/cnic";

export interface SettingsFormData {
  fullName: string;
  phone: string;
  cnic: string;
  city: string;
  university: string;
  employmentStatus: "student" | "employed" | "selfEmployed" | "unemployed";
  socialLink: string;
  gender: User["gender"] | "";
  profileImg: string;
}

export interface CompletionField {
  key: string;
  label: string;
  filled: boolean;
}

export const employmentOptions = [
  { value: "student", label: "Student", placeholder: "University" },
  { value: "employed", label: "Employed", placeholder: "Workplace" },
  { value: "selfEmployed", label: "Business/Self Employed", placeholder: "Business Name" },
  { value: "unemployed", label: "Living in my unemployment era", placeholder: "" },
] as const;

const emptyForm: SettingsFormData = {
  fullName: "",
  phone: "",
  cnic: "",
  city: "",
  university: "",
  employmentStatus: "unemployed",
  socialLink: "",
  gender: "",
  profileImg: "",
};

function buildFormData(user: User): SettingsFormData {
  return {
    fullName: user.fullName || "",
    phone: inputFromStoredPhone(user.phone || ""),
    cnic: formatCnicInput(user.cnic || ""),
    city: user.city || "",
    university: user.university || "",
    employmentStatus: (user as any).employmentStatus || "unemployed",
    socialLink: user.socialLink || "",
    gender: user.gender || "",
    profileImg: user.profileImg || "",
  };
}

function formDataEqual(a: SettingsFormData, b: SettingsFormData): boolean {
  return (
    a.fullName === b.fullName &&
    a.phone === b.phone &&
    a.cnic === b.cnic &&
    a.city === b.city &&
    a.university === b.university &&
    a.employmentStatus === b.employmentStatus &&
    a.socialLink === b.socialLink &&
    a.gender === b.gender &&
    a.profileImg === b.profileImg
  );
}

const isSafeReturnTo = (value?: string | null) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\");

export const isEmpty = (val?: string | null) => !val || val.trim().length === 0;

export function useSettingsForm() {
  const [userData, setUserData] = useState<User>({} as User);
  const [formData, setFormData] = useState<SettingsFormData>(emptyForm);
  const pristineRef = useRef<SettingsFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [cnicError, setCnicError] = useState<string | null>(null);

  const userHandler = useUserHandler();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const forceEdit = searchParams?.get("forceEdit") === "true";
  const returnTo = searchParams?.get("returnTo") || "";
  const profileStatus = (userData as any)?.profileStatus;
  const isFlagshipReturn =
    forceEdit && typeof returnTo === "string" && returnTo.includes("/flagship/flagship-requirement");
  const requiredFields = isFlagshipReturn
    ? profileStatus?.requiredFor?.flagshipRegistration
    : profileStatus?.missing;
  const missingFields: string[] = requiredFields || [];
  const highlightMissing = forceEdit;

  const isDirty = useMemo(
    () => !formDataEqual(formData, pristineRef.current),
    [formData]
  );

  const initials = useMemo(() => {
    const name = userData.fullName || userData.email || "";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return (name[0] || "U").toUpperCase();
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [userData.fullName, userData.email]);

  const verificationStatus = (userData as any)?.verification?.status || "";
  // Raw status string matching backend VerificationStatus enum values:
  // "verified" | "pending" | "rejected" | "unverified"

  const completionFields = useMemo<CompletionField[]>(() => [
    { key: "fullName", label: "Full Name", filled: !isEmpty(formData.fullName) },
    { key: "phone", label: "Phone", filled: !isEmpty(formData.phone) },
    { key: "cnic", label: "CNIC", filled: !isEmpty(formData.cnic) },
    { key: "city", label: "City", filled: !isEmpty(formData.city) },
    { key: "gender", label: "Gender", filled: !!formData.gender },
    { key: "employmentStatus", label: "Employment", filled: !!formData.employmentStatus },
    { key: "profileImg", label: "Profile Photo", filled: !isEmpty(formData.profileImg) },
    { key: "socialLink", label: "Instagram", filled: !isEmpty(formData.socialLink) },
  ], [formData]);

  const completionPercentage = useMemo(
    () => Math.round((completionFields.filter((f) => f.filled).length / completionFields.length) * 100),
    [completionFields]
  );

  const missingFieldsList = useMemo(
    () => completionFields.filter((f) => !f.filled),
    [completionFields]
  );

  const fetchUserData = useCallback(async () => {
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
      const built = buildFormData(response);
      setFormData(built);
      pristineRef.current = built;
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setIsLoading(false);
      toast({
        title: "Load Failed",
        description: "Failed to load user data. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateField = useCallback((field: keyof SettingsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    const sanitized = sanitizePhoneInput(value);
    setFormData((prev) => ({ ...prev, phone: sanitized }));
    if (sanitized.length === 10) {
      setPhoneError(null);
    }
  }, []);

  const handleCnicChange = useCallback((value: string) => {
    const formatted = formatCnicInput(value);
    setFormData((prev) => ({ ...prev, cnic: formatted }));
    if (!validateCnicFormat(formatted)) {
      setCnicError(null);
    }
  }, []);

  const handleEmploymentChange = useCallback((value: SettingsFormData["employmentStatus"]) => {
    setFormData((prev) => ({
      ...prev,
      employmentStatus: value,
      university: value === "unemployed" ? "" : prev.university,
    }));
  }, []);

  const handleProfileImgFile = useCallback((file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFormData((prev) => ({ ...prev, profileImg: result || "" }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveProfileImg = useCallback(() => {
    setFormData((prev) => ({ ...prev, profileImg: "" }));
  }, []);

  const handleCancel = useCallback(() => {
    if (forceEdit) return;
    setFormData(pristineRef.current);
    setPhoneError(null);
    setCnicError(null);
  }, [forceEdit]);

  const handleSave = useCallback(async () => {
    try {
      setIsUpdating(true);

      const phoneValidationError = validatePhoneDigits(formData.phone, "Phone");
      setPhoneError(phoneValidationError);
      if (phoneValidationError) {
        setIsUpdating(false);
        return;
      }

      if (isFlagshipReturn) {
        const missing: string[] = [];
        if (!formData.city) missing.push("city");
        if (!formData.gender) missing.push("gender");
        if (missing.length) {
          setIsUpdating(false);
          toast({
            title: "Missing Information",
            description: "Please select your gender and city to continue.",
            variant: "destructive",
          });
          return;
        }
        if (formData.cnic) {
          const cnicValidationError = validateCnicFormat(formData.cnic);
          setCnicError(cnicValidationError);
          if (cnicValidationError) {
            setIsUpdating(false);
            return;
          }
        } else {
          setCnicError(null);
        }
      } else {
        if (!formData.employmentStatus) {
          setIsUpdating(false);
          toast({
            title: "Missing Information",
            description: "Please select your employment status.",
            variant: "destructive",
          });
          return;
        }
        const requiresWorkDetail = formData.employmentStatus !== "unemployed";
        if (requiresWorkDetail && !formData.university) {
          const fieldLabel =
            employmentOptions.find((o) => o.value === formData.employmentStatus)?.placeholder || "details";
          setIsUpdating(false);
          toast({
            title: "Missing Information",
            description: `Please enter your ${fieldLabel.toLowerCase()}.`,
            variant: "destructive",
          });
          return;
        }
        const cnicValidationError = validateCnicFormat(formData.cnic);
        setCnicError(cnicValidationError);
        if (cnicValidationError) {
          setIsUpdating(false);
          return;
        }
      }

      const requiresWorkDetail = formData.employmentStatus !== "unemployed";
      const payload = {
        ...formData,
        phone: formatPhoneForApi(formData.phone),
        cnic: cnicDigits(formData.cnic),
        university: requiresWorkDetail ? formData.university : "",
        ...(formData.profileImg ? { profileImg: formData.profileImg } : {}),
      };

      const updatedUser = await userHandler.updateUser(payload);
      setUserData(updatedUser);
      const newPristine = buildFormData(updatedUser);
      setFormData(newPristine);
      pristineRef.current = newPristine;
      setPhoneError(null);
      setCnicError(null);

      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });

      if (forceEdit && returnTo) {
        const destination = isSafeReturnTo(returnTo) ? returnTo : "/home";
        router.replace(destination);
        return;
      }
    } catch (err: any) {
      console.error("Error updating user data:", err);
      const errorMessage = err?.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : "Failed to update user data. Please try again.";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [formData, forceEdit, returnTo, isFlagshipReturn, router, toast, userHandler]);

  const handleLogout = useCallback(async () => {
    const base = process.env.NEXT_PUBLIC_AUTH_URL?.trim();
    const callbackUrl = base ? `${base}/login` : "/login";
    await signOut({ callbackUrl });
  }, []);

  const handleChangePassword = useCallback(() => {
    router.push("/change-password");
  }, [router]);

  return {
    userData,
    formData,
    isLoading,
    isUpdating,
    isDirty,
    phoneError,
    cnicError,
    forceEdit,
    highlightMissing,
    missingFields,
    initials,
    verificationStatus,
    completionPercentage,
    completionFields,
    missingFieldsList,
    isFlagshipReturn,
    updateField,
    handlePhoneChange,
    handleCnicChange,
    handleEmploymentChange,
    handleProfileImgFile,
    handleRemoveProfileImg,
    handleCancel,
    handleSave,
    handleLogout,
    handleChangePassword,
  };
}
