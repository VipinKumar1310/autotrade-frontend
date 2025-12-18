'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  MousePointer, 
  Zap, 
  Check, 
  Sparkles,
  Clock
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Automation, ExecutionMode } from '@/types';
import clsx from 'clsx';

interface AutomationFormProps {
  automation?: Automation;
}

const executionModes: { value: ExecutionMode; label: string; description: string; icon: typeof Bot }[] = [
  { value: 'manual', label: 'Manual', description: 'Review signals and decide each trade', icon: Zap },
  { value: 'one-click', label: 'One-Click', description: 'Quick confirmation to execute trades', icon: MousePointer },
  { value: 'auto', label: 'Auto', description: 'Fully automated trade execution', icon: Bot },
];

export function AutomationForm({ automation }: AutomationFormProps) {
  const router = useRouter();
  const { telegramProviders, brokers, createAutomation } = useStore();
  
  const connectedProviders = telegramProviders.filter((p) => p.connected);
  const connectedBrokers = brokers.filter((b) => b.connected);

  const [formData, setFormData] = useState({
    name: automation?.name || '',
    telegram_provider_id: automation?.telegram_provider_id || connectedProviders[0]?.id || '',
    broker_id: automation?.broker_id || connectedBrokers[0]?.id || '',
    execution_mode: automation?.execution_mode || 'manual' as ExecutionMode,
    quantity: automation?.rules.quantity || 50,
    max_quantity: automation?.rules.max_quantity || 100,
    stop_loss_percent: automation?.rules.stop_loss_percent || 20,
    max_trades_per_day: automation?.rules.max_trades_per_day || 5,
    ai_validation: automation?.options.ai_validation || false,
    delay_execution_seconds: automation?.options.delay_execution_seconds || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    createAutomation({
      name: formData.name || `Automation ${Date.now()}`,
      telegram_provider_id: formData.telegram_provider_id,
      broker_id: formData.broker_id,
      execution_mode: formData.execution_mode,
      status: 'paused',
      last_signal_at: new Date().toISOString(),
      trades_today: 0,
      total_trades: 0,
      rules: {
        quantity: formData.quantity,
        max_quantity: formData.max_quantity,
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

    router.push('/automations');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-dark-muted mb-2">
          Automation Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Nifty Options Auto"
          className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder-dark-muted/50 focus:border-white/30 transition-colors"
        />
      </div>

      {/* Telegram Provider */}
      <div>
        <label className="block text-sm font-medium text-dark-muted mb-2">
          Telegram Provider
        </label>
        <div className="space-y-2">
          {connectedProviders.map((provider) => (
            <label
              key={provider.id}
              className={clsx(
                'flex items-center gap-3 p-3 bg-dark-card border rounded-lg cursor-pointer transition-colors',
                formData.telegram_provider_id === provider.id
                  ? 'border-white'
                  : 'border-dark-border hover:border-dark-muted'
              )}
            >
              <input
                type="radio"
                name="provider"
                value={provider.id}
                checked={formData.telegram_provider_id === provider.id}
                onChange={(e) => setFormData({ ...formData, telegram_provider_id: e.target.value })}
                className="sr-only"
              />
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: provider.avatar_color }}
              >
                {provider.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{provider.name}</p>
                <p className="text-xs text-dark-muted">{provider.signal_count} signals</p>
              </div>
              {formData.telegram_provider_id === provider.id && (
                <Check size={18} className="text-white" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Broker */}
      <div>
        <label className="block text-sm font-medium text-dark-muted mb-2">
          Broker
        </label>
        <div className="space-y-2">
          {connectedBrokers.map((broker) => (
            <label
              key={broker.id}
              className={clsx(
                'flex items-center gap-3 p-3 bg-dark-card border rounded-lg cursor-pointer transition-colors',
                formData.broker_id === broker.id
                  ? 'border-white'
                  : 'border-dark-border hover:border-dark-muted'
              )}
            >
              <input
                type="radio"
                name="broker"
                value={broker.id}
                checked={formData.broker_id === broker.id}
                onChange={(e) => setFormData({ ...formData, broker_id: e.target.value })}
                className="sr-only"
              />
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: broker.logo_color }}
              >
                {broker.code.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{broker.name}</p>
                <p className="text-xs text-dark-muted">ID: {broker.account_id}</p>
              </div>
              {formData.broker_id === broker.id && (
                <Check size={18} className="text-white" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Execution Mode */}
      <div>
        <label className="block text-sm font-medium text-dark-muted mb-2">
          Execution Mode
        </label>
        <div className="space-y-2">
          {executionModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <label
                key={mode.value}
                className={clsx(
                  'flex items-center gap-3 p-3 bg-dark-card border rounded-lg cursor-pointer transition-colors',
                  formData.execution_mode === mode.value
                    ? 'border-white'
                    : 'border-dark-border hover:border-dark-muted'
                )}
              >
                <input
                  type="radio"
                  name="mode"
                  value={mode.value}
                  checked={formData.execution_mode === mode.value}
                  onChange={(e) => setFormData({ ...formData, execution_mode: e.target.value as ExecutionMode })}
                  className="sr-only"
                />
                <div className="h-10 w-10 rounded-lg bg-dark-border flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{mode.label}</p>
                  <p className="text-xs text-dark-muted">{mode.description}</p>
                </div>
                {formData.execution_mode === mode.value && (
                  <Check size={18} className="text-white" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Trade Rules</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-dark-muted mb-1.5">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:border-white/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-muted mb-1.5">Max Quantity</label>
            <input
              type="number"
              value={formData.max_quantity}
              onChange={(e) => setFormData({ ...formData, max_quantity: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:border-white/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-muted mb-1.5">Stop Loss %</label>
            <input
              type="number"
              value={formData.stop_loss_percent}
              onChange={(e) => setFormData({ ...formData, stop_loss_percent: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:border-white/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-muted mb-1.5">Max Trades/Day</label>
            <input
              type="number"
              value={formData.max_trades_per_day}
              onChange={(e) => setFormData({ ...formData, max_trades_per_day: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:border-white/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Options</h3>
        
        <label className="flex items-center justify-between p-3 bg-dark-card border border-dark-border rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-dark-muted" />
            <div>
              <p className="text-sm font-medium text-white">AI Validation</p>
              <p className="text-xs text-dark-muted">Validate signals before execution</p>
            </div>
          </div>
          <div className={clsx(
            'relative w-11 h-6 rounded-full transition-colors',
            formData.ai_validation ? 'bg-profit' : 'bg-dark-border'
          )}>
            <input
              type="checkbox"
              checked={formData.ai_validation}
              onChange={(e) => setFormData({ ...formData, ai_validation: e.target.checked })}
              className="sr-only"
            />
            <div className={clsx(
              'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
              formData.ai_validation ? 'translate-x-6' : 'translate-x-1'
            )} />
          </div>
        </label>

        <div className="p-3 bg-dark-card border border-dark-border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={18} className="text-dark-muted" />
            <div>
              <p className="text-sm font-medium text-white">Delay Execution</p>
              <p className="text-xs text-dark-muted">Wait before executing trade</p>
            </div>
          </div>
          <select
            value={formData.delay_execution_seconds}
            onChange={(e) => setFormData({ ...formData, delay_execution_seconds: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-dark-border border-0 rounded-lg text-white text-sm focus:ring-0"
          >
            <option value={0}>No delay</option>
            <option value={5}>5 seconds</option>
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.telegram_provider_id || !formData.broker_id}
          className={clsx(
            'w-full py-3.5 rounded-lg text-base font-semibold transition-all',
            !isSubmitting && formData.telegram_provider_id && formData.broker_id
              ? 'bg-white text-dark-bg hover:bg-white/90 active:scale-[0.98]'
              : 'bg-dark-card text-dark-muted cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-dark-muted border-t-transparent rounded-full animate-spin" />
              <span>Creating...</span>
            </div>
          ) : automation ? (
            'Save Changes'
          ) : (
            'Create Automation'
          )}
        </button>
      </div>
    </form>
  );
}

