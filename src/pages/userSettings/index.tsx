"use client";
import Navigation from "../navigation";
import Header from "../../components/header";
import withAuth from "@/hoc/withAuth";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileHeaderCard from "@/components/userSettings/ProfileHeaderCard";
import ProfileCompletionMeter from "@/components/userSettings/ProfileCompletionMeter";
import PersonalInfoCard from "@/components/userSettings/PersonalInfoCard";
import ProfessionalInfoCard from "@/components/userSettings/ProfessionalInfoCard";
import SocialCard from "@/components/userSettings/SocialCard";
import AccountStatsCard from "@/components/userSettings/AccountStatsCard";
import SecurityCard from "@/components/userSettings/SecurityCard";
import SaveBar from "@/components/userSettings/SaveBar";

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

function SettingsLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto page-padding pt-6 space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

function UserSettings() {
  const {
    userData,
    formData,
    isLoading,
    isUpdating,
    isDirty,
    phoneError,
    cnicError,
    forceEdit,
    highlightMissing,
    initials,
    verificationStatus,
    completionPercentage,
    completionFields,
    missingFieldsList,
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
  } = useSettingsForm();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex flex-col">
        <Header setSidebarOpen={() => {}} showMenuButton={false} />
        <main className="flex-1 overflow-y-auto bg-white">
          <SettingsLoadingSkeleton />
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <style>{blinkStyle}</style>
      <Header setSidebarOpen={() => {}} showMenuButton={false} />

      <main className="flex-1 overflow-y-auto bg-white pb-28 lg:pb-16">
        <div className="max-w-4xl mx-auto page-padding pt-6">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-heading mb-5">Profile </h1>

          {/* Profile Completion Meter */}
          <ProfileCompletionMeter
            percentage={completionPercentage}
            missingFields={missingFieldsList}
            completionFields={completionFields}
            forceEdit={forceEdit}
          />

          {/* Profile Header - Avatar, Name, Email, Badge */}
          <ProfileHeaderCard
            formData={formData}
            email={userData.email || ""}
            initials={initials}
            verificationStatus={verificationStatus}
            highlightMissing={highlightMissing}
            onNameChange={(val) => updateField("fullName", val)}
            onProfileImgFile={handleProfileImgFile}
            onRemoveProfileImg={handleRemoveProfileImg}
          />

          {/* Section Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Left Column */}
            <div className="space-y-4 lg:space-y-6">
              <PersonalInfoCard
                formData={formData}
                highlightMissing={highlightMissing}
                phoneError={phoneError}
                cnicError={cnicError}
                onPhoneChange={handlePhoneChange}
                onCnicChange={handleCnicChange}
                onFieldChange={(field, val) => updateField(field as keyof typeof formData, val)}
                onGenderChange={(val) => updateField("gender", val as string)}
              />
              <ProfessionalInfoCard
                formData={formData}
                highlightMissing={highlightMissing}
                onFieldChange={(field, val) => updateField(field as keyof typeof formData, val)}
                onEmploymentChange={handleEmploymentChange}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:space-y-6">
              <SocialCard
                socialLink={formData.socialLink}
                onFieldChange={(field, val) => updateField(field as keyof typeof formData, val)}
              />
              <AccountStatsCard
                referralID={userData.referralID || ""}
                musafirsVerified={userData.verificationStats?.verifiedByMe ?? 0}
              />
              <SecurityCard
                onChangePassword={handleChangePassword}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Save Bar */}
      <SaveBar
        isDirty={isDirty}
        isUpdating={isUpdating}
        forceEdit={forceEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <Navigation />
    </div>
  );
}

export default withAuth(UserSettings);
