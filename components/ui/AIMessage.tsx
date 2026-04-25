'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface AIMessageProps {
  role: 'user' | 'model';
  text: string;
}

export default function AIMessage({ role, text }: AIMessageProps) {
  const isModel = role === 'model';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isModel ? -10 : 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className={cn(
        "flex gap-4 w-full mb-6",
        isModel ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-border shadow-lg",
        isModel ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
      )}>
        {isModel ? <Bot size={20} /> : <User size={20} />}
      </div>

      <div className={cn(
        "max-w-[80%] md:max-w-[70%]",
        isModel ? "ai-bubble ai-bubble-tail" : "bg-surface border border-border p-4 rounded-2xl"
      )}>
        <div className="prose prose-invert prose-sm max-w-none prose-emerald prose-p:leading-relaxed prose-pre:bg-background/50">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
        <div className="mt-2 flex items-center justify-between opacity-50">
           <span className="text-[10px] font-bold uppercase tracking-widest">{isModel ? 'Vault System' : 'Verified User'}</span>
        </div>
      </div>
    </motion.div>
  );
}
