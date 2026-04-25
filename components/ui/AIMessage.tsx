'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { User, Sparkles } from 'lucide-react';

interface AIMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function AIMessage({ role, content }: AIMessageProps) {
  const isAI = role === 'assistant';

  return (
    <div className={cn(
      "flex w-full gap-4 mb-8",
      isAI ? "justify-start" : "justify-end"
    )}>
      {isAI && (
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      )}

      <div className={cn(
        "max-w-[85%] relative",
        isAI ? "text-left" : "text-right"
      )}>
        <div className={cn(
          "p-6 rounded-3xl shadow-xl text-lg leading-relaxed",
          isAI 
            ? "bg-surface border border-border text-foreground" 
            : "bg-primary text-primary-foreground font-medium"
        )}>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {isAI && <div className="ai-bubble-tail" />}
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 px-2">
          {isAI ? 'Saver AI Coach' : 'You'} • Just now
        </p>
      </div>

      {!isAI && (
        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
