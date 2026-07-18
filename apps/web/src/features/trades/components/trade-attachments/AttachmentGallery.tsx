'use client';

import {
    useState,
} from 'react';

import { useDeleteTradeAttachment } from '../../hooks/use-delete-trade-attachment';
import type { TradeAttachment } from '../../types/trade-attachment.type';
import { AttachmentCard } from './AttachmentCard';
import { ImagePreviewModal } from './ImagePreviewModal';

interface AttachmentGalleryProps {
  tradeId: string;
  attachments: TradeAttachment[];
}

export function AttachmentGallery({
  tradeId,
  attachments,
}: AttachmentGalleryProps) {
    const [previewAttachment, setPreviewAttachment] =
        useState<TradeAttachment | null>(null);

    const deleteMutation =
        useDeleteTradeAttachment(tradeId);

    function handleDelete(
        attachment: TradeAttachment,
    ): void {
        const confirmed = window.confirm(
        `Delete "${attachment.filename}"? This action cannot be undone.`,
        );

        if (!confirmed) {
        return;
        }

        if (previewAttachment?.id === attachment.id) {
        setPreviewAttachment(null);
        }

        deleteMutation.mutate(attachment.id);
    }

    const deleteError =
        deleteMutation.error instanceof Error
        ? deleteMutation.error.message
        : deleteMutation.isError
            ? 'Unable to delete the attachment.'
            : null;

    return (
        <>
        <div>
            <div className="mb-3">
            <h3 className="font-semibold text-slate-900">
                Uploaded images
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                Select an image to open the full preview.
            </p>
            </div>

            {deleteError && (
            <p
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
                {deleteError}
            </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {attachments.map((attachment) => (
                <AttachmentCard
                key={attachment.id}
                attachment={attachment}
                isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables ===
                    attachment.id
                }
                onPreview={setPreviewAttachment}
                onDelete={handleDelete}
                />
            ))}
            </div>
        </div>

        <ImagePreviewModal
            attachment={previewAttachment}
            onClose={() => setPreviewAttachment(null)}
            onDelete={handleDelete}
            isDeleting={
            deleteMutation.isPending &&
            deleteMutation.variables ===
                previewAttachment?.id
            }
        />
        </>
    );
}
