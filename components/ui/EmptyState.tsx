import React from 'react';
import { LucideIcon } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon, action }: {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center glass border-dashed rounded-3xl w-full">
      <div className="p-6 bg-surface-2 rounded-full mb-6">
        <Icon size={48} className="text-text-muted opacity-50" />
      </div>
      <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
      <p className="text-text-muted max-w-sm mb-8 text-sm">{description}</p>
      {action && action}
    </div>
  );
}
