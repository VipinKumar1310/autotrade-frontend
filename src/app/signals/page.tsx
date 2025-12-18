'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Check, XCircle, Clock, Filter, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatCurrency } from '@/lib/utils';
import clsx from 'clsx';
import type { ExecutionStatus } from '@/types';

type FilterType = 'all' | ExecutionStatus;

// Custom Telegram Icon (Official Logo)
const TelegramIcon = ({
  size = 14,
  className,
  id = "tg",
}: {
  size?: number;
  className?: string;
  id?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 240 240" className={className}>
    <defs>
      <linearGradient
        id={`${id}-bg`}
        x1="-683.305"
        x2="-693.305"
        y1="534.845"
        y2="511.512"
        gradientTransform="matrix(6 0 0 -6 4255 3247)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#37aee2" />
        <stop offset="1" stopColor="#1e96c8" />
      </linearGradient>
      <linearGradient
        id={`${id}-arrow`}
        x1="128.991"
        x2="153.991"
        y1="118.245"
        y2="78.245"
        gradientTransform="matrix(1 0 0 -1 0 242)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#eff7fc" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
    </defs>
    <path
      d="M240 120c0 66.3-53.7 120-120 120S0 186.3 0 120 53.7 0 120 0s120 53.7 120 120z"
      fill={`url(#${id}-bg)`}
    />
    <path
      d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z"
      fill="#c8daea"
    />
    <path
      d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z"
      fill="#a9c9dd"
    />
    <path
      d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z"
      fill={`url(#${id}-arrow)`}
    />
  </svg>
);

// Kite Icon Component
const KiteIcon = ({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <img
    src="/icons/kite-zerodha.webp"
    alt="Kite"
    width={size}
    height={size}
    className={className}
  />
);

// Format date and time
const formatDateTime = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${day} ${month}, ${hour12}:${mins} ${ampm}`;
};

export default function SignalsPage() {
  const router = useRouter();
  const { isAuthenticated, parsedSignals, trades, automations } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  // Get open trades
  const openTrades = trades.filter((t) => t.status === 'open');

  const filteredSignals = parsedSignals
    .filter((s) => filter === 'all' || s.execution_status === filter)
    .sort((a, b) => new Date(b.parsed_at).getTime() - new Date(a.parsed_at).getTime());

  const getAutomationById = (id: string) => automations.find((a) => a.id === id);

  const getStatusConfig = (status: ExecutionStatus) => {
    switch (status) {
      case 'executed':
        return { label: 'Done', icon: Check, className: 'text-profit bg-profit/20' };
      case 'skipped':
        return { label: 'Skip', icon: XCircle, className: 'text-loss bg-loss/20' };
      case 'pending_manual':
        return { label: 'Wait', icon: Clock, className: 'text-warning bg-warning/20' };
      default:
        return { label: 'Wait', icon: Clock, className: 'text-dark-muted bg-dark-muted/20' };
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Signals" 
        subtitle={`${parsedSignals.length} total signals`}
      />

      {/* Ongoing Trades - Compact List */}
      {openTrades.length > 0 && (
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-profit"></span>
            </span>
            <span className="text-xs font-medium text-dark-muted uppercase tracking-wide">Open Positions</span>
          </div>
          <div className="space-y-2">
            {openTrades.map((trade) => {
              const automation = getAutomationById(trade.automation_id);
              const isBuy = trade.direction === 'BUY';
              const currentPnl = trade.current_price 
                ? (trade.current_price - trade.entry_price) * trade.quantity * (isBuy ? 1 : -1)
                : trade.pnl;
              const currentPnlPercent = trade.current_price 
                ? ((trade.current_price - trade.entry_price) / trade.entry_price) * 100 * (isBuy ? 1 : -1)
                : trade.pnl_percent;

              const isExpanded = expandedCard === `open-${trade.id}`;
              
              return (
                <div 
                  key={trade.id} 
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(`open-${trade.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleExpand(`open-${trade.id}`)}
                  className="bg-dark-bg border border-profit relative overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.15)] animate-pulse-subtle cursor-pointer transition-all duration-300 ease-out"
                >
                  {/* Live glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-profit/5 via-transparent to-profit/5 animate-shimmer" />
                  
                  {/* Main content */}
                  <div className="px-3 py-2 relative">
                    {/* Row 1: Instrument + Automation */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isBuy ? (
                          <TrendingUp size={11} className="text-profit flex-shrink-0" />
                        ) : (
                          <TrendingDown size={11} className="text-loss flex-shrink-0" />
                        )}
                        <span className="text-[11px] font-medium text-white">{trade.instrument}</span>
                        <span className="text-[10px] text-dark-muted">•</span>
                        <div className="flex items-center gap-1">
                          <TelegramIcon size={10} id={`open-${trade.id}`} className="flex-shrink-0" />
                          <KiteIcon size={10} className="flex-shrink-0" />
                        </div>
                        <span className="text-[10px] text-dark-muted">{automation?.name}</span>
                      </div>
                      <ChevronDown 
                        size={14} 
                        className={clsx(
                          'text-dark-muted transition-transform duration-300',
                          isExpanded && 'rotate-180'
                        )} 
                      />
                    </div>
                    {/* Row 2: Prices & P&L */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-dark-muted tabular-nums">
                        ₹{trade.entry_price} → ₹{trade.current_price} | SL:₹{trade.stop_loss} | T:₹{trade.targets?.[0]}
                      </span>
                      <span className={clsx(
                        'text-[11px] font-semibold tabular-nums',
                        currentPnl >= 0 ? 'text-profit' : 'text-loss'
                      )}>
                        {currentPnl >= 0 ? '+' : ''}₹{currentPnl.toFixed(0)} ({currentPnlPercent >= 0 ? '+' : ''}{currentPnlPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  <div className={clsx(
                    'grid transition-all duration-300 ease-out',
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}>
                    <div className="overflow-hidden">
                      <div className="px-3 pb-3 pt-1 border-t border-profit/30 relative">
                        <div className="grid grid-cols-3 gap-3 text-[10px]">
                          <div>
                            <span className="text-dark-muted block">Quantity</span>
                            <span className="text-white font-medium">{trade.quantity}</span>
                          </div>
                          <div>
                            <span className="text-dark-muted block">Entry</span>
                            <span className="text-white font-medium">₹{trade.entry_price}</span>
                          </div>
                          <div>
                            <span className="text-dark-muted block">Current</span>
                            <span className={clsx('font-medium', currentPnl >= 0 ? 'text-profit' : 'text-loss')}>
                              ₹{trade.current_price}
                            </span>
                          </div>
                          <div>
                            <span className="text-dark-muted block">Stop Loss</span>
                            <span className="text-loss font-medium">₹{trade.stop_loss}</span>
                          </div>
                          <div>
                            <span className="text-dark-muted block">Target</span>
                            <span className="text-profit font-medium">₹{trade.targets?.[0]}</span>
                          </div>
                          <div>
                            <span className="text-dark-muted block">P&L</span>
                            <span className={clsx('font-semibold', currentPnl >= 0 ? 'text-profit' : 'text-loss')}>
                              {currentPnl >= 0 ? '+' : ''}₹{currentPnl.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="sticky top-14 z-30 bg-dark-bg border-b border-dark-border mt-3">
        <div className="flex gap-1 p-2 overflow-x-auto scrollbar-hide">
          {(['all', 'executed', 'skipped', 'pending_manual'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors',
                filter === f
                  ? 'bg-white text-dark-bg'
                  : 'text-dark-muted hover:text-white'
              )}
            >
              {f === 'all' ? 'All' : 
               f === 'executed' ? 'Executed' :
               f === 'skipped' ? 'Skipped' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Signals list - Two row cards */}
      <div className="px-4 py-3 space-y-2">
        {filteredSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter size={28} className="text-dark-muted mb-2" />
            <p className="text-sm text-dark-muted">No signals found</p>
          </div>
        ) : (
          filteredSignals.map((signal) => {
            const automation = getAutomationById(signal.automation_id);
            const trade = trades.find((t) => t.signal_id === signal.id && t.status === 'closed');
            const status = getStatusConfig(signal.execution_status);
            const StatusIcon = status.icon;
            const isBuy = signal.direction === 'BUY';
            const signalTime = new Date(signal.parsed_at);
            const isExpanded = expandedCard === `signal-${signal.id}`;

            return (
              <div 
                key={signal.id} 
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(`signal-${signal.id}`)}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpand(`signal-${signal.id}`)}
                className="bg-dark-bg border border-dark-border cursor-pointer transition-all duration-300 ease-out"
              >
                {/* Main content */}
                <div className="px-3 py-2">
                  {/* Row 1: Instrument + Automation name */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {isBuy ? (
                        <TrendingUp size={11} className="text-profit flex-shrink-0" />
                      ) : (
                        <TrendingDown size={11} className="text-loss flex-shrink-0" />
                      )}
                      <span className="text-[11px] font-medium text-white">{signal.instrument}</span>
                      <span className="text-[10px] text-dark-muted">•</span>
                      <div className="flex items-center gap-1">
                        <TelegramIcon size={10} className="flex-shrink-0" id={`sig-${signal.id}`} />
                        <KiteIcon size={10} className="flex-shrink-0" />
                      </div>
                      <span className="text-[10px] text-dark-muted">{automation?.name}</span>
                    </div>
                    <ChevronDown 
                      size={14} 
                      className={clsx(
                        'text-dark-muted transition-transform duration-300 flex-shrink-0',
                        isExpanded && 'rotate-180'
                      )} 
                    />
                  </div>
                  
                  {/* Row 2: Prices, Time, Status/P&L */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-dark-muted tabular-nums">
                      ₹{signal.entry_price} | SL:₹{signal.stop_loss} | T:₹{signal.targets[0]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-dark-muted">
                        {formatDateTime(signalTime)}
                      </span>
                      {trade ? (
                        <span className={clsx(
                          'text-[11px] font-semibold tabular-nums',
                          trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                        )}>
                          {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
                        </span>
                      ) : (
                        <span className={clsx(
                          'inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium',
                          status.className
                        )}>
                          <StatusIcon size={9} />
                          {status.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded content */}
                <div className={clsx(
                  'grid transition-all duration-300 ease-out',
                  isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}>
                  <div className="overflow-hidden">
                    <div className="px-3 pb-3 pt-2 border-t border-dark-border">
                      <div className="grid grid-cols-3 gap-3 text-[10px]">
                        <div>
                          <span className="text-dark-muted block">Direction</span>
                          <span className={clsx('font-medium', isBuy ? 'text-profit' : 'text-loss')}>
                            {signal.direction}
                          </span>
                        </div>
                        <div>
                          <span className="text-dark-muted block">Entry</span>
                          <span className="text-white font-medium">₹{signal.entry_price}</span>
                        </div>
                        <div>
                          <span className="text-dark-muted block">Stop Loss</span>
                          <span className="text-loss font-medium">₹{signal.stop_loss}</span>
                        </div>
                        <div>
                          <span className="text-dark-muted block">Target</span>
                          <span className="text-profit font-medium">₹{signal.targets[0]}</span>
                        </div>
                        <div>
                          <span className="text-dark-muted block">Status</span>
                          <span className={clsx(
                            'inline-flex items-center gap-0.5 font-medium',
                            status.className.replace('bg-profit/20', '').replace('bg-loss/20', '').replace('bg-warning/20', '').replace('bg-dark-muted/20', '')
                          )}>
                            <StatusIcon size={9} />
                            {signal.execution_status === 'executed' ? 'Executed' : 
                             signal.execution_status === 'skipped' ? 'Skipped' : 'Pending'}
                          </span>
                        </div>
                        {trade && (
                          <div>
                            <span className="text-dark-muted block">P&L</span>
                            <span className={clsx('font-semibold', trade.pnl >= 0 ? 'text-profit' : 'text-loss')}>
                              {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      {trade && (
                        <div className="mt-2 pt-2 border-t border-dark-border/50 grid grid-cols-3 gap-3 text-[10px]">
                          <div>
                            <span className="text-dark-muted block">Qty Executed</span>
                            <span className="text-white font-medium">{trade.quantity}</span>
                          </div>
                          <div>
                            <span className="text-dark-muted block">Exit Price</span>
                            <span className="text-white font-medium">₹{trade.exit_price}</span>
                          </div>
                          <div>
                            <span className="text-dark-muted block">P&L %</span>
                            <span className={clsx('font-semibold', trade.pnl_percent >= 0 ? 'text-profit' : 'text-loss')}>
                              {trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}
                      {signal.execution_status === 'skipped' && signal.skip_reason && (
                        <div className="mt-2 pt-2 border-t border-dark-border/50">
                          <span className="text-dark-muted text-[10px] block">Skip Reason</span>
                          <span className="text-loss text-[10px] font-medium">{signal.skip_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}
