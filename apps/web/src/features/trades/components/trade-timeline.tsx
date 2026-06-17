import type { Trade } from '../types/trade.types';

interface TradeTimelineProps {
  trade: Trade;
}

function formatDate(date?: string | null) {
  if (!date) {
    return '—';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '—';
  }

  return parsedDate.toLocaleDateString();
}

function TimelineItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export function TradeTimeline({ trade }: TradeTimelineProps) {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>

      <p className="mt-1 text-sm text-slate-500">
        Important dates related to this trade.
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-5">
        <TimelineItem label="Opened" value={formatDate(trade.openedAt)} />
        <TimelineItem label="Closed" value={formatDate(trade.closedAt)} />
      </div>
    </section>
  );
}
