'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Mail, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

type LoginMethod = 'email' | 'phone';

export function LoginScreen() {
  const router = useRouter();
  const login = useStore((state) => state.login);
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
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <Zap size={28} className="text-dark-bg" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              AutoTrade
            </span>
          </div>
          <p className="text-dark-muted text-sm max-w-xs">
            Automated trading signal execution. Connect, configure, trade.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method Toggle */}
          <div className="flex gap-2 p-1 bg-dark-card rounded-lg">
            <button
              type="button"
              onClick={() => { 
                setMethod('email'); 
                if (inputRef.current) inputRef.current.value = '';
              }}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors',
                method === 'email'
                  ? 'bg-white text-dark-bg'
                  : 'text-dark-muted hover:text-white'
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
                  ? 'bg-white text-dark-bg'
                  : 'text-dark-muted hover:text-white'
              )}
            >
              <Phone size={16} />
              Phone
            </button>
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-dark-muted mb-2">
              {method === 'email' ? 'Email address' : 'Phone number'}
            </label>
            <input
              ref={inputRef}
              type={method === 'email' ? 'email' : 'tel'}
              name="credential"
              placeholder={method === 'email' ? 'trader@example.com' : '+91 98765 43210'}
              className="w-full px-4 py-3.5 bg-dark-card border border-dark-border rounded-lg text-white placeholder-dark-muted/50 focus:border-white/30 transition-colors"
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
                ? 'bg-white text-dark-bg hover:bg-white/90 active:scale-[0.98]'
                : 'bg-dark-card text-dark-muted cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-dark-muted border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <p className="mt-8 text-center text-xs text-dark-muted">
          Demo mode: Enter any valid {method} to continue
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-dark-border">
        <p className="text-center text-xs text-dark-muted">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
