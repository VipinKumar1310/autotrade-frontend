'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page now redirects to dashboard since notifications are shown in the top bar sheet
export default function NotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
