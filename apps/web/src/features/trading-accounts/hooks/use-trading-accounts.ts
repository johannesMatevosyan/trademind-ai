import { useQuery } from '@tanstack/react-query';
import { getTradingAccounts } from '../api/trading-accounts.api';

export function useTradingAccounts() {
  return useQuery({
    queryKey: ['trading-accounts'],
    queryFn: getTradingAccounts,
  });
}
