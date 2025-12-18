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
        className={clsx(
          "fixed inset-0 z-50 transition-opacity",
          theme === 'dark' ? 'bg-black/80' : 'bg-black/50'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div 
          className={clsx(
            "max-h-[85vh] overflow-y-auto safe-bottom border-t",
            theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className={clsx("sticky top-0 pt-3 pb-2 z-10", theme === 'dark' ? 'bg-dark-bg' : 'bg-white')}>
            <div className={clsx("w-10 h-1 mx-auto", theme === 'dark' ? 'bg-dark-border' : 'bg-gray-300')} />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-4 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isBuy ? (
                  <TrendingUp size={16} className="text-profit" />
                ) : (
                  <TrendingDown size={16} className="text-loss" />
                )}
                <span className={clsx(
                  'text-[10px] font-semibold px-1.5 py-0.5',
                  isBuy ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                )}>
                  {signal.direction}
                </span>
              </div>
              <h2 className={clsx("text-base font-semibold", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {signal.instrument}
              </h2>
              <p className={clsx("text-[10px] mt-0.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                Parsed {formatDateTime(new Date(signal.parsed_at))}
              </p>
            </div>
            <button
              onClick={onClose}
              className={clsx(
                "p-1.5 transition-colors -mr-1",
                theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
              )}
            >
              <X size={18} />
            </button>
          </div>

          {/* Signal Details */}
          <div className="px-4 pb-24 space-y-3">
            {/* Entry, SL, Targets */}
            <div className="grid grid-cols-2 gap-2">
              <div className={clsx(
                "p-2.5 border",
                theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
              )}>
                <div className={clsx("flex items-center gap-1 mb-0.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  <Target size={10} />
                  <span className="text-[10px]">Entry</span>
                </div>
                <p className={clsx("text-sm font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  ₹{signal.entry_price.toLocaleString()}
                </p>
                <p className={clsx("text-[9px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  Range: ₹{signal.entry_range.min} - ₹{signal.entry_range.max}
                </p>
              </div>
              
              <div className={clsx(
                "p-2.5 border",
                theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
              )}>
                <div className="flex items-center gap-1 text-loss mb-0.5">
                  <Shield size={10} />
                  <span className="text-[10px]">Stop Loss</span>
                </div>
                <p className={clsx("text-sm font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  ₹{signal.stop_loss.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Targets */}
            <div className={clsx(
              "p-2.5 border",
              theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
            )}>
              <div className="flex items-center gap-1 text-profit mb-2">
                <TrendingUp size={10} />
                <span className="text-[10px]">Targets</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {signal.targets.map((target, index) => (
                  <span 
                    key={index}
                    className={clsx(
                      'px-2 py-1 text-xs font-medium tabular-nums',
                      trade && trade.target_hit > index
                        ? 'bg-profit/20 text-profit'
                        : theme === 'dark' ? 'bg-dark-border text-white' : 'bg-gray-200 text-gray-700'
                    )}
                  >
                    T{index + 1}: ₹{target.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>

            {/* Confidence */}
            <div className={clsx(
              "flex items-center justify-between p-2.5 border",
              theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
            )}>
              <span className={clsx("text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>AI Confidence</span>
              <div className="flex items-center gap-2">
                <div className={clsx("w-20 h-1 overflow-hidden", theme === 'dark' ? 'bg-dark-border' : 'bg-gray-200')}>
                  <div 
                    className={clsx("h-full", theme === 'dark' ? 'bg-white' : 'bg-gray-900')}
                    style={{ width: `${signal.confidence * 100}%` }}
                  />
                </div>
                <span className={clsx("text-xs font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {(signal.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Execution Status */}
            <div className={clsx("border-t pt-3", theme === 'dark' ? 'border-dark-border' : 'border-gray-200')}>
              <h3 className={clsx("text-xs font-medium mb-2", theme === 'dark' ? 'text-white' : 'text-gray-900')}>Execution Status</h3>
              
              {isExecuted && trade && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-profit">
                    <Check size={14} />
                    <span className="text-xs font-medium">Trade Executed</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className={clsx(
                      "p-2 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
                    )}>
                      <p className={clsx("text-[10px] mb-0.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>Entry Price</p>
                      <p className={clsx("text-xs font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        ₹{trade.entry_price.toLocaleString()}
                      </p>
                    </div>
                    <div className={clsx(
                      "p-2 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
                    )}>
                      <p className={clsx("text-[10px] mb-0.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>Exit Price</p>
                      <p className={clsx("text-xs font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        {trade.exit_price ? `₹${trade.exit_price.toLocaleString()}` : '-'}
                      </p>
                    </div>
                    <div className={clsx(
                      "p-2 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
                    )}>
                      <p className={clsx("text-[10px] mb-0.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>Quantity</p>
                      <p className={clsx("text-xs font-medium tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                        {trade.quantity}
                      </p>
                    </div>
                    <div className={clsx(
                      "p-2 border",
                      theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
                    )}>
                      <p className={clsx("text-[10px] mb-0.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>P&L</p>
                      <p className={clsx(
                        'text-xs font-medium tabular-nums',
                        trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                      )}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </p>
                    </div>
                  </div>

                  <div className={clsx(
                    "p-2 border",
                    theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
                  )}>
                    <div className="flex items-center justify-between">
                      <span className={clsx("text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>Result</span>
                      <span className={clsx(
                        'text-xs font-semibold',
                        trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                      )}>
                        {trade.pnl >= 0 ? 'PROFIT' : 'LOSS'} ({trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isSkipped && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-loss">
                    <XCircle size={14} />
                    <span className="text-xs font-medium">Trade Skipped</span>
                  </div>
                  <div className="p-2 bg-loss/10 border border-loss/20">
                    <p className="text-xs text-loss">
                      {signal.skip_reason || 'Trade was skipped due to rule constraints'}
                    </p>
                  </div>
                </div>
              )}

              {isPending && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-warning">
                    <Clock size={14} />
                    <span className="text-xs font-medium">Awaiting Execution</span>
                  </div>
                  <div className="p-2 bg-warning/10 border border-warning/20">
                    <p className="text-xs text-warning">
                      This signal requires manual confirmation before execution
                    </p>
                  </div>
                  <button className={clsx(
                    "w-full py-2 text-sm font-medium transition-colors",
                    theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90' : 'bg-gray-900 text-white hover:bg-gray-800'
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
