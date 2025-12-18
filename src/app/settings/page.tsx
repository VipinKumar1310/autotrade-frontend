'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  MessageCircle, 
  Link2, 
  LogOut, 
  ChevronRight,
  User,
  Shield,
  Bell,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import clsx from 'clsx';

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const connectedProviders = telegramProviders.filter((p) => p.connected);
  const connectedBrokers = brokers.filter((b) => b.connected);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AppLayout>
      <PageHeader title="Settings" />

      <div className="p-4 space-y-6">
        {/* User Profile */}
        {user && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-dark-border flex items-center justify-center text-xl font-semibold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white truncate">
                  {user.name}
                </h2>
                <p className="text-sm text-dark-muted truncate">{user.email}</p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-profit/20 text-profit text-xs font-medium rounded">
                  {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div>
          <h3 className="text-xs font-medium text-dark-muted uppercase tracking-wider mb-2 px-1">
            Appearance
          </h3>
          <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 hover:bg-dark-border/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={20} className="text-dark-muted" />
                ) : (
                  <Sun size={20} className="text-dark-muted" />
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Theme</p>
                  <p className="text-xs text-dark-muted">
                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </p>
                </div>
              </div>
              <div className={clsx(
                'relative w-11 h-6 rounded-full transition-colors',
                theme === 'dark' ? 'bg-white' : 'bg-dark-border'
              )}>
                <div className={clsx(
                  'absolute top-1 h-4 w-4 rounded-full transition-transform',
                  theme === 'dark' ? 'translate-x-6 bg-dark-bg' : 'translate-x-1 bg-white'
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Connections */}
        <div>
          <h3 className="text-xs font-medium text-dark-muted uppercase tracking-wider mb-2 px-1">
            Connections
          </h3>
          <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden divide-y divide-dark-border">
            {/* Telegram */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#0088cc]/20 flex items-center justify-center">
                  <MessageCircle size={20} className="text-[#0088cc]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Telegram Channels</p>
                  <p className="text-xs text-dark-muted">
                    {connectedProviders.length} connected
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-dark-muted" />
            </div>

            {/* Connected Providers */}
            {connectedProviders.length > 0 && (
              <div className="px-4 py-3 bg-dark-bg/50">
                <div className="space-y-2">
                  {connectedProviders.map((provider) => (
                    <div 
                      key={provider.id}
                      className="flex items-center gap-2 text-sm text-dark-muted"
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: provider.avatar_color }}
                      />
                      <span className="truncate">{provider.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Broker */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-dark-border flex items-center justify-center">
                  <Link2 size={20} className="text-dark-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Broker</p>
                  <p className="text-xs text-dark-muted">
                    {connectedBrokers.length > 0 ? connectedBrokers[0].name : 'Not connected'}
                  </p>
                </div>
              </div>
              {connectedBrokers.length > 0 ? (
                <span className="px-2 py-1 bg-profit/20 text-profit text-xs font-medium rounded">
                  Active
                </span>
              ) : (
                <ChevronRight size={18} className="text-dark-muted" />
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-xs font-medium text-dark-muted uppercase tracking-wider mb-2 px-1">
            Preferences
          </h3>
          <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden divide-y divide-dark-border">
            <button className="w-full flex items-center justify-between p-4 hover:bg-dark-border/30 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-dark-muted" />
                <span className="text-sm font-medium text-white">Notifications</span>
              </div>
              <ChevronRight size={18} className="text-dark-muted" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-dark-border/30 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-dark-muted" />
                <span className="text-sm font-medium text-white">Privacy & Security</span>
              </div>
              <ChevronRight size={18} className="text-dark-muted" />
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xs font-medium text-dark-muted uppercase tracking-wider mb-2 px-1">
            Support
          </h3>
          <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden divide-y divide-dark-border">
            <button className="w-full flex items-center justify-between p-4 hover:bg-dark-border/30 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-dark-muted" />
                <span className="text-sm font-medium text-white">Help Center</span>
              </div>
              <ExternalLink size={16} className="text-dark-muted" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-dark-card border border-dark-border rounded-lg text-loss hover:bg-loss/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Log Out</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-dark-muted py-4">
          AutoTrade Pro v1.0.0
        </p>
      </div>
    </AppLayout>
  );
}

