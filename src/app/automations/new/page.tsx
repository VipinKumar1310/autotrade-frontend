'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { AutomationForm } from '@/components/automations/AutomationForm';

export default function NewAutomationPage() {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <PageHeader 
        title="Create Automation" 
        showBack 
      />
      <AutomationForm />
    </AppLayout>
  );
}

