import { Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useUserHandler from '@/hooks/useUserHandler';
import { useNotificationsContext } from '@/context/NotificationsProvider';
import NotificationList from '../notifications/NotificationList';

export default function Header({ notificationCount = 0, setSidebarOpen, showMenuButton = true }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const notificationWrapperRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { getMe } = useUserHandler();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationsContext();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      const inUserDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      const inNotifications =
        notificationWrapperRef.current &&
        notificationWrapperRef.current.contains(event.target);

      if (!inUserDropdown) setShowDropdown(false);
      if (!inNotifications) setShowNotifications(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res);
      } catch (error) {
        console.error('Failed to fetch user for header', error);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const initials = useMemo(() => {
    if (!user) return 'U';
    const name = user.fullName || user.email || '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return (name[0] || 'U').toUpperCase();
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'U';
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [user]);

  const handleSettings = () => {
    router.push('/userSettings');
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }
    setShowDropdown((prev) => !prev);
  };

  const isHome = pathname === '/home';
  const showAuthCta = status !== 'authenticated' && !isHome;

  return (
    <header className='h-16 bg-white border-b flex items-center px-4 lg:px-6'>
      {/* Mobile menu button */}
      {showMenuButton && setSidebarOpen && (
        <button className='p-2 rounded-md lg:hidden' onClick={() => setSidebarOpen(true)}>
          <Menu className='w-6 h-6' />
        </button>
      )}

      <div className='flex items-center ml-auto space-x-4'>
        {showAuthCta && (
          <div className='flex items-center space-x-3 mr-1'>
            <button
              onClick={() => router.push('/login')}
              className='text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors'
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup/create-account')}
              className='rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 hover:shadow-lg'
            >
              Sign up
            </button>
          </div>
        )}

        {/* Notification Bell */}
        {status === 'authenticated' && (
          <div className='relative mr-2' ref={notificationWrapperRef}>
            <button onClick={() => setShowNotifications((prev) => !prev)}>
              <Bell className='w-6 h-6 text-gray-500' />
              {(unreadCount || notificationCount) > 0 && (
                <span className='absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                  {unreadCount || notificationCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div
                className='absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-3'
              >
                <NotificationList
                  notifications={notifications}
                  onMarkRead={markAsRead}
                  onMarkAll={markAllAsRead}
                  isCompact
                />
              </div>
            )}
          </div>
        )}

        {/* User Profile / Settings */}
        <div className='relative flex items-center'>
          <button
            onClick={handleProfileClick}
            className='flex items-center focus:outline-none'
          >
            {status === 'authenticated' && user?.fullName && (
              <span className='text-sm font-medium mr-2 hidden sm:inline'>{user.fullName}</span>
            )}
            <div className='w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm overflow-hidden relative'>
              {status === 'authenticated' && user?.profileImg ? (
                <Image
                  src={user.profileImg}
                  alt='Profile image'
                  fill
                  sizes='36px'
                  className='object-cover rounded-full'
                />
              ) : (
                initials
              )}
            </div>
          </button>
          {status === 'authenticated' && showDropdown && (
            <div
              ref={dropdownRef}
              className='absolute right-0 mt-12 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10'
            >
              <button
                onClick={handleSettings}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Settings
              </button>
              <button
                onClick={async () => {
                  const base = process.env.NEXT_PUBLIC_AUTH_URL?.trim();
                  const callbackUrl = base ? `${base}/login` : '/login';
                  await signOut({ callbackUrl });
                }}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
