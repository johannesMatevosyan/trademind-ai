'use client';

import { useTradeAttachments } from '../hooks/use-trade-attachments';
import { MAX_TRADE_ATTACHMENTS } from './attachment.constants';
import { AttachmentUploader } from './AttachmentUploader';

interface TradeAttachmentsProps {
  tradeId: string;
}

export function TradeAttachments({
  tradeId,
}: TradeAttachmentsProps) {
  const {
    data: attachments,
    isLoading,
    isError,
    error,
  } = useTradeAttachments(tradeId);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="font-semibold text-red-800">
          Attachments
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : 'Unable to load trade attachments.'}
        </p>
      </section>
    );
  }

  const attachmentCount = attachments?.length ?? 0;
  const availableSlots = Math.max(
    MAX_TRADE_ATTACHMENTS - attachmentCount,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Attachments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add charts, broker screenshots, and other
            visual evidence for this trade.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {attachmentCount} / {MAX_TRADE_ATTACHMENTS}
        </span>
      </div>

      <AttachmentUploader
        tradeId={tradeId}
        availableSlots={availableSlots}
      />

      <div className="mt-6 border-t border-slate-200 pt-5">
        {attachmentCount === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
            <p className="font-medium text-slate-800">
              No attachments yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Upload your first trading screenshot.
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            {attachmentCount} attachment
            {attachmentCount === 1 ? '' : 's'} uploaded.
            The image gallery will be added in the next
            checkpoint.
          </p>
        )}
      </div>
    </section>
  );
}
