"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Flag, Wallet, Users } from "lucide-react"
import { useSession } from "next-auth/react"

export function Navigation() {
  const pathname = usePathname()
  const { status } = useSession()
  const isAuthenticated = status === "authenticated"

  const links = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/passport", label: "Passport", icon: Flag },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/referrals", label: "Referral", icon: Users },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white px-3 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] md:bottom-auto md:left-4 md:top-1/2 md:w-16 md:-translate-y-1/2 md:rounded-full md:border md:px-3 md:pt-6 md:pb-6">
      <ul className="flex justify-between md:flex-col md:space-y-6">
        {links.map(({ href, label, icon: Icon }) => {
          const isHomeLink = href === "/home"
          const isActive = pathname === href
          const linkClasses = [
            "flex flex-col items-center gap-1 px-3 py-1.5 text-xs rounded-xl transition",
            isActive ? "text-brand-primary" : "text-gray-600 hover:text-brand-primary",
          ].join(" ")

          return (
            <li key={href}>
              <Link href={href} className={linkClasses}>
                <Icon className="h-6 w-6" />
                <span className="md:hidden">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function NavigationPage() {
  return <Navigation />
}
