import { CheckCircle2, Circle } from "lucide-react";
import type { CompletionField } from "@/hooks/useSettingsForm";

interface ProfileCompletionMeterProps {
  percentage: number;
  missingFields: CompletionField[];
  completionFields: CompletionField[];
  forceEdit: boolean;
}

export default function ProfileCompletionMeter({
  percentage,
  missingFields,
  completionFields,
  forceEdit,
}: ProfileCompletionMeterProps) {
  if (percentage === 100 && !forceEdit) return null;

  return (
    <div className="mb-4 rounded-xl border bg-canvas-soft p-4 lg:p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-heading">
            {forceEdit ? "Complete your profile to continue" : `Profile ${percentage}% complete`}
          </p>
          {missingFields.length > 0 && !forceEdit && (
            <p className="text-xs text-gray-500 mt-0.5">
              Add {missingFields.map((f) => f.label).join(", ")}
            </p>
          )}
        </div>
        <span className="text-sm font-semibold text-brand-primary">{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist - shown when forceEdit or significant fields missing */}
      {(forceEdit || percentage < 75) && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {completionFields.map((field) => (
            <div key={field.key} className="flex items-center gap-1.5">
              {field.filled ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              )}
              <span
                className={`text-xs ${
                  field.filled ? "text-gray-500" : "text-gray-700 font-medium"
                }`}
              >
                {field.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
