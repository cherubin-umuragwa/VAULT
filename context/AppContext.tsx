'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  savingsMethod?: string;
  dailyIncome?: number;
  updatedAt?: string;
}

interface AppState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('vault-theme') as 'dark' | 'light';
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          // Initialize profile
          const initialProfile: UserProfile = {
            userId: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            updatedAt: new Date().toISOString(),
          };
          setDoc(userRef, initialProfile);
        }
        setLoading(false);
      }, (err) => {
        console.error('Firestore Error:', err);
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('vault-theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  };

  return (
    <AppContext.Provider value={{ user, profile, loading, theme, setTheme, updateProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
