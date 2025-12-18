'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  LogOut, 
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import clsx from 'clsx';
import Image from 'next/image';

// Custom Telegram Icon
const TelegramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 240 240">
    <defs>
      <linearGradient id="tg-settings-bg" x1="0.667" x2="0.417" y1="0.167" y2="0.75">
        <stop offset="0" stopColor="#37aee2" />
        <stop offset="1" stopColor="#1e96c8" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="120" fill="url(#tg-settings-bg)" />
    <path d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z" fill="#c8daea" />
    <path d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z" fill="#a9c9dd" />
    <path d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z" fill="#fff" />
  </svg>
);

// Kite Icon
const KiteIcon = ({ size = 16 }: { size?: number }) => (
  <Image src="/icons/kite-zerodha.webp" alt="Kite" width={size} height={size} />
);

// Telegram Connection Modal
function TelegramModal({ 
  isOpen, 
  onClose, 
  isConnected,
  theme 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  isConnected: boolean;
  theme: 'dark' | 'light';
}) {
  const [formData, setFormData] = useState({
    apiId: '',
    apiHash: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={clsx(
          "fixed inset-0 z-50 transition-opacity",
          theme === 'dark' ? 'bg-black/80' : 'bg-black/50'
        )}
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div 
          className={clsx(
            "max-h-[90vh] overflow-y-auto border-t",
            theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle */}
          <div className={clsx("sticky top-0 pt-3 pb-2 z-10", theme === 'dark' ? 'bg-dark-bg' : 'bg-white')}>
            <div className={clsx("w-10 h-1 mx-auto", theme === 'dark' ? 'bg-dark-border' : 'bg-gray-300')} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-3">
              <TelegramIcon size={28} />
              <div>
                <h2 className={clsx("text-base font-semibold", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {isConnected ? 'Reconnect Telegram' : 'Connect Telegram'}
                </h2>
                <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  MTProto API Connection
                </p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-4 pb-24 space-y-4">
            <div className={clsx(
              "p-3 text-xs border",
              theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-muted' : 'bg-gray-50 border-gray-200 text-gray-600'
            )}>
              Get your API credentials from{' '}
              <a 
                href="https://my.telegram.org/apps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-info underline"
              >
                my.telegram.org/apps
              </a>
            </div>

            <div>
              <label className={clsx("block text-[10px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                API ID
              </label>
              <input
                type="text"
                value={formData.apiId}
                onChange={(e) => setFormData({ ...formData, apiId: e.target.value })}
                placeholder="12345678"
                autoComplete="off"
                className={clsx(
                  "w-full px-3 py-2 text-sm transition-colors border outline-none",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                )}
              />
            </div>

            <div>
              <label className={clsx("block text-[10px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                API Hash
              </label>
              <input
                type="text"
                value={formData.apiHash}
                onChange={(e) => setFormData({ ...formData, apiHash: e.target.value })}
                placeholder="a1b2c3d4e5f6g7h8i9j0..."
                autoComplete="off"
                className={clsx(
                  "w-full px-3 py-2 text-sm transition-colors border outline-none font-mono",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                )}
              />
            </div>

            <div>
              <label className={clsx("block text-[10px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+91 98765 43210"
                autoComplete="off"
                className={clsx(
                  "w-full px-3 py-2 text-sm transition-colors border outline-none",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.apiId || !formData.apiHash || !formData.phoneNumber}
              className={clsx(
                'w-full py-2.5 text-sm font-semibold transition-all',
                !isSubmitting && formData.apiId && formData.apiHash && formData.phoneNumber
                  ? theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90 active:scale-[0.98]' : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
                  : theme === 'dark' ? 'bg-dark-card text-dark-muted cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className={clsx("h-4 w-4 border-2 border-t-transparent rounded-full animate-spin", theme === 'dark' ? 'border-dark-muted' : 'border-gray-400')} />
                  <span>Connecting...</span>
                </div>
              ) : (
                isConnected ? 'Reconnect' : 'Connect Telegram'
              )}
            </button>

            {isConnected && (
              <button
                type="button"
                className="w-full py-2 text-sm font-medium text-loss transition-colors hover:bg-loss/10"
              >
                Disconnect Telegram
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

// Broker Connection Modal
function BrokerModal({ 
  isOpen, 
  onClose, 
  isConnected,
  theme 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  isConnected: boolean;
  theme: 'dark' | 'light';
}) {
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    userId: '',
  });
  const [showSecret, setShowSecret] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={clsx(
          "fixed inset-0 z-50 transition-opacity",
          theme === 'dark' ? 'bg-black/80' : 'bg-black/50'
        )}
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div 
          className={clsx(
            "max-h-[90vh] overflow-y-auto border-t",
            theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle */}
          <div className={clsx("sticky top-0 pt-3 pb-2 z-10", theme === 'dark' ? 'bg-dark-bg' : 'bg-white')}>
            <div className={clsx("w-10 h-1 mx-auto", theme === 'dark' ? 'bg-dark-border' : 'bg-gray-300')} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-3">
              <div className={clsx(
                "h-8 w-8 flex items-center justify-center",
                theme === 'dark' ? 'bg-dark-border' : 'bg-gray-100'
              )}>
                <KiteIcon size={24} />
              </div>
              <div>
                <h2 className={clsx("text-base font-semibold", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {isConnected ? 'Reconnect Zerodha Kite' : 'Connect Zerodha Kite'}
                </h2>
                <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  Kite Connect API
                </p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-4 pb-24 space-y-4">
            <div className={clsx(
              "p-3 text-xs border",
              theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-muted' : 'bg-gray-50 border-gray-200 text-gray-600'
            )}>
              Get your API credentials from{' '}
              <a 
                href="https://kite.trade/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-info underline"
              >
                kite.trade
              </a>
            </div>

            <div>
              <label className={clsx("block text-[10px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                API Key
              </label>
              <input
                type="text"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="your_api_key"
                autoComplete="off"
                className={clsx(
                  "w-full px-3 py-2 text-sm transition-colors border outline-none font-mono",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                )}
              />
            </div>

            <div>
              <label className={clsx("block text-[10px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                API Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                  placeholder="••••••••••••••••"
                  autoComplete="off"
                  className={clsx(
                    "w-full px-3 py-2 pr-10 text-sm transition-colors border outline-none font-mono",
                    theme === 'dark' 
                      ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/50' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className={clsx(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1",
                    theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-900'
                  )}
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className={clsx("block text-[10px] uppercase tracking-wide mb-1.5", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                User ID
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                placeholder="AB1234"
                autoComplete="off"
                className={clsx(
                  "w-full px-3 py-2 text-sm transition-colors border outline-none font-mono uppercase",
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/50' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.apiKey || !formData.apiSecret || !formData.userId}
              className={clsx(
                'w-full py-2.5 text-sm font-semibold transition-all',
                !isSubmitting && formData.apiKey && formData.apiSecret && formData.userId
                  ? theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90 active:scale-[0.98]' : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
                  : theme === 'dark' ? 'bg-dark-card text-dark-muted cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className={clsx("h-4 w-4 border-2 border-t-transparent rounded-full animate-spin", theme === 'dark' ? 'border-dark-muted' : 'border-gray-400')} />
                  <span>Connecting...</span>
                </div>
              ) : (
                isConnected ? 'Reconnect' : 'Connect Broker'
              )}
            </button>

            {isConnected && (
              <button
                type="button"
                className="w-full py-2 text-sm font-medium text-loss transition-colors hover:bg-loss/10"
              >
                Disconnect Broker
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { 
    isAuthenticated, 
    user, 
    theme, 
    toggleTheme, 
    telegramProviders, 
    brokers,
    logout 
  } = useStore();

  const [telegramModalOpen, setTelegramModalOpen] = useState(false);
  const [brokerModalOpen, setBrokerModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  // Check if Telegram is connected (mock - based on having connected providers)
  const isTelegramConnected = telegramProviders.some(p => p.connected);
  const connectedBrokers = brokers.filter((b) => b.connected);
  const isBrokerConnected = connectedBrokers.length > 0;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* User Profile */}
        {user && (
          <div className={clsx(
            "p-4",
            theme === 'dark' ? 'premium-card' : 'bg-white border border-gray-100 shadow-sm'
          )}>
            <div className="flex items-center gap-3">
              <div className={clsx(
                "h-12 w-12 flex items-center justify-center text-lg font-bold",
                theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'
              )}>
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={clsx("text-sm font-semibold tracking-tight truncate", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {user.name}
                </h2>
                <p className={clsx("text-xs truncate", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                  {user.email}
                </p>
                <span className="inline-flex items-center mt-1.5 px-2 py-0.5 status-badge-running text-[10px] font-semibold uppercase tracking-wide">
                  {user.subscription.plan}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div>
          <h3 className={clsx(
            "text-[9px] font-semibold uppercase tracking-wider mb-2 px-1",
            theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'
          )}>
            Appearance
          </h3>
          <div className={clsx(
            theme === 'dark' ? 'premium-card' : 'bg-white border border-gray-100 shadow-sm'
          )}>
            <button
              onClick={toggleTheme}
              className={clsx(
                "w-full flex items-center justify-between p-3.5 transition-colors card-interactive",
                theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-9 h-9 flex items-center justify-center",
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                )}>
                  {theme === 'dark' ? (
                    <Moon size={18} className="text-white" />
                  ) : (
                    <Sun size={18} className="text-gray-900" />
                  )}
                </div>
                <div className="text-left">
                  <p className={clsx("text-sm font-semibold tracking-tight", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    Theme
                  </p>
                  <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </p>
                </div>
              </div>
              <div className={clsx(
                'relative w-11 h-6 transition-colors',
                theme === 'dark' ? 'bg-white' : 'bg-gray-900'
              )}>
                <div className={clsx(
                  'absolute top-0.5 h-5 w-5 transition-transform',
                  theme === 'dark' ? 'translate-x-5 bg-dark-bg' : 'translate-x-0.5 bg-white'
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Connections */}
        <div>
          <h3 className={clsx(
            "text-[9px] font-semibold uppercase tracking-wider mb-2 px-1",
            theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'
          )}>
            Connections
          </h3>
          <div className={clsx(
            "divide-y",
            theme === 'dark' 
              ? 'premium-card divide-white/5' 
              : 'bg-white border border-gray-100 shadow-sm divide-gray-100'
          )}>
            {/* Telegram Connection */}
            <button 
              onClick={() => setTelegramModalOpen(true)}
              className={clsx(
                "w-full flex items-center justify-between p-3.5 transition-colors card-interactive",
                theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <TelegramIcon size={36} />
                <div className="text-left">
                  <p className={clsx("text-sm font-semibold tracking-tight", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    Telegram
                  </p>
                  <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                    MTProto API
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isTelegramConnected ? (
                  <span className="flex items-center gap-1.5 px-2 py-1 status-badge-running text-[10px] font-semibold uppercase tracking-wide">
                    <span className="status-dot status-dot-live" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 status-badge-error text-[10px] font-semibold uppercase tracking-wide">
                    <AlertCircle size={10} />
                    Connect
                  </span>
                )}
                <ChevronRight size={16} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
              </div>
            </button>

            {/* Broker Connection */}
            <button 
              onClick={() => setBrokerModalOpen(true)}
              className={clsx(
                "w-full flex items-center justify-between p-3.5 transition-colors card-interactive",
                theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "h-9 w-9 flex items-center justify-center",
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                )}>
                  <KiteIcon size={28} />
                </div>
                <div className="text-left">
                  <p className={clsx("text-sm font-semibold tracking-tight", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    Zerodha Kite
                  </p>
                  <p className={clsx("text-[10px]", theme === 'dark' ? 'text-dark-muted' : 'text-gray-500')}>
                    Kite Connect API
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isBrokerConnected ? (
                  <span className="flex items-center gap-1.5 px-2 py-1 status-badge-running text-[10px] font-semibold uppercase tracking-wide">
                    <span className="status-dot status-dot-live" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 status-badge-error text-[10px] font-semibold uppercase tracking-wide">
                    <AlertCircle size={10} />
                    Connect
                  </span>
                )}
                <ChevronRight size={16} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
              </div>
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className={clsx(
            "text-[9px] font-semibold uppercase tracking-wider mb-2 px-1",
            theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'
          )}>
            Preferences
          </h3>
          <div className={clsx(
            "divide-y",
            theme === 'dark' 
              ? 'premium-card divide-white/5' 
              : 'bg-white border border-gray-100 shadow-sm divide-gray-100'
          )}>
            <button className={clsx(
              "w-full flex items-center justify-between p-3.5 transition-colors card-interactive",
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-9 h-9 flex items-center justify-center",
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                )}>
                  <Bell size={18} className={theme === 'dark' ? 'text-white' : 'text-gray-700'} />
                </div>
                <span className={clsx("text-sm font-semibold tracking-tight", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  Notifications
                </span>
              </div>
              <ChevronRight size={16} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
            </button>
            <button className={clsx(
              "w-full flex items-center justify-between p-3.5 transition-colors card-interactive",
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-9 h-9 flex items-center justify-center",
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                )}>
                  <Shield size={18} className={theme === 'dark' ? 'text-white' : 'text-gray-700'} />
                </div>
                <span className={clsx("text-sm font-semibold tracking-tight", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  Privacy & Security
                </span>
              </div>
              <ChevronRight size={16} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className={clsx(
            "text-[9px] font-semibold uppercase tracking-wider mb-2 px-1",
            theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'
          )}>
            Support
          </h3>
          <div className={clsx(
            theme === 'dark' ? 'premium-card' : 'bg-white border border-gray-100 shadow-sm'
          )}>
            <button className={clsx(
              "w-full flex items-center justify-between p-3.5 transition-colors card-interactive",
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-9 h-9 flex items-center justify-center",
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                )}>
                  <HelpCircle size={18} className={theme === 'dark' ? 'text-white' : 'text-gray-700'} />
                </div>
                <span className={clsx("text-sm font-semibold tracking-tight", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  Help Center
                </span>
              </div>
              <ExternalLink size={14} className={theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={clsx(
            "w-full flex items-center justify-center gap-2 p-3.5 text-loss font-semibold text-sm transition-all card-interactive",
            theme === 'dark' 
              ? 'premium-card hover:bg-loss/10' 
              : 'bg-white border border-gray-100 shadow-sm hover:bg-loss/5'
          )}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>

        {/* Version */}
        <p className={clsx(
          "text-center text-[10px] py-4 font-mono",
          theme === 'dark' ? 'text-dark-muted' : 'text-gray-400'
        )}>
          AutoTrade Pro v1.0.0
        </p>
      </div>

      {/* Modals */}
      <TelegramModal 
        isOpen={telegramModalOpen} 
        onClose={() => setTelegramModalOpen(false)} 
        isConnected={isTelegramConnected}
        theme={theme}
      />
      <BrokerModal 
        isOpen={brokerModalOpen} 
        onClose={() => setBrokerModalOpen(false)} 
        isConnected={isBrokerConnected}
        theme={theme}
      />
    </AppLayout>
  );
}
