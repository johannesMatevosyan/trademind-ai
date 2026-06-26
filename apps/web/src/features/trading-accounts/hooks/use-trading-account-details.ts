'use client';

import { useQuery } from '@tanstack/react-query';
import { getTradingAccountDetails } from '../api/trading-account-details.api';

export function useTradingAccountDetails(accountId: string) {
  return useQuery({
    queryKey: ['trading-account', accountId],
    queryFn: () => getTradingAccountDetails(accountId),
    enabled: Boolean(accountId),
  });
}
