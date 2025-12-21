import { LayoutDashboard, UserCog, Settings, Flag, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import imag from './../../assets/musafir-logo.svg';
import { ROUTES_CONSTANTS } from '@/config/constants';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { currentFlagship } from '@/store/flagship';

export default function Navigation({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const [currentFlagshipData, setCurrentFlagshipData] = useRecoilState(currentFlagship);
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className='w-5 h-5' />,
      route: '/dashboard',
    },
    {
      id: 'trip-registration',
      label: 'Trip Registration',
      icon: <ChevronRight className='w-5 h-5' />,
      route: '/trip-registration',
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <UserCog className='w-5 h-5' />,
      route: '/user-management',
    },
    {
      id: 'create-flagship',
      label: 'Create Flagship',
      icon: <Flag className='w-5 h-5' />,
      route: ROUTES_CONSTANTS.FLAGSHIP.CREATE,
    },
  ];

  const handleNavigation = (item) => {
    setActiveNav(item.id);
    if (item.route === ROUTES_CONSTANTS.FLAGSHIP.CREATE) setCurrentFlagshipData({});
    router.push(item.route);
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div
      className={`bg-white border-r flex flex-col ${
        sidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-64' : 'hidden lg:flex lg:w-60'
      }`}
    >
      {/* Logo */}
      <div className='p-2 ml-20 border-b flex items-center justify-between'>
        <div className='w-12 h-12 relative'>
          <Image src={imag} alt='Logo' layout='fill' objectFit='contain' />
        </div>
        {/* Close button for mobile */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden p-2 rounded-md hover:bg-gray-100'
          >
            <X className='w-5 h-5' />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 py-6'>
        <ul className='space-y-1'>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center px-4 py-3 text-sm ${
                  activeNav === item.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation(item)}
              >
                <span className='mr-3'>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
