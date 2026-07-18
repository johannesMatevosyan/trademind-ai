import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { deleteTradeAttachment } from '../api/delete-trade-attachment.api';
import type { DeleteTradeAttachmentResponse, TradeAttachment } from '../types/trade-attachment.type';
import { tradeAttachmentsQueryKey } from './trade-attachments-query-key';

interface DeleteAttachmentContext {
  previousAttachments?: TradeAttachment[];
}

export function useDeleteTradeAttachment(
  tradeId: string,
) {
  const queryClient = useQueryClient();
  const queryKey = tradeAttachmentsQueryKey(tradeId);

  return useMutation<
    DeleteTradeAttachmentResponse,
    Error,
    string,
    DeleteAttachmentContext
  >({
    mutationFn: (attachmentId: string) =>
      deleteTradeAttachment({
        tradeId,
        attachmentId,
      }),

    onMutate: async (
      attachmentId,
    ): Promise<DeleteAttachmentContext> => {
        await queryClient.cancelQueries({
            queryKey,
        });

        const previousAttachments =
            queryClient.getQueryData<TradeAttachment[]>(
            queryKey,
            );

        queryClient.setQueryData<TradeAttachment[]>(
            queryKey,
            (currentAttachments = []) =>
            currentAttachments.filter(
                (attachment) =>
                attachment.id !== attachmentId,
            ),
        );

        return {
            previousAttachments,
        };
    },

    onError: (_error, _attachmentId, context) => {
        if (context?.previousAttachments) {
            queryClient.setQueryData(
            queryKey,
            context.previousAttachments,
            );
        }
    },

    onSettled: async () => {
        await queryClient.invalidateQueries({
            queryKey,
        });
    },
  });
}
