'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X,
  Bot, 
  MousePointer, 
  Zap, 
  Sparkles,
  Clock,
  Search,
  ChevronDown,
  Check,
  Play,
  Pause,
  Trash2
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Automation, ExecutionMode } from '@/types';
import clsx from 'clsx';

// Custom Telegram Icon
const TelegramIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 240 240" className={className}>
    <defs>
      <linearGradient id="tg-edit-modal-bg" x1="0.667" x2="0.417" y1="0.167" y2="0.75">
        <stop offset="0" stopColor="#37aee2" />
        <stop offset="1" stopColor="#1e96c8" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="120" fill="url(#tg-edit-modal-bg)" />
    <path d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z" fill="#c8daea" />
    <path d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z" fill="#a9c9dd" />
    <path d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z" fill="#fff" />
  </svg>
);

// Kite Icon Component
const KiteIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <img src="/icons/kite-zerodha.webp" alt="Kite" width={size} height={size} className={className} />
);

interface EditAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation: Automation | null;
}

const executionModes: { value: ExecutionMode; label: string; icon: typeof Bot }[] = [
  { value: 'manual', label: 'Manual', icon: Zap },
  { value: 'one-click', label: 'One-Click', icon: MousePointer },
  { value: 'auto', label: 'Auto', icon: Bot },
];

export function EditAutomationModal({ isOpen, onClose, automation }: EditAutomationModalProps) {
  const { 
    telegramProviders, 
    brokers, 
    updateAutomation, 
    updateAutomationStatus,
    deleteAutomation,
    theme 
  } = useStore();
  
  const connectedProviders = telegramProviders.filter((p) => p.connected);
  const connectedBrokers = brokers.filter((b) => b.connected);

  const [formData, setFormData] = useState({
    name: '',
    telegram_provider_id: '',
    broker_id: '',
    execution_mode: 'manual' as ExecutionMode,
    quantity: 50,
    stop_loss_percent: 20,
    max_trades_per_day: 5,
    ai_validation: false,
    delay_execution_seconds: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [channelSearch, setChannelSearch] = useState('');
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const brokerDropdownRef = useRef<HTMLDivElement>(null);

  // Filter channels based on search
  const filteredChannels = useMemo(() => {
    if (!channelSearch) return connectedProviders;
    return connectedProviders.filter(p => 
      p.name.toLowerCase().includes(channelSearch.toLowerCase())
    );
  }, [connectedProviders, channelSearch]);

  // Lock body scroll when modal is open
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (channelDropdownRef.current && !channelDropdownRef.current.contains(event.target as Node)) {
        setShowChannelDropdown(false);
      }
      if (brokerDropdownRef.current && !brokerDropdownRef.current.contains(event.target as Node)) {
        setShowBrokerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize form data when automation changes
  useEffect(() => {
    if (isOpen && automation) {
      setFormData({
        name: automation.name,
        telegram_provider_id: automation.telegram_provider_id,
        broker_id: automation.broker_id,
        execution_mode: automation.execution_mode,
        quantity: automation.rules.quantity,
        stop_loss_percent: automation.rules.stop_loss_percent,
        max_trades_per_day: automation.rules.max_trades_per_day,
        ai_validation: automation.options.ai_validation,
        delay_execution_seconds: automation.options.delay_execution_seconds,
      });
      setChannelSearch('');
    }
  }, [isOpen, automation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!automation) return;
    
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    updateAutomation(automation.id, {
      name: formData.name || automation.name,
      telegram_provider_id: formData.telegram_provider_id,
      broker_id: formData.broker_id,
      execution_mode: formData.execution_mode,
      rules: {
        quantity: formData.quantity,
        max_quantity: formData.quantity * 2,
        stop_loss_percent: formData.stop_loss_percent,
        max_trades_per_day: formData.max_trades_per_day,
        allowed_instruments: ['ALL'],
        allowed_directions: ['BUY', 'SELL'],
      },
      options: {
        ai_validation: formData.ai_validation,
        delay_execution_seconds: formData.delay_execution_seconds,
        require_confirmation: formData.execution_mode === 'manual',
      },
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleToggleStatus = () => {
    if (!automation) return;
    const newStatus = automation.status === 'running' ? 'paused' : 'running';
    updateAutomationStatus(automation.id, newStatus);
  };

  const handleDelete = () => {
    if (!automation) return;
    if (confirm('Delete this automation? This action cannot be undone.')) {
      deleteAutomation(automation.id);
      onClose();
    }
  };

  const selectedChannel = connectedProviders.find(p => p.id === formData.telegram_provider_id);
  const selectedBroker = connectedBrokers.find(b => b.id === formData.broker_id);

  if (!isOpen || !automation) return null;

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
      
      {/* Bottom Sheet Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div 
          className={clsx(
            "max-h-[90vh] overflow-y-auto border-t",
            theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className={clsx("sticky top-0 pt-3 pb-2 z-10", theme === 'dark' ? 'bg-dark-bg' : 'bg-white')}>
            <div className={clsx("w-10 h-1 mx-auto", theme === 'dark' ? 'bg-dark-border' : 'bg-gray-300')} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div>
              <h2 className={clsx("text-base font-semibold", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                Edit Automation
              </h2>
              {/* Status Badge */}
              <div className="flex items-center gap-2 mt-1">
                <span className={clsx(
                  'px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                  automation.status === 'running' 
                    ? 'bg-profit/20 text-profit' 
                    : automation.status === 'error'
                    ? 'bg-loss/20 text-loss'
                    : theme === 'dark' ? 'bg-dark-muted/20 text-dark-muted' : 'bg-gray-200 text-gray-500'
                )}>
                  {automation.status}
                </span>
                <span className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-400')}>
                  {automation.total_trades} trades total
                </span>
              </div>
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

          {/* Stats Row */}
          <div className={clsx(
            "mx-4 mb-4 p-3 grid grid-cols-3 gap-2 border",
            theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-gray-50 border-gray-200'
          )}>
            <div>
              <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>Today</p>
              <p className={clsx("text-sm font-semibold tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {automation.trades_today} trades
              </p>
            </div>
            <div>
              <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>Win Rate</p>
              <p className={clsx("text-sm font-semibold tabular-nums", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {automation.stats.win_rate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>Total P&L</p>
              <p className={clsx(
                "text-sm font-semibold tabular-nums",
                automation.stats.total_pnl >= 0 ? 'text-profit' : 'text-loss'
              )}>
                {automation.stats.total_pnl >= 0 ? '+' : ''}₹{automation.stats.total_pnl.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-4 pb-24 space-y-4">
            {/* Row 1: Name Input (short) */}
            <div>
              <label className={clsx("block text-[11px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Automation"
                autoComplete="off"
                className={clsx(
                  "w-full px-3 py-2 text-sm transition-colors border outline-none",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                )}
              />
            </div>

            {/* Row 2: Telegram Channel Dropdown with Search */}
            <div ref={channelDropdownRef} className="relative">
              <label className={clsx("block text-[11px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                Telegram Channel
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowChannelDropdown(!showChannelDropdown);
                  setShowBrokerDropdown(false);
                }}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2 border text-sm transition-colors",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white hover:border-dark-muted' 
                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                )}
              >
                <div className="flex items-center gap-2">
                  {selectedChannel ? (
                    <>
                      <TelegramIcon size={16} />
                      <span className="truncate">{selectedChannel.name}</span>
                    </>
                  ) : (
                    <span className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'}>Select channel</span>
                  )}
                </div>
                <ChevronDown size={14} className={clsx(
                  'transition-transform',
                  theme === 'dark' ? 'text-dark-muted' : 'text-gray-400',
                  showChannelDropdown && 'rotate-180'
                )} />
              </button>

              {showChannelDropdown && (
                <div className={clsx(
                  "absolute top-full left-0 right-0 mt-1 z-50 border shadow-lg max-h-48 overflow-hidden",
                  theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
                )}>
                  {/* Search */}
                  <div 
                    className={clsx("p-2 border-b", theme === 'dark' ? 'border-dark-border' : 'border-gray-100')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={clsx(
                      "flex items-center gap-2 px-2 py-1.5 border",
                      theme === 'dark' ? 'bg-dark-border border-dark-border' : 'bg-gray-50 border-gray-200'
                    )}>
                      <Search size={12} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
                      <input
                        type="text"
                        value={channelSearch}
                        onChange={(e) => {
                          e.stopPropagation();
                          setChannelSearch(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Search channels..."
                        autoComplete="off"
                        className={clsx(
                          "flex-1 bg-transparent text-xs outline-none",
                          theme === 'dark' ? 'text-white placeholder-dark-muted' : 'text-gray-900 placeholder-gray-400'
                        )}
                      />
                    </div>
                  </div>
                  {/* Options */}
                  <div className="max-h-32 overflow-y-auto">
                    {filteredChannels.length === 0 ? (
                      <div className={clsx("px-3 py-2 text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                        No channels found
                      </div>
                    ) : (
                      filteredChannels.map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, telegram_provider_id: provider.id });
                            setShowChannelDropdown(false);
                            setChannelSearch('');
                          }}
                          className={clsx(
                            'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
                            theme === 'dark' ? 'hover:bg-dark-border' : 'hover:bg-gray-50',
                            formData.telegram_provider_id === provider.id 
                              ? (theme === 'dark' ? 'text-white bg-dark-border' : 'text-gray-900 bg-gray-100')
                              : (theme === 'dark' ? 'text-dark-muted' : 'text-gray-600')
                          )}
                        >
                          <TelegramIcon size={14} />
                          <span className="flex-1 truncate">{provider.name}</span>
                          {formData.telegram_provider_id === provider.id && (
                            <Check size={12} className="text-profit flex-shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Row 3: Broker Dropdown */}
            <div ref={brokerDropdownRef} className="relative">
              <label className={clsx("block text-[11px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                Broker / Exchange
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowBrokerDropdown(!showBrokerDropdown);
                  setShowChannelDropdown(false);
                }}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2 border text-sm transition-colors",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white hover:border-dark-muted' 
                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                )}
              >
                <div className="flex items-center gap-2">
                  {selectedBroker ? (
                    <>
                      <KiteIcon size={16} />
                      <span className="truncate">{selectedBroker.name}</span>
                    </>
                  ) : (
                    <span className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'}>Select broker</span>
                  )}
                </div>
                <ChevronDown size={14} className={clsx(
                  'transition-transform',
                  theme === 'dark' ? 'text-dark-muted' : 'text-gray-400',
                  showBrokerDropdown && 'rotate-180'
                )} />
              </button>

              {showBrokerDropdown && (
                <div className={clsx(
                  "absolute top-full left-0 right-0 mt-1 z-50 border shadow-lg max-h-40 overflow-y-auto",
                  theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
                )}>
                  {connectedBrokers.map((broker) => (
                    <button
                      key={broker.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, broker_id: broker.id });
                        setShowBrokerDropdown(false);
                      }}
                      className={clsx(
                        'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
                        theme === 'dark' ? 'hover:bg-dark-border' : 'hover:bg-gray-50',
                        formData.broker_id === broker.id 
                          ? (theme === 'dark' ? 'text-white bg-dark-border' : 'text-gray-900 bg-gray-100')
                          : (theme === 'dark' ? 'text-dark-muted' : 'text-gray-600')
                      )}
                    >
                      <KiteIcon size={14} />
                      <span className="flex-1 truncate">{broker.name}</span>
                      {formData.broker_id === broker.id && (
                        <Check size={12} className="text-profit flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row 4: Execution Mode (Horizontal) */}
            <div>
              <label className={clsx("block text-[11px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                Execution Mode
              </label>
              <div className="flex gap-1">
                {executionModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = formData.execution_mode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, execution_mode: mode.value })}
                      className={clsx(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors border',
                        isSelected
                          ? theme === 'dark' ? 'bg-white text-dark-bg border-white' : 'bg-gray-900 text-white border-gray-900'
                          : theme === 'dark' 
                            ? 'bg-dark-card text-dark-muted border-dark-border hover:text-white hover:border-dark-muted' 
                            : 'bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:border-gray-300'
                      )}
                    >
                      <Icon size={12} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 5: Trade Rules (Compact Grid) */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={clsx("block text-[10px] uppercase tracking-wide mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  Qty
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  autoComplete="off"
                  className={clsx(
                    "w-full px-2 py-1.5 text-xs transition-colors border text-center outline-none",
                    theme === 'dark' 
                      ? 'bg-dark-card border-dark-border text-white focus:border-white/50' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-gray-400'
                  )}
                />
              </div>
              <div>
                <label className={clsx("block text-[10px] uppercase tracking-wide mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  SL %
                </label>
                <input
                  type="number"
                  value={formData.stop_loss_percent}
                  onChange={(e) => setFormData({ ...formData, stop_loss_percent: parseInt(e.target.value) || 0 })}
                  autoComplete="off"
                  className={clsx(
                    "w-full px-2 py-1.5 text-xs transition-colors border text-center outline-none",
                    theme === 'dark' 
                      ? 'bg-dark-card border-dark-border text-white focus:border-white/50' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-gray-400'
                  )}
                />
              </div>
              <div>
                <label className={clsx("block text-[10px] uppercase tracking-wide mb-1", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  Max/Day
                </label>
                <input
                  type="number"
                  value={formData.max_trades_per_day}
                  onChange={(e) => setFormData({ ...formData, max_trades_per_day: parseInt(e.target.value) || 0 })}
                  autoComplete="off"
                  className={clsx(
                    "w-full px-2 py-1.5 text-xs transition-colors border text-center outline-none",
                    theme === 'dark' 
                      ? 'bg-dark-card border-dark-border text-white focus:border-white/50' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-gray-400'
                  )}
                />
              </div>
            </div>

            {/* Row 6: Options (Horizontal) */}
            <div className="flex gap-2">
              {/* AI Validation Toggle */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, ai_validation: !formData.ai_validation })}
                className={clsx(
                  'flex-1 flex items-center justify-between px-3 py-2 border transition-colors',
                  formData.ai_validation
                    ? 'border-profit bg-profit/10'
                    : theme === 'dark' ? 'border-dark-border bg-dark-card' : 'border-gray-200 bg-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className={formData.ai_validation ? 'text-profit' : theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
                  <span className={clsx("text-xs", formData.ai_validation ? 'text-profit' : theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                    AI Validation
                  </span>
                </div>
                <div className={clsx(
                  'w-8 h-4 rounded-full relative transition-colors',
                  formData.ai_validation ? 'bg-profit' : theme === 'dark' ? 'bg-dark-border' : 'bg-gray-200'
                )}>
                  <div className={clsx(
                    'absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform',
                    formData.ai_validation ? 'translate-x-4' : 'translate-x-0.5'
                  )} />
                </div>
              </button>

              {/* Delay Dropdown */}
              <div className={clsx(
                "flex-1 flex items-center gap-2 px-3 py-2 border",
                theme === 'dark' ? 'border-dark-border bg-dark-card' : 'border-gray-200 bg-white'
              )}>
                <Clock size={12} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
                <select
                  value={formData.delay_execution_seconds}
                  onChange={(e) => setFormData({ ...formData, delay_execution_seconds: parseInt(e.target.value) })}
                  className={clsx(
                    "flex-1 bg-transparent text-xs outline-none cursor-pointer",
                    theme === 'dark' ? 'text-white [&>option]:bg-dark-card [&>option]:text-white' : 'text-gray-900 [&>option]:bg-white [&>option]:text-gray-900'
                  )}
                >
                  <option value={0}>No delay</option>
                  <option value={5}>5s delay</option>
                  <option value={10}>10s delay</option>
                  <option value={30}>30s delay</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {/* Toggle Status Button */}
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={automation.status === 'error'}
                className={clsx(
                  "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border",
                  automation.status === 'running'
                    ? theme === 'dark' ? 'bg-dark-card border-dark-border text-white hover:bg-dark-border' : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200'
                    : automation.status === 'error'
                    ? theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-muted cursor-not-allowed' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-profit/20 border-profit/30 text-profit hover:bg-profit/30'
                )}
              >
                {automation.status === 'running' ? (
                  <>
                    <Pause size={14} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Start
                  </>
                )}
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                className={clsx(
                  "flex items-center justify-center px-3 py-2.5 transition-colors border",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-dark-muted hover:bg-loss/20 hover:border-loss/30 hover:text-loss' 
                    : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-loss/10 hover:border-loss/30 hover:text-loss'
                )}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.telegram_provider_id || !formData.broker_id}
              className={clsx(
                'w-full py-2.5 text-sm font-semibold transition-all',
                !isSubmitting && formData.telegram_provider_id && formData.broker_id
                  ? theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90 active:scale-[0.98]' : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
                  : theme === 'dark' ? 'bg-dark-card text-dark-muted cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className={clsx("h-4 w-4 border-2 border-t-transparent rounded-full animate-spin", theme === 'dark' ? 'border-dark-muted' : 'border-gray-400')} />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

