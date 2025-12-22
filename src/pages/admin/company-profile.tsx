"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import withAuth from "@/hoc/withAuth";
import { ROLES } from "@/config/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useCompanyProfile from "@/hooks/useCompanyProfile";
import { CompanyProfile } from "@/services/types/companyProfile";
import { showAlert } from "@/pages/alert";

function CompanyProfilePage() {
  const { getProfile, updateProfile } = useCompanyProfile();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();

    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (data) {
        setProfile(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setLogoPreview(data.logoUrl || null);
      } else {
        setProfile(null);
        setName("");
        setDescription("");
        setLogoPreview(null);
      }
    } catch (error) {
      console.error("Failed to load company profile", error);
    } finally {
      setLoading(false);
      setLogoFile(null);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    if (!file) {
      setLogoFile(null);
      setLogoPreview(profile?.logoUrl ?? null);
      return;
    }

    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      showAlert("Name and description are required", "error");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateProfile({
        name: name.trim(),
        description: description.trim(),
        logoFile,
      });
      if (updated) {
        setProfile(updated);
        setLogoPreview(updated.logoUrl || null);
        setLogoFile(null);
      }
    } catch (error) {
      console.error("Failed to save company profile", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile Details</h1>
          <p className="text-gray-600 mt-2">
            Manage the logo, name, and description shown on the home page header.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 space-y-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {loading ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="text-sm text-gray-500">No logo</span>
              )}
            </div>
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="logo"
              >
                Company logo
              </label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a square image for best results. We optimize and upload to storage.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
              Company name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="3Musafir"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Company description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A Founder Institute certified platform making community-led travel safe and sustainable for Asians globally."
              rows={4}
              required
              disabled={saving}
            />
            <p className="text-xs text-gray-500 mt-1">
              This text appears below the logo on the home page hero.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={loadProfile}
              disabled={loading || saving}
            >
              Reset
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CompanyProfilePage, { allowedRoles: [ROLES.ADMIN] });
