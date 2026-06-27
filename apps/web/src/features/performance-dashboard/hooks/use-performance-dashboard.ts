'use client';

import { useAnalyticsOverview } from '@/features/analytics/hooks/use-analytics-overview';
import { useQuery } from '@tanstack/react-query';
import { getPnlHistory, getSymbolPerformance, getTradingActivity, getWinLoss } from '../api/performance-dashboard.api';
import type { PerformanceDashboardData } from '../types/performance-dashboard.types';

export function usePerformanceDashboard() {

  const overview = useAnalyticsOverview();

  const pnlHistory = useQuery({
    queryKey: ['analytics', 'pnl-history'],
    queryFn: getPnlHistory,
  });

  const symbolPerformance = useQuery({
    queryKey: ['analytics', 'symbol-performance'],
    queryFn: getSymbolPerformance,
  });

  const winLoss = useQuery({
    queryKey: ['analytics', 'win-loss'],
    queryFn: getWinLoss,
  });

  const tradingActivity = useQuery({
    queryKey: ['analytics', 'trading-activity'],
    queryFn: getTradingActivity,
  });

  const dashboardData: PerformanceDashboardData | undefined = overview.data
    ? {
        totalTrades: overview.data.totalTrades ?? 0,
        openTrades: overview.data.openTrades ?? 0,
        closedTrades: overview.data.closedTrades ?? 0,
        totalPnl: Number(overview.data.totalRealizedPnl ?? 0),
        winRate: Number(overview.data.winRate ?? 0),
        profitFactor: null,
      }
    : undefined;

  return {
    overview: {
      data: dashboardData,
      isLoading: overview.isLoading,
      isError: overview.isError,
    },
    pnlHistory,
    symbolPerformance,
    winLoss,
    tradingActivity,
  };
}
