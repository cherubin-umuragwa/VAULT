'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Target, 
  Receipt, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Wallet
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: Receipt, label: 'Expenses', href: '/expenses' },
  { icon: CreditCard, label: 'Debts', href: '/debts' },
  { icon: MessageSquare, label: 'AI Coach', href: '/coach' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useApp();

  return (
    <aside className="w-64 border-r border-border h-screen flex flex-col bg-surface sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Wallet className="text-primary-foreground w-6 h-6" />
        </div>
        <span className="text-2xl font-display font-bold tracking-tight">VAULT</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all group",
                isActive && "nav-active-border text-foreground text-primary font-medium"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive && "text-primary")} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={() => signOut(auth)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
}
