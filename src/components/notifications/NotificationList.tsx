import { NotificationItem } from '@/interfaces/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);

interface Props {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAll: () => void;
  isCompact?: boolean;
}

const NotificationList = ({ notifications, onMarkRead, onMarkAll, isCompact = false }: Props) => {
  const router = useRouter();

  const handleNotificationClick = (notification: NotificationItem) => {
    onMarkRead(notification.id);

    const link = notification.link;
    if (!link) return;

    if (/^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }

    router.push(link);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-heading">Notifications</h3>
        <button
          className="text-xs text-brand-primary hover:text-brand-primary-hover hover:underline"
          onClick={onMarkAll}
        >
          Mark all read
        </button>
      </div>
      <div className={classNames('space-y-2', { 'max-h-80 overflow-y-auto': isCompact })}>
        {notifications.length === 0 && (
          <p className="text-xs text-muted-foreground">No notifications yet.</p>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            className={classNames(
              'w-full text-left border rounded-md px-3 py-2 transition-colors border-border',
              n.readAt
                ? 'bg-card hover:bg-muted'
                : 'bg-muted border-brand-primary/20 hover:bg-muted'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-heading">{n.title}</p>
                <p className="text-xs text-text">{n.message}</p>
              </div>
              <span className="text-[11px] text-text-light whitespace-nowrap">
                {dayjs(n.createdAt).fromNow()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
