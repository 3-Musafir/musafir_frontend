import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSession } from 'next-auth/react';
import api from '@/pages/api';
import apiEndpoints from '@/config/apiEndpoints';
import constants from '@/config/constants';
import { NotificationItem, NotificationListPayload } from '@/interfaces/notifications';

const normalizeList = (res: any): NotificationListPayload => {
  const payload = res?.data ?? res;
  return {
    items: payload?.items ?? [],
    unreadCount: payload?.unreadCount ?? 0,
  };
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      // Only fetch when authenticated so we don't hit the frontend
      // origin (which lacks /notifications) and log misleading 404s.
      const session = await getSession();
      if (!session?.accessToken) return;

      const res = await api.get(apiEndpoints.NOTIFICATIONS.LIST);
      const payload = normalizeList(res);
      setNotifications(payload.items);
      setUnreadCount(payload.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, []);

  const handleNewNotification = useCallback((notification: NotificationItem) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((count) => count + 1);
  }, []);

  const handleReadNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const connectSocket = useCallback(async () => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) return;

      if (socketRef.current) {
        return;
      }

      const base = constants.APP_URL || '';
      const socket = io(`${base}/notifications`, {
        path: '/socket.io',
        transports: ['websocket'],
        withCredentials: true,
        auth: { token },
        extraHeaders: { Authorization: `Bearer ${token}` },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
        reconnectionDelayMax: 5000,
      });

      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
      socket.on('notifications:new', handleNewNotification);
      socket.on('notifications:read', handleReadNotification);
      socket.on('connect_error', (err) => {
        console.error('Notification socket error', err?.message || err);
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to connect notification socket', error);
    }
  }, [handleNewNotification, handleReadNotification]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.patch(apiEndpoints.NOTIFICATIONS.MARK_READ(id));
      handleReadNotification(id);
      socketRef.current?.emit('notifications:read', { id });
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  }, [handleReadNotification]);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch(apiEndpoints.NOTIFICATIONS.MARK_ALL);
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    connectSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connectSocket]);

  return {
    notifications,
    unreadCount,
    connected,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotifications;
