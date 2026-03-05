import { useRef } from "react";
import classNames from "classnames";
import { Camera, Upload, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { isEmpty } from "@/hooks/useSettingsForm";
import type { SettingsFormData } from "@/hooks/useSettingsForm";

interface ProfileHeaderCardProps {
  formData: SettingsFormData;
  email: string;
  initials: string;
  verificationStatus: string;
  highlightMissing: boolean;
  onNameChange: (value: string) => void;
  onProfileImgFile: (file: File) => void;
  onRemoveProfileImg: () => void;
}

/** Maps raw backend verification status to display label + badge styling */
const VERIFICATION_BADGE_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  verified:   { label: "Verified",     variant: "default",     className: "bg-green-100 text-green-700 border-green-200" },
  pending:    { label: "Pending",      variant: "secondary",   className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  rejected:   { label: "Rejected",     variant: "destructive", className: "bg-red-100 text-red-700 border-red-200" },
  unverified: { label: "Not Verified", variant: "outline",     className: "bg-gray-100 text-gray-500 border-gray-200" },
};

const DEFAULT_BADGE = { label: "Not Verified", variant: "outline" as const, className: "bg-gray-100 text-gray-500 border-gray-200" };

export default function ProfileHeaderCard({
  formData,
  email,
  initials,
  verificationStatus,
  highlightMissing,
  onNameChange,
  onProfileImgFile,
  onRemoveProfileImg,
}: ProfileHeaderCardProps) {
  const badge = VERIFICATION_BADGE_MAP[verificationStatus] || DEFAULT_BADGE;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewImg = formData.profileImg;
  const isValidImageUrl =
    previewImg &&
    (previewImg.startsWith("http://") ||
      previewImg.startsWith("https://") ||
      previewImg.startsWith("data:image/"));

  return (
    <Card className="mb-4 lg:mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with hover overlay */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="w-20 h-20 lg:w-24 lg:h-24">
                {isValidImageUrl ? (
                  <AvatarImage src={previewImg} alt="Profile" />
                ) : null}
                <AvatarFallback className="bg-gray-900 text-white text-xl lg:text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onProfileImgFile(file);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-brand-primary hover:underline font-medium flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Upload Photo
              </button>
              {isValidImageUrl && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={onRemoveProfileImg}
                    className="text-gray-400 hover:text-brand-error hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name + Email + Badge */}
          <div className="flex-1 space-y-3 w-full">
            <div
              className={classNames({
                "blink-required": highlightMissing && isEmpty(formData.fullName),
                "rounded-md": highlightMissing && isEmpty(formData.fullName),
              })}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => onNameChange(e.target.value)}
                required
                className="w-full input-field"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                disabled
                className="w-full input-field"
              />
            </div>
            <div>
              <Badge
                variant={badge.variant}
                className={badge.className}
              >
                {badge.label}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
