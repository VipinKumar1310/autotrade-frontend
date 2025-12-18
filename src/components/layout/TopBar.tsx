'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Zap, X, AlertTriangle, CheckCircle2, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TelegramIcon } from '@/components/icons/TelegramIcon';
import clsx from 'clsx';
import Image from 'next/image';

export function TopBar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
  
  // Check for connection issues
  const disconnectedTelegram = telegramProviders.filter(p => !p.connected);
  const disconnectedBrokers = brokers.filter(b => !b.connected);
  const hasConnectionIssues = disconnectedTelegram.length > 0 || disconnectedBrokers.length > 0;
  
  // Total badge count (unread + connection issues)
  const totalIssues = unreadCount + (hasConnectionIssues ? 1 : 0);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 50);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNotificationOpen(false);
    };

    if (isNotificationOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isNotificationOpen]);

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
    
    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const displayNotifications = notifications.slice(0, 8);
  const connectionIssuesCount = disconnectedTelegram.length + disconnectedBrokers.length;

  return (
    <header className={clsx(
      'sticky top-0 z-40 flex h-14 items-center justify-between px-4',
      theme === 'dark' 
        ? 'glass-dark border-b border-white/5' 
        : 'glass-light border-b border-black/5'
    )}>
      {/* Logo - visible on mobile only */}
      <Link href="/dashboard" className="flex items-center gap-2.5 lg:hidden group">
        <div className={clsx(
          'flex h-8 w-8 items-center justify-center transition-transform group-hover:scale-105',
          theme === 'dark' ? 'bg-white' : 'bg-gray-900'
        )}>
          <Zap size={16} className={theme === 'dark' ? 'text-dark-bg' : 'text-white'} />
        </div>
        <span className={clsx(
          'text-base font-semibold tracking-tight headline',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          AutoTrade
        </span>
      </Link>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Notification Bell with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className={clsx(
            'relative p-2 transition-colors',
            theme === 'dark' 
              ? 'text-dark-muted hover:bg-dark-card hover:text-white' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <Bell size={22} />
          
          {/* Badge */}
          {totalIssues > 0 && (
            <span className={clsx(
              'absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-bold text-white',
              hasConnectionIssues ? 'bg-warning' : 'bg-loss'
            )}>
              {totalIssues > 9 ? '9+' : totalIssues}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isNotificationOpen && (
          <div
            className={clsx(
              'absolute top-full right-0 mt-2 w-72 max-h-80 overflow-hidden z-[100] animate-scale-in',
              theme === 'dark' 
                ? 'glass-dark shadow-premium-lg' 
                : 'glass-light shadow-lg border border-gray-100'
            )}
          >
            {/* Header */}
            <div className={clsx(
              'flex items-center justify-between px-3 py-2 border-b',
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
                    onClick={() => markAllNotificationsRead()}
                    className={clsx(
                      'text-[10px] font-medium px-1.5 py-0.5',
                      theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
                    )}
                  >
                    Mark all
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className={clsx(
                    'p-1',
                    theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
                  )}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-60">
              {/* Connection Issues Section */}
              {hasConnectionIssues && (
                <div className={clsx(
                  'px-3 py-2 border-b',
                  theme === 'dark' ? 'border-dark-border bg-dark-card/50' : 'border-gray-100 bg-gray-50'
                )}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle size={12} className="text-warning" />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-warning">
                      {connectionIssuesCount} Issue{connectionIssuesCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-0.5">
                    {disconnectedTelegram.slice(0, 2).map((provider) => (
                      <button
                        key={provider.id}
                        className={clsx(
                          'w-full flex items-center gap-2 p-1.5',
                          theme === 'dark' ? 'hover:bg-dark-border' : 'hover:bg-gray-100'
                        )}
                      >
                        <TelegramIcon size={14} />
                        <span className={clsx('text-[11px] truncate flex-1 text-left', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                          {provider.name}
                        </span>
                        <span className="text-[9px] text-loss">Reconnect</span>
                      </button>
                    ))}
                    {disconnectedBrokers.slice(0, 2).map((broker) => (
                      <button
                        key={broker.id}
                        className={clsx(
                          'w-full flex items-center gap-2 p-1.5',
                          theme === 'dark' ? 'hover:bg-dark-border' : 'hover:bg-gray-100'
                        )}
                      >
                        <Image src="/icons/kite-zerodha.webp" alt={broker.name} width={14} height={14} />
                        <span className={clsx('text-[11px] truncate flex-1 text-left', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                          {broker.name}
                        </span>
                        <span className="text-[9px] text-loss">Reconnect</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications List */}
              {displayNotifications.length === 0 && !hasConnectionIssues ? (
                <div className="py-6 text-center">
                  <Bell size={20} className={theme === 'dark' ? 'mx-auto mb-1.5 text-dark-muted' : 'mx-auto mb-1.5 text-gray-300'} />
                  <p className={clsx('text-xs', theme === 'dark' ? 'text-dark-muted' : 'text-gray-400')}>
                    No notifications
                  </p>
                </div>
              ) : (
                displayNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    className={clsx(
                      'w-full flex items-start gap-2 px-3 py-2 text-left border-b',
                      theme === 'dark' ? 'border-dark-border' : 'border-gray-50',
                      !notification.read && (theme === 'dark' ? 'bg-dark-card/30' : 'bg-blue-50/30'),
                      theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx(
                        'text-[11px] leading-tight',
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
                      <span className={clsx('text-[9px]', theme === 'dark' ? 'text-dark-muted' : 'text-gray-400')}>
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
        )}
      </div>
    </header>
  );
}
