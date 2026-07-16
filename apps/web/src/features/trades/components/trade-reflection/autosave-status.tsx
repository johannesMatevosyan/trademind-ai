export type ReflectionSaveStatus =
  | 'idle'
  | 'unsaved'
  | 'saving'
  | 'saved'
  | 'error';

interface AutosaveStatusProps {
  status: ReflectionSaveStatus;
  onRetry?: () => void;
}

export function AutosaveStatus({
  status,
  onRetry,
}: AutosaveStatusProps) {
  return (
    <div
      className="min-h-5 text-sm"
      role="status"
      aria-live="polite"
    >
      {status === 'unsaved' && (
        <span className="font-medium text-amber-600">
          Unsaved changes
        </span>
      )}

      {status === 'saving' && (
        <span className="inline-flex items-center gap-2 text-slate-500">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
          />

          Saving...
        </span>
      )}

      {status === 'saved' && (
        <span className="font-medium text-emerald-600">
          ✓ Saved
        </span>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2">
          <span className="font-medium text-red-600">
            Could not save
          </span>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-medium text-red-700 underline underline-offset-2 transition hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
