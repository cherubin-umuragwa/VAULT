'use client';

import React from 'react';
import { Bell, Search, User, Flag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const routeNames: { [key: string]: string } = {
  '/dashboard': 'Financial Overview',
  '/coach': 'VAULT AI Coach',
  '/goals': 'Saving Goals',
  '/budget': 'Budget & Spending',
  '/subscriptions': 'Subscription Audit',
  '/debt': 'Debt Payoff Plan',
  '/simulator': 'Scenario Simulator',
  '/report': 'Wealth Intelligence',
  '/crisis': 'Crisis Management',
};

export default function Topbar() {
  const pathname = usePathname();
  const { state } = useApp();
  const pageTitle = routeNames[pathname] || 'VAULT';

  return (
    <header className="h-20 bg-background/50 backdrop-blur-xl border-b border-border sticky top-0 z-40 flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl clash-style text-text">{pageTitle}</h1>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Control Panel • {state.user.name || 'Investor'}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-full border border-border">
          <div className="w-5 h-3 bg-red-600 relative overflow-hidden rounded-sm">
             <div className="absolute top-1/3 left-0 w-full h-1/3 bg-black"></div>
             <div className="absolute bottom-0 left-0 w-full h-1/3 bg-yellow-400"></div>
          </div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">UGX</span>
        </div>

        <button className="p-2 text-text-muted hover:text-text hover:bg-surface-2 rounded-xl transition-all">
          <Search size={20} />
        </button>

        <button className="p-2 text-text-muted hover:text-text hover:bg-surface-2 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
        </button>

        <div className="h-8 w-[1px] bg-border mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center p-1">
             <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-secondary opacity-80"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
