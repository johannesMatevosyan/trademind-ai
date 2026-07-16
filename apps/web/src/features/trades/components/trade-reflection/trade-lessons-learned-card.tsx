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

interface TradeLessonsLearnedCardProps {
  tradeId: string;
  initialValue?: string | null;
}

const MAX_LESSONS_LENGTH = 5_000;

export function TradeLessonsLearnedCard({
  tradeId,
  initialValue,
}: TradeLessonsLearnedCardProps) {
  const [lessonsLearned, setLessonsLearned] =
    useState(initialValue ?? '');
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

    setLessonsLearned(nextValue);
    setSavedValue(nextValue);
    setSaveStatus('idle');
  }, [initialValue, tradeId]);

  const hasChanges = lessonsLearned !== savedValue;

  const handleSave = () => {
    if (!hasChanges || updateReflection.isPending) {
      return;
    }

    setSaveStatus('saving');

    updateReflection.mutate(
      {
        lessonsLearned,
      },
      {
        onSuccess: () => {
          setSavedValue(lessonsLearned);
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
      <div className="flex min-h-14 items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Lessons Learned
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Capture what you should repeat, avoid, or
            improve next time.
          </p>
        </div>

        <AutosaveStatus status={saveStatus} />
      </div>

      <div className="mt-5">
        <label
          htmlFor={`trade-lessons-${tradeId}`}
          className="text-sm font-medium text-slate-700"
        >
          Lessons
        </label>

        <textarea
          id={`trade-lessons-${tradeId}`}
          value={lessonsLearned}
          maxLength={MAX_LESSONS_LENGTH}
          onChange={(event) => {
            setLessonsLearned(event.target.value);

            if (saveStatus !== 'idle') {
              setSaveStatus('idle');
            }
          }}
          placeholder="What should you repeat, avoid, or improve in the next similar trade?"
          className="mt-2 min-h-40 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">
            {lessonsLearned.length.toLocaleString()} /{' '}
            {MAX_LESSONS_LENGTH.toLocaleString()}
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
              : 'Save lessons'}
          </button>
        </div>

        {saveStatus === 'error' && (
          <p className="mt-3 text-sm text-red-600">
            Your lessons were not removed. Try saving
            them again.
          </p>
        )}
      </div>
    </section>
  );
}
