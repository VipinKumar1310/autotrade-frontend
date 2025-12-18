'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatList } from '@/components/chats/ChatList';

export default function ChatsPage() {
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
      <ChatList />
    </AppLayout>
  );
}

