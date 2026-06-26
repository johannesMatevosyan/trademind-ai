interface PerformanceKpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export function PerformanceKpiCard({
  title,
  value,
  subtitle,
}: PerformanceKpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>

      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
