'use client';

import {
    useEffect,
    useRef,
} from 'react';

import type { TradeAttachment } from '../../types/trade-attachment.type';
import { formatFileSize } from '../attachment.utils';

interface ImagePreviewModalProps {
    attachment: TradeAttachment | null;
    isDeleting?: boolean;
    onClose: () => void;
    onDelete: (attachment: TradeAttachment) => void;
}

export function ImagePreviewModal({
  attachment,
  isDeleting = false,
  onClose,
  onDelete,
}: ImagePreviewModalProps) {
    const closeButtonRef =
        useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!attachment) {
            return;
        }

        const previousOverflow =
        document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        function handleKeyDown(
            event: KeyboardEvent,
        ): void {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener(
            'keydown',
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                'keydown',
                handleKeyDown,
            );
        };
    }, [attachment, onClose]);

    if (!attachment) {
        return null;
    }

    const uploadedDate = new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: 'medium',
            timeStyle: 'short',
        },
    ).format(new Date(attachment.createdAt));

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="attachment-preview-title"
            className="fixed inset-0 z-50 flex flex-col bg-slate-950/95"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                onClose();
                }
            }}
        >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white md:px-6">
            <div className="min-w-0">
                <h2
                    id="attachment-preview-title"
                    title={attachment.filename}
                    className="truncate font-semibold"
                >
                    {attachment.filename}
                </h2>

                <p className="mt-1 text-xs text-slate-300">
                    {formatFileSize(attachment.size)}
                    {' · '}
                    {uploadedDate}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    onClick={() => onDelete(attachment)}
                    disabled={isDeleting}
                    className="rounded-lg border border-red-400/40 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>

                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close image preview"
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
                >
                    Close
                </button>
            </div>
        </header>

        <div
            className="flex min-h-0 flex-1 items-center justify-center p-4 md:p-8"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={attachment.url}
                alt={attachment.filename}
                className="max-h-full max-w-full object-contain"
            />
        </div>
        </div>
    );
}
