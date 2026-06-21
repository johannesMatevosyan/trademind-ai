'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    updateTrade,
    type UpdateTradePayload,
} from '../api/update-trade.api';

interface UseUpdateTradeParams {
  tradeId: string;
}

export function useUpdateTrade({ tradeId }: UseUpdateTradeParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTradePayload) =>
      updateTrade(tradeId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
    },
  });
}
