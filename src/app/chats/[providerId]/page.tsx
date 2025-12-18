'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChatView } from '@/components/chats/ChatView';

export default function ChatPage() {
  const params = useParams();
  const providerId = params.providerId as string;
  const router = useRouter();
  const { isAuthenticated, getProviderById } = useStore();
  const provider = getProviderById(providerId);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (!provider) {
    return (
      <AppLayout>
        <PageHeader title="Channel Not Found" showBack />
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className="text-dark-muted">This channel doesn&apos;t exist.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title={provider.name}
        subtitle={provider.username}
        showBack 
      />
      <ChatView providerId={providerId} />
    </AppLayout>
  );
}
