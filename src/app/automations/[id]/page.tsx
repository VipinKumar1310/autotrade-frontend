'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { AutomationForm } from '@/components/automations/AutomationForm';

export default function EditAutomationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated, automations } = useStore();
  const automation = automations.find((a) => a.id === id);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (!automation) {
    return (
      <AppLayout>
        <PageHeader title="Automation Not Found" showBack />
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className="text-dark-muted">This automation doesn&apos;t exist.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Edit Automation" 
        subtitle={automation.name}
        showBack 
      />
      <AutomationForm automation={automation} />
    </AppLayout>
  );
}
