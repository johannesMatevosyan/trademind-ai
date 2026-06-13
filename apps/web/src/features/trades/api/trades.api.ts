import { apiFetch } from '@/shared/api/api-client';
import type { Trade } from '../types/trade.types';

export async function getTrades(): Promise<Trade[]> {
  const response = await apiFetch('/trades');

  if (!response.ok) {
    throw new Error('Failed to fetch trades');
  }

  return response.json();
}
