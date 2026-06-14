import type { TradingAccount } from '../types/trading-account.types';
import { TradingAccountsCard } from './trading-accounts-card';

interface TradingAccountsListProps {
  accounts?: TradingAccount[];
  isLoading?: boolean;
  isError?: boolean;
}

export function TradingAccountsList({
  accounts = [],
  isLoading = false,
  isError = false,
}: TradingAccountsListProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Trading Accounts
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-900">
          Trading Accounts
        </h2>
        <p className="mt-2 text-sm text-red-700">
          Failed to load trading accounts.
        </p>
      </section>
    );
  }

  if (accounts.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Trading Accounts
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          No trading accounts found yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Trading Accounts
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your connected trading accounts overview.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <TradingAccountsCard key={account.id} account={account} />
        ))}
      </div>
    </section>
  );
}
