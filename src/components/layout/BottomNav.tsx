'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  BarChart3, 
  MessageCircle, 
  Settings 
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/automations', label: 'Automations', icon: Zap },
  { href: '/chats', label: 'Chats', icon: MessageCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { theme } = useStore();

  return (
    <nav className={clsx(
      'fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-sm safe-bottom',
      theme === 'dark' 
        ? 'border-dark-border bg-dark-bg/95' 
        : 'border-light-border bg-light-bg/95'
    )}>
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors touch-feedback',
                isActive
                  ? theme === 'dark' ? 'text-white' : 'text-light-text'
                  : theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-light-muted hover:text-light-text'
              )}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={clsx(
                'text-[10px] font-medium',
                isActive ? 'opacity-100' : 'opacity-70'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className={clsx(
                  'absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full',
                  theme === 'dark' ? 'bg-white' : 'bg-light-text'
                )} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
