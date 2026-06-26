import type { PerformanceDashboardData } from '../types/performance-dashboard.types';
import { PerformanceKpiCard } from './performance-kpi-card';

interface PerformanceSummaryProps {
  data?: PerformanceDashboardData;
  isLoading?: boolean;
  isError?: boolean;
}

function formatMoney(value?: number) {
  if (value === undefined) return '—';

  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  });
}

function formatPercent(value?: number) {
  if (value === undefined) return '—';

  return `${value.toFixed(1)}%`;
}

export function PerformanceSummary({
  data,
  isLoading,
  isError,
}: PerformanceSummaryProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Could not load performance summary.
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <PerformanceKpiCard
        title="Net P&L"
        value={formatMoney(data?.totalPnl)}
        subtitle="Total realized performance"
      />

      <PerformanceKpiCard
        title="Win Rate"
        value={formatPercent(data?.winRate)}
        subtitle="Closed winning trades"
      />

      <PerformanceKpiCard
        title="Trades"
        value={String(data?.totalTrades ?? '—')}
        subtitle={`${data?.openTrades ?? 0} open / ${data?.closedTrades ?? 0} closed`}
      />

      <PerformanceKpiCard
        title="Profit Factor"
        value={data?.profitFactor ? data.profitFactor.toFixed(2) : '—'}
        subtitle="Coming soon"
      />
    </section>
  );
}
