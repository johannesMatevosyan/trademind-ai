import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { importTrades } from '../api/import-trades.api';

import type {
    CsvImportRequest,
    CsvImportResult,
} from '../types/csv-import.types';

export function useImportTrades() {
  const queryClient = useQueryClient();

  return useMutation<
    CsvImportResult,
    Error,
    CsvImportRequest
  >({
    mutationFn: importTrades,

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['trades'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['analytics'],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'trading-account',
            variables.tradingAccountId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ['trading-accounts'],
        }),
      ]);
    },
  });
}
