import { useQuery } from '@tanstack/react-query';
import { getTrades } from '../api/trades.api';

export function useTrades() {
  return useQuery({
    queryKey: ['trades'],
    queryFn: getTrades,
  });
}
