import type { Trade } from '../types/trade.types';
import { TradeStatusBadge } from './trade-status-badge';

interface TradesTableProps {
  trades: Trade[];
}

function formatDate(value: string | null) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString();
}

function formatNullableNumber(value: number | null) {
  if (value === null) return '—';

  return value.toString();
}

function formatPnl(value: number | null) {
  if (value === null) return '—';

  return value > 0 ? `+${value}` : value.toString();
}

function getSymbolLabel(trade: Trade) {
  return trade.symbol?.code || trade.symbolId;
}

export function TradesTable({ trades }: TradesTableProps) {
  if (trades.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-600">
        No trades found yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl shadow-slate-300/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm text-slate-800">
          <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold tracking-wide">Symbol</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Side</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Entry</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Exit</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Quantity</th>
              <th className="px-4 py-3 font-semibold tracking-wide">PnL</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Opened</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Closed</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-slate-200 transition hover:bg-slate-100 even:bg-slate-50 last:border-b-0"
              >
                <td className="px-4 py-3 font-medium">{getSymbolLabel(trade)}</td>
                <td className="px-4 py-3">{trade.side}</td>
                <td className="px-4 py-3">
                  <TradeStatusBadge status={trade.status} />
                </td>
                <td className="px-4 py-3">{trade.entryPrice}</td>
                <td className="px-4 py-3">
                  {formatNullableNumber(trade.exitPrice)}
                </td>
                <td className="px-4 py-3">{trade.quantity}</td>
                <td className="px-4 py-3">{formatPnl(trade.pnl)}</td>
                <td className="px-4 py-3">{formatDate(trade.openedAt)}</td>
                <td className="px-4 py-3">{formatDate(trade.closedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
