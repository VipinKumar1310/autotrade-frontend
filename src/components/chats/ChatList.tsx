'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatDistanceToNow } from '@/lib/utils';
import clsx from 'clsx';

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

  if (connectedProviders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className={clsx(
          "h-16 w-16 rounded-full flex items-center justify-center mb-4",
          theme === 'dark' ? 'bg-dark-card' : 'bg-light-card'
        )}>
          <svg className={clsx("w-8 h-8", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
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
    <div className={clsx("divide-y", theme === 'dark' ? 'divide-dark-border' : 'divide-light-border')}>
      {connectedProviders.map((provider) => {
        const lastMessage = getLastMessage(provider.id);
        
        return (
          <div
            key={provider.id}
            onClick={() => router.push(`/chats/${provider.id}`)}
            className={clsx(
              "flex items-center gap-3 p-4 cursor-pointer transition-colors",
              theme === 'dark' 
                ? 'hover:bg-dark-card/50 active:bg-dark-card' 
                : 'hover:bg-light-card/50 active:bg-light-card'
            )}
          >
            {/* Avatar */}
            <div 
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
              style={{ backgroundColor: provider.avatar_color }}
            >
              {provider.name.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={clsx("text-base font-medium truncate", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                  {provider.name}
                </h3>
                {lastMessage && (
                  <span className={clsx("text-xs flex-shrink-0 ml-2", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                    {formatDistanceToNow(new Date(lastMessage.timestamp))}
                  </span>
                )}
              </div>
              <p className={clsx("text-sm truncate", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                {lastMessage?.text.split('\n')[0] || 'No messages yet'}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight size={20} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
          </div>
        );
      })}
    </div>
  );
}
