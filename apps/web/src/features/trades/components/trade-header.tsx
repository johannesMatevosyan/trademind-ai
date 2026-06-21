import Link from 'next/link';
import { TradeStatus } from '../types/trade.types';
import { TradeSideBadge } from './trade-side-badge';
import { TradeStatusBadge } from './trade-status-badge';

interface TradeHeaderProps {
  symbol?: string | null;
  accountName?: string | null;
  tradeId: string;
  side?: string | null;
  status: string | null;
}

function formatValue(value?: string | null) {
  return value?.trim() || '—';
}

function formatTradeId(id: string) {
  return id ? `Trade #${id.slice(0, 8)}...` : 'Trade #—';
}

export function TradeHeader({
  symbol,
  accountName,
  tradeId,
  side,
  status,
}: TradeHeaderProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-950">
              {formatValue(symbol)}
            </h1>

            <span
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
              title={`Trade ID: ${tradeId}`}
              >
              {formatTradeId(tradeId)}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {formatValue(accountName)}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Trade details and execution summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TradeSideBadge side={side} />
          <TradeStatusBadge status={(status ?? 'OPEN') as TradeStatus} />
          <Link
            href={`/trading/${tradeId}/edit`}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>
        </div>
      </div>
    </section>
  );
}
