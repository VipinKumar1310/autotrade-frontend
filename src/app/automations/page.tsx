'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { AutomationCard } from '@/components/automations/AutomationCard';
import { CreateAutomationModal } from '@/components/automations/CreateAutomationModal';
import { EditAutomationModal } from '@/components/automations/EditAutomationModal';
import type { Automation } from '@/types';
import clsx from 'clsx';

export default function AutomationsPage() {
  const router = useRouter();
  const { isAuthenticated, automations, getProviderById, getBrokerById, theme } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 space-y-3">
        {/* Add Automation Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className={clsx(
            "w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed transition-colors",
            theme === 'dark' 
              ? 'border-dark-border text-dark-muted hover:border-white hover:text-white' 
              : 'border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900'
          )}
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add Automation</span>
        </button>
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
              onClick={() => setShowCreateModal(true)}
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
                onEdit={(auto) => setEditingAutomation(auto)}
              />
            );
          })
        )}
      </div>

      {/* Create Automation Modal */}
      <CreateAutomationModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />

      {/* Edit Automation Modal */}
      <EditAutomationModal
        isOpen={editingAutomation !== null}
        onClose={() => setEditingAutomation(null)}
        automation={editingAutomation}
      />
    </AppLayout>
  );
}
