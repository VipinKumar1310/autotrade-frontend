'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { NotificationSheet } from './NotificationSheet';
import clsx from 'clsx';

export function TopBar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { theme, notifications, telegramProviders, brokers } = useStore();
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  // Check for connection issues
  const disconnectedTelegram = telegramProviders.filter(p => !p.connected);
  const disconnectedBrokers = brokers.filter(b => !b.connected);
  const hasConnectionIssues = disconnectedTelegram.length > 0 || disconnectedBrokers.length > 0;
  
  // Total badge count (unread + connection issues)
  const totalIssues = unreadCount + (hasConnectionIssues ? 1 : 0);

  return (
    <header className={clsx(
      'sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur-sm',
      theme === 'dark' 
        ? 'border-dark-border bg-dark-bg/95' 
        : 'border-light-border bg-light-bg/95'
    )}>
      {/* Logo - visible on mobile only */}
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className={clsx(
          'flex h-8 w-8 items-center justify-center rounded-lg',
          theme === 'dark' ? 'bg-white' : 'bg-light-text'
        )}>
          <Zap size={18} className={theme === 'dark' ? 'text-dark-bg' : 'text-light-bg'} />
        </div>
        <span className={clsx(
          'text-base font-semibold tracking-tight',
          theme === 'dark' ? 'text-white' : 'text-light-text'
        )}>
          AutoTrade
        </span>
      </Link>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Notification Bell with Dropdown */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsNotificationOpen(!isNotificationOpen);
          }}
          className={clsx(
            'relative p-2 rounded-lg transition-colors',
            theme === 'dark' 
              ? 'text-dark-muted hover:bg-dark-card hover:text-white' 
              : 'text-light-muted hover:bg-light-card hover:text-light-text'
          )}
        >
          <Bell size={22} />
          
          {/* Badge */}
          {totalIssues > 0 && (
            <span className={clsx(
              'absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white',
              hasConnectionIssues ? 'bg-warning' : 'bg-loss'
            )}>
              {totalIssues > 9 ? '9+' : totalIssues}
            </span>
          )}
          
          {/* Connection issue indicator dot */}
          {hasConnectionIssues && unreadCount === 0 && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-warning animate-pulse" />
          )}
        </button>

        {/* Notification Dropdown */}
        <NotificationSheet 
          isOpen={isNotificationOpen} 
          onClose={() => setIsNotificationOpen(false)} 
        />
      </div>
    </header>
  );
}
