import Link from 'next/link';
import type { TradingAccount } from '../types/trading-account.types';
import { TradingAccountStatusBadge } from './trading-account-status-badge';

interface Props {
  account: TradingAccount;
}

function fallback(value?: string | null) {
  return value || '—';
}

export function TradingAccountHeader({ account }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link
        href="/trading"
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        ← Back to Trading
      </Link>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            {fallback(account.name)}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {fallback(account.broker)}
          </p>
        </div>

        <TradingAccountStatusBadge status={account.status} />
      </div>
    </section>
  );
}
