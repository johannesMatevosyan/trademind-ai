'use client';

import type { TradeAttachment } from '../../types/trade-attachment.type';
import { formatFileSize } from '../attachment.utils';

interface AttachmentCardProps {
  attachment: TradeAttachment;
  isDeleting: boolean;
  onPreview: (attachment: TradeAttachment) => void;
  onDelete: (attachment: TradeAttachment) => void;
}

export function AttachmentCard({
  attachment,
  isDeleting,
  onPreview,
  onDelete,
}: AttachmentCardProps) {
    const uploadedDate = new Intl.DateTimeFormat(
        undefined,
        {
        dateStyle: 'medium',
        },
    ).format(new Date(attachment.createdAt));

    return (
        <article
            className={[
                'overflow-hidden rounded-xl border border-slate-200 bg-white transition',
                isDeleting
                ? 'pointer-events-none opacity-50'
                : 'hover:border-slate-300 hover:shadow-sm',
            ].join(' ')}
            >
            <button
                type="button"
                onClick={() => onPreview(attachment)}
                disabled={isDeleting}
                className="group block w-full text-left"
                aria-label={`Preview ${attachment.filename}`}
            >
                <div className="aspect-video overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={attachment.url}
                    alt={attachment.filename}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                />
                </div>
            </button>

            <div className="p-3">
                <p
                    title={attachment.filename}
                    className="truncate text-sm font-semibold text-slate-900"
                    >
                    {attachment.filename}
                </p>

                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span>{formatFileSize(attachment.size)}</span>
                    <span aria-hidden="true">•</span>
                    <span>{uploadedDate}</span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={() => onPreview(attachment)}
                        disabled={isDeleting}
                        className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed"
                    >
                        Preview
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(attachment)}
                        disabled={isDeleting}
                        aria-label={`Delete ${attachment.filename}`}
                        className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </article>
    );
}
