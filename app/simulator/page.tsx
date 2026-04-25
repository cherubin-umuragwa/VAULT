'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import SectionHeader from '@/components/ui/SectionHeader';
import { formatUGX } from '@/lib/formatUGX';
import { Sparkles, TrendingUp, ShieldCheck, Zap, History, RefreshCcw, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';

export default function SimulatorPage() {
  const { state } = useApp();
  const [savingsIncrease, setSavingsIncrease] = useState(250000);
  const [expenseCut, setExpenseCut] = useState(15);
  const [incomeRaise, setIncomeRaise] = useState(10);

  const totalCurrentExpenses = state.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentMonthlySavings = Math.max(0, state.income - totalCurrentExpenses);
  
  const simulationData = useMemo(() => {
    const data = [];
    const months = 60; // 5 years
    
    // Future savings per month including modifications
    const newSavingsPerMonth = currentMonthlySavings + savingsIncrease + (state.income * (incomeRaise / 100)) + (totalCurrentExpenses * (expenseCut / 100));
    const annualInterestRate = 0.08; // Assume 8% compound growth for investment
    const monthlyInterestRate = annualInterestRate / 12;

    let balance = state.goals.reduce((acc, g) => acc + g.saved, 0);
    let originalBalance = balance;
    let originalSavings = currentMonthlySavings;

    for (let i = 0; i <= months; i++) {
        if (i % 6 === 0 || i === months) {
            data.push({
                month: i,
                year: (i / 12).toFixed(1),
                projected: Math.round(balance),
                original: Math.round(originalBalance + (originalSavings * i)),
            });
        }
        balance = (balance + newSavingsPerMonth) * (1 + monthlyInterestRate);
    }
    return data;
  }, [currentMonthlySavings, savingsIncrease, incomeRaise, expenseCut, state.income, totalCurrentExpenses, state.goals]);

  const emergencyFundWeeks = state.income > 0 ? (state.goals.reduce((a, b) => a + b.saved, 0) / (totalCurrentExpenses / 4)).toFixed(1) : '0';

  return (
    <AppShell>
      <SectionHeader 
        title="Scenario Simulator" 
        subtitle="Time-travel your UGX. Move the sliders to see your 1, 3, and 5-year financial destiny."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders Area */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-3xl bg-surface border border-border space-y-8">
              <h4 className="text-lg font-bold flex items-center gap-2">
                 <RefreshCcw size={18} className="text-primary" />
                 What-If Parameters
              </h4>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Extra Savings / mo</label>
                    <span className="text-sm font-display font-bold text-primary">+{formatUGX(savingsIncrease)}</span>
                 </div>
                 <input 
                   type="range" min="0" max="2000000" step="50000" 
                   value={savingsIncrease} onChange={(e) => setSavingsIncrease(Number(e.target.value))}
                   className="w-full h-1.5 bg-background rounded-full appearance-none cursor-pointer accent-primary"
                 />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Expense Reduction %</label>
                    <span className="text-sm font-display font-bold text-secondary">{expenseCut}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="50" step="5" 
                   value={expenseCut} onChange={(e) => setExpenseCut(Number(e.target.value))}
                   className="w-full h-1.5 bg-background rounded-full appearance-none cursor-pointer accent-secondary"
                 />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Income Hike %</label>
                    <span className="text-sm font-display font-bold text-info">+{incomeRaise}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" step="5" 
                   value={incomeRaise} onChange={(e) => setIncomeRaise(Number(e.target.value))}
                   className="w-full h-1.5 bg-background rounded-full appearance-none cursor-pointer accent-info"
                 />
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 flex gap-4">
              <Zap className="text-primary flex-shrink-0" />
              <div>
                 <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">AI Interpretation</p>
                 <p className="text-xs text-text-muted leading-relaxed italic">
                    "These combined moves would accelerate your **Dream House** goal by 14 months and build a safety buffer equivalent to a trip to the moon (or 9 months in Kampala)."
                 </p>
              </div>
           </div>
        </div>

        {/* Projections Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 rounded-3xl bg-surface border border-border">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-xl font-bold">Wealth Progression Projection</h4>
                 <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Projected</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-text-muted opacity-30"></div> Current Trend</div>
                 </div>
              </div>
              
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulationData}>
                       <defs>
                          <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#00d68f" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#00d68f" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="year" unit="y" axisLine={false} tickLine={false} tick={{ fill: '#6b6d8a', fontSize: 10 }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b6d8a', fontSize: 10 }} tickFormatter={(val) => `${val/1000000}M`} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0e0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                         formatter={(val) => [formatUGX(val as number), '']}
                       />
                       <Area type="monotone" dataKey="original" stroke="#6b6d8a" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                       <Area type="monotone" dataKey="projected" stroke="#00d68f" strokeWidth={4} fill="url(#simGradient)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: '1 Year Forecast', val: simulationData.find(d => Number(d.year) === 1.5)?.projected || 0, icon: TrendingUp },
                { label: '5 Year Legacy', val: simulationData[simulationData.length-1].projected, icon: Sparkles },
                { label: 'Emergency Runway', val: `${emergencyFundWeeks} Weeks`, icon: ShieldCheck, isRaw: true },
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-2xl bg-surface border border-border group hover:border-primary/40 transition-all">
                   <stat.icon className="text-text-muted mb-4 group-hover:text-primary transition-colors" size={20} />
                   <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                   <p className="text-lg font-display font-bold text-text group-hover:text-primary transition-colors">
                     {stat.isRaw ? stat.val : formatUGX(stat.val as number)}
                   </p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </AppShell>
  );
}
