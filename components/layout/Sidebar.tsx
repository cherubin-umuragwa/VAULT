'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MessageSquareQuote, 
  Target, 
  PieChart, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Bot,
  Brain,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'VAULT Coach', icon: MessageSquareQuote, path: '/coach' },
  { name: 'Saving Goals', icon: Target, path: '/goals' },
  { name: 'Budgeting', icon: PieChart, path: '/budget' },
  { name: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
  { name: 'Debt Planner', icon: TrendingUp, path: '/debt' },
  { name: 'Simulator', icon: Sparkles, path: '/simulator' },
  { name: 'Wealth Report', icon: FileText, path: '/report' },
  { name: 'Crisis Mode', icon: ShieldAlert, path: '/crisis' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="fixed left-0 top-0 h-screen bg-surface border-r border-border z-50 flex flex-col transition-all duration-300"
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">V</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter text-text">VAULT</span>
          </Link>
        )}
        {isCollapsed && (
           <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
             <span className="text-primary font-bold text-lg">V</span>
           </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <SidebarLink 
              key={item.path} 
              item={item} 
              isActive={isActive} 
              isCollapsed={isCollapsed} 
            />
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-muted hover:bg-surface-2 hover:text-text transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
        </button>
      </div>
    </motion.aside>
  );
}

// Fixed Sidebar Item to avoid broken LinkNext usage
function SidebarLink({ item, isActive, isCollapsed }: { item: any; isActive: boolean; isCollapsed: boolean }) {
  return (
    <Link
      href={item.path}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-none transition-all duration-200 group relative border-l-4",
        isActive 
          ? "bg-primary/5 text-primary border-primary" 
          : "text-text-muted hover:bg-surface-2 hover:text-text border-transparent"
      )}
    >
      <item.icon size={20} className={cn(isActive ? "text-primary" : "text-text-muted group-hover:text-text")} />
      {!isCollapsed && <span className="text-sm font-medium truncate">{item.name}</span>}
    </Link>
  );
}
