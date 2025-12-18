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
          <div className={clsx(
            "rounded-lg p-4 border",
            theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
          )}>
            <div className="flex items-center gap-4">
              <div className={clsx(
                "h-14 w-14 rounded-full flex items-center justify-center text-xl font-semibold",
                theme === 'dark' ? 'bg-dark-border text-white' : 'bg-light-border text-light-text'
              )}>
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={clsx("text-lg font-semibold truncate", theme === 'dark' ? 'text-white' : 'text-light-text')}>
                  {user.name}
                </h2>
                <p className={clsx("text-sm truncate", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>{user.email}</p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-profit/20 text-profit text-xs font-medium rounded">
                  {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div>
          <h3 className={clsx("text-xs font-medium uppercase tracking-wider mb-2 px-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
            Appearance
          </h3>
          <div className={clsx(
            "rounded-lg overflow-hidden border",
            theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
          )}>
            <button
              onClick={toggleTheme}
              className={clsx(
                "w-full flex items-center justify-between p-4 transition-colors",
                theme === 'dark' ? 'hover:bg-dark-border/30' : 'hover:bg-light-border/30'
              )}
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={20} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
                ) : (
                  <Sun size={20} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
                )}
                <div className="text-left">
                  <p className={clsx("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-light-text')}>Theme</p>
                  <p className={clsx("text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </p>
                </div>
              </div>
              <div className={clsx(
                'relative w-11 h-6 rounded-full transition-colors',
                theme === 'dark' ? 'bg-white' : 'bg-light-text'
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
          <h3 className={clsx("text-xs font-medium uppercase tracking-wider mb-2 px-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
            Connections
          </h3>
          <div className={clsx(
            "rounded-lg overflow-hidden divide-y border",
            theme === 'dark' ? 'bg-dark-card border-dark-border divide-dark-border' : 'bg-light-card border-light-border divide-light-border'
          )}>
            {/* Telegram */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#0088cc]/20 flex items-center justify-center">
                  <MessageCircle size={20} className="text-[#0088cc]" />
                </div>
                <div>
                  <p className={clsx("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-light-text')}>Telegram Channels</p>
                  <p className={clsx("text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                    {connectedProviders.length} connected
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
            </div>

            {/* Connected Providers */}
            {connectedProviders.length > 0 && (
              <div className={clsx("px-4 py-3", theme === 'dark' ? 'bg-dark-bg/50' : 'bg-light-bg/50')}>
                <div className="space-y-2">
                  {connectedProviders.map((provider) => (
                    <div 
                      key={provider.id}
                      className={clsx("flex items-center gap-2 text-sm", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}
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
                <div className={clsx("h-10 w-10 rounded-lg flex items-center justify-center", theme === 'dark' ? 'bg-dark-border' : 'bg-light-border')}>
                  <Link2 size={20} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
                </div>
                <div>
                  <p className={clsx("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-light-text')}>Broker</p>
                  <p className={clsx("text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
                    {connectedBrokers.length > 0 ? connectedBrokers[0].name : 'Not connected'}
                  </p>
                </div>
              </div>
              {connectedBrokers.length > 0 ? (
                <span className="px-2 py-1 bg-profit/20 text-profit text-xs font-medium rounded">
                  Active
                </span>
              ) : (
                <ChevronRight size={18} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className={clsx("text-xs font-medium uppercase tracking-wider mb-2 px-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
            Preferences
          </h3>
          <div className={clsx(
            "rounded-lg overflow-hidden divide-y border",
            theme === 'dark' ? 'bg-dark-card border-dark-border divide-dark-border' : 'bg-light-card border-light-border divide-light-border'
          )}>
            <button className={clsx(
              "w-full flex items-center justify-between p-4 transition-colors",
              theme === 'dark' ? 'hover:bg-dark-border/30' : 'hover:bg-light-border/30'
            )}>
              <div className="flex items-center gap-3">
                <Bell size={20} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
                <span className={clsx("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-light-text')}>Notifications</span>
              </div>
              <ChevronRight size={18} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
            </button>
            <button className={clsx(
              "w-full flex items-center justify-between p-4 transition-colors",
              theme === 'dark' ? 'hover:bg-dark-border/30' : 'hover:bg-light-border/30'
            )}>
              <div className="flex items-center gap-3">
                <Shield size={20} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
                <span className={clsx("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-light-text')}>Privacy & Security</span>
              </div>
              <ChevronRight size={18} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className={clsx("text-xs font-medium uppercase tracking-wider mb-2 px-1", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
            Support
          </h3>
          <div className={clsx(
            "rounded-lg overflow-hidden divide-y border",
            theme === 'dark' ? 'bg-dark-card border-dark-border divide-dark-border' : 'bg-light-card border-light-border divide-light-border'
          )}>
            <button className={clsx(
              "w-full flex items-center justify-between p-4 transition-colors",
              theme === 'dark' ? 'hover:bg-dark-border/30' : 'hover:bg-light-border/30'
            )}>
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
                <span className={clsx("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-light-text')}>Help Center</span>
              </div>
              <ExternalLink size={16} className={theme === 'dark' ? 'text-dark-muted' : 'text-light-muted'} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={clsx(
            "w-full flex items-center justify-center gap-2 p-4 rounded-lg text-loss transition-colors border",
            theme === 'dark' ? 'bg-dark-card border-dark-border hover:bg-loss/10' : 'bg-light-card border-light-border hover:bg-loss/10'
          )}
        >
          <LogOut size={18} />
          <span className="font-medium">Log Out</span>
        </button>

        {/* Version */}
        <p className={clsx("text-center text-xs py-4", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
          AutoTrade Pro v1.0.0
        </p>
      </div>
    </AppLayout>
  );
}
