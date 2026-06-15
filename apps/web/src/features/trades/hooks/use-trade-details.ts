import { useQuery } from '@tanstack/react-query';
import { getTradeDetails } from '../api/trade-details.api';

export function useTradeDetails(tradeId: string) {
  return useQuery({
    queryKey: ['trade-details', tradeId],
    queryFn: () => getTradeDetails(tradeId),
    enabled: Boolean(tradeId),
  });
}
