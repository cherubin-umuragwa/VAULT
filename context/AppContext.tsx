'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/localStorage';

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  cycle: 'monthly' | 'yearly';
  category: string;
  score?: 'Essential' | 'Redundant' | 'Renegotiable' | 'Cut';
}

export interface Debt {
  id: string;
  name: string;
  total: number;
  interest: number;
  minimum: number;
}

export interface Budget {
  income: number;
  categories: { [key: string]: number };
}

interface AppState {
  user: { name: string; onboardingComplete: boolean };
  income: number;
  expenses: Expense[];
  goals: Goal[];
  subscriptions: Subscription[];
  debts: Debt[];
  budget: Budget;
  chatHistory: { role: 'user' | 'model'; text: string; timestamp: number }[];
  healthScore: number;
}

const defaultState: AppState = {
  user: { name: '', onboardingComplete: false },
  income: 0,
  expenses: [],
  goals: [],
  subscriptions: [],
  debts: [],
  budget: {
    income: 0,
    categories: {
      Housing: 0,
      Food: 0,
      Transport: 0,
      Entertainment: 0,
      Health: 0,
      Savings: 0,
      Other: 0,
    },
  },
  chatHistory: [],
  healthScore: 70,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: {
    setUser: (user: AppState['user']) => void;
    setIncome: (income: number) => void;
    setExpenses: (expenses: Expense[]) => void;
    setGoals: (goals: Goal[]) => void;
    setSubscriptions: (subs: Subscription[]) => void;
    setDebts: (debts: Debt[]) => void;
    setBudget: (budget: Budget) => void;
    addChatMessage: (msg: { role: 'user' | 'model'; text: string }) => void;
    clearChat: () => void;
    updateHealthScore: (score: number) => void;
    resetAll: () => void;
  };
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedState = loadFromStorage('vault_state', defaultState);
    setState(savedState);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToStorage('vault_state', state);
    }
  }, [state, isLoaded]);

  const dispatch = {
    setUser: (user: AppState['user']) => setState(prev => ({ ...prev, user })),
    setIncome: (income: number) => setState(prev => ({ ...prev, income })),
    setExpenses: (expenses: Expense[]) => setState(prev => ({ ...prev, expenses })),
    setGoals: (goals: Goal[]) => setState(prev => ({ ...prev, goals })),
    setSubscriptions: (subscriptions: Subscription[]) => setState(prev => ({ ...prev, subscriptions })),
    setDebts: (debts: Debt[]) => setState(prev => ({ ...prev, debts })),
    setBudget: (budget: Budget) => setState(prev => ({ ...prev, budget })),
    addChatMessage: (msg: { role: 'user' | 'model'; text: string }) => 
      setState(prev => ({ 
        ...prev, 
        chatHistory: [...prev.chatHistory, { ...msg, timestamp: Date.now() }] 
      })),
    clearChat: () => setState(prev => ({ ...prev, chatHistory: [] })),
    updateHealthScore: (healthScore: number) => setState(prev => ({ ...prev, healthScore })),
    resetAll: () => setState(defaultState),
  };

  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
