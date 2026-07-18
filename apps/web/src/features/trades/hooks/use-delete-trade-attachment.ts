import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { deleteTradeAttachment } from '../api/delete-trade-attachment.api';
import { tradeAttachmentsQueryKey } from './trade-attachments-query-key';

export function useDeleteTradeAttachment(
  tradeId: string,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attachmentId: string) =>
        deleteTradeAttachment({
            tradeId,
            attachmentId,
        }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: tradeAttachmentsQueryKey(tradeId),
            });
        },
    });
}
