'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { AutomationCard } from '@/components/automations/AutomationCard';

export default function AutomationsPage() {
  const router = useRouter();
  const { isAuthenticated, automations, getProviderById, getBrokerById } = useStore();

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
            className="flex h-9 w-9 items-center justify-center bg-white text-dark-bg transition-colors hover:bg-white/90"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="p-4 space-y-3">
        {automations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 bg-dark-card flex items-center justify-center mb-4">
              <Plus size={28} className="text-dark-muted" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No automations yet
            </h3>
            <p className="text-sm text-dark-muted max-w-xs mb-6">
              Connect a Telegram channel to a broker and start automating your trades
            </p>
            <button
              onClick={() => router.push('/automations/new')}
              className="px-6 py-2.5 bg-white text-dark-bg font-medium hover:bg-white/90 transition-colors"
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
