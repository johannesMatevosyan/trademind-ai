import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { uploadTradeAttachments } from '../api/upload-trade-attachments.api';
import { tradeAttachmentsQueryKey } from './trade-attachments-query-key';

export function useUploadTradeAttachments(
  tradeId: string,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (files: File[]) =>
        uploadTradeAttachments(tradeId, files),

        onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: tradeAttachmentsQueryKey(tradeId),
        });
        },
    });
}
