'use client';

import { useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Target, Shield, Clock, Check, XCircle } from 'lucide-react';
import type { ParsedSignal, Trade } from '@/types';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

interface SignalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  signal?: ParsedSignal;
  trade?: Trade;
}

export function SignalDrawer({ isOpen, onClose, signal, trade }: SignalDrawerProps) {
  const { theme } = useStore();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !signal) return null;

  const isBuy = signal.direction === 'BUY';
  const isExecuted = signal.execution_status === 'executed';
  const isSkipped = signal.execution_status === 'skipped';
  const isPending = signal.execution_status === 'pending_manual' || signal.execution_status === 'pending';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 sheet-overlay animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className={clsx(
          "rounded-t-2xl max-h-[85vh] overflow-y-auto safe-bottom border-t",
          theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-light-bg border-light-border'
        )}>
          {/* Handle */}
          <div className={clsx("sticky top-0 pt-3 pb-2", theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg')}>
            <div className={clsx("w-10 h-1 rounded-full mx-auto", theme === 'dark' ? 'bg-dark-border' : 'bg-light-border')} />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-4 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isBuy ? (
                  <TrendingUp size={18} className="text-profit" />
                ) : (
                  <TrendingDown size={18} className="text-loss" />
                )}
                <span className={clsx(
                  'text-xs font-semibold px-2 py-0.5 rounded',
                  isBuy ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                )}>
                  {signal.direction}
                </span>
              </div>
              <h2 className={clsx("text-lg font-semibold", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                {signal.instrument}
              </h2>
              <p className={clsx("text-xs mt-0.5", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                Parsed {formatDateTime(new Date(signal.parsed_at))}
              </p>
            </div>
            <button
              onClick={onClose}
              className={clsx(
                "p-2 transition-colors -mr-2",
                theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-light-muted hover:text-light-text'
              )}
            >
              <X size={20} />
            </button>
          </div>

          {/* Signal Details */}
          <div className="px-4 pb-4 space-y-4">
            {/* Entry, SL, Targets */}
            <div className="grid grid-cols-2 gap-3">
              <div className={clsx(
                "rounded-lg p-3 border",
                theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
              )}>
                <div className={clsx("flex items-center gap-1.5 mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                  <Target size={14} />
                  <span className="text-xs">Entry</span>
                </div>
                <p className={clsx("text-base font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                  ₹{signal.entry_price.toLocaleString()}
                </p>
                <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                  Range: ₹{signal.entry_range.min} - ₹{signal.entry_range.max}
                </p>
              </div>
              
              <div className={clsx(
                "rounded-lg p-3 border",
                theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
              )}>
                <div className="flex items-center gap-1.5 text-loss mb-1">
                  <Shield size={14} />
                  <span className="text-xs">Stop Loss</span>
                </div>
                <p className={clsx("text-base font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                  ₹{signal.stop_loss.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Targets */}
            <div className={clsx(
              "rounded-lg p-3 border",
              theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
            )}>
              <div className="flex items-center gap-1.5 text-profit mb-2">
                <TrendingUp size={14} />
                <span className="text-xs">Targets</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {signal.targets.map((target, index) => (
                  <span 
                    key={index}
                    className={clsx(
                      'px-2.5 py-1 rounded text-sm font-medium tabular-nums',
                      trade && trade.target_hit > index
                        ? 'bg-profit/20 text-profit'
                        : theme === 'dark' ? 'bg-dark-border text-white' : 'bg-light-border text-light-text'
                    )}
                  >
                    T{index + 1}: ₹{target.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>

            {/* Confidence */}
            <div className={clsx(
              "flex items-center justify-between p-3 rounded-lg border",
              theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
            )}>
              <span className={clsx("text-sm", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>AI Confidence</span>
              <div className="flex items-center gap-2">
                <div className={clsx("w-24 h-1.5 rounded-full overflow-hidden", theme === 'dark' ? 'bg-dark-border' : 'bg-light-border')}>
                  <div 
                    className={clsx("h-full rounded-full", theme === 'dark' ? 'bg-white' : 'bg-light-text')}
                    style={{ width: `${signal.confidence * 100}%` }}
                  />
                </div>
                <span className={clsx("text-sm font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                  {(signal.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Execution Status */}
            <div className={clsx("border-t pt-4", theme === 'dark' ? 'border-dark-border' : 'border-light-border')}>
              <h3 className={clsx("text-sm font-medium mb-3", theme === 'dark' ? 'text-white' : 'text-light-text')}>Execution Status</h3>
              
              {isExecuted && trade && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-profit">
                    <Check size={18} />
                    <span className="font-medium">Trade Executed</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className={clsx(
                      "rounded-lg p-3 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
                    )}>
                      <p className={clsx("text-xs mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>Entry Price</p>
                      <p className={clsx("text-sm font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                        ₹{trade.entry_price.toLocaleString()}
                      </p>
                    </div>
                    <div className={clsx(
                      "rounded-lg p-3 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
                    )}>
                      <p className={clsx("text-xs mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>Exit Price</p>
                      <p className={clsx("text-sm font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                        {trade.exit_price ? `₹${trade.exit_price.toLocaleString()}` : '-'}
                      </p>
                    </div>
                    <div className={clsx(
                      "rounded-lg p-3 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
                    )}>
                      <p className={clsx("text-xs mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>Quantity</p>
                      <p className={clsx("text-sm font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                        {trade.quantity}
                      </p>
                    </div>
                    <div className={clsx(
                      "rounded-lg p-3 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
                    )}>
                      <p className={clsx("text-xs mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>P&L</p>
                      <p className={clsx(
                        'text-sm font-medium tabular-nums',
                        trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                      )}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </p>
                    </div>
                  </div>

                  <div className={clsx(
                    "p-3 rounded-lg border",
                    theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
                  )}>
                    <div className="flex items-center justify-between">
                      <span className={clsx("text-sm", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>Result</span>
                      <span className={clsx(
                        'text-sm font-semibold',
                        trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                      )}>
                        {trade.pnl >= 0 ? 'PROFIT' : 'LOSS'} ({trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isSkipped && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-loss">
                    <XCircle size={18} />
                    <span className="font-medium">Trade Skipped</span>
                  </div>
                  <div className="p-3 bg-loss/10 border border-loss/20 rounded-lg">
                    <p className="text-sm text-loss">
                      {signal.skip_reason || 'Trade was skipped due to rule constraints'}
                    </p>
                  </div>
                </div>
              )}

              {isPending && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-warning">
                    <Clock size={18} />
                    <span className="font-medium">Awaiting Execution</span>
                  </div>
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning">
                      This signal requires manual confirmation before execution
                    </p>
                  </div>
                  <button className={clsx(
                    "w-full py-2.5 rounded-lg font-medium transition-colors",
                    theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90' : 'bg-light-text text-white hover:bg-light-text/90'
                  )}>
                    Execute Trade
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
