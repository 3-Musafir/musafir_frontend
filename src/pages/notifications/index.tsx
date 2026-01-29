'use client';

import Header from '@/components/header';
import NotificationList from '@/components/notifications/NotificationList';
import { useNotificationsContext } from '@/context/NotificationsProvider';
import withAuth from '@/hoc/withAuth';

function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsContext();

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <Header showMenuButton={false} />

      <main className="flex-1 px-4 md:px-6 lg:px-8 xl:px-10 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl lg:text-2xl font-semibold text-heading">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2 py-0.5">
                {unreadCount} unread
              </span>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-brand-primary hover:text-brand-primary-hover hover:underline"
          >
            Mark all read
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <NotificationList
            notifications={notifications}
            onMarkRead={markAsRead}
            onMarkAll={markAllAsRead}
            showHeader={false}
          />
        </div>
      </main>
    </div>
  );
}

export default withAuth(NotificationsPage);
