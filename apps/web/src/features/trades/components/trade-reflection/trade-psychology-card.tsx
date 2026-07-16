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

interface TradePsychologyCardProps {
  tradeId: string;
  initialValue?: string | null;
}

const MAX_PSYCHOLOGY_LENGTH = 5_000;

const EMOTIONAL_STATES = [
  'Calm',
  'Confident',
  'Disciplined',
  'Hesitant',
  'Fearful',
  'FOMO',
  'Frustrated',
  'Overconfident',
] as const;

export function TradePsychologyCard({
  tradeId,
  initialValue,
}: TradePsychologyCardProps) {
  const [psychology, setPsychology] = useState(
    initialValue ?? '',
  );
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

    setPsychology(nextValue);
    setSavedValue(nextValue);
    setSaveStatus('idle');
  }, [initialValue, tradeId]);

  const hasChanges = psychology !== savedValue;

  const addEmotionalState = (state: string) => {
    const prefix = `Emotional state: ${state}`;

    if (psychology.includes(prefix)) {
      return;
    }

    setPsychology((currentValue) => {
      if (!currentValue.trim()) {
        return `${prefix}\n\n`;
      }

      return `${prefix}\n\n${currentValue}`;
    });

    setSaveStatus('idle');
  };

  const handleSave = () => {
    if (!hasChanges || updateReflection.isPending) {
      return;
    }

    setSaveStatus('saving');

    updateReflection.mutate(
      {
        psychology,
      },
      {
        onSuccess: () => {
          setSavedValue(psychology);
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
            Psychology Reflection
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Record how emotions affected your decisions.
          </p>
        </div>

        <AutosaveStatus status={saveStatus} />
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-slate-700">
          Emotional state
        </legend>

        <div className="mt-3 flex flex-wrap gap-2">
          {EMOTIONAL_STATES.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => addEmotionalState(state)}
              className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {state}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label
          htmlFor={`trade-psychology-${tradeId}`}
          className="text-sm font-medium text-slate-700"
        >
          Reflection
        </label>

        <textarea
          id={`trade-psychology-${tradeId}`}
          value={psychology}
          maxLength={MAX_PSYCHOLOGY_LENGTH}
          onChange={(event) => {
            setPsychology(event.target.value);

            if (saveStatus !== 'idle') {
              setSaveStatus('idle');
            }
          }}
          placeholder="How did emotions affect this trade? Did you follow the plan or act impulsively?"
          className="mt-2 min-h-40 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">
            {psychology.length.toLocaleString()} /{' '}
            {MAX_PSYCHOLOGY_LENGTH.toLocaleString()}
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
              : 'Save psychology'}
          </button>
        </div>

        {saveStatus === 'error' && (
          <p className="mt-3 text-sm text-red-600">
            Your reflection is still available in the
            textarea. Try saving it again.
          </p>
        )}
      </div>
    </section>
  );
}
