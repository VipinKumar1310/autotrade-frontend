'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatDistanceToNow } from '@/lib/utils';
import clsx from 'clsx';

// Custom Telegram Icon
const TelegramIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 240 240" className={className}>
    <defs>
      <linearGradient id="tg-chatlist-bg" x1="0.667" x2="0.417" y1="0.167" y2="0.75">
        <stop offset="0" stopColor="#37aee2" />
        <stop offset="1" stopColor="#1e96c8" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="120" fill="url(#tg-chatlist-bg)" />
    <path d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z" fill="#c8daea" />
    <path d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z" fill="#a9c9dd" />
    <path d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z" fill="#fff" />
  </svg>
);

export function ChatList() {
  const router = useRouter();
  const { telegramProviders, telegramMessages, theme } = useStore();
  
  const connectedProviders = telegramProviders.filter((p) => p.connected);

  const getLastMessage = (providerId: string) => {
    const messages = telegramMessages
      .filter((m) => m.provider_id === providerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return messages[0];
  };

  const getMessageCount = (providerId: string) => {
    return telegramMessages.filter((m) => m.provider_id === providerId).length;
  };

  if (connectedProviders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className={clsx(
          "h-16 w-16 flex items-center justify-center mb-4",
          theme === 'dark' ? 'bg-dark-card' : 'bg-light-card'
        )}>
          <MessageCircle size={28} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
        </div>
        <h3 className={clsx("text-lg font-medium mb-2", theme === 'dark' ? 'text-white' : 'text-light-text')}>
          No channels connected
        </h3>
        <p className={clsx("text-sm max-w-xs", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
          Connect Telegram channels in Settings to start receiving signals
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {connectedProviders.map((provider) => {
        const lastMessage = getLastMessage(provider.id);
        const messageCount = getMessageCount(provider.id);
        
        return (
          <div
            key={provider.id}
            onClick={() => router.push(`/chats/${provider.id}`)}
            className={clsx(
              "flex items-center gap-3 p-3 cursor-pointer transition-all border",
              theme === 'dark' 
                ? 'bg-dark-card border-dark-border hover:border-dark-muted' 
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
            )}
          >
            {/* Telegram Icon */}
            <div className="flex-shrink-0">
              <TelegramIcon size={36} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className={clsx("text-sm font-medium truncate", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {provider.name}
                </h3>
                {lastMessage && (
                  <span className={clsx("text-[10px] flex-shrink-0 ml-2", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                    {formatDistanceToNow(new Date(lastMessage.timestamp))}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className={clsx("text-xs truncate flex-1", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  {lastMessage?.text.split('\n')[0] || 'No messages yet'}
                </p>
                <span className={clsx(
                  "text-[10px] ml-2 px-1.5 py-0.5 flex-shrink-0",
                  theme === 'dark' ? 'bg-dark-border text-dark-muted' : 'bg-gray-100 text-gray-500'
                )}>
                  {messageCount} msgs
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight size={16} className={clsx("flex-shrink-0", theme === 'dark' ? 'text-dark-muted' : 'text-gray-400')} />
          </div>
        );
      })}
    </div>
  );
}
