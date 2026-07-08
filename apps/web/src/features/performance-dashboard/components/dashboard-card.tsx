import { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
}

export function DashboardCard({
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}
