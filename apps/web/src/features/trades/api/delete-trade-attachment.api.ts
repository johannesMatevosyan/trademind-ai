import { apiFetch } from '@/shared/api/api-client';

import type { DeleteTradeAttachmentResponse } from '../types/trade-attachment.type';

interface DeleteTradeAttachmentParams {
    tradeId: string;
    attachmentId: string;
}

export async function deleteTradeAttachment({
  tradeId,
  attachmentId,
}: DeleteTradeAttachmentParams): Promise<DeleteTradeAttachmentResponse> {
    const response = await apiFetch(
        `/trades/${encodeURIComponent(
        tradeId,
        )}/attachments/${encodeURIComponent(attachmentId)}`,
        {
        method: 'DELETE',
        },
    );

    if (!response.ok) {
        throw new Error(
            await getResponseError(
                response,
                'Unable to delete the trade attachment.',
            ),
        );
    }

    return response.json() as Promise<DeleteTradeAttachmentResponse>;
}

async function getResponseError(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
    const body = (await response.json().catch(() => null)) as {
        message?: string | string[];
    } | null;

    if (Array.isArray(body?.message)) {
        return body.message.join(', ');
    }

    return body?.message ?? fallbackMessage;
}
