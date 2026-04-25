'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp, Goal } from '@/context/AppContext';
import SectionHeader from '@/components/ui/SectionHeader';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatUGX } from '@/lib/formatUGX';
import { Target, Plus, Calendar, Trash2, Edit3, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function GoalsPage() {
  const { state, dispatch } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: '',
    emoji: '💰',
    target: 0,
    saved: 0,
    deadline: '',
    priority: 'medium'
  });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name!,
      emoji: newGoal.emoji || '💰',
      target: Number(newGoal.target),
      saved: Number(newGoal.saved) || 0,
      deadline: newGoal.deadline || '',
      priority: (newGoal.priority as 'low' | 'medium' | 'high') || 'medium'
    };
    dispatch.setGoals([...state.goals, goal]);
    setIsAdding(false);
    setNewGoal({ name: '', emoji: '💰', target: 0, saved: 0, deadline: '', priority: 'medium' });
  };

  const deleteGoal = (id: string) => {
    dispatch.setGoals(state.goals.filter(g => g.id !== id));
  };

  const updateSaved = (id: string, amount: number) => {
    const goals = state.goals.map(g => {
      if (g.id === id) {
        const newSaved = g.saved + amount;
        if (newSaved >= g.target && g.saved < g.target) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00d68f', '#7c6fff', '#38c6ff']
          });
        }
        return { ...g, saved: Math.min(newSaved, g.target) };
      }
      return g;
    });
    dispatch.setGoals(goals);
  };

  return (
    <AppShell>
      <SectionHeader 
        title="Saving Goals" 
        subtitle="Turn your Ugandan dreams into UGX reality with micro-target precision."
        action={
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Create Goal
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-2xl bg-surface-2 border-2 border-dashed border-primary/30 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                 <input 
                   type="text" 
                   value={newGoal.emoji} 
                   onChange={(e) => setNewGoal({...newGoal, emoji: e.target.value})}
                   className="w-12 h-12 bg-background border border-border rounded-xl text-center text-xl outline-none focus:border-primary"
                 />
                 <input 
                   type="text" 
                   placeholder="Goal Name (e.g. Dream House)"
                   value={newGoal.name}
                   onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                   className="flex-1 bg-background border border-border rounded-xl px-4 h-12 text-sm outline-none focus:border-primary"
                 />
              </div>
              <input 
                type="number" 
                placeholder="Target Amount (UGX)"
                onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                className="bg-background border border-border rounded-xl px-4 h-12 text-sm outline-none focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="date" 
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="bg-background border border-border rounded-xl px-4 h-12 text-xs outline-none focus:border-primary"
                />
                <select 
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as any})}
                  className="bg-background border border-border rounded-xl px-4 h-12 text-sm outline-none focus:border-primary"
                >
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={handleAddGoal} className="flex-1 py-3 bg-primary text-background font-bold rounded-xl">Save Goal</button>
                <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-surface border border-border text-text-muted rounded-xl">Cancel</button>
              </div>
            </motion.div>
          )}

          {state.goals.map((goal) => {
            const progress = (goal.saved / goal.target) * 100;
            const remaining = goal.target - goal.saved;
            return (
              <motion.div
                layout
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-surface border border-border group hover:border-primary/30 transition-all flex flex-col gap-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-2 rounded-2xl flex items-center justify-center text-3xl border border-border">
                      {goal.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-0.5">{goal.name}</h3>
                      <div className="flex items-center gap-2">
                         <span className={cn(
                           "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                           goal.priority === 'high' ? "bg-danger/10 text-danger" : 
                           goal.priority === 'medium' ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
                         )}>
                           {goal.priority}
                         </span>
                         <span className="text-[10px] text-text-muted flex items-center gap-1">
                           <Calendar size={10} />
                           {goal.deadline || 'No deadline'}
                         </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="p-2 text-text-muted hover:text-danger rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted font-medium">Progress</span>
                    <span className="text-primary font-bold">{progress.toFixed(1)}%</span>
                  </div>
                  <ProgressBar progress={progress} color={progress === 100 ? 'primary' : 'info'} size="md" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Saved</p>
                    <p className="text-md font-display font-bold text-primary">{formatUGX(goal.saved)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Remaining</p>
                    <p className="text-md font-display font-bold text-text-muted">{formatUGX(remaining)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                   <button 
                     onClick={() => updateSaved(goal.id, 50000)}
                     className="flex-1 py-3 bg-surface-2 border border-border rounded-xl text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all"
                   >
                     + UGX 50k
                   </button>
                   <button 
                    onClick={() => updateSaved(goal.id, 100000)}
                    className="flex-1 py-3 bg-surface-2 border border-border rounded-xl text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all"
                   >
                     + UGX 100k
                   </button>
                   <button className="p-3 bg-surface-2 border border-border rounded-xl text-text-muted hover:text-primary transition-all">
                      <Sparkles size={18} />
                   </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {state.goals.length === 0 && !isAdding && (
          <div className="lg:col-span-3 py-20 flex flex-col items-center justify-center text-center glass border-dashed rounded-3xl">
             <div className="p-6 bg-surface-2 rounded-full mb-6">
                <Target size={48} className="text-text-muted opacity-50" />
             </div>
             <h3 className="text-xl font-bold mb-2">No active saving goals</h3>
             <p className="text-text-muted max-w-sm mb-8">What are you working towards? A new iPhone? Land in Entebbe? Start small, save big.</p>
             <button 
              onClick={() => setIsAdding(true)}
              className="px-8 py-4 bg-primary text-background font-bold rounded-2xl hover:opacity-90 transition-all flex items-center gap-2"
             >
                <Plus size={20} />
                Set Your First Goal
             </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
