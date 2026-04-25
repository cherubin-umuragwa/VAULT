import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color: 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
  delay?: number;
}

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  danger: 'bg-danger/10 text-danger',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
};

export default function StatCard({ title, value, icon: Icon, trend, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4 hover:border-text-muted/30 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className={cn("p-3 rounded-xl", colorMap[color])}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={cn("text-xs font-bold px-2 py-1 rounded-full", trend.isUp ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger")}>
            {trend.isUp ? '+' : '-'}{trend.value}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-display font-bold text-text group-hover:text-primary transition-colors">{value}</p>
      </div>
    </motion.div>
  );
}
