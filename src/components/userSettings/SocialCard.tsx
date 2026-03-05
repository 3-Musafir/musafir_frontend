import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Instagram } from "lucide-react";

interface SocialCardProps {
  socialLink: string;
  onFieldChange: (field: string, value: string) => void;
}

export default function SocialCard({ socialLink, onFieldChange }: SocialCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Social</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="socialLink"
              value={socialLink}
              onChange={(e) => onFieldChange("socialLink", e.target.value)}
              placeholder="@username or instagram.com/username"
              className="w-full input-field pl-10"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">@username or instagram.com/username</p>
        </div>
      </CardContent>
    </Card>
  );
}
