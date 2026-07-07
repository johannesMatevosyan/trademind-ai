import type { RiskMetricsData } from '../types/performance-dashboard.types';
import { PerformanceKpiCard } from './performance-kpi-card';

interface RiskMetricsProps {
  data?: RiskMetricsData;
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

function formatRatio(value: number | null | undefined) {
  if (value === null || value === undefined) return '—';

  return value.toFixed(2);
}

export function RiskMetrics({ data, isLoading, isError }: RiskMetricsProps) {
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
        Could not load risk metrics.
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Risk Metrics</h2>

        <p className="mt-1 text-sm text-slate-500">
          Strategy quality and risk-adjusted performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PerformanceKpiCard
          title="Expectancy"
          value={formatMoney(data?.expectancy)}
          subtitle="Expected value per trade"
        />

        <PerformanceKpiCard
          title="Average Win"
          value={formatMoney(data?.averageWin)}
          subtitle="Average winning trade"
        />

        <PerformanceKpiCard
          title="Average Loss"
          value={formatMoney(data?.averageLoss)}
          subtitle="Average losing trade"
        />

        <PerformanceKpiCard
          title="Profit Factor"
          value={formatRatio(data?.profitFactor)}
          subtitle="Gross profit / gross loss"
        />
      </div>
    </section>
  );
}
