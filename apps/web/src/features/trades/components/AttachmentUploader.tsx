'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useUploadTradeAttachments } from '../hooks/use-upload-trade-attachments';
import {
  createFileIdentity,
  formatFileSize,
  validateAttachmentFiles,
} from './attachment.utils';
import { AttachmentDropzone } from './AttachmentDropzone';

interface SelectedFilePreview {
  file: File;
  previewUrl: string;
}

interface AttachmentUploaderProps {
  tradeId: string;
  availableSlots: number;
}

export function AttachmentUploader({
  tradeId,
  availableSlots,
}: AttachmentUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<
    SelectedFilePreview[]
  >([]);
  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

  const uploadMutation =
    useUploadTradeAttachments(tradeId);

  const selectedFileCount = selectedFiles.length;

  const effectiveAvailableSlots = Math.max(
    availableSlots - selectedFileCount,
    0,
  );

  const selectedFilesRef =
  useRef<SelectedFilePreview[]>([]);

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      selectedFilesRef.current.forEach(
        ({ previewUrl }) => {
          URL.revokeObjectURL(previewUrl);
        },
      );
    };
  }, []);

  const isUploadDisabled =
    uploadMutation.isPending ||
    selectedFiles.length === 0;

  const uploadError =
    uploadMutation.error instanceof Error
      ? uploadMutation.error.message
      : uploadMutation.isError
        ? 'Unable to upload the selected attachments.'
        : null;

  function addFiles(files: File[]): void {
    setValidationErrors([]);
    uploadMutation.reset();

    const existingIdentities = new Set(
      selectedFiles.map(({ file }) =>
        createFileIdentity(file),
      ),
    );

    const uniqueFiles = files.filter(
      (file) =>
        !existingIdentities.has(createFileIdentity(file)),
    );

    const duplicateCount =
      files.length - uniqueFiles.length;

    const validation = validateAttachmentFiles({
      files: uniqueFiles,
      availableSlots: effectiveAvailableSlots,
    });

    const newErrors = [...validation.errors];

    if (duplicateCount > 0) {
      newErrors.push(
        `${duplicateCount} duplicate file${
          duplicateCount === 1 ? ' was' : 's were'
        } ignored.`,
      );
    }

    setValidationErrors(newErrors);

    if (!validation.acceptedFiles.length) {
      return;
    }

    setSelectedFiles((currentFiles) => [
      ...currentFiles,
      ...validation.acceptedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeFile(fileIdentity: string): void {
    setSelectedFiles((currentFiles) => {
      const fileToRemove = currentFiles.find(
        ({ file }) =>
          createFileIdentity(file) === fileIdentity,
      );

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }

      return currentFiles.filter(
        ({ file }) =>
          createFileIdentity(file) !== fileIdentity,
      );
    });

    setValidationErrors([]);
    uploadMutation.reset();
  }

  async function handleUpload(): Promise<void> {
    if (!selectedFiles.length) {
      return;
    }

    try {
      await uploadMutation.mutateAsync(
        selectedFiles.map(({ file }) => file),
      );

      selectedFiles.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
      });

      setSelectedFiles([]);
      setValidationErrors([]);
    } catch {
      // Mutation state displays the API error.
    }
  }

  const selectedTotalSize = useMemo(
    () =>
      selectedFiles.reduce(
        (total, { file }) => total + file.size,
        0,
      ),
    [selectedFiles],
  );

  return (
    <div className="space-y-4">
      <AttachmentDropzone
        disabled={
          uploadMutation.isPending ||
          effectiveAvailableSlots === 0
        }
        onFilesSelected={addFiles}
      />

      {validationErrors.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <p className="font-medium text-amber-900">
            Some files could not be added
          </p>

          <ul className="mt-2 space-y-1 text-sm text-amber-800">
            {validationErrors.map((error) => (
              <li key={error}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-medium text-slate-900">
                Ready to upload
              </h3>

              <p className="text-sm text-slate-500">
                {selectedFileCount} file
                {selectedFileCount === 1 ? '' : 's'} ·{' '}
                {formatFileSize(selectedTotalSize)}
              </p>
            </div>

            <button
              type="button"
              disabled={isUploadDisabled}
              onClick={() => {
                void handleUpload();
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadMutation.isPending
                ? 'Uploading...'
                : `Upload ${selectedFileCount} image${
                    selectedFileCount === 1 ? '' : 's'
                  }`}
            </button>
          </div>

          {uploadMutation.isPending && (
            <div
              aria-label="Uploading attachments"
              className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"
            >
              <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-700" />
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedFiles.map(
              ({ file, previewUrl }) => {
                const fileIdentity =
                  createFileIdentity(file);

                return (
                  <article
                    key={fileIdentity}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="aspect-video bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt={`Preview of ${file.name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p
                          title={file.name}
                          className="truncate text-sm font-medium text-slate-900"
                        >
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={uploadMutation.isPending}
                        onClick={() =>
                          removeFile(fileIdentity)
                        }
                        aria-label={`Remove ${file.name}`}
                        className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {uploadError}
        </p>
      )}

      {uploadMutation.isSuccess &&
        selectedFiles.length === 0 && (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            Attachments uploaded successfully.
          </p>
        )}
    </div>
  );
}
