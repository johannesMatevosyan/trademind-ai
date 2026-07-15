import { apiFetch } from '@/shared/api/api-client';
import type {
    Trade,
    UpdateTradeReflectionInput,
} from '../types/trade.types';

export async function updateTradeReflection(
  tradeId: string,
  payload: UpdateTradeReflectionInput,
): Promise<Trade> {
  const response = await apiFetch(
    `/trades/${tradeId}/reflection`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update trade reflection');
  }

  return response.json();
}
