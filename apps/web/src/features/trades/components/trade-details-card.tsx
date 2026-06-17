import type { Trade } from '../types/trade.types';
import { TradeAccountInfo } from './trade-account-info';
import { TradeHeader } from './trade-header';
import { TradeMetrics } from './trade-metrics';
import { TradeNotesPlaceholder } from './trade-notes-placeholder';
import { TradeTimeline } from './trade-timeline';

interface TradeDetailsCardProps {
  trade: Trade;
}

export function TradeDetailsCard({ trade }: TradeDetailsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6">
      <TradeHeader
        symbol={trade.symbol?.code ?? null}
        accountName={trade.tradingAccountId ?? null}
        tradeId={trade.id}
        side={trade.side}
        status={trade.status}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 3xl:grid-cols-3">
        <TradeMetrics trade={trade} />
      </div>

      <TradeAccountInfo trade={trade} />

      <TradeTimeline trade={trade} />

      <TradeNotesPlaceholder />
    </section>
  );
}
