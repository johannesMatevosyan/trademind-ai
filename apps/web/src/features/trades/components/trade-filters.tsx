import type { TradingAccount } from '@/features/trading-accounts/types/trading-account.types';
import type { TradeFiltersState } from '../hooks/use-trade-filters';

interface TradeFiltersProps {
  filters: TradeFiltersState;
  tradingAccounts: TradingAccount[];
  onFilterChange: <K extends keyof TradeFiltersState>(
    key: K,
    value: TradeFiltersState[K]
  ) => void;
  onReset: () => void;
}

export function TradeFilters({
  filters,
  tradingAccounts,
  onFilterChange,
  onReset,
}: TradeFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Trade Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Filter your journal by symbol, status, side, or account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <input
          value={filters.symbol}
          onChange={(event) => onFilterChange('symbol', event.target.value)}
          placeholder="Search symbol..."
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
        />

        <select
          value={filters.status}
          onChange={(event) => onFilterChange('status', event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={filters.side}
          onChange={(event) => onFilterChange('side', event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="ALL">All sides</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>

        <select
          value={filters.accountId}
          onChange={(event) => onFilterChange('accountId', event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="ALL">All accounts</option>

          {tradingAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name ?? account.id}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset filters
        </button>
      </div>
    </section>
  );
}
