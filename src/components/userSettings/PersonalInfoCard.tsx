import classNames from "classnames";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CITIES } from "@/config/constants";
import { isEmpty } from "@/hooks/useSettingsForm";
import type { SettingsFormData } from "@/hooks/useSettingsForm";
import type { User } from "@/interfaces/login";

const selectClass =
  "w-full input-field bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[position:right_12px_center] pr-10" +
  " bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]";

interface PersonalInfoCardProps {
  formData: SettingsFormData;
  highlightMissing: boolean;
  phoneError: string | null;
  cnicError: string | null;
  onPhoneChange: (value: string) => void;
  onCnicChange: (value: string) => void;
  onFieldChange: (field: string, value: string) => void;
  onGenderChange: (value: User["gender"] | "") => void;
}

export default function PersonalInfoCard({
  formData,
  highlightMissing,
  phoneError,
  cnicError,
  onPhoneChange,
  onCnicChange,
  onFieldChange,
  onGenderChange,
}: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Phone */}
          <div
            className={classNames({
              "blink-required": highlightMissing && isEmpty(formData.phone),
              "rounded-md": highlightMissing && isEmpty(formData.phone),
            })}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="flex items-start">
              <span className="inline-flex items-center shrink-0 px-3 h-[42px] lg:h-[46px] text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                +92
              </span>
              <div className="flex-1 min-w-0">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="3XXXXXXXXX"
                  className={`w-full input-field rounded-l-none ${
                    phoneError
                      ? "border-brand-error focus:ring-red-500"
                      : "border-gray-300"
                  }`}
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

          {/* CNIC */}
          <div
            className={classNames({
              "blink-required": highlightMissing && isEmpty(formData.cnic),
              "rounded-md": highlightMissing && isEmpty(formData.cnic),
            })}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
            <input
              type="text"
              name="cnic"
              value={formData.cnic}
              onChange={(e) => onCnicChange(e.target.value)}
              maxLength={15}
              placeholder="12345-1234567-1"
              className={`w-full input-field ${
                cnicError ? "border-brand-error focus:ring-red-500" : ""
              }`}
              aria-invalid={cnicError ? "true" : "false"}
              aria-describedby={cnicError ? "cnic-error" : undefined}
            />
            {cnicError && (
              <p id="cnic-error" className="text-xs text-brand-error mt-1">
                {cnicError}
              </p>
            )}
          </div>

          {/* Gender */}
          <div
            className={classNames({
              "blink-required": highlightMissing && isEmpty(formData.gender),
              "rounded-md": highlightMissing && isEmpty(formData.gender),
            })}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender ?? ""}
              onChange={(e) => onGenderChange((e.target.value as User["gender"]) || "")}
              className={selectClass}
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* City */}
          <div
            className={classNames({
              "blink-required": highlightMissing && isEmpty(formData.city),
              "rounded-md": highlightMissing && isEmpty(formData.city),
            })}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={(e) => onFieldChange("city", e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>
                Select city
              </option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
