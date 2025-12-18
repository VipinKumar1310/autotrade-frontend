'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  showBack = false, 
  rightAction,
  className 
}: PageHeaderProps) {
  const router = useRouter();
  const theme = useStore((state) => state.theme);

  return (
    <header className={clsx(
      'sticky top-0 z-40 border-b backdrop-blur-sm safe-top',
      theme === 'dark' 
        ? 'border-dark-border bg-dark-bg/95' 
        : 'border-light-border bg-light-bg/95',
      className
    )}>
      <div className="flex h-14 items-center gap-3 px-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors -ml-2',
              theme === 'dark'
                ? 'text-dark-muted hover:bg-dark-card hover:text-white'
                : 'text-light-muted hover:bg-light-card hover:text-light-text'
            )}
          >
            <ArrowLeft size={22} />
          </button>
        )}
        
        <div className="flex-1 min-w-0">
          <h1 className={clsx(
            'text-lg font-semibold truncate',
            theme === 'dark' ? 'text-white' : 'text-light-text'
          )}>{title}</h1>
          {subtitle && (
            <p className={clsx(
              'text-xs truncate',
              theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'
            )}>{subtitle}</p>
          )}
        </div>

        {rightAction && (
          <div className="flex-shrink-0">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
}
