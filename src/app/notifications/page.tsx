'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  TrendingUp, 
  Check, 
  XCircle, 
  AlertTriangle, 
  Pencil, 
  Trash2, 
  Pause,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatDistanceToNow } from '@/lib/utils';
import type { NotificationType } from '@/types';
import clsx from 'clsx';

const notificationConfig: Record<NotificationType, {
  icon: typeof Bell;
  iconClassName: string;
  bgClassName: string;
}> = {
  signal_detected: {
    icon: TrendingUp,
    iconClassName: 'text-info',
    bgClassName: 'bg-info/20',
  },
  trade_executed: {
    icon: Check,
    iconClassName: 'text-profit',
    bgClassName: 'bg-profit/20',
  },
  trade_closed: {
    icon: CheckCheck,
    iconClassName: 'text-profit',
    bgClassName: 'bg-profit/20',
  },
  signal_skipped: {
    icon: XCircle,
    iconClassName: 'text-loss',
    bgClassName: 'bg-loss/20',
  },
  manual_required: {
    icon: AlertTriangle,
    iconClassName: 'text-warning',
    bgClassName: 'bg-warning/20',
  },
  error: {
    icon: AlertCircle,
    iconClassName: 'text-loss',
    bgClassName: 'bg-loss/20',
  },
  message_edited: {
    icon: Pencil,
    iconClassName: 'text-warning',
    bgClassName: 'bg-warning/20',
  },
  message_deleted: {
    icon: Trash2,
    iconClassName: 'text-loss',
    bgClassName: 'bg-loss/20',
  },
  automation_paused: {
    icon: Pause,
    iconClassName: 'text-dark-muted',
    bgClassName: 'bg-dark-muted/20',
  },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    isAuthenticated, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group by date
  const groupedNotifications = sortedNotifications.reduce((acc, notif) => {
    const date = new Date(notif.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notif);
    return acc;
  }, {} as Record<string, typeof notifications>);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' });
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Notifications" 
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={markAllNotificationsRead}
              className="text-sm text-dark-muted hover:text-white transition-colors"
            >
              Mark all read
            </button>
          ) : null
        }
      />

      <div className="divide-y divide-dark-border">
        {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
          <div key={date}>
            {/* Date header */}
            <div className="sticky top-14 z-20 bg-dark-bg px-4 py-2 border-b border-dark-border">
              <span className="text-xs font-medium text-dark-muted">
                {formatDateHeader(date)}
              </span>
            </div>

            {/* Notifications for this date */}
            {dateNotifications.map((notification) => {
              const config = notificationConfig[notification.type];
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={clsx(
                    'flex gap-3 p-4 cursor-pointer transition-colors',
                    !notification.read && 'bg-dark-card/50'
                  )}
                >
                  {/* Icon */}
                  <div className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0',
                    config.bgClassName
                  )}>
                    <Icon size={18} className={config.iconClassName} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={clsx(
                        'text-sm font-medium truncate',
                        notification.read ? 'text-dark-muted' : 'text-white'
                      )}>
                        {notification.title}
                      </h3>
                      <span className="text-[10px] text-dark-muted flex-shrink-0">
                        {formatDistanceToNow(new Date(notification.timestamp))}
                      </span>
                    </div>
                    <p className={clsx(
                      'text-sm mt-0.5',
                      notification.read ? 'text-dark-muted/70' : 'text-dark-muted'
                    )}>
                      {notification.message}
                    </p>
                    
                    {notification.action_required && !notification.read && (
                      <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-warning/20 text-warning text-xs font-medium rounded">
                        <AlertTriangle size={12} />
                        Action required
                      </span>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-white flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="h-16 w-16 rounded-full bg-dark-card flex items-center justify-center mb-4">
              <Bell size={28} className="text-dark-muted" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No notifications
            </h3>
            <p className="text-sm text-dark-muted max-w-xs">
              You&apos;ll receive alerts for signals, trades, and important updates
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

