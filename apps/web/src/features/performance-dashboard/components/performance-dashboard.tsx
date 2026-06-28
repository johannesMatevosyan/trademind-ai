'use client';

import { usePerformanceDashboard } from '../hooks/use-performance-dashboard';
import { PerformanceSummary } from './performance-summary';
import { PnlHistoryChart } from './pnl-history-chart';
import { SymbolBreakdownPlaceholder } from './symbol-breakdown-placeholder';
import { TradingActivityPlaceholder } from './trading-activity-placeholder';
import { WinLossOverview } from './win-loss-overview';

export function PerformanceDashboard() {
  const { overview, pnlHistory, symbolPerformance, winLoss, tradingActivity } = usePerformanceDashboard();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          Performance Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track trading performance, risk, and execution quality.
        </p>
      </div>

      <PerformanceSummary data={overview.data} isLoading={overview.isLoading} isError={overview.isError} />

      <div className="grid gap-6 xl:grid-cols-2">

        <PnlHistoryChart
          data={pnlHistory.data ?? []}
          isLoading={pnlHistory.isLoading}
          isError={pnlHistory.isError}
        />

        <WinLossOverview
          data={winLoss.data ?? []}
          isLoading={winLoss.isLoading}
          isError={winLoss.isError}/>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SymbolBreakdownPlaceholder
          data={symbolPerformance.data ?? []}
          isLoading={symbolPerformance.isLoading}
          isError={symbolPerformance.isError} />

        <TradingActivityPlaceholder
          data={tradingActivity.data ?? []}
          isLoading={tradingActivity.isLoading}
          isError={tradingActivity.isError}
        />
      </div>
    </section>
  );
}
