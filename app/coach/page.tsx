'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import { streamMessage } from '@/lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Trash2, Zap, MessageSquare, Bot } from 'lucide-react';
import AIMessage from '@/components/ui/AIMessage';
import TypingIndicator from '@/components/ui/TypingIndicator';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  "How can I save UGX 1M in 3 months?",
  "Audit my subscriptions for leaks",
  "Avalanche vs Snowball for my debt?",
  "Analyze my spending patterns",
  "Ugandan side income ideas for 2024"
];

export default function CoachPage() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatHistory, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage = text.trim();
    setInput('');
    dispatch.addChatMessage({ role: 'user', text: userMessage });
    setIsTyping(true);

    try {
      let fullResponse = '';
      const contextData = {
        user: state.user,
        income: state.income,
        goals: state.goals,
        expenses: state.expenses,
        subscriptions: state.subscriptions,
        debts: state.debts,
        healthScore: state.healthScore
      };

      const stream = streamMessage(userMessage, state.chatHistory, contextData);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
      }

      dispatch.addChatMessage({ role: 'model', text: fullResponse });
    } catch (error) {
      console.error(error);
      dispatch.addChatMessage({ 
        role: 'model', 
        text: "I encountered a synchronization error in my analytical core. Please check your connection or retry your request." 
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-180px)] glass rounded-3xl overflow-hidden border border-border">
        {/* Chat Header */}
        <div className="p-6 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                <Bot size={24} />
             </div>
             <div>
                <h3 className="font-display font-black text-lg tracking-tighter uppercase">VAULT Coach v2.0</h3>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                   <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">System Online • Deep Logic Active</span>
                </div>
             </div>
          </div>
          <button 
            onClick={() => dispatch.clearChat()}
            className="p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-grid">
           {state.chatHistory.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-surface-2 rounded-3xl flex items-center justify-center shadow-2xl border border-border">
                   <MessageSquare size={40} className="text-primary opacity-50" />
                </div>
                <div>
                   <h2 className="text-2xl font-display font-black mb-2 uppercase tracking-tighter">Initialize Guidance</h2>
                   <p className="text-sm text-text-muted">I am VAULT. Every recommendation I make is backed by your real-time UGX data patterns. How can I optimize your balance today?</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                   {SUGGESTED_PROMPTS.map((prompt) => (
                     <button 
                       key={prompt}
                       onClick={() => handleSend(prompt)}
                       className="px-4 py-2 bg-surface-2 border border-border rounded-full text-xs text-text-muted hover:border-primary hover:text-primary transition-all font-medium"
                     >
                       {prompt}
                     </button>
                   ))}
                </div>
             </div>
           )}
           {state.chatHistory.map((msg, i) => (
             <AIMessage key={i} role={msg.role} text={msg.text} />
           ))}
           {isTyping && (
             <div className="flex justify-start">
               <div className="ai-bubble ai-bubble-tail">
                 <TypingIndicator />
               </div>
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-surface-2/50 backdrop-blur-md border-t border-border">
           <div className="max-w-4xl mx-auto relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask VAULT about your goals, debt, or spending..."
                className="w-full bg-background border border-border rounded-2xl py-4 pl-6 pr-32 outline-none focus:border-primary transition-all shadow-xl"
              />
              <div className="absolute right-2 top-2 bottom-2 flex gap-2">
                 <div className="flex items-center px-4 text-text-muted">
                    <Zap size={16} className={cn(isTyping ? "text-primary" : "")} />
                 </div>
                 <button 
                   onClick={() => handleSend()}
                   disabled={!input.trim() || isTyping}
                   className="px-6 bg-primary text-background font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                 >
                   <Send size={18} />
                   <span className="hidden md:block">Send</span>
                 </button>
              </div>
           </div>
           <p className="text-[10px] text-center text-text-muted mt-4 uppercase tracking-[0.2em] font-bold">
             AI suggestions are advisory. Final financial decisions remain with the user.
           </p>
        </div>
      </div>
    </AppShell>
  );
}
