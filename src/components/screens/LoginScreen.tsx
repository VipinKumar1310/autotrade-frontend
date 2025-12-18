'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Mail, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

type LoginMethod = 'email' | 'phone';

export function LoginScreen() {
  const router = useRouter();
  const { login, theme } = useStore();
  const [method, setMethod] = useState<LoginMethod>('email');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value || '';
    
    // Validate
    const isValid = method === 'email' 
      ? value.includes('@') 
      : value.length >= 10;
    
    if (!isValid || !value.trim()) return;

    setIsLoading(true);
    
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    login(method === 'email' ? value : `user@autotrade.io`);
    router.push('/dashboard');
  };

  return (
    <div className={clsx("min-h-screen flex flex-col", theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg')}>
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              theme === 'dark' ? 'bg-white' : 'bg-light-text'
            )}>
              <Zap size={28} className={theme === 'dark' ? 'text-dark-bg' : 'text-white'} />
            </div>
            <span className={clsx("text-2xl font-bold tracking-tight", theme === 'dark' ? 'text-white' : 'text-light-text')}>
              AutoTrade
            </span>
          </div>
          <p className={clsx("text-sm max-w-xs", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
            Automated trading signal execution. Connect, configure, trade.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method Toggle */}
          <div className={clsx("flex gap-2 p-1 rounded-lg", theme === 'dark' ? 'bg-dark-card' : 'bg-light-card')}>
            <button
              type="button"
              onClick={() => { 
                setMethod('email'); 
                if (inputRef.current) inputRef.current.value = '';
              }}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors',
                method === 'email'
                  ? theme === 'dark' ? 'bg-white text-dark-bg' : 'bg-light-text text-white'
                  : theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-light-muted hover:text-light-text'
              )}
            >
              <Mail size={16} />
              Email
            </button>
            <button
              type="button"
              onClick={() => { 
                setMethod('phone'); 
                if (inputRef.current) inputRef.current.value = '';
              }}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors',
                method === 'phone'
                  ? theme === 'dark' ? 'bg-white text-dark-bg' : 'bg-light-text text-white'
                  : theme === 'dark' ? 'text-dark-muted hover:text-white' : 'text-light-muted hover:text-light-text'
              )}
            >
              <Phone size={16} />
              Phone
            </button>
          </div>

          {/* Input */}
          <div>
            <label className={clsx("block text-sm font-medium mb-2", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
              {method === 'email' ? 'Email address' : 'Phone number'}
            </label>
            <input
              ref={inputRef}
              type={method === 'email' ? 'email' : 'tel'}
              name="credential"
              placeholder={method === 'email' ? 'trader@example.com' : '+91 98765 43210'}
              className={clsx(
                "w-full px-4 py-3.5 rounded-lg transition-colors border",
                theme === 'dark' 
                  ? 'bg-dark-card border-dark-border text-white placeholder-dark-muted/50 focus:border-white/30' 
                  : 'bg-light-card border-light-border text-light-text placeholder-light-muted/50 focus:border-light-text/30'
              )}
              autoComplete={method === 'email' ? 'email' : 'tel'}
              autoFocus
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-base font-semibold transition-all',
              !isLoading
                ? theme === 'dark' ? 'bg-white text-dark-bg hover:bg-white/90 active:scale-[0.98]' : 'bg-light-text text-white hover:bg-light-text/90 active:scale-[0.98]'
                : theme === 'dark' ? 'bg-dark-card text-dark-muted cursor-not-allowed' : 'bg-light-card text-light-muted cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className={clsx("h-5 w-5 border-2 border-t-transparent rounded-full animate-spin", theme === 'dark' ? 'border-dark-muted' : 'border-light-muted')} />
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <p className={clsx("mt-8 text-center text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
          Demo mode: Enter any valid {method} to continue
        </p>
      </div>

      {/* Footer */}
      <div className={clsx("px-6 py-6 border-t", theme === 'dark' ? 'border-dark-border' : 'border-light-border')}>
        <p className={clsx("text-center text-xs", theme === 'dark' ? 'text-dark-muted' : 'text-light-muted')}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
