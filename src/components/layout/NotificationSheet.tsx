'use client';

import { useEffect, useRef } from 'react';
import { 
  X, 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TelegramIcon } from '@/components/icons/TelegramIcon';
import clsx from 'clsx';
import Image from 'next/image';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSheet({ isOpen, onClose }: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    theme, 
    notifications, 
    telegramProviders, 
    brokers,
    markNotificationRead,
    markAllNotificationsRead
  } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Get connection status
  const disconnectedTelegram = telegramProviders.filter(p => !p.connected);
  const disconnectedBrokers = brokers.filter(b => !b.connected);
  const hasConnectionIssues = disconnectedTelegram.length > 0 || disconnectedBrokers.length > 0;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Delay to prevent immediate closing from the same click that opened it
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade_executed':
      case 'signal_detected':
        return <CheckCircle2 size={14} className="text-profit" />;
      case 'trade_skipped':
      case 'error':
        return <AlertCircle size={14} className="text-loss" />;
      case 'message_edited':
      case 'message_deleted':
        return <AlertTriangle size={14} className="text-warning" />;
      default:
        return <Info size={14} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  // Take only 5 most recent notifications for display
  const displayNotifications = notifications.slice(0, 10);
  const connectionIssuesCount = disconnectedTelegram.length + disconnectedBrokers.length;

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        'absolute top-full right-0 mt-2 w-80 max-h-80 overflow-hidden border shadow-xl z-[100]',
        theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
      )}
      style={{ transform: 'translateX(0)' }}
    >
      {/* Header */}
      <div className={clsx(
        'flex items-center justify-between px-3 py-2.5 border-b',
        theme === 'dark' ? 'border-dark-border' : 'border-gray-100'
      )}>
        <div className="flex items-center gap-2">
          <span className={clsx(
            'text-sm font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center bg-loss px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAllNotificationsRead();
              }}
              className={clsx(
                'text-[10px] font-medium px-1.5 py-0.5 transition-colors',
                theme === 'dark' 
                  ? 'text-dark-muted hover:text-white' 
                  : 'text-gray-400 hover:text-gray-900'
              )}
            >
              Mark all
            </button>
          )}
          <button
            onClick={onClose}
            className={clsx(
              'p-1 transition-colors',
              theme === 'dark' 
                ? 'text-dark-muted hover:text-white' 
                : 'text-gray-400 hover:text-gray-900'
            )}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-64">
        {/* Connection Issues Section */}
        {hasConnectionIssues && (
          <div className={clsx(
            'px-3 py-2 border-b',
            theme === 'dark' ? 'border-dark-border bg-dark-card/50' : 'border-gray-100 bg-gray-50'
          )}>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={12} className="text-warning" />
              <span className={clsx(
                'text-[10px] font-semibold uppercase tracking-wide',
                theme === 'dark' ? 'text-warning' : 'text-warning'
              )}>
                {connectionIssuesCount} Connection Issue{connectionIssuesCount > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-1">
              {/* Disconnected Telegram Providers */}
              {disconnectedTelegram.map((provider) => (
                <button
                  key={provider.id}
                  className={clsx(
                    'w-full flex items-center gap-2 p-1.5 transition-colors',
                    theme === 'dark' 
                      ? 'hover:bg-dark-border' 
                      : 'hover:bg-gray-100'
                  )}
                >
                  <TelegramIcon size={16} />
                  <div className="flex-1 text-left min-w-0">
                    <p className={clsx(
                      'text-xs font-medium truncate',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {provider.name}
                    </p>
                  </div>
                  <span className="text-[9px] text-loss">Reconnect</span>
                  <ChevronRight size={12} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
                </button>
              ))}

              {/* Disconnected Brokers */}
              {disconnectedBrokers.map((broker) => (
                <button
                  key={broker.id}
                  className={clsx(
                    'w-full flex items-center gap-2 p-1.5 transition-colors',
                    theme === 'dark' 
                      ? 'hover:bg-dark-border' 
                      : 'hover:bg-gray-100'
                  )}
                >
                  {broker.code === 'KITE' ? (
                    <Image
                      src="/icons/kite-zerodha.webp"
                      alt={broker.name}
                      width={16}
                      height={16}
                      className="flex-shrink-0"
                    />
                  ) : (
                    <div 
                      className="w-4 h-4 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                      style={{ backgroundColor: broker.logo_color || '#666' }}
                    >
                      {broker.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <p className={clsx(
                      'text-xs font-medium truncate',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {broker.name}
                    </p>
                  </div>
                  <span className="text-[9px] text-loss">Reconnect</span>
                  <ChevronRight size={12} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div>
          {displayNotifications.length === 0 && !hasConnectionIssues ? (
            <div className="py-8 text-center">
              <Bell size={24} className={clsx(
                'mx-auto mb-2',
                theme === 'dark' ? 'text-dark-muted' : 'text-gray-300'
              )} />
              <p className={clsx(
                'text-xs',
                theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'
              )}>
                No notifications
              </p>
            </div>
          ) : (
            displayNotifications.map((notification) => (
              <button
                key={notification.id}
                onClick={(e) => {
                  e.stopPropagation();
                  markNotificationRead(notification.id);
                }}
                className={clsx(
                  'w-full flex items-start gap-2 px-3 py-2 text-left transition-colors border-b',
                  theme === 'dark' ? 'border-dark-border' : 'border-gray-50',
                  !notification.read && (theme === 'dark' ? 'bg-dark-card/50' : 'bg-blue-50/50'),
                  theme === 'dark' 
                    ? 'hover:bg-dark-card' 
                    : 'hover:bg-gray-50'
                )}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={clsx(
                    'text-xs leading-tight',
                    theme === 'dark' ? 'text-white' : 'text-gray-900',
                    !notification.read && 'font-medium'
                  )}>
                    {notification.title}
                  </p>
                  <p className={clsx(
                    'text-[10px] mt-0.5 line-clamp-1',
                    theme === 'dark' ? 'text-dark-muted' : 'text-gray-500'
                  )}>
                    {notification.message}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className={clsx(
                    'text-[9px]',
                    theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'
                  )}>
                    {formatTime(notification.timestamp)}
                  </span>
                  {!notification.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-loss" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer - View All */}
      {notifications.length > 5 && (
        <div className={clsx(
          'px-3 py-2 border-t text-center',
          theme === 'dark' ? 'border-dark-border' : 'border-gray-100'
        )}>
          <button className={clsx(
            'text-[10px] font-medium',
            theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
          )}>
            View all {notifications.length} notifications
          </button>
        </div>
      )}
    </div>
  );
}
