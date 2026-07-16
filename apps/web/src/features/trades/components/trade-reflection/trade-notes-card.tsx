'use client';

import {
    useEffect,
    useState,
} from 'react';

import { useUpdateTradeReflection } from '../../hooks/use-update-trade-reflection';
import {
    AutosaveStatus,
    type ReflectionSaveStatus,
} from './autosave-status';

interface TradeNotesCardProps {
  tradeId: string;
  initialValue?: string | null;
}

const MAX_NOTES_LENGTH = 10_000;

export function TradeNotesCard({
  tradeId,
  initialValue,
}: TradeNotesCardProps) {
  const [notes, setNotes] = useState(initialValue ?? '');
  const [savedValue, setSavedValue] = useState(
    initialValue ?? '',
  );
  const [saveStatus, setSaveStatus] =
    useState<ReflectionSaveStatus>('idle');

  const updateReflection =
    useUpdateTradeReflection({
      tradeId,
    });

  useEffect(() => {
    const nextValue = initialValue ?? '';

    setNotes(nextValue);
    setSavedValue(nextValue);
    setSaveStatus('idle');
  }, [initialValue, tradeId]);

  const hasChanges = notes !== savedValue;

  const handleSave = () => {
    if (!hasChanges || updateReflection.isPending) {
      return;
    }

    setSaveStatus('saving');

    updateReflection.mutate(
      {
        notes,
      },
      {
        onSuccess: () => {
          setSavedValue(notes);
          setSaveStatus('saved');
        },
        onError: () => {
          setSaveStatus('error');
        },
      },
    );
  };

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

        <AutosaveStatus status={saveStatus} />
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
          onChange={(event) => {
            setNotes(event.target.value);

            if (saveStatus !== 'idle') {
              setSaveStatus('idle');
            }
          }}
          placeholder="Document your setup, market context, entry reason, trade management, and what happened during the trade."
          className="mt-2 min-h-48 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">
            {notes.length.toLocaleString()} /{' '}
            {MAX_NOTES_LENGTH.toLocaleString()}
          </span>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              !hasChanges ||
              updateReflection.isPending
            }
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {updateReflection.isPending
              ? 'Saving...'
              : 'Save notes'}
          </button>
        </div>

        {saveStatus === 'error' && (
          <p className="mt-3 text-sm text-red-600">
            Your notes were not removed. Check the API
            connection and try saving again.
          </p>
        )}
      </div>
    </section>
  );
}
