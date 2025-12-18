'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { AutomationCard } from '@/components/automations/AutomationCard';
import clsx from 'clsx';

export default function AutomationsPage() {
  const router = useRouter();
  const { isAuthenticated, automations, getProviderById, getBrokerById, theme } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <PageHeader 
        title="Automations" 
        subtitle={`${automations.length} active connections`}
        rightAction={
          <button
            onClick={() => router.push('/automations/new')}
            className={clsx(
              "flex h-9 w-9 items-center justify-center transition-colors",
              theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90' : 'bg-light-text text-white hover:bg-light-text/90'
            )}
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="p-4 space-y-3">
        {automations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className={clsx(
              "h-16 w-16 flex items-center justify-center mb-4",
              theme === 'dark' ? 'bg-dark-card' : 'bg-light-card'
            )}>
              <Plus size={28} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
            </div>
            <h3 className={clsx("text-lg font-medium mb-2", theme === 'dark' ? 'text-white' : 'text-light-text')}>
              No automations yet
            </h3>
            <p className={clsx("text-sm max-w-xs mb-6", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
              Connect a Telegram channel to a broker and start automating your trades
            </p>
            <button
              onClick={() => router.push('/automations/new')}
              className={clsx(
                "px-6 py-2.5 font-medium transition-colors",
                theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90' : 'bg-light-text text-white hover:bg-light-text/90'
              )}
            >
              Create Automation
            </button>
          </div>
        ) : (
          automations.map((automation) => {
            const provider = getProviderById(automation.telegram_provider_id);
            const broker = getBrokerById(automation.broker_id);
            
            return (
              <AutomationCard
                key={automation.id}
                automation={automation}
                provider={provider}
                broker={broker}
              />
            );
          })
        )}
      </div>
    </AppLayout>
  );
}
