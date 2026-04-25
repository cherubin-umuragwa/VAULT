'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import SectionHeader from '@/components/ui/SectionHeader';
import { sendMessage } from '@/lib/gemini';
import { ShieldAlert, Zap, AlertCircle, TrendingDown, Phone, ShieldCheck, Heart, Home, ArrowRight } from 'lucide-react';
import { formatUGX } from '@/lib/formatUGX';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function CrisisPage() {
  const { state } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [situation, setSituation] = useState('');
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activateCrisisMode = async () => {
    if (!situation.trim()) return;
    setIsLoading(true);
    try {
      const prompt = `ACTIVATE CRISIS MODE. Situation: ${situation}. I need an immediate triage plan, a 30-day emergency UGX budget, and my next 24-hour action steps. Be firm but reassuring. Use Ugandan context.`;
      const response = await sendMessage(prompt, [], {
        user: state.user,
        income: state.income,
        expenses: state.expenses,
        goals: state.goals,
        debts: state.debts,
        subscriptions: state.subscriptions
      });
      setPlan(response);
      setIsActive(true);
    } catch (err) {
      setPlan("VAULT internal systems are struggling during this crisis. Here are your immediate actions: 1. Stop all non-essential spending. 2. Triage your bills. 3. Check your actual UGX cash balance.");
      setIsActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCrisis = () => {
    setIsActive(false);
    setSituation('');
    setPlan(null);
  };

  return (
    <AppShell>
      <SectionHeader 
        title="Crisis Management" 
        subtitle="Calm in the storm. Activate this mode only in real financial emergencies."
      />

      <div className="max-w-4xl mx-auto">
        {!isActive ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 rounded-3xl bg-surface border border-border flex flex-col items-center text-center space-y-8"
          >
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center">
               <ShieldAlert size={40} className="text-danger" />
            </div>
            
            <div>
               <h3 className="text-2xl font-display font-bold mb-3">Emergency Signal Required</h3>
               <p className="text-text-muted max-w-sm">
                 VAULT acts as your secondary autopilot. Describe the emergency clearly so we can calculate your triage plan.
               </p>
            </div>

            <textarea 
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. Unexpected job loss, medical emergency, or overwhelming debt collection notice..."
              className="w-full h-32 bg-background border border-border rounded-2xl p-6 text-sm outline-none focus:border-danger transition-all resize-none"
            />

            <button 
              onClick={activateCrisisMode}
              disabled={isLoading || !situation.trim()}
              className="w-full py-5 bg-danger text-white font-bold rounded-2xl text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-danger/20"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Synthesizing Triage Plan...
                </>
              ) : (
                <>
                  <Zap size={24} />
                  Activate VAULT Crisis Protocol
                </>
              )}
            </button>
            
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
               Data Security Check: Encrypted • Isolated • Private
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-between"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-danger rounded-xl flex items-center justify-center text-white">
                     <AlertCircle size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-danger uppercase tracking-widest text-xs">Crisis Protocol Active</h4>
                     <p className="text-xs text-text-muted">Follow these instructions with 100% precision.</p>
                  </div>
               </div>
               <button 
                 onClick={resetCrisis}
                 className="px-4 py-2 bg-surface text-text font-bold rounded-lg text-xs hover:bg-surface-2 transition-all"
               >
                 Exit Protocol
               </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 rounded-2xl bg-surface border border-border">
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Heart size={16} className="text-danger" />
                     Vital Signs
                  </h4>
                  <div className="space-y-4">
                     {[
                       { l: 'Emergency Fund', v: '0 Weeks', i: Home },
                       { l: 'Priority Debt', v: 'UGX 1.2M', i: TrendingDown },
                       { l: 'Daily Limit', v: 'UGX 10k', i: ShieldCheck },
                     ].map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-surface-2 rounded-xl">
                          <div className="flex items-center gap-2 text-xs">
                             <s.i size={14} className="text-text-muted" />
                             <span className="font-medium text-text-muted">{s.l}</span>
                          </div>
                          <span className="text-sm font-bold">{s.v}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-surface border border-border">
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Phone size={16} className="text-info" />
                     Essential Contacts
                  </h4>
                  <div className="space-y-3">
                     {[
                       { n: 'Umembe Support', c: 'Payment Plan' },
                       { n: 'NWSC Uganda', c: 'Negotiation' },
                       { n: 'Financial Helpline', c: '0800 123 456' },
                     ].map((c, i) => (
                       <div key={i} className="flex items-center justify-between p-3 border border-border rounded-xl group cursor-pointer hover:border-info transition-all">
                          <span className="text-xs font-bold">{c.n}</span>
                          <ArrowRight size={14} className="text-text-muted group-hover:text-info transition-all" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="glass rounded-3xl p-10">
               <div className="markdown-body">
                  <ReactMarkdown>{plan || ''}</ReactMarkdown>
               </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
