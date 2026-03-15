'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useNotificationsContext } from '@/context/NotificationsProvider';
import NotificationList from './NotificationList';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ open, onClose }: Props) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationsContext();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-heading">Notifications</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2 py-0.5">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="text-sm text-brand-primary hover:text-brand-primary-hover hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto h-[calc(100%-65px)] px-4 py-3">
          <NotificationList
            notifications={notifications}
            onMarkRead={(id) => {
              markAsRead(id);
              onClose();
            }}
            onMarkAll={markAllAsRead}
            showHeader={false}
          />
        </div>
      </div>
    </>
  );
}
