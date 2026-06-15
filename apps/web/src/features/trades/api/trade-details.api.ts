import { apiFetch } from '@/shared/api/api-client';
import type { Trade } from '../types/trade.types';

export async function getTradeDetails(tradeId: string): Promise<Trade> {
  const response = await apiFetch(`/trades/${tradeId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch trade details');
  }

  return response.json() as Promise<Trade>;
}
