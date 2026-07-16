import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { updateTradeReflection } from '../api/update-trade-reflection.api';
import type {
    TradeDetails,
    UpdateTradeReflectionInput,
} from '../types/trade.types';

interface UseUpdateTradeReflectionParams {
  tradeId: string;
}

export function useUpdateTradeReflection({
  tradeId,
}: UseUpdateTradeReflectionParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateTradeReflectionInput,
    ) => updateTradeReflection(tradeId, payload),

    onSuccess: (updatedTrade) => {
      queryClient.setQueryData<TradeDetails>(
        ['trade-details', tradeId],
        (currentTrade) => {
          if (!currentTrade) {
            return currentTrade;
          }

          return {
            ...currentTrade,
            notes: updatedTrade.notes,
            psychology: updatedTrade.psychology,
            lessonsLearned:
              updatedTrade.lessonsLearned,
          };
        },
      );
    },
  });
}
