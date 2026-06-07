'use client';

import { useAnalyticsOverview } from '../../hooks/use-analytics-overview';
import { AnalyticsOverviewCard } from './analytics-overview-card';

export function AnalyticsOverview() {
  const { data, isLoading, isError } =
    useAnalyticsOverview();

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (isError) {
    return <div>Failed to load analytics</div>;
  }

  if (!data) {
    return <div>No analytics available</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
      <AnalyticsOverviewCard
        title="Total Trades"
        value={data.totalTrades}
      />

      <AnalyticsOverviewCard
        title="Open Trades"
        value={data.openTrades}
      />

      <AnalyticsOverviewCard
        title="Closed Trades"
        value={data.closedTrades}
      />

      <AnalyticsOverviewCard
        title="Win Rate"
        value={`${data.winRate}%`}
      />

      <AnalyticsOverviewCard
        title="Realized PnL"
        value={data.totalRealizedPnl}
      />

      <AnalyticsOverviewCard
        title="Average PnL"
        value={data.averageRealizedPnl}
      />

      <AnalyticsOverviewCard
        title="Best Trade"
        value={data.bestTradePnl}
      />

      <AnalyticsOverviewCard
        title="Worst Trade"
        value={data.worstTradePnl}
      />
    </div>
  );
}
