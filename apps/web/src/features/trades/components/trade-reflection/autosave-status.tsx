export type ReflectionSaveStatus =
  | 'idle'
  | 'saving'
  | 'saved'
  | 'error';

interface AutosaveStatusProps {
  status: ReflectionSaveStatus;
}

export function AutosaveStatus({
  status,
}: AutosaveStatusProps) {
  return (
    <div
      className="min-h-5 text-sm"
      role="status"
      aria-live="polite"
    >
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
        <span className="font-medium text-red-600">
          Could not save
        </span>
      )}
    </div>
  );
}
