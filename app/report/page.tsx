'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import SectionHeader from '@/components/ui/SectionHeader';
import { sendMessage } from '@/lib/gemini';
import { FileText, Download, Share2, Calendar, TrendingUp, Zap, Star, ShieldCheck } from 'lucide-react';
import { formatUGX } from '@/lib/formatUGX';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function ReportPage() {
  const { state } = useApp();
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate a comprehensive "Wealth Intelligence Report" for the past week. Breakdown my performance, celebrate wins, flag warning signs, and offer one high-impact Money Move of the Week. Also include a 'Financial Weather Forecast' (e.g. Sunny/Tight/Storm). Everything in UGX. Use markdown headers.`;
      const response = await sendMessage(prompt, [], {
        user: state.user,
        income: state.income,
        goals: state.goals,
        expenses: state.expenses,
        subscriptions: state.subscriptions,
        debts: state.debts,
        healthScore: state.healthScore
      });
      setReport(response);
    } catch (err) {
      setReport("# Report Generation Failed\n\nI was unable to compile your intelligence data. Please try again in a few moments.");
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-UG', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <AppShell>
      <SectionHeader 
        title="Wealth Intelligence" 
        subtitle="Your personalized UGX autopsy. Compiled by VAULT's analytical core."
        action={
          <div className="flex gap-2">
            <button className="p-2.5 bg-surface border border-border text-text-muted rounded-xl hover:text-primary transition-all">
               <Download size={20} />
            </button>
            <button className="p-2.5 bg-surface border border-border text-text-muted rounded-xl hover:text-primary transition-all">
               <Share2 size={20} />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-3xl bg-surface border border-border">
              <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6">Active Overview</h4>
              <div className="space-y-6">
                 {[
                   { l: 'Health Score', v: state.healthScore, i: Star, c: 'text-primary' },
                   { l: 'Goal Progress', v: '42%', i: TrendingUp, c: 'text-secondary' },
                   { l: 'Budget Left', v: 'UGX 450k', i: ShieldCheck, c: 'text-info' },
                 ].map((s, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <s.i size={16} className={s.c} />
                         <span className="text-xs text-text-muted font-medium">{s.l}</span>
                      </div>
                      <span className="text-sm font-bold text-text">{s.v}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-surface-2 border border-border sticky top-28">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap size={18} className="text-primary" />
                 </div>
                 <h4 className="text-sm font-bold">Quick Refresher</h4>
              </div>
              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Reports are generated based on your real-time data sync. For the best insights, ensure all expenses are logged.
              </p>
              <button 
                onClick={generateReport}
                className="w-full py-3 bg-primary text-background font-bold rounded-xl text-xs uppercase tracking-widest hover:opacity-90 transition-all"
              >
                Refresh Intel
              </button>
           </div>
        </div>

        <div className="lg:col-span-3">
           <div className="glass rounded-3xl p-10 min-h-[600px] relative overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-20 space-y-6">
                   <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center p-3">
                      <FileText className="text-primary animate-pulse" size={40} />
                   </div>
                   <div className="space-y-2 text-center">
                      <p className="text-lg font-bold font-display animate-pulse">VAULT is synthesizing data...</p>
                      <p className="text-xs text-text-muted tracking-widest uppercase">Cross-referencing UGX patterns</p>
                   </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="prose prose-invert prose-emerald max-w-none"
                >
                   <div className="flex items-center gap-2 mb-8 pb-8 border-b border-border">
                      <Calendar size={16} className="text-text-muted" />
                      <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Report for Period Ending {today}</span>
                   </div>
                   
                   <div className="markdown-body">
                     <ReactMarkdown>{report || ''}</ReactMarkdown>
                   </div>
                </motion.div>
              )}
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
           </div>
        </div>
      </div>
    </AppShell>
  );
}
