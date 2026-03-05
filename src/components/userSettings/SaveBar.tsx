import { cn } from "@/lib/utils";

interface SaveBarProps {
  isDirty: boolean;
  isUpdating: boolean;
  forceEdit: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveBar({ isDirty, isUpdating, forceEdit, onSave, onCancel }: SaveBarProps) {
  const visible = isDirty || forceEdit;

  return (
    <div
      className={cn(
        "fixed bottom-16 lg:bottom-0 left-0 right-0 bg-white border-t shadow-lg transition-all duration-200 z-40",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center lg:justify-end gap-3">
        {!forceEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost h-10 px-4 py-2 text-sm rounded-md"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={isUpdating}
          className="btn-primary h-10 px-5 py-2 text-sm rounded-md"
          aria-busy={isUpdating || undefined}
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
