import classNames from "classnames";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { employmentOptions, isEmpty } from "@/hooks/useSettingsForm";
import type { SettingsFormData } from "@/hooks/useSettingsForm";

const selectClass =
  "w-full input-field bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[position:right_12px_center] pr-10" +
  " bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]";

interface ProfessionalInfoCardProps {
  formData: SettingsFormData;
  highlightMissing: boolean;
  onFieldChange: (field: string, value: string) => void;
  onEmploymentChange: (value: SettingsFormData["employmentStatus"]) => void;
}

export default function ProfessionalInfoCard({
  formData,
  highlightMissing,
  onFieldChange,
  onEmploymentChange,
}: ProfessionalInfoCardProps) {
  const currentOption = employmentOptions.find((o) => o.value === formData.employmentStatus);
  const showWorkDetail = formData.employmentStatus !== "unemployed";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Professional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Employment Status */}
        <div
          className={classNames({
            "blink-required": highlightMissing && isEmpty(formData.employmentStatus),
            "rounded-md": highlightMissing && isEmpty(formData.employmentStatus),
          })}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment Status
          </label>
          <select
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={(e) =>
              onEmploymentChange(e.target.value as SettingsFormData["employmentStatus"])
            }
            className={selectClass}
          >
            <option value="" disabled>
              Select status
            </option>
            {employmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* University / Workplace / Business Name */}
        {showWorkDetail && (
          <div
            className={classNames({
              "blink-required": highlightMissing && isEmpty(formData.university),
              "rounded-md": highlightMissing && isEmpty(formData.university),
            })}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {currentOption?.placeholder || "Details"}
            </label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={(e) => onFieldChange("university", e.target.value)}
              placeholder={currentOption?.placeholder || ""}
              className="w-full input-field"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
