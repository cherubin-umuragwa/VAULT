'use client';

import React from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { formatUGX, cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  ArrowRight,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', amount: 120000 },
  { name: 'Tue', amount: 180000 },
  { name: 'Wed', amount: 150000 },
  { name: 'Thu', amount: 280000 },
  { name: 'Fri', amount: 210000 },
  { name: 'Sat', amount: 350000 },
  { name: 'Sun', amount: 420000 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <Topbar title="Overview" />
      
      <main className="p-8 space-y-8 pb-16">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Balance" value={4250000} change="+12.5%" trend="up" />
          <StatCard title="Monthly Savings" value={850000} change="+8.2%" trend="up" />
          <StatCard title="Debt Total" value={1200000} change="-5.4%" trend="down" />
          <StatCard title="Daily Budget" value={25000} change="Remaining" trend="neutral" />
        </section>

        {/* Charts & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold font-display tracking-tight">Savings Progress</h3>
                <select className="bg-background border border-border rounded-lg px-2 py-1 text-sm text-muted-foreground outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0e0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-display tracking-tight">Recent Activity</h3>
                <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'MTN MoMo Transfer', date: 'Today, 2:45 PM', amount: 50000, type: 'save' },
                  { label: 'Nakakata Market', date: 'Yesterday, 10:20 AM', amount: -15000, type: 'spend' },
                  { label: 'Boda Boda Expense', date: 'Yesterday, 8:15 AM', amount: -4000, type: 'spend' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        item.type === 'save' ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                      )}>
                        {item.type === 'save' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <p className={cn("font-bold", item.type === 'save' ? "text-primary" : "text-foreground")}>
                      {item.type === 'save' ? '+' : '-'}{formatUGX(Math.abs(item.amount))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
              <h3 className="text-xl font-bold font-display mb-6">Active Goals</h3>
              <div className="space-y-6">
                <GoalItem title="Land in Mukono" current={1200000} target={5000000} />
                <GoalItem title="Boda Loan Clear" current={450000} target={1200000} />
                <GoalItem title="Kish Kids Fees" current={800000} target={800000} completed />
              </div>
              <button className="w-full mt-8 py-4 bg-background border border-border border-dashed rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary transition-all">
                <Plus className="w-5 h-5" />
                <span>Add new goal</span>
              </button>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold font-display text-accent mb-4">Coach Tip</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                &quot;Bambi, you spent UGX 45,000 extra on data last week. If you switch to the monthly bundle, you&apos;ll save UGX 15,000 per week. That&apos;s a gomesi for your mom by Christmas! 🎉&quot;
              </p>
              <button className="w-full py-3 bg-accent text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                chat with coach
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, change, trend }: { title: string, value: number | string, change: string, trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-surface border border-border rounded-3xl p-6 relative overflow-hidden group">
      <div className={cn(
        "absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500",
        trend === 'down' && "bg-accent"
      )} />
      <p className="text-muted-foreground text-sm font-medium">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <h4 className="text-2xl font-bold font-display tracking-tight">
          {typeof value === 'number' ? formatUGX(value) : value}
        </h4>
        <div className={cn(
          "px-2 py-1 rounded-lg text-xs font-bold",
          trend === 'up' ? "bg-primary/10 text-primary" : trend === 'down' ? "bg-red-500/10 text-red-500" : "bg-muted/10 text-muted"
        )}>
          {change}
        </div>
      </div>
    </div>
  );
}

function GoalItem({ title, current, target, completed }: { title: string, current: number, target: number, completed?: boolean }) {
  const progress = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          {completed ? <div className="w-2 h-2 rounded-full bg-primary" /> : <div className="w-2 h-2 rounded-full bg-muted" />}
          <span className="font-medium">{title}</span>
        </div>
        <span className="text-muted-foreground">{formatUGX(current)} / {formatUGX(target)}</span>
      </div>
      <div className="h-2 bg-background rounded-full overflow-hidden border border-border">
        <div 
          className={cn("h-full transition-all duration-1000", completed ? "bg-primary" : "bg-primary/50")} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
