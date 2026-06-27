export interface WinLossData {
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  totalClosedTrades: number;
}

interface WinLossChartProps {
  data: WinLossData;
  isLoading?: boolean;
  isError?: boolean;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

export function WinLossOverview({
  data,
  isLoading,
  isError,
}: WinLossChartProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load win/loss statistics.
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Win / Loss Distribution
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Distribution of completed trades.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <StatCard
          label="Winning"
          value={data.winningTrades}
        />

        <StatCard
          label="Losing"
          value={data.losingTrades}
        />

        <StatCard
          label="Breakeven"
          value={data.breakevenTrades}
        />

        <StatCard
          label="Closed"
          value={data.totalClosedTrades}
        />
      </div>
    </section>
  );
}
