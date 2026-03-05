import { Key, LogOut, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SecurityCardProps {
  onChangePassword: () => void;
  onLogout: () => void;
}

export default function SecurityCard({ onChangePassword, onLogout }: SecurityCardProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base">Security</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <button
          type="button"
          onClick={onChangePassword}
          className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors border-t"
        >
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Change Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors border-t"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-brand-error">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </CardContent>
    </Card>
  );
}
