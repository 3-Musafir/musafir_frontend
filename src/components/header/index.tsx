import { Bell, Menu, Home, Flag, Wallet, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import UserProfileMenu from './UserProfileMenu';
import { useNotificationsContext } from '@/context/NotificationsProvider';
import { TabType } from '@/context/DashboardContext';

interface HeaderProps {
  notificationCount?: number;
  setSidebarOpen?: (open: boolean) => void;
  showMenuButton?: boolean;
  onTabChange?: (tab: TabType) => void;
  activeTab?: TabType;
}


export default function Header({
  notificationCount = 0,
  setSidebarOpen,
  showMenuButton = true,
  onTabChange,
  activeTab: externalActiveTab
}: HeaderProps) {
  const previousPathRef = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { unreadCount } = useNotificationsContext();


  useEffect(() => {
    if (!pathname) return;
    if (!pathname.startsWith('/notifications')) {
      previousPathRef.current = pathname;
    }
  }, [pathname]);


  useEffect(() => {
    if (status === 'authenticated') {
      router.prefetch('/notifications');
    }
  }, [status, router]);




  const showAuthCta = status !== 'authenticated'; // Show login/signup buttons when not authenticated on ANY page

  const tabLinks: { href: string; label: string; icon: typeof Home; tabId: TabType }[] = [
    { href: '/home', label: 'Home', icon: Home, tabId: 'home' },
    { href: '/passport', label: 'Passport', icon: Flag, tabId: 'passport' },
    { href: '/wallet', label: 'Wallet', icon: Wallet, tabId: 'wallet' },
    { href: '/referrals', label: 'Referrals', icon: Users, tabId: 'referrals' },
  ];

  return (
    <header className='h-16 lg:h-20 bg-white border-b flex items-center px-4 lg:px-8'>
      {/* Mobile menu button */}
      {showMenuButton && setSidebarOpen && (
        <button className='p-2 rounded-md lg:hidden' onClick={() => setSidebarOpen(true)}>
          <Menu className='w-6 h-6' />
        </button>
      )}

      {/* Desktop navigation - visible only on lg screens and above */}
      {(status === 'authenticated' || !onTabChange) && (
        <nav className='hidden lg:flex items-center space-x-8 ml-6'>
          <Link
            href='/explore'
            className={`text-base font-medium transition-colors ${
              pathname === '/explore' ? 'text-brand-primary' : 'text-gray-600 hover:text-brand-primary'
            }`}
          >
            Explore
          </Link>
          {status === 'authenticated' && tabLinks.map(({ href, label, tabId }) => {
            const isActive = onTabChange ? externalActiveTab === tabId : pathname === href;

            if (onTabChange) {
              // Tab mode - use button for instant switching
              return (
                <button
                  key={tabId}
                  onClick={() => onTabChange(tabId)}
                  className={`text-base font-medium transition-colors ${
                    isActive ? 'text-brand-primary' : 'text-gray-600 hover:text-brand-primary'
                  }`}
                >
                  {label}
                </button>
              );
            }

            // Link mode - use Next.js Link for page navigation
            return (
              <Link
                key={href}
                href={href}
                className={`text-base font-medium transition-colors ${
                  isActive ? 'text-brand-primary' : 'text-gray-600 hover:text-brand-primary'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}

      <div className='flex items-center ml-auto space-x-4 lg:space-x-6'>
        {showAuthCta && (
          <div className='flex items-center space-x-3 lg:space-x-4 mr-1'>
            <button
              onClick={() => router.push('/login')}
              className='text-sm lg:text-base font-medium text-gray-700 hover:text-brand-primary-hover transition-colors'
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup/create-account')}
              className='rounded-full bg-brand-primary px-3 py-1.5 lg:px-5 lg:py-2 text-sm lg:text-base font-semibold text-white shadow-md shadow-brand-primary/20 transition hover:bg-brand-primary-hover hover:shadow-lg'
            >
              Sign up
            </button>
          </div>
        )}

        {/* Notification Bell */}
        {status === 'authenticated' && (
          <div className='relative mr-2 lg:mr-3'>
            <button
              onClick={() => {
                if (pathname?.startsWith('/notifications')) {
                  const target = previousPathRef.current || '/home';
                  router.push(target);
                  return;
                }

                router.push('/notifications');
              }}
              aria-label='View notifications'
            >
              <Bell className='w-6 h-6 lg:w-7 lg:h-7 text-gray-500' />
              {(unreadCount || notificationCount) > 0 && (
                <span className='absolute -top-1 -right-1 bg-blue-500 text-white text-xs lg:text-sm rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center'>
                  {unreadCount || notificationCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* User Profile / Settings */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
