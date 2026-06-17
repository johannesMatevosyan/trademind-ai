import type { Trade } from '../types/trade.types';
import { TradeHeader } from './trade-header';

interface TradeDetailsCardProps {
  trade: Trade;
}

function fallback(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '—' : value;
}

function formatDate(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString();
}

export function TradeDetailsCard({ trade }: TradeDetailsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <TradeHeader
        symbol={trade.symbol?.code ?? null}
        accountName={trade.tradingAccountId ?? null}
        tradeId={trade.id}
        side={trade.side}
        status={trade.status}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailItem label="Entry" value={fallback(trade.entryPrice)} />
        <DetailItem label="Exit" value={fallback(trade.exitPrice)} />
        <DetailItem label="Quantity" value={fallback(trade.quantity)} />
        <DetailItem label="PNL" value={fallback(trade.pnl)} />
        <DetailItem label="Opened" value={formatDate(trade.openedAt)} />
        <DetailItem label="Closed" value={formatDate(trade.closedAt)} />
      </div>
    </section>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}
