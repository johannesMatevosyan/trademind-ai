import { formatCurrency } from '@org/shared-ui';

export interface SymbolPerformanceItem {
  symbol: string;
  trades: number;
  pnl: number;
}
interface SymbolBreakdownProps {
  data: SymbolPerformanceItem[];
  isLoading?: boolean;
  isError?: boolean;
}

export function SymbolBreakdownPlaceholder({
  data,
  isLoading,
  isError,
}: SymbolBreakdownProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Could not load symbol performance.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Symbol Performance
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Realized performance grouped by symbol.
      </p>

      {data.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
          No symbol performance data yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {data.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.symbol}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.trades} trades
                </p>
              </div>

              <p className="font-semibold text-slate-900">
                {formatCurrency(item.pnl)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
