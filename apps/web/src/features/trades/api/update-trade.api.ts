import { apiFetch } from '@/shared/api/api-client';
import type { Trade } from '../types/trade.types';

export interface UpdateTradePayload {
  side?: string;
  status?: string;
  entryPrice?: string;
  exitPrice?: string | null;
  quantity?: string;
  openedAt?: string;
  closedAt?: string | null;
  notes?: string | null;
}

export async function updateTrade(
  tradeId: string,
  payload: UpdateTradePayload
): Promise<Trade> {
  const response = await apiFetch(`/trades/${tradeId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update trade');
  }

  return response.json();
}
