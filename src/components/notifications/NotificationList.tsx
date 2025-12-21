import { NotificationItem } from '@/interfaces/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';

dayjs.extend(relativeTime);

interface Props {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAll: () => void;
  isCompact?: boolean;
}

const NotificationList = ({ notifications, onMarkRead, onMarkAll, isCompact = false }: Props) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={onMarkAll}
        >
          Mark all read
        </button>
      </div>
      <div className={classNames('space-y-2', { 'max-h-80 overflow-y-auto': isCompact })}>
        {notifications.length === 0 && (
          <p className="text-xs text-gray-500">No notifications yet.</p>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => onMarkRead(n.id)}
            className={classNames(
              'w-full text-left border rounded-md px-3 py-2 transition-colors',
              n.readAt ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 border-blue-100 hover:bg-blue-100'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-600">{n.message}</p>
              </div>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">
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
