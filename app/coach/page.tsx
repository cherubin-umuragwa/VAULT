'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { AIMessage } from '@/components/ui/AIMessage';
import { useApp } from '@/context/AppContext';
import { model } from '@/lib/gemini';
import { Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CoachPage() {
  const { profile } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Kalyerere ${profile?.displayName?.split(' ')[0] || 'Saver'}! I'm Saver, your AI savings coach. I see you're saving for your future in UGX. How can I help you save more today? 🇺🇬` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const systemPrompt = `
        You are "Saver" — a friendly, wise, and encouraging AI savings coach built specifically for Ugandans.
        USER PROFILE:
        Name: ${profile?.displayName}
        Daily Income: UGX ${profile?.dailyIncome || 'Not set'}
        Savings Method: ${profile?.savingsMethod || 'Not set'}

        PERSONALITY:
        - Warm, encouraging, never judgmental.
        - Speak simply — no financial jargon.
        - Use Ugandan context (UGX, MTN MoMo, school fees, medical bills, rent, boda boda, market vendors).
        - Use emojis to feel friendly.
        - Celebrate small wins (even 2,000 UGX).
        - If the user writes in Luganda, respond in Luganda.

        GOALS:
        - Help set goals.
        - Calculate loss to moneylender interest if applicable.
        - Give a "financial health score" (0-100).
        - Suggest micro-saving habits.

        Keep responses under 150 words.
        Current time: ${new Date().toLocaleString()}
      `;

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
      });

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: userMsg }
      ]);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops, my network is a bit slow. Can you say that again, bambi? 😅" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar title="AI Savings Coach" />

      <main className="flex-1 flex gap-8 p-8 min-h-0">
        {/* Chat Section - Large as requested */}
        <div className="flex-1 flex flex-col bg-surface border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Chat with Saver</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Always active</p>
              </div>
            </div>
            <button 
              onClick={() => setMessages([messages[0]])}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-4 scroll-smooth"
          >
            {messages.map((m, i) => (
              <AIMessage key={i} role={m.role} content={m.content} />
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
                <div className="p-6 rounded-3xl bg-surface border border-border text-muted-foreground italic">
                  Saver is thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-border bg-surface/50">
            <div className="flex gap-4 items-end bg-background border border-border rounded-[2rem] p-4 shadow-inner focus-within:border-primary transition-colors">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask your coach anything... (e.g. How do I save for land?)"
                className="flex-1 bg-transparent py-2 px-2 outline-none resize-none max-h-32 min-h-[48px] text-lg"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Tips */}
        <div className="w-80 space-y-6 hidden xl:block">
          <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Suggested Topics
            </h4>
            <div className="space-y-2">
              {[
                "How much can I save on UGX 20k/day?",
                "Are moneylenders dangerous?",
                "Best way to save for land",
                "How to use MTN MoMo to save"
              ].map((topic, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(topic)}
                  className="w-full text-left p-3 text-sm rounded-xl bg-surface border border-border hover:bg-surface-hover hover:border-primary transition-all text-muted-foreground hover:text-foreground"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6">
            <h4 className="font-bold mb-2">Financial Health Score</h4>
            <div className="relative h-4 bg-background rounded-full overflow-hidden mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-500 to-primary" />
              <div 
                className="absolute top-0 bottom-0 right-0 bg-surface border-l border-border" 
                style={{ width: '40%' }} 
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xl font-bold font-display tracking-tight lowercase">60/100</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Improving</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              You&apos;re doing great! Saving consistently for 2 weeks will boost your score to 75.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
