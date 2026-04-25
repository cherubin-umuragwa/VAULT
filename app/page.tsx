'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { state } = useApp();
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-xl animate-bounce flex items-center justify-center">
          <span className="text-background font-bold text-2xl">V</span>
        </div>
        <p className="text-text-muted animate-pulse">Initializing VAULT Intelligence...</p>
      </div>
    </div>
  );
}
