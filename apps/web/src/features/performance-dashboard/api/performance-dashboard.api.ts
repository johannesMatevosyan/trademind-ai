import { apiFetch } from "@/shared/api/api-client";
import { SymbolPerformanceItem } from "../components/symbol-breakdown-placeholder";
import { PnlHistoryItem, TradingActivityItem, WinLossData } from "../types/performance-dashboard.types";


export async function getPnlHistory(): Promise<PnlHistoryItem[]> {
  const response = await apiFetch(`/analytics/pnl-history`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics PNL history');
  }

  return response.json() as Promise<PnlHistoryItem[]>;
}

export async function getSymbolPerformance(): Promise<SymbolPerformanceItem[]> {
  const response = await apiFetch(`/analytics/symbol-performance`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics symbol performance');
  }

  return response.json() as Promise<SymbolPerformanceItem[]>;
}

export async function getWinLoss(): Promise<WinLossData> {
  const response = await apiFetch(`/analytics/win-loss`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics win-loss');
  }

  return response.json() as Promise<WinLossData>;
}

export async function getTradingActivity(): Promise<TradingActivityItem[]> {
  const response = await apiFetch(`/analytics/trading-activity`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics trading activity');
  }

  return response.json() as Promise<TradingActivityItem[]>;
}
