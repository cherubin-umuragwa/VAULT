'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp, Subscription } from '@/context/AppContext';
import SectionHeader from '@/components/ui/SectionHeader';
import { formatUGX } from '@/lib/formatUGX';
import { CreditCard, Trash2, ShieldAlert, Zap, TrendingUp, Filter, Plus, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function SubscriptionsPage() {
  const { state, dispatch } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newSub, setNewSub] = useState<Partial<Subscription>>({ name: '', cost: 0, cycle: 'monthly', category: 'Entertainment' });
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAddSub = () => {
    if (!newSub.name || !newSub.cost) return;
    const sub: Subscription = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSub.name!,
      cost: Number(newSub.cost),
      cycle: newSub.cycle || 'monthly',
      category: newSub.category || 'Other'
    };
    dispatch.setSubscriptions([...state.subscriptions, sub]);
    setIsAdding(false);
    setNewSub({ name: '', cost: 0, cycle: 'monthly', category: 'Entertainment' });
  };

  const deleteSub = (id: string) => {
    dispatch.setSubscriptions(state.subscriptions.filter(s => s.id !== id));
  };

  const runAudit = () => {
    setIsAuditing(true);
    // Simulate AI thinking
    setTimeout(() => {
      const auditedSubs = state.subscriptions.map(s => {
        const scores: Subscription['score'][] = ['Essential', 'Redundant', 'Renegotiable', 'Cut'];
        return { ...s, score: scores[Math.floor(Math.random() * scores.length)] };
      });
      dispatch.setSubscriptions(auditedSubs);
      setIsAuditing(false);
    }, 2000);
  };

  const totalMonthly = state.subscriptions.reduce((acc, s) => acc + (s.cycle === 'monthly' ? s.cost : s.cost / 12), 0);
  const totalYearly = totalMonthly * 12;

  return (
    <AppShell>
      <SectionHeader 
        title="Subscription Audit" 
        subtitle="Uncover money leaks. VAULT identifies redundant recurring UGX charges."
        action={
          <div className="flex gap-3">
             <button 
              onClick={runAudit}
              disabled={isAuditing || state.subscriptions.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-secondary/20"
            >
              {isAuditing ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : <Zap size={18} />}
              Run AI Audit
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-all"
            >
              <Plus size={18} />
              Add Tracker
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Summary Side */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-3xl bg-surface border border-border">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Monthly Burn Rate</p>
              <h3 className="text-3xl font-display font-bold text-text mb-4">{formatUGX(totalMonthly)}</h3>
              <div className="p-3 bg-danger/10 rounded-2xl flex items-center gap-3">
                 <ShieldAlert size={18} className="text-danger" />
                 <p className="text-[10px] text-danger font-bold uppercase tracking-wider">Yearly Impact: {formatUGX(totalYearly)}</p>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/20">
              <h4 className="text-sm font-bold text-secondary flex items-center gap-2 mb-4">
                 <TrendingUp size={16} />
                 Savings Potential
              </h4>
              <p className="text-xs text-text-muted leading-relaxed mb-4">
                Cutting <span className="text-text font-bold">2 "Redundant"</span> subscriptions would free up <span className="text-secondary font-bold">UGX 65,000</span> monthly for your House Fund.
              </p>
              <button className="w-full py-2 bg-secondary/20 text-secondary rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/30 transition-all">
                Implement Recommendations
              </button>
           </div>
        </div>

        {/* List Side */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 rounded-2xl bg-surface-2 border border-primary/30 flex flex-wrap gap-4 overflow-hidden"
              >
                <input 
                  type="text" 
                  placeholder="Service Name" 
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none w-full md:w-auto flex-1 h-12"
                  value={newSub.name}
                  onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="Cost (UGX)" 
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none w-full md:w-auto h-12"
                  value={newSub.cost || ''}
                  onChange={(e) => setNewSub({...newSub, cost: Number(e.target.value)})}
                />
                <select 
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none h-12"
                  onChange={(e) => setNewSub({...newSub, cycle: e.target.value as any})}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="flex gap-2 w-full md:w-auto">
                   <button onClick={handleAddSub} className="px-6 h-12 bg-primary text-background font-bold rounded-xl flex-1">Save</button>
                   <button onClick={() => setIsAdding(false)} className="px-6 h-12 bg-surface text-text-muted rounded-xl">Cancel</button>
                </div>
              </motion.div>
            )}

            {state.subscriptions.map((sub) => (
              <motion.div
                layout
                key={sub.id}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-text-muted/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                   <div className={cn(
                     "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                     sub.score === 'Essential' ? "bg-primary/10" : 
                     sub.score === 'Redundant' ? "bg-warning/10" : "bg-surface-2"
                   )}>
                     <CreditCard className={cn(
                       sub.score === 'Essential' ? "text-primary" : 
                       sub.score === 'Redundant' ? "text-warning" : "text-text-muted"
                     )} size={20} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-0.5">
                         <h4 className="font-bold text-text">{sub.name}</h4>
                         {sub.score && (
                           <span className={cn(
                             "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                             sub.score === 'Essential' ? "bg-primary/10 text-primary" :
                             sub.score === 'Cut' ? "bg-danger/10 text-danger" :
                             sub.score === 'Redundant' ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
                           )}>
                             {sub.score}
                           </span>
                         )}
                      </div>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        {sub.cycle} • {sub.category}
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="text-right">
                      <p className="text-sm font-bold text-text">{formatUGX(sub.cost)}</p>
                      <p className="text-[10px] text-text-muted">Yearly: {formatUGX(sub.cycle === 'monthly' ? sub.cost * 12 : sub.cost)}</p>
                   </div>
                   <button onClick={() => deleteSub(sub.id)} className="p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all">
                      <Trash2 size={18} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {state.subscriptions.length === 0 && !isAdding && (
             <div className="py-20 flex flex-col items-center justify-center text-center opacity-50 bg-surface/30 rounded-3xl border border-dashed border-border">
                <Filter size={40} className="mb-4" />
                <p className="text-sm font-bold">No subscriptions tracked yet</p>
                <p className="text-xs">VAULT can only audit what it can see.</p>
             </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
