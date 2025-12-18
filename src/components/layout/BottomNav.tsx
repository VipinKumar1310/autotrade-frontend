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
      'fixed bottom-0 left-0 right-0 z-50 safe-bottom lg:hidden',
      theme === 'dark' 
        ? 'glass-dark border-t border-white/5' 
        : 'glass-light border-t border-black/5'
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
                'relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all touch-feedback',
                isActive
                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                  : theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
              )}
            >
              <div className={clsx(
                'relative transition-transform',
                isActive && 'scale-110'
              )}>
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
              </div>
              <span className={clsx(
                'text-[10px] transition-all',
                isActive ? 'font-semibold opacity-100' : 'font-medium opacity-60'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className={clsx(
                  'absolute -top-px left-1/2 h-[2px] w-10 -translate-x-1/2',
                  theme === 'dark' ? 'bg-white' : 'bg-gray-900'
                )} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
