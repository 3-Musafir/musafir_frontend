export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationListPayload {
  items: NotificationItem[];
  unreadCount: number;
}
