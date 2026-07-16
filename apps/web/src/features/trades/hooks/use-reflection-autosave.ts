'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import type {
    ReflectionSaveStatus,
} from '../components/trade-reflection/autosave-status';
import type {
    UpdateTradeReflectionInput,
} from '../types/trade.types';
import { useUpdateTradeReflection } from './use-update-trade-reflection';

type ReflectionField =
  | 'notes'
  | 'psychology'
  | 'lessonsLearned';

interface UseReflectionAutosaveParams {
  tradeId: string;
  field: ReflectionField;
  initialValue?: string | null;
  delay?: number;
}

export function useReflectionAutosave({
  tradeId,
  field,
  initialValue,
  delay = 800,
}: UseReflectionAutosaveParams) {
  const normalizedInitialValue = initialValue ?? '';

  const [value, setValue] = useState(
    normalizedInitialValue,
  );

  const [savedValue, setSavedValue] = useState(
    normalizedInitialValue,
  );

  const [status, setStatus] =
    useState<ReflectionSaveStatus>('idle');

  const updateReflection =
    useUpdateTradeReflection({
      tradeId,
    });

  const latestValueRef = useRef(value);
  const requestIdRef = useRef(0);
  const isInitialRenderRef = useRef(true);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const nextValue = initialValue ?? '';

    setValue(nextValue);
    setSavedValue(nextValue);
    setStatus('idle');

    latestValueRef.current = nextValue;
    isInitialRenderRef.current = true;
    requestIdRef.current += 1;
  }, [initialValue, tradeId]);

  const save = useCallback(
    (valueToSave: string) => {
      if (valueToSave === savedValue) {
        setStatus('idle');
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      setStatus('saving');

      const payload: UpdateTradeReflectionInput = {
        [field]: valueToSave,
      };

      updateReflection.mutate(payload, {
        onSuccess: () => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setSavedValue(valueToSave);

          if (
            latestValueRef.current === valueToSave
          ) {
            setStatus('saved');
          } else {
            setStatus('unsaved');
          }
        },

        onError: () => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setStatus('error');
        },
      });
    },
    [
      field,
      savedValue,
      updateReflection,
    ],
  );

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    if (value === savedValue) {
      setStatus('idle');
      return;
    }

    setStatus('unsaved');

    const timeoutId = window.setTimeout(() => {
      save(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    delay,
    save,
    savedValue,
    value,
  ]);

  const retry = useCallback(() => {
    save(latestValueRef.current);
  }, [save]);

  return {
    value,
    setValue,
    status,
    retry,
    isSaving: status === 'saving',
    hasUnsavedChanges: value !== savedValue,
  };
}
