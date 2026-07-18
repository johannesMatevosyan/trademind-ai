import { apiFetch } from "@/shared/api/api-client";

import type { TradeAttachment } from '../types/trade-attachment.type';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:3000/api';

export async function getTradeAttachments(
  tradeId: string,
): Promise<TradeAttachment[]> {
    const response = await apiFetch(
        `/trades/${encodeURIComponent(tradeId)}/attachments`,
    );

    if (!response.ok) {
        throw new Error(
            await getResponseError(
                response,
                'Unable to load trade attachments.',
            ),
        );
    }

    const attachments =
        (await response.json()) as TradeAttachment[];

    return attachments.map((attachment) => ({
        ...attachment,
        url: resolveAttachmentUrl(attachment.url),
    }));
}

function resolveAttachmentUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    return new URL(url, API_URL).toString();
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
