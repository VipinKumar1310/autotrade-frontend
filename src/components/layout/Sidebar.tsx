'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Zap, 
  BarChart3, 
  MessageCircle, 
  Bell, 
  Settings,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/automations', label: 'Automations', icon: Zap },
  { href: '/chats', label: 'Chats', icon: MessageCircle },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, notifications, logout, user } = useStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className={clsx(
      'flex h-full flex-col',
      theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'
    )}>
      {/* Logo */}
      <div className={clsx(
        'flex h-16 items-center border-b px-6',
        theme === 'dark' ? 'border-dark-border' : 'border-light-border'
      )}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            theme === 'dark' ? 'bg-white' : 'bg-light-text'
          )}>
            <Zap size={20} className={theme === 'dark' ? 'text-dark-bg' : 'text-light-bg'} />
          </div>
          <span className={clsx(
            'text-lg font-semibold tracking-tight',
            theme === 'dark' ? 'text-white' : 'text-light-text'
          )}>
            AutoTrade
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          const showBadge = item.href === '/notifications' && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? theme === 'dark' 
                    ? 'bg-dark-card text-white' 
                    : 'bg-light-card text-light-text'
                  : theme === 'dark'
                    ? 'text-dark-muted hover:bg-dark-card/50 hover:text-white'
                    : 'text-light-muted hover:bg-light-card/50 hover:text-light-text'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-loss px-1.5 text-xs font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={clsx(
        'border-t p-3',
        theme === 'dark' ? 'border-dark-border' : 'border-light-border'
      )}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={clsx(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'text-dark-muted hover:bg-dark-card/50 hover:text-white'
              : 'text-light-muted hover:bg-light-card/50 hover:text-light-text'
          )}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User info & logout */}
        {user && (
          <div className={clsx(
            'mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5'
          )}>
            <div className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
              theme === 'dark' ? 'bg-dark-card text-white' : 'bg-light-card text-light-text'
            )}>
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className={clsx(
                'truncate text-sm font-medium',
                theme === 'dark' ? 'text-white' : 'text-light-text'
              )}>{user.name}</p>
              <p className={clsx(
                'truncate text-xs',
                theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'
              )}>{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className={clsx(
                'rounded-lg p-2 transition-colors',
                theme === 'dark'
                  ? 'text-dark-muted hover:bg-dark-card hover:text-white'
                  : 'text-light-muted hover:bg-light-card hover:text-light-text'
              )}
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
