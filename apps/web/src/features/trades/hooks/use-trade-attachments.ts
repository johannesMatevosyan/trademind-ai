import { useQuery } from '@tanstack/react-query';

import { getTradeAttachments } from '../api/get-trade-attachments.api';
import { tradeAttachmentsQueryKey } from './trade-attachments-query-key';

export function useTradeAttachments(
  tradeId: string,
) {
    return useQuery({
        queryKey: tradeAttachmentsQueryKey(tradeId),
        queryFn: () => getTradeAttachments(tradeId),
        enabled: Boolean(tradeId),
    });
}
