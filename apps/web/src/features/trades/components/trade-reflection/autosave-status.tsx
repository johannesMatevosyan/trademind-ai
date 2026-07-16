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
        <span className="text-amber-600">
          Unsaved changes
        </span>
      )}

      {status === 'saving' && (
        <span className="text-slate-500">
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
              className="font-medium text-red-700 underline underline-offset-2 hover:text-red-900"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
