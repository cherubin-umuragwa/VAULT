'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import StatCard from '@/components/ui/StatCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { 
  PiggyBank, 
  TrendingUp, 
  Target as TargetIcon, 
  CreditCard, 
  ArrowUpRight, 
  MessageSquare,
  Zap,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { formatUGX } from '@/lib/formatUGX';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';
import Link from 'next/link';

const mockChartData = [
  { name: 'Jan', savings: 450000 },
  { name: 'Feb', savings: 680000 },
  { name: 'Mar', savings: 520000 },
  { name: 'Apr', savings: 900000 },
  { name: 'May', savings: 1200000 },
  { name: 'Jun', savings: 1550000 },
];

const COLORS = ['#00d68f', '#7c6fff', '#38c6ff', '#ffb800', '#ff5e7d'];

export default function Dashboard() {
  const { state } = useApp();
  
  // Calculations
  const totalSaved = state.goals.reduce((acc, goal) => acc + goal.saved, 0);
  const activeGoals = state.goals.filter(g => g.saved < g.target).length;
  const monthlySubCost = state.subscriptions.reduce((acc, sub) => acc + (sub.cycle === 'monthly' ? sub.cost : sub.cost / 12), 0);
  
  const spendingData = [
    { name: 'Housing', value: state.budget.categories.Housing || 400000 },
    { name: 'Food', value: state.budget.categories.Food || 300000 },
    { name: 'Transport', value: state.budget.categories.Transport || 200000 },
    { name: 'Entertainment', value: state.budget.categories.Entertainment || 150000 },
    { name: 'Other', value: state.budget.categories.Other || 100000 },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-surface-2 p-8 border border-border">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-display font-bold text-text mb-2">Hello, {state.user.name || 'Investor'}!</h2>
              <p className="text-text-muted max-w-md">Your financial health is looking strong. You've saved UGX 450,000 more than last month. Keep it up!</p>
              <div className="flex gap-4 mt-6">
                 <Link href="/coach" className="px-6 py-3 bg-primary text-background font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all">
                   <MessageSquare size={18} />
                   Talk to Coach
                 </Link>
                 <Link href="/goals" className="px-6 py-3 bg-surface border border-border text-text font-bold rounded-xl flex items-center gap-2 hover:bg-surface-2 transition-all">
                   Manage Goals
                 </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-border" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * state.healthScore) / 100} className="text-primary transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-3xl font-display font-bold text-text">{state.healthScore}</span>
                   <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Health</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                   <Zap size={14} />
                   <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
                </div>
                <p className="text-sm text-text-muted italic">"Based on your recent spending, cutting 2 redundant subs could increase your savings rate by 8%."</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        {/* Action Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Saved" 
            value={formatUGX(totalSaved)} 
            icon={PiggyBank} 
            trend={{ value: '12%', isUp: true }}
            color="primary"
            delay={0.1}
          />
          <StatCard 
            title="Budget Used" 
            value="64%" 
            icon={TrendingUp} 
            color="secondary"
            delay={0.2}
          />
          <StatCard 
            title="Active Goals" 
            value={activeGoals.toString()} 
            icon={TargetIcon} 
            color="info"
            delay={0.3}
          />
          <StatCard 
            title="Sub Costs/mo" 
            value={formatUGX(monthlySubCost)} 
            icon={CreditCard} 
            color="warning"
            delay={0.4}
          />
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold">Savings Momentum</h3>
               <select className="bg-surface-2 border border-border text-sm p-1.5 rounded-lg outline-none cursor-pointer">
                 <option>Last 6 months</option>
                 <option>Last year</option>
               </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d68f" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d68f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b6d8a', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b6d8a', fontSize: 12 }} tickFormatter={(val) => `UGX ${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0e0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#00d68f' }}
                    labelStyle={{ color: '#e2e4f0', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="savings" stroke="#00d68f" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border">
             <h3 className="text-lg font-bold mb-8">Spending Snapshot</h3>
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0e0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="space-y-3 mt-4">
               {spendingData.map((item, index) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                       <span className="text-sm text-text-muted">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-text">{formatUGX(item.value)}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Recent Insights & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold">Priority Money Moves</h3>
                 <span className="text-xs text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">Daily Update</span>
              </div>
              <div className="space-y-4">
                 {[
                   { t: 'Emergency Fund Boost', d: 'Your current runway is 1.2 months. AI suggests 3 months for peak security.', i: Zap },
                   { t: 'Subscription Overlap', d: 'You have two video streaming services. Cutting one saves UGX 45k/mo.', i: ShieldAlert },
                   { t: 'High Interest Debt', d: 'The Credit Card debt interest is UGX 12k higher this month. Pay extra.', i: TrendingUp },
                 ].map((move, i) => (
                   <div key={i} className="p-4 rounded-xl bg-surface-2 border border-border group hover:border-primary/30 transition-all cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-background text-primary">
                          <move.i size={18} />
                        </div>
                        <div>
                           <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{move.t}</h4>
                           <p className="text-xs text-text-muted leading-relaxed">{move.d}</p>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-6 rounded-2xl bg-surface border border-border">
              <h3 className="text-lg font-bold mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {state.expenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 rounded-full bg-surface-2 mb-4">
                      <CheckCircle2 className="text-text-muted" />
                    </div>
                    <p className="text-sm text-text-muted">No recent expenses logged. You're doing great!</p>
                  </div>
                ) : (
                  state.expenses.slice(0, 5).map((exp, i) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-all">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-xl">
                            {exp.category === 'Food' ? '🍔' : '🏠'}
                         </div>
                         <div>
                            <p className="text-sm font-bold">{exp.category}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-tighter">{new Date(exp.date).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <span className="text-sm font-bold text-danger">-{formatUGX(exp.amount)}</span>
                    </div>
                  ))
                )}
                <button className="w-full py-3 rounded-xl border border-dashed border-border text-text-muted text-sm hover:border-primary hover:text-primary transition-all">
                  + Add New Transaction
                </button>
              </div>
           </div>
        </div>
      </div>
    </AppShell>
  );
}
