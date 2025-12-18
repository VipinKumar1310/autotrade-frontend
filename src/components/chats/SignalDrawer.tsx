'use client';

import { useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Target, Shield, Clock, Check, XCircle } from 'lucide-react';
import type { ParsedSignal, Trade } from '@/types';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import clsx from 'clsx';

interface SignalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  signal?: ParsedSignal;
  trade?: Trade;
}

export function SignalDrawer({ isOpen, onClose, signal, trade }: SignalDrawerProps) {
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
        <div className="bg-dark-bg border-t border-dark-border rounded-t-2xl max-h-[85vh] overflow-y-auto safe-bottom">
          {/* Handle */}
          <div className="sticky top-0 bg-dark-bg pt-3 pb-2">
            <div className="w-10 h-1 bg-dark-border rounded-full mx-auto" />
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
              <h2 className="text-lg font-semibold text-white">
                {signal.instrument}
              </h2>
              <p className="text-xs text-dark-muted mt-0.5">
                Parsed {formatDateTime(new Date(signal.parsed_at))}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-dark-muted hover:text-white transition-colors -mr-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* Signal Details */}
          <div className="px-4 pb-4 space-y-4">
            {/* Entry, SL, Targets */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-card border border-dark-border rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-dark-muted mb-1">
                  <Target size={14} />
                  <span className="text-xs">Entry</span>
                </div>
                <p className="text-base font-medium text-white tabular-nums">
                  ₹{signal.entry_price.toLocaleString()}
                </p>
                <p className="text-[10px] text-dark-muted">
                  Range: ₹{signal.entry_range.min} - ₹{signal.entry_range.max}
                </p>
              </div>
              
              <div className="bg-dark-card border border-dark-border rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-loss mb-1">
                  <Shield size={14} />
                  <span className="text-xs">Stop Loss</span>
                </div>
                <p className="text-base font-medium text-white tabular-nums">
                  ₹{signal.stop_loss.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Targets */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-3">
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
                        : 'bg-dark-border text-white'
                    )}
                  >
                    T{index + 1}: ₹{target.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>

            {/* Confidence */}
            <div className="flex items-center justify-between p-3 bg-dark-card border border-dark-border rounded-lg">
              <span className="text-sm text-dark-muted">AI Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-dark-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${signal.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white tabular-nums">
                  {(signal.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Execution Status */}
            <div className="border-t border-dark-border pt-4">
              <h3 className="text-sm font-medium text-white mb-3">Execution Status</h3>
              
              {isExecuted && trade && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-profit">
                    <Check size={18} />
                    <span className="font-medium">Trade Executed</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-card border border-dark-border rounded-lg p-3">
                      <p className="text-xs text-dark-muted mb-1">Entry Price</p>
                      <p className="text-sm font-medium text-white tabular-nums">
                        ₹{trade.entry_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-dark-card border border-dark-border rounded-lg p-3">
                      <p className="text-xs text-dark-muted mb-1">Exit Price</p>
                      <p className="text-sm font-medium text-white tabular-nums">
                        ₹{trade.exit_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-dark-card border border-dark-border rounded-lg p-3">
                      <p className="text-xs text-dark-muted mb-1">Quantity</p>
                      <p className="text-sm font-medium text-white tabular-nums">
                        {trade.quantity}
                      </p>
                    </div>
                    <div className="bg-dark-card border border-dark-border rounded-lg p-3">
                      <p className="text-xs text-dark-muted mb-1">P&L</p>
                      <p className={clsx(
                        'text-sm font-medium tabular-nums',
                        trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                      )}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-dark-card border border-dark-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-muted">Result</span>
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
                  <button className="w-full py-2.5 bg-white text-dark-bg rounded-lg font-medium hover:bg-white/90 transition-colors">
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

