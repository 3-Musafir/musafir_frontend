"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useUserHandler from "@/hooks/useUserHandler";

interface User {
  fullName?: string;
  email?: string;
  profileImg?: string;
}

export default function UserProfileMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { status } = useSession();
  const { getMe } = useUserHandler();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const inUserDropdown = dropdownRef.current && dropdownRef.current.contains(event.target as Node);

      if (!inUserDropdown) setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res);
      } catch (error) {
        console.error("Failed to fetch user for header", error);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const initials = useMemo(() => {
    if (!user) return "U";
    const name = user.fullName || user.email || "";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return (name[0] || "U").toUpperCase();
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [user]);

  const handleSettings = () => {
    router.push("/userSettings");
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="relative flex items-center">
      <button onClick={handleProfileClick} className="flex items-center focus:outline-none">
        {status === "authenticated" && user?.fullName && (
          <span className="text-sm lg:text-base font-medium mr-2 lg:mr-3 hidden sm:inline">{user.fullName}</span>
        )}
        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm lg:text-base overflow-hidden relative">
          {status === "authenticated" && user?.profileImg ? (
            <Image
              src={user.profileImg}
              alt="Profile image"
              fill
              sizes="44px"
              className="object-cover rounded-full"
            />
          ) : (
            initials
          )}
        </div>
      </button>
      {status === "authenticated" && showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-12 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        >
          <button
            onClick={handleSettings}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </button>
          <button
            onClick={async () => {
              const base = process.env.NEXT_PUBLIC_AUTH_URL?.trim();
              const callbackUrl = base ? `${base}/login` : "/login";
              await signOut({ callbackUrl });
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
