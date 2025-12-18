'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme class to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
    }
  }, [theme, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {children}
      </div>
    );
  }

  return (
    <div className={theme}>
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-dark-bg text-dark-text' 
          : 'bg-light-bg text-light-text'
      }`}>
        {children}
      </div>
    </div>
  );
}

