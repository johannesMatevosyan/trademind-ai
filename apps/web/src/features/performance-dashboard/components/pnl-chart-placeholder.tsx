interface PnlHistoryItem {
  date: string | null;
  pnl: number;
}

interface PnlChartPlaceholderProps {
  data: PnlHistoryItem[];
  isLoading?: boolean;
  isError?: boolean;
}

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  });
}

export function PnlChartPlaceholder({
  data,
  isLoading,
  isError,
}: PnlChartPlaceholderProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Could not load P&L history.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">P&L Over Time</h2>

      <p className="mt-1 text-sm text-slate-500">
        Realized P&L from closed trades.
      </p>

      {data.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
          No closed trades yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {data.slice(-5).map((item) => (
            <div
              key={`${item.date}-${item.pnl}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <span className="text-slate-500">{item.date ?? '—'}</span>

              <span className="font-semibold text-slate-900">
                {formatMoney(item.pnl)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
