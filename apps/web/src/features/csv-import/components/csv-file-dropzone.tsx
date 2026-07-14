'use client';

import {
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
} from 'react';

interface CsvFileDropzoneProps {
  fileName?: string;
  disabled?: boolean;
  onFileSelected: (file: File) => void;
}

const ALLOWED_MIME_TYPES = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'text/plain',
]);

function isCsvFile(file: File): boolean {
  const hasCsvExtension = file.name
    .toLowerCase()
    .endsWith('.csv');

  const hasCompatibleMimeType =
    file.type.length === 0 ||
    ALLOWED_MIME_TYPES.has(file.type);

  return hasCsvExtension && hasCompatibleMimeType;
}

export function CsvFileDropzone({
  fileName,
  disabled = false,
  onFileSelected,
}: CsvFileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] =
    useState(false);
  const [fileError, setFileError] = useState<
    string | null
  >(null);

  function processFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!isCsvFile(file)) {
      setFileError(
        'Please select a valid .csv file',
      );
      return;
    }

    setFileError(null);
    onFileSelected(file);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    processFile(event.target.files?.[0]);

    event.target.value = '';
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    processFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        disabled={disabled}
        onChange={handleInputChange}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if (
            !disabled &&
            (event.key === 'Enter' ||
              event.key === ' ')
          ) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={[
          'rounded-xl border-2 border-dashed p-8 text-center transition',
          isDragging
            ? 'border-slate-500 bg-slate-50'
            : 'border-slate-300 bg-white',
          disabled
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:border-slate-400 hover:bg-slate-50',
        ].join(' ')}
      >
        <p className="text-sm font-medium text-slate-900">
          Drop a CSV file here
        </p>

        <p className="mt-1 text-sm text-slate-500">
          or click to choose a file
        </p>

        <p className="mt-3 text-xs text-slate-400">
          Maximum size: 2 MB · Maximum rows: 500
        </p>

        {fileName && (
          <p className="mt-4 text-sm font-medium text-slate-700">
            Selected: {fileName}
          </p>
        )}
      </div>

      {fileError && (
        <p className="text-sm text-red-600">
          {fileError}
        </p>
      )}
    </div>
  );
}
