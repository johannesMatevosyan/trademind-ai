'use client';

import { useAnalyticsOverview } from '@/features/analytics/hooks/use-analytics-overview';
import type { PerformanceDashboardData } from '../types/performance-dashboard.types';

export function usePerformanceDashboard() {
  const { data, isLoading, isError } = useAnalyticsOverview();

  const dashboardData: PerformanceDashboardData | undefined = data
    ? {
        totalTrades: data.totalTrades ?? 0,
        openTrades: data.openTrades ?? 0,
        closedTrades: data.closedTrades ?? 0,
        totalPnl: Number(data.totalRealizedPnl ?? 0),
        winRate: Number(data.winRate ?? 0),
        profitFactor: null,
      }
    : undefined;

  return {
    data: dashboardData,
    isLoading,
    isError,
  };
}
