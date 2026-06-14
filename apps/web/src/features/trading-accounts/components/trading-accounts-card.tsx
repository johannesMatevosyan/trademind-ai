import type { TradingAccount } from '../types/trading-account.types';
import { TradingAccountStatusBadge } from './trading-account-status-badge';

interface TradingAccountsCardProps {
  account: TradingAccount;
}

function formatFallback(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '—' : value;
}

function formatBalance(value?: string | number | null) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return numericValue.toLocaleString();
}

function formatDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString();
}

export function TradingAccountsCard({ account }: TradingAccountsCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {formatFallback(account.name)}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Broker: {formatFallback(account.broker)}
          </p>
        </div>

        <TradingAccountStatusBadge status={account.status} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Currency</p>
          <p className="mt-1 font-medium text-slate-900">
            {formatFallback(account.currency)}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Balance</p>
          <p className="mt-1 font-medium text-slate-900">
            {formatBalance(account.balance)}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Created</p>
          <p className="mt-1 font-medium text-slate-900">
            {formatDate(account.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
