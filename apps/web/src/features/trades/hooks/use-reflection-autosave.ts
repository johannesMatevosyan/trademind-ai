'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import type { ReflectionSaveStatus } from '../components/trade-reflection/autosave-status';
import type { UpdateTradeReflectionInput } from '../types/trade.types';
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

const SAVED_STATUS_DURATION = 2_500;

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
  const skipInitialAutosaveRef = useRef(true);
  const savedStatusTimeoutRef =
    useRef<number | null>(null);

  const clearSavedStatusTimeout = useCallback(() => {
    if (savedStatusTimeoutRef.current !== null) {
      window.clearTimeout(
        savedStatusTimeoutRef.current,
      );

      savedStatusTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const nextValue = initialValue ?? '';

    clearSavedStatusTimeout();

    setValue(nextValue);
    setSavedValue(nextValue);
    setStatus('idle');

    latestValueRef.current = nextValue;
    skipInitialAutosaveRef.current = true;

    // Invalidates responses belonging to the previous trade.
    requestIdRef.current += 1;
  }, [
    clearSavedStatusTimeout,
    initialValue,
    tradeId,
  ]);

  const save = useCallback(
    (valueToSave: string) => {
      if (valueToSave === savedValue) {
        setStatus('idle');
        return;
      }

      clearSavedStatusTimeout();

      const requestId =
        requestIdRef.current + 1;

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
            latestValueRef.current !== valueToSave
          ) {
            setStatus('unsaved');
            return;
          }

          setStatus('saved');

          savedStatusTimeoutRef.current =
            window.setTimeout(() => {
              if (
                requestId ===
                  requestIdRef.current &&
                latestValueRef.current ===
                  valueToSave
              ) {
                setStatus('idle');
              }
            }, SAVED_STATUS_DURATION);
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
      clearSavedStatusTimeout,
      field,
      savedValue,
      updateReflection,
    ],
  );

  useEffect(() => {
    if (skipInitialAutosaveRef.current) {
      skipInitialAutosaveRef.current = false;
      return;
    }

    clearSavedStatusTimeout();

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
    clearSavedStatusTimeout,
    delay,
    save,
    savedValue,
    value,
  ]);

  const hasUnsavedChanges =
    value !== savedValue;

  useEffect(() => {
    const handleBeforeUnload = (
      event: BeforeUnloadEvent,
    ) => {
      if (
        !hasUnsavedChanges &&
        status !== 'saving'
      ) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener(
      'beforeunload',
      handleBeforeUnload,
    );

    return () => {
      window.removeEventListener(
        'beforeunload',
        handleBeforeUnload,
      );
    };
  }, [
    hasUnsavedChanges,
    status,
  ]);

  useEffect(() => {
    return () => {
      clearSavedStatusTimeout();
    };
  }, [clearSavedStatusTimeout]);

  const retry = useCallback(() => {
    save(latestValueRef.current);
  }, [save]);

  return {
    value,
    setValue,
    status,
    retry,
    hasUnsavedChanges,
    isSaving: status === 'saving',
  };
}
