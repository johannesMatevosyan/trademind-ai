import { apiFetch } from '@/shared/api/api-client';
import type { TradingAccount } from '../types/trading-account.types';

export async function getTradingAccountDetails(
  accountId: string
): Promise<TradingAccount> {
  const response = await apiFetch(`/trading-accounts/${accountId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch trading account details');
  }

  return response.json();
}
