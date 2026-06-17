import { TradeDetails } from '../types/trade.types';

interface TradeMetricsProps {
  trade: TradeDetails;
}

function fallback(value: string | number | null | undefined) {
  return value ?? '—';
}

function calculatePnl(trade: TradeDetails) {
  if (trade.pnl !== null && trade.pnl !== undefined) {
    return trade.pnl;
  }

  if (
    trade.entryPrice !== null &&
    trade.entryPrice !== undefined &&
    trade.exitPrice !== null &&
    trade.exitPrice !== undefined &&
    trade.quantity !== null &&
    trade.quantity !== undefined
  ) {
    return (
      (Number(trade.exitPrice) - Number(trade.entryPrice)) *
      Number(trade.quantity)
    ).toFixed(2);
  }

  return '—';
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-center items-center">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export function TradeMetrics({ trade }: TradeMetricsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Position Metrics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Trade execution summary and performance.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 divide divide-slate-200">
        <MetricCard
          label="Entry"
          value={fallback(trade.entryPrice)}
        />

        <MetricCard
          label="Exit"
          value={fallback(trade.exitPrice)}
        />

        <MetricCard
          label="Quantity"
          value={fallback(trade.quantity)}
        />

        <MetricCard
          label="P&L"
          value={calculatePnl(trade)}
        />
      </div>
    </section>
  );
}
