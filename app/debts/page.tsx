'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { formatUGX } from '@/lib/utils';
import { 
  Plus, 
  Trash2, 
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  dueDate: string;
}

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Boda Loan', amount: 850000, interestRate: 15, dueDate: '2024-12-25' },
    { id: '2', name: 'Market Stall Rent', amount: 350000, interestRate: 0, dueDate: '2024-12-01' },
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Topbar title="Debt Tracker" />
        
        <main className="p-8 space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest leading-loose">total money owed</p>
              <h3 className="text-4xl font-display font-bold text-red-500 lowercase">
                {formatUGX(debts.reduce((sum, d) => sum + d.amount, 0))}
              </h3>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              <span>Add Debt Item</span>
            </button>
          </header>

          <div className="grid gap-6">
            {debts.map((debt) => (
              <div 
                key={debt.id}
                className="bg-surface border border-border rounded-3xl p-6 flex flex-wrap items-center justify-between gap-6 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-display tracking-tight">{debt.name}</h4>
                    <p className="text-sm text-muted-foreground">Due: {debt.dueDate} • {debt.interestRate}% interest</p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Amount</p>
                    <p className="text-2xl font-bold font-display">{formatUGX(debt.amount)}</p>
                  </div>
                  <button className="p-3 bg-background border border-border rounded-xl text-muted-foreground hover:text-red-500 hover:border-red-500 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-3xl p-8 max-w-2xl">
            <h4 className="text-xl font-bold font-display text-accent mb-4">Moneylender Warning</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bambi, be careful with &quot;Quick Loans&quot; from moneylenders. At 15% interest per month, a UGX 1,000,000 loan will cost you UGX 1,150,000 in just 30 days! That&apos;s UGX 150,000 you could have saved for your goals. Always try SACCOs or MoMo loans first.
            </p>
          </div>
        </main>
      </div>

      {/* Add Debt Modal - Large container as requested */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-border rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-surface2">
                <h3 className="text-2xl font-display font-bold tracking-tight lowercase">Add New Debt Item</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-background rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                {/* Large Input Containers as requested */}
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground uppercase tracking-widest px-2">What is the debt for?</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="e.g. Boda Boda Loan, Rent Arrears"
                      className="w-full text-2xl font-bold bg-background border border-border rounded-2xl p-6 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                    />
                    <TrendingUp className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm text-muted-foreground uppercase tracking-widest px-2">How much is it? (UGX)</label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full text-2xl font-bold bg-background border border-border rounded-2xl p-6 outline-none focus:border-primary transition-all"
                      />
                      <DollarSign className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-muted-foreground uppercase tracking-widest px-2">Due Date</label>
                    <div className="relative group">
                      <input 
                        type="date" 
                        className="w-full text-2xl font-bold bg-background border border-border rounded-2xl p-6 outline-none focus:border-primary transition-all"
                      />
                      <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-6 bg-primary text-primary-foreground rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    save debt item
                  </button>
                  <p className="text-center text-muted-foreground text-sm mt-4">
                    Saver will calculate the interest for you automatically.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
