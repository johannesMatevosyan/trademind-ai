import type { Trade } from '../types/trade.types';

interface TradeAccountInfoProps {
  trade: Trade;
}

function fallback(value: string | null | undefined) {
  return value ?? '—';
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-all text-lg font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export function TradeAccountInfo({ trade }: TradeAccountInfoProps) {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Trading account details connected to this trade.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard label="Account ID" value={fallback(trade.tradingAccountId)} />
        <InfoCard label="Broker" value="—" />
        <InfoCard label="Currency" value="—" />
      </div>
    </section>
  );
}
