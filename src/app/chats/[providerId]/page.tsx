'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatView } from '@/components/chats/ChatView';
import clsx from 'clsx';

// Custom Telegram Icon
const TelegramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 240 240">
    <defs>
      <linearGradient id="tg-chat-header-bg" x1="0.667" x2="0.417" y1="0.167" y2="0.75">
        <stop offset="0" stopColor="#37aee2" />
        <stop offset="1" stopColor="#1e96c8" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="120" fill="url(#tg-chat-header-bg)" />
    <path d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z" fill="#c8daea" />
    <path d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z" fill="#a9c9dd" />
    <path d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z" fill="#fff" />
  </svg>
);

function ChatPageContent() {
  const params = useParams();
  const providerId = params.providerId as string;
  const router = useRouter();
  const { isAuthenticated, getProviderById, telegramMessages, theme } = useStore();
  const provider = getProviderById(providerId);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const messageCount = telegramMessages.filter(m => m.provider_id === providerId).length;

  if (!provider) {
    return (
      <AppLayout>
        <div className={clsx(
          "sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b",
          theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
        )}>
          <button 
            onClick={() => router.back()}
            className={clsx(
              "p-1 -ml-1 transition-colors",
              theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
            )}
          >
            <ArrowLeft size={20} />
          </button>
          <span className={clsx("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            Channel Not Found
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-500'}>This channel doesn&apos;t exist.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Chat Header */}
      <div className={clsx(
        "sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 border-b",
        theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className={clsx(
              "p-1 -ml-1 transition-colors",
              theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
            )}
          >
            <ArrowLeft size={18} />
          </button>
          <TelegramIcon size={28} />
          <div className="min-w-0">
            <h1 className={clsx("text-sm font-medium truncate", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {provider.name}
            </h1>
            <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
              {messageCount} messages
            </p>
          </div>
        </div>
        <button className={clsx(
          "p-1.5 transition-colors",
          theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
        )}>
          <MoreVertical size={18} />
        </button>
      </div>
      
      <ChatView providerId={providerId} />
    </AppLayout>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
