import { apiFetch } from '@/shared/api/api-client';
import type { Trade } from '../types/trade.types';

export interface CreateTradePayload {
  tradingAccountId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  status?: 'OPEN' | 'CLOSED' | 'CANCELLED';
  entryPrice: string;
  exitPrice?: string;
  quantity: string;
  pnl?: string;
  notes?: string;
  openedAt?: string;
  closedAt?: string;
}

export async function createTrade(
  payload: CreateTradePayload
): Promise<Trade> {
  const response = await apiFetch('/trades', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create trade');
  }

  return response.json() as Promise<Trade>;
}
