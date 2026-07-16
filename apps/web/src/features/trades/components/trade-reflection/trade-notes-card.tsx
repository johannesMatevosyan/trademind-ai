'use client';

import { useReflectionAutosave } from '../../hooks/use-reflection-autosave';
import { AutosaveStatus } from './autosave-status';

interface TradeNotesCardProps {
  tradeId: string;
  initialValue?: string | null;
}

const MAX_NOTES_LENGTH = 10_000;

export function TradeNotesCard({
  tradeId,
  initialValue,
}: TradeNotesCardProps) {
  const {
    value: notes,
    setValue: setNotes,
    status,
    retry,
  } = useReflectionAutosave({
    tradeId,
    field: 'notes',
    initialValue,
  });

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Trade Notes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Document the setup, market context, entry
            reason, and trade management.
          </p>
        </div>

        <AutosaveStatus
          status={status}
          onRetry={retry}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor={`trade-notes-${tradeId}`}
          className="text-sm font-medium text-slate-700"
        >
          Notes
        </label>

        <textarea
          id={`trade-notes-${tradeId}`}
          value={notes}
          maxLength={MAX_NOTES_LENGTH}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          placeholder="Document your setup, market context, entry reason, trade management, and what happened during the trade."
          className="mt-2 min-h-48 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {notes.length.toLocaleString()} /{' '}
            {MAX_NOTES_LENGTH.toLocaleString()}
          </span>

          <span className="text-xs text-slate-400">
            Autosaves after you stop typing
          </span>
        </div>
      </div>
    </section>
  );
}
