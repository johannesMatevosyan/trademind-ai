'use client';

import {
    type ChangeEvent,
    type DragEvent,
    useRef,
    useState,
} from 'react';

import { ATTACHMENT_INPUT_ACCEPT } from './attachment.constants';

interface AttachmentDropzoneProps {
  disabled?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export function AttachmentDropzone({
  disabled = false,
  onFilesSelected,
}: AttachmentDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleBrowse(): void {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (files.length) {
      onFilesSelected(files);
    }

    event.target.value = '';
  }

  function handleDragEnter(
    event: DragEvent<HTMLDivElement>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = disabled
        ? 'none'
        : 'copy';
    }
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    if (
      event.currentTarget.contains(
        event.relatedTarget as Node | null,
      )
    ) {
      return;
    }

    setIsDragging(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (disabled) {
      return;
    }

    const files = Array.from(
      event.dataTransfer.files ?? [],
    );

    if (files.length) {
      onFilesSelected(files);
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleBrowse}
      onKeyDown={(event) => {
        if (
          !disabled &&
          (event.key === 'Enter' || event.key === ' ')
        ) {
          event.preventDefault();
          handleBrowse();
        }
      }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
        'flex min-h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition sm:px-6',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2',
        disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
            : 'cursor-pointer hover:border-slate-400 hover:bg-slate-50',
        isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-slate-50/50',
        ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ATTACHMENT_INPUT_ACCEPT}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
      />

      <div
        aria-hidden="true"
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl"
      >
        ↑
      </div>

      <p className="font-semibold text-slate-900">
        Drag trading screenshots here
      </p>

      <p className="mt-1 text-sm text-slate-500">
        or click to browse files
      </p>

      <p className="mt-4 text-xs text-slate-400">
        PNG, JPG, JPEG or WEBP · Maximum 5 MB each
      </p>
    </div>
  );
}
