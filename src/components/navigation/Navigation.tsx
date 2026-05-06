"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flag, Wallet, Users } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/passport", label: "Passport", icon: Flag },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/referrals", label: "Referral", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden">
      <div className="w-full md:max-w-3xl mx-auto px-3 pb-[env(safe-area-inset-bottom)]">
        <div className="border-t border-border bg-white">
          <ul className="flex justify-around px-1 pt-2 pb-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              const linkClasses = [
                "flex flex-col items-center gap-1 px-3 py-1.5 text-xs rounded-xl transition",
                isActive ? "text-brand-primary" : "text-gray-600 hover:text-brand-primary",
              ].join(" ");

              return (
                <li key={href}>
                  <Link href={href} className={linkClasses}>
                    <Icon className="h-6 w-6" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
