'use client';
import { useState, useEffect } from 'react';
import Navigation from '../../components/navigation';
import Header from '../../components/header';
import LiveTripCard from '../../components/cards/liveTrip';
import PastTripCard from '../../components/cards/pastTrip';
import useFlagshipHook from '@/hooks/useFlagshipHandler';
import { FLAGSHIP_STATUS, ROLES } from '@/config/constants';
import withAuth from '@/hoc/withAuth';

function Dashboard() {
  const action = useFlagshipHook();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [liveTrips, setLiveTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Mounted state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Handle form submission
  const getTrips = async () => {
    try {
      const liveTrips: any = await action.filterFlagship({ status: FLAGSHIP_STATUS.PUBLISHED });
      if (liveTrips.length !== 0) setLiveTrips(liveTrips);
      const pastTrips: any = await action.filterFlagship({ status: FLAGSHIP_STATUS.COMPLETED });
      if (pastTrips.length !== 0) setPastTrips(pastTrips);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  // Close sidebar on window resize (when switching to desktop)
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    getTrips();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null; // avoid hydration issues

  return (
    <div className='flex h-screen bg-gray-50'>
      <Navigation
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header setSidebarOpen={setSidebarOpen} />

        <main className='flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50'>
          {/* Live Trips Section */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-6'>Live trips</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {liveTrips.length !== 0 ? (
                liveTrips.map((trip: any) => <LiveTripCard key={trip._id} trip={trip} />)
              ) : (
                <> No Live Trips </>
              )}
            </div>
          </section>

          {/* Past Trips Section */}
          <section>
            <h2 className='text-2xl font-bold mb-6'>Past trips</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {pastTrips.length !== 0 ? (
                pastTrips.map((trip: any) => <PastTripCard key={trip._id} trip={trip} />)
              ) : (
                <> No Past Trips</>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default withAuth(Dashboard, { allowedRoles: [ROLES.ADMIN] });
