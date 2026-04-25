import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function ProgressBar({ progress, color = 'primary', size = 'md', animated = true }: { 
  progress: number; 
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    danger: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
  };

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn("w-full bg-border rounded-full overflow-hidden", heights[size])}>
      <motion.div
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${safeProgress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("h-full rounded-full transition-colors", colors[color])}
      />
    </div>
  );
}
