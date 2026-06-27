import { apiFetch } from "@/shared/api/api-client";


export async function getPnlHistory(): Promise<any> {
  const response = await apiFetch(`/analytics/pnl-history`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics PNL history');
  }

  return response.json() as Promise<any>;
}

export async function getSymbolPerformance(): Promise<any> {
  const response = await apiFetch(`/analytics/symbol-performance`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics symbol performance');
  }

  return response.json() as Promise<any>;
}

export async function getWinLoss(): Promise<any> {
  const response = await apiFetch(`/analytics/win-loss`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics win-loss');
  }

  return response.json() as Promise<any>;
}

export async function getTradingActivity(): Promise<any> {
  const response = await apiFetch(`/analytics/trading-activity`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics trading activity');
  }

  return response.json() as Promise<any>;
}
