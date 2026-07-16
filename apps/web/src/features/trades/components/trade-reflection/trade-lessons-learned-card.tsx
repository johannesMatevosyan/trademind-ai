'use client';

import { useReflectionAutosave } from '../../hooks/use-reflection-autosave';
import { AutosaveStatus } from './autosave-status';

interface TradeLessonsLearnedCardProps {
  tradeId: string;
  initialValue?: string | null;
}

const MAX_LESSONS_LENGTH = 5_000;

export function TradeLessonsLearnedCard({
  tradeId,
  initialValue,
}: TradeLessonsLearnedCardProps) {
  const {
    value: lessonsLearned,
    setValue: setLessonsLearned,
    status,
    retry,
  } = useReflectionAutosave({
    tradeId,
    field: 'lessonsLearned',
    initialValue,
  });

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

        <AutosaveStatus
          status={status}
          onRetry={retry}
        />
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
          onChange={(event) =>
            setLessonsLearned(event.target.value)
          }
          placeholder="What should you repeat, avoid, or improve in the next similar trade?"
          className="mt-2 min-h-40 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">
            {lessonsLearned.length.toLocaleString()} /{' '}
            {MAX_LESSONS_LENGTH.toLocaleString()}
          </span>

          <span className="text-xs text-slate-400">
            Autosaves after you stop typing
          </span>
        </div>

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-600">
            Your lessons are still available in the
            textarea. Use Retry to save them again.
          </p>
        )}
      </div>
    </section>
  );
}
