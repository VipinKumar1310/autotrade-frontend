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

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSheet({ isOpen, onClose }: NotificationSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
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
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
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
        return <CheckCircle2 size={16} className="text-profit" />;
      case 'trade_skipped':
      case 'error':
        return <AlertCircle size={16} className="text-loss" />;
      case 'message_edited':
      case 'message_deleted':
        return <AlertTriangle size={16} className="text-warning" />;
      default:
        return <Info size={16} className="text-dark-muted" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={clsx(
          'fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] transform rounded-t-2xl transition-transform duration-300 ease-out',
          theme === 'dark' ? 'bg-dark-bg border-t border-dark-border' : 'bg-light-bg border-t border-light-border',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className={clsx(
            'h-1 w-10 rounded-full',
            theme === 'dark' ? 'bg-dark-border' : 'bg-light-border'
          )} />
        </div>

        {/* Header */}
        <div className={clsx(
          'flex items-center justify-between px-4 pb-3 border-b',
          theme === 'dark' ? 'border-dark-border' : 'border-light-border'
        )}>
          <div className="flex items-center gap-3">
            <Bell size={20} className={theme === 'dark' ? 'text-white' : 'text-light-text'} />
            <h2 className={clsx(
              'text-lg font-semibold',
              theme === 'dark' ? 'text-white' : 'text-light-text'
            )}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-loss px-1.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className={clsx(
                  'text-xs font-medium px-2 py-1 rounded transition-colors',
                  theme === 'dark' 
                    ? 'text-dark-muted hover:text-white hover:bg-dark-card' 
                    : 'text-light-muted hover:text-light-text hover:bg-light-card'
                )}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className={clsx(
                'p-1.5 rounded-lg transition-colors',
                theme === 'dark' 
                  ? 'text-dark-muted hover:bg-dark-card hover:text-white' 
                  : 'text-light-muted hover:bg-light-card hover:text-light-text'
              )}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] pb-safe">
          {/* Connection Issues Section */}
          {hasConnectionIssues && (
            <div className={clsx(
              'px-4 py-3 border-b',
              theme === 'dark' ? 'border-dark-border bg-dark-card/50' : 'border-light-border bg-light-card/50'
            )}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-warning" />
                <span className={clsx(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-white' : 'text-light-text'
                )}>
                  Connection Issues
                </span>
              </div>
              
              <div className="space-y-2">
                {/* Disconnected Telegram Providers */}
                {disconnectedTelegram.map((provider) => (
                  <button
                    key={provider.id}
                    className={clsx(
                      'w-full flex items-center gap-3 p-2 rounded-lg transition-colors',
                      theme === 'dark' 
                        ? 'bg-dark-bg hover:bg-dark-border' 
                        : 'bg-light-bg hover:bg-light-border'
                    )}
                  >
                    <TelegramIcon size={20} />
                    <div className="flex-1 text-left">
                      <p className={clsx(
                        'text-sm font-medium',
                        theme === 'dark' ? 'text-white' : 'text-light-text'
                      )}>
                        {provider.name}
                      </p>
                      <p className="text-xs text-loss">Disconnected - Tap to reconnect</p>
                    </div>
                    <ChevronRight size={16} className="text-dark-muted" />
                  </button>
                ))}

                {/* Disconnected Brokers */}
                {disconnectedBrokers.map((broker) => (
                  <button
                    key={broker.id}
                    className={clsx(
                      'w-full flex items-center gap-3 p-2 rounded-lg transition-colors',
                      theme === 'dark' 
                        ? 'bg-dark-bg hover:bg-dark-border' 
                        : 'bg-light-bg hover:bg-light-border'
                    )}
                  >
                    {broker.code === 'KITE' ? (
                      <Image
                        src="/icons/kite-zerodha.webp"
                        alt={broker.name}
                        width={20}
                        height={20}
                        className="rounded flex-shrink-0"
                      />
                    ) : (
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ backgroundColor: broker.logo_color || '#666' }}
                      >
                        {broker.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className={clsx(
                        'text-sm font-medium',
                        theme === 'dark' ? 'text-white' : 'text-light-text'
                      )}>
                        {broker.name}
                      </p>
                      <p className="text-xs text-loss">Disconnected - Tap to reconnect</p>
                    </div>
                    <ChevronRight size={16} className="text-dark-muted" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="px-4 py-2">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={40} className={clsx(
                  'mx-auto mb-3',
                  theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'
                )} />
                <p className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'}>
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    className={clsx(
                      'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                      !notification.read && (theme === 'dark' ? 'bg-dark-card' : 'bg-light-card'),
                      theme === 'dark' 
                        ? 'hover:bg-dark-card' 
                        : 'hover:bg-light-card'
                    )}
                  >
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx(
                        'text-sm',
                        theme === 'dark' ? 'text-white' : 'text-light-text',
                        !notification.read && 'font-medium'
                      )}>
                        {notification.title}
                      </p>
                      <p className={clsx(
                        'text-xs mt-0.5 line-clamp-2',
                        theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'
                      )}>
                        {notification.message}
                      </p>
                      <p className={clsx(
                        'text-[10px] mt-1',
                        theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'
                      )}>
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-loss mt-1.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

