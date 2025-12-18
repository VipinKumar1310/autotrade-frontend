'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { MessageBubble } from './MessageBubble';
import { SignalDrawer } from './SignalDrawer';
import type { ParsedSignal, Trade } from '@/types';
import clsx from 'clsx';

interface ChatViewProps {
  providerId: string;
}

export function ChatView({ providerId }: ChatViewProps) {
  const { getMessagesByProvider, getSignalByMessageId, getTradeBySignalId, theme } = useStore();
  const messages = getMessagesByProvider(providerId);
  
  const [selectedSignal, setSelectedSignal] = useState<{
    signal: ParsedSignal;
    trade?: Trade;
  } | null>(null);

  const handleMessageClick = (messageId: string) => {
    const signal = getSignalByMessageId(messageId);
    if (signal) {
      const trade = signal.trade_id ? getTradeBySignalId(signal.id) : undefined;
      setSelectedSignal({ signal, trade });
    }
  };

  // Group messages by date
  const messagesByDate = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <p className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'}>No messages yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse p-4 space-y-reverse space-y-3">
        {Object.entries(messagesByDate)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, dateMessages]) => (
            <div key={date} className="space-y-3">
              {/* Date header */}
              <div className="flex justify-center py-2">
                <span className={clsx(
                  "px-3 py-1 rounded-full text-xs",
                  theme === 'dark' ? 'bg-dark-card text-dark-muted' : 'bg-light-card text-light-muted'
                )}>
                  {formatDateHeader(date)}
                </span>
              </div>
              
              {/* Messages for this date */}
              {dateMessages
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onSignalClick={() => handleMessageClick(message.id)}
                  />
                ))}
            </div>
          ))}
      </div>

      {/* Signal Drawer */}
      <SignalDrawer
        isOpen={!!selectedSignal}
        onClose={() => setSelectedSignal(null)}
        signal={selectedSignal?.signal}
        trade={selectedSignal?.trade}
      />
    </>
  );
}
