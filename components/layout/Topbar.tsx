'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Search } from 'lucide-react';
import Image from 'next/image';

export function Topbar({ title }: { title: string }) {
  const { profile } = useApp();

  return (
    <header className="h-20 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight lowercase">{title}</h2>
        <p className="text-sm text-muted-foreground">Welcome back, {profile?.displayName?.split(' ')[0] || 'Saver'}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 bg-surface border border-border rounded-full text-sm focus:outline-none focus:border-primary transition-colors w-64"
          />
        </div>
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{profile?.displayName || 'User'}</p>
            <p className="text-xs text-muted-foreground leading-none mt-1">Free Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-border overflow-hidden bg-surface relative">
            {profile?.photoURL ? (
              <Image 
                src={profile.photoURL} 
                alt="Avatar" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                {profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
