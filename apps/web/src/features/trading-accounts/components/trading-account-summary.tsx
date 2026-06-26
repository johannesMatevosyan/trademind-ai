import type { TradingAccount } from '../types/trading-account.types';

interface Props {
  account: TradingAccount;
}

function fallback(value?: string | number | null) {
  return value ?? '—';
}

function formatDate(date?: string | null) {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString();
}

function SummaryItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function TradingAccountSummary({ account }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Account Summary</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryItem label="Balance" value={fallback(account.balance)} />
        <SummaryItem label="Currency" value={fallback(account.currency)} />
        <SummaryItem label="Created" value={formatDate(account.createdAt)} />
        <SummaryItem label="Updated" value={formatDate(account.updatedAt)} />
      </div>
    </section>
  );
}
