'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import SectionHeader from '@/components/ui/SectionHeader';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatUGX } from '@/lib/formatUGX';
import { Wallet, TrendingUp, PieChart, Info, Plus, ChevronRight, Zap, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function BudgetPage() {
  const { state, dispatch } = useApp();
  const [incomeInput, setIncomeInput] = useState(state.income.toString());

  const handleUpdateIncome = () => {
    const amount = Number(incomeInput);
    dispatch.setIncome(amount);
  };

  const categories = Object.keys(state.budget.categories);
  const totalSpent = state.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetSafetyPercent = state.income > 0 ? (totalSpent / state.income) * 100 : 0;

  return (
    <AppShell>
      <SectionHeader 
        title="Budget & Spending" 
        subtitle="Master your cash flow. VAULT analyzes your UGX movement against your income."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income & Overview */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-6 rounded-3xl bg-primary border border-primary/20 text-background">
             <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-background/20 rounded-xl">
                   <Wallet size={24} />
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-background/20 rounded">Monthly Income</button>
             </div>
             <div className="mb-6">
                <p className="text-sm font-medium opacity-80 mb-1">Set your monthly income</p>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-display font-bold">UGX</span>
                   <input 
                     type="number" 
                     value={incomeInput}
                     onChange={(e) => setIncomeInput(e.target.value)}
                     onBlur={handleUpdateIncome}
                     className="bg-transparent border-b-2 border-background/30 text-3xl font-display font-bold outline-none focus:border-background w-full"
                   />
                </div>
             </div>
             <div className="p-4 bg-background/10 rounded-2xl flex items-center gap-3">
                <Target size={20} />
                <div>
                   <p className="text-xs font-bold leading-tight">Saving Target: 20%</p>
                   <p className="text-[10px] opacity-70">UGX {formatUGX(state.income * 0.2)} / month</p>
                </div>
             </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-border">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-secondary" />
                Budget Health
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Income Used</span>
                      <span className={cn("font-bold", budgetSafetyPercent > 90 ? "text-danger" : "text-primary")}>
                        {budgetSafetyPercent.toFixed(1)}%
                      </span>
                   </div>
                   <ProgressBar progress={budgetSafetyPercent} color={budgetSafetyPercent > 80 ? 'danger' : 'primary'} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="p-3 rounded-2xl bg-surface-2 border border-border">
                      <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Spent</p>
                      <p className="text-sm font-bold">{formatUGX(totalSpent)}</p>
                   </div>
                   <div className="p-3 rounded-2xl bg-surface-2 border border-border">
                      <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Balance</p>
                      <p className="text-sm font-bold text-primary">{formatUGX(state.income - totalSpent)}</p>
                   </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-3">
                   <Zap size={18} className="text-secondary flex-shrink-0" />
                   <p className="text-xs text-text-muted leading-relaxed">
                     <span className="text-secondary font-bold">VAULT Insight:</span> You have UGX 150,000 unallocated. Move this to your <strong>House Fund</strong> to reach your goal 2 weeks earlier.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-surface border border-border">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <PieChart size={24} className="text-primary" />
                Monthly Allocations
              </h3>
              <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                Generate AI Plan <Plus size={16} />
              </button>
           </div>

           <div className="space-y-8">
              {categories.map((cat, i) => {
                const limit = state.budget.categories[cat] || 0;
                const spent = state.expenses.filter(e => e.category === cat).reduce((a, b) => a + b.amount, 0);
                const percent = limit > 0 ? (spent / limit) * 100 : 0;
                
                return (
                  <div key={cat} className="group">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-lg">
                             {cat === 'Housing' ? '🏠' : cat === 'Food' ? '🍔' : cat === 'Transport' ? '🚕' : cat === 'Entertainment' ? '🎬' : '📦'}
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">{cat}</h4>
                             <p className="text-[10px] text-text-muted uppercase tracking-wider">Remaining: {formatUGX(Math.max(0, limit - spent))}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="flex items-center gap-2 justify-end mb-1">
                             <span className="text-[10px] text-text-muted font-bold">Limit: {formatUGX(limit)}</span>
                             <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all cursor-pointer" />
                          </div>
                          <span className={cn("text-xs font-bold", percent > 100 ? "text-danger" : "text-text")}>
                            {formatUGX(spent)}
                          </span>
                       </div>
                    </div>
                    <ProgressBar progress={percent} color={percent > 100 ? 'danger' : percent > 80 ? 'warning' : 'info'} size="sm" />
                  </div>
                );
              })}
           </div>

           <button className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-border text-text-muted font-bold hover:border-primary hover:text-primary transition-all">
              + Add Custom Category
           </button>
        </div>
      </div>
    </AppShell>
  );
}
