'use client';

import { ChevronRight, Trash2, Pencil } from 'lucide-react';
import type { TelegramMessage, MessageTag } from '@/types';
import { formatTime } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: TelegramMessage;
  onSignalClick?: () => void;
  isHighlighted?: boolean;
}

export function MessageBubble({ message, onSignalClick, isHighlighted }: MessageBubbleProps) {
  const { theme } = useStore();
  const hasSignal = message.parsed_signal_id !== null;
  const isEdited = message.edited_at !== null;
  const isDeleted = message.deleted_at !== null;

  const tagConfig: Record<MessageTag, { 
    label: string; 
    className: string;
    priority: number;
  }> = {
    SIGNAL_DETECTED: { 
      label: 'SIGNAL', 
      className: 'bg-info/20 text-info',
      priority: 1
    },
    PARSED: { 
      label: 'PARSED', 
      className: theme === 'dark' ? 'bg-dark-muted/20 text-dark-muted' : 'bg-gray-200 text-gray-600',
      priority: 2
    },
    TRADE_EXECUTED: { 
      label: 'EXECUTED', 
      className: 'bg-profit/20 text-profit',
      priority: 3
    },
    TRADE_SKIPPED: { 
      label: 'SKIPPED', 
      className: 'bg-loss/20 text-loss',
      priority: 4
    },
    MESSAGE_EDITED: { 
      label: 'EDITED', 
      className: 'bg-warning/20 text-warning',
      priority: 5
    },
    MESSAGE_DELETED: { 
      label: 'DELETED', 
      className: 'bg-loss/20 text-loss',
      priority: 6
    },
  };
  
  // Sort tags by priority for display
  const sortedTags = [...message.tags].sort(
    (a, b) => tagConfig[a].priority - tagConfig[b].priority
  );

  return (
    <div className="w-full">
      <div 
        className={clsx(
          'relative p-3 max-w-[90%] border transition-all',
          theme === 'dark' 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-white border-gray-200 shadow-sm',
          hasSignal && 'cursor-pointer',
          hasSignal && (theme === 'dark' ? 'hover:border-dark-muted' : 'hover:border-gray-300'),
          isDeleted && 'opacity-60',
          isHighlighted && (theme === 'dark' ? 'border-white ring-1 ring-white/20' : 'border-gray-900 ring-1 ring-gray-900/20')
        )}
        onClick={hasSignal ? onSignalClick : undefined}
      >
        {/* Integrity warnings */}
        {(isEdited || isDeleted) && (
          <div className={clsx(
            'flex items-center gap-1.5 mb-2 text-[10px] font-medium',
            isDeleted ? 'text-loss' : 'text-warning'
          )}>
            {isDeleted ? (
              <>
                <Trash2 size={10} />
                <span>Message deleted after signal</span>
              </>
            ) : (
              <>
                <Pencil size={10} />
                <span>Edited after signal</span>
              </>
            )}
          </div>
        )}

        {/* Message text */}
        <p className={clsx(
          'text-xs whitespace-pre-wrap break-words leading-relaxed',
          theme === 'dark' ? 'text-white' : 'text-gray-900',
          isDeleted && 'line-through'
        )}>
          {message.text}
        </p>

        {/* Tags */}
        {sortedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {sortedTags.map((tag) => {
              const config = tagConfig[tag];
              return (
                <span
                  key={tag}
                  className={clsx(
                    'px-1.5 py-0.5 text-[9px] font-semibold tracking-wide',
                    config.className
                  )}
                >
                  {config.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          <span className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
            {formatTime(new Date(message.timestamp))}
            {isEdited && !isDeleted && ' (edited)'}
          </span>
          
          {hasSignal && (
            <button 
              className={clsx(
                "flex items-center gap-0.5 text-[10px] font-medium transition-colors",
                theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-500 hover:text-gray-900'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onSignalClick?.();
              }}
            >
              View Signal
              <ChevronRight size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
