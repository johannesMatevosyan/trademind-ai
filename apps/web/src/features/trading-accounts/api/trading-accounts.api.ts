import { apiFetch } from '@/shared/api/api-client';
import type { TradingAccount } from '../types/trading-account.types';

export async function getTradingAccounts(): Promise<TradingAccount[]> {
  const response = await apiFetch('/trading-accounts');

  if (!response.ok) {
    throw new Error('Failed to fetch trading accounts');
  }

  return response.json();
}
