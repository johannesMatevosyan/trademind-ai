import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrade } from '../api/create-trade.api';

export function useCreateTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrade,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['trades'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['analytics-overview'],
      });
    },
  });
}
