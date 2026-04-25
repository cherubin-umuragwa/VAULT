'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp, Debt } from '@/context/AppContext';
import SectionHeader from '@/components/ui/SectionHeader';
import { formatUGX } from '@/lib/formatUGX';
import { TrendingDown, Plus, Trash2, Zap, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export default function DebtPage() {
  const { state, dispatch } = useApp();
  const [strategy, setStrategy] = useState<'Avalanche' | 'Snowball'>('Avalanche');
  const [isAdding, setIsAdding] = useState(false);
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({ name: '', total: 0, interest: 0, minimum: 0 });

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.total) return;
    const debt: Debt = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDebt.name!,
      total: Number(newDebt.total),
      interest: Number(newDebt.interest),
      minimum: Number(newDebt.minimum)
    };
    dispatch.setDebts([...state.debts, debt]);
    setIsAdding(false);
    setNewDebt({ name: '', total: 0, interest: 0, minimum: 0 });
  };

  const deleteDebt = (id: string) => {
    dispatch.setDebts(state.debts.filter(d => d.id !== id));
  };

  const totalDebt = state.debts.reduce((acc, d) => acc + d.total, 0);
  const debtToIncome = state.income > 0 ? (totalDebt / (state.income * 12)) * 100 : 0;
  const isDangerZone = debtToIncome > 40;

  const chartData = state.debts.map(d => ({ name: d.name, amount: d.total }));

  return (
    <AppShell>
      <SectionHeader 
        title="Debt Payoff Planner" 
        subtitle="Eradicate high-interest debt. Compare strategies and visualize your countdown to freedom."
        action={
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Add Debt Item
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Overview & Strategy */}
        <div className="lg:col-span-1 space-y-8">
           <div className={cn(
             "p-6 rounded-3xl border flex flex-col gap-4",
             isDangerZone ? "bg-danger/10 border-danger/30" : "bg-surface border-border"
           )}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Liability</p>
                {isDangerZone && <AlertCircle className="text-danger" size={20} />}
              </div>
              <h3 className={cn("text-4xl font-display font-bold", isDangerZone ? "text-danger" : "text-text")}>
                {formatUGX(totalDebt)}
              </h3>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Debt-to-Income Ratio</span>
                    <span className={cn("font-bold", isDangerZone ? "text-danger" : "text-primary")}>{debtToIncome.toFixed(1)}%</span>
                 </div>
                 <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", isDangerZone ? "bg-danger" : "bg-primary")} style={{ width: `${Math.min(100, debtToIncome)}%` }}></div>
                 </div>
                 <p className="text-[10px] text-text-muted mt-1 italic">
                   {isDangerZone ? "CRITICAL: Ratio above 40%. Activating debt emergency protocols." : "SAFE: Ratio is within a healthy financial boundary."}
                 </p>
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-surface border border-border">
              <h4 className="text-lg font-bold mb-6">Execution Strategy</h4>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-2 rounded-2xl border border-border">
                 <button 
                   onClick={() => setStrategy('Avalanche')}
                   className={cn("py-3 rounded-xl text-xs font-bold transition-all", strategy === 'Avalanche' ? "bg-primary text-background" : "text-text-muted hover:text-text")}
                 >
                   Avalanche
                 </button>
                 <button 
                   onClick={() => setStrategy('Snowball')}
                   className={cn("py-3 rounded-xl text-xs font-bold transition-all", strategy === 'Snowball' ? "bg-primary text-background" : "text-text-muted hover:text-text")}
                 >
                   Snowball
                 </button>
              </div>
              <p className="text-xs text-text-muted mt-4 leading-relaxed bg-surface-2 p-3 rounded-xl">
                {strategy === 'Avalanche' 
                  ? "VAULT Logic: Focus on the debt with the highest interest rate (mathematically optimized to save you UGX)."
                  : "VAULT Logic: Focus on the smallest balance first (behaviorally optimized for psychological momentum)."}
              </p>
           </div>
           
           <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/20 flex gap-4">
              <Zap className="text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-secondary mb-1 uppercase tracking-widest">AI Milestone Preview</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Based on your current strategy, you'll be <span className="text-text font-bold">Debt Free</span> in <span className="text-secondary font-bold">14 months</span>. That's UGX 2M saved in interest.
                </p>
              </div>
           </div>
        </div>

        {/* Right: List & Charts */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 rounded-3xl bg-surface border border-border">
              <h4 className="text-lg font-bold mb-8">Waterfall Payoff Timeline</h4>
              <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b6d8a', fontSize: 12 }} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b6d8a', fontSize: 12 }} tickFormatter={(val) => `${val/1000}k`} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0e0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                         cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                       />
                       <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 0 ? '#00d68f' : '#7c6fff'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="space-y-4">
              <AnimatePresence>
                {isAdding && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 rounded-2xl bg-surface-2 border border-primary/30 grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
                  >
                    <input type="text" placeholder="Debt Name" value={newDebt.name} onChange={(e) => setNewDebt({...newDebt, name: e.target.value})} className="bg-background border border-border rounded-xl px-4 h-12 text-sm outline-none w-full" />
                    <input type="number" placeholder="Total (UGX)" value={newDebt.total || ''} onChange={(e) => setNewDebt({...newDebt, total: Number(e.target.value)})} className="bg-background border border-border rounded-xl px-4 h-12 text-sm outline-none w-full" />
                    <input type="number" placeholder="Interest (%)" value={newDebt.interest || ''} onChange={(e) => setNewDebt({...newDebt, interest: Number(e.target.value)})} className="bg-background border border-border rounded-xl px-4 h-12 text-sm outline-none w-full" />
                    <input type="number" placeholder="Min. Payment (UGX)" value={newDebt.minimum || ''} onChange={(e) => setNewDebt({...newDebt, minimum: Number(e.target.value)})} className="bg-background border border-border rounded-xl px-4 h-12 text-sm outline-none w-full" />
                    <div className="col-span-2 lg:col-span-4 flex gap-2">
                       <button onClick={handleAddDebt} className="flex-1 py-3 bg-primary text-background font-bold rounded-xl">Save Debt</button>
                       <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-surface border border-border text-text-muted rounded-xl">Cancel</button>
                    </div>
                  </motion.div>
                )}

                {state.debts.map((debt, i) => (
                  <motion.div 
                    key={debt.id} 
                    layout
                    className={cn(
                      "p-6 rounded-2xl bg-surface border flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-text-muted/30 transition-all",
                      i === 0 && strategy === 'Avalanche' ? "border-primary/50 shadow-lg shadow-primary/5" : "border-border"
                    )}
                  >
                    <div className="flex items-center gap-5 w-full md:w-auto">
                       <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-xl">
                          📉
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-0.5">
                             <h4 className="font-bold text-text">{debt.name}</h4>
                             {i === 0 && (
                               <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter bg-primary text-background">Next Target</span>
                             )}
                          </div>
                          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                            {debt.interest}% Interest • {formatUGX(debt.minimum)} min
                          </p>
                       </div>
                    </div>

                    <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-12">
                       <div className="text-right">
                          <p className="text-xs text-text-muted mb-1">Total Remaining</p>
                          <p className="text-xl font-display font-bold">{formatUGX(debt.total)}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="p-2 text-text-muted hover:text-primary transition-colors">
                             <Calendar size={18} />
                          </button>
                          <button onClick={() => deleteDebt(debt.id)} className="p-2 text-text-muted hover:text-danger transition-colors">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </AppShell>
  );
}
