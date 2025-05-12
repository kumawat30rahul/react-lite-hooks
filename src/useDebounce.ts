import { useEffect, useState, useRef, useCallback } from "react";

export interface DebounceOptions {
  delay: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
  equalityFn?: <T>(previous: T, current: T) => boolean;
}

export interface DebounceReturn<T> {
  debouncedValue: T;
  flush: () => void;
  cancel: () => void;
  isPending: boolean;
}

// Default equality check – shallow comparison
function defaultEqualityFn<T>(previous: T, current: T): boolean {
  return previous === current;
}

/**
 * useDebounce hook
 *
 * This custom hook debounces a changing value – meaning, it delays
 * updates until after a specified period of inactivity.
 *
 * Features:
 * - Supports both leading and trailing updates
 * - Optional max wait time to ensure updates aren’t delayed forever
 * - Manual flush and cancel controls
 * - Tracks whether a value update is currently pending
 * - Accepts a custom equality check for more complex types
 *
 * @param value - The input value that changes over time
 * @param options - Configuration for debounce behavior (or just a delay in ms)
 */
export function useDebounce<T>(
  value: T,
  options: number | DebounceOptions
): DebounceReturn<T> {
  // Normalize config: if just a number, treat it as the delay
  const config = typeof options === "number" ? { delay: options } : options;

  const {
    delay,
    maxWait,
    leading = false,
    trailing = true,
    equalityFn = defaultEqualityFn,
  } = config;

  // This is the value we expose after debouncing
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Whether we're currently waiting to update the debounced value
  const [isPending, setIsPending] = useState<boolean>(false);

  // References to avoid stale closures and unnecessary re-renders
  const previousValue = useRef<T>(value);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallTime = useRef<number | null>(null);

  // Clears all active timeouts
  const clearTimers = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    if (maxWaitTimeout.current) {
      clearTimeout(maxWaitTimeout.current);
      maxWaitTimeout.current = null;
    }
  }, []);

  // Applies the debounced value (usually called by the timeout)
  const applyDebounce = useCallback(() => {
    setDebouncedValue(previousValue.current);
    setIsPending(false);
    lastCallTime.current = null;
  }, []);

  // Forces the current pending value to be applied immediately
  const flush = useCallback(() => {
    if (timeout.current || maxWaitTimeout.current) {
      applyDebounce();
      clearTimers();
    }
  }, [applyDebounce, clearTimers]);

  // Cancels any pending debounced updates
  const cancel = useCallback(() => {
    if (timeout.current || maxWaitTimeout.current) {
      setIsPending(false);
      clearTimers();
    }
  }, [clearTimers]);

  useEffect(() => {
    // If the value hasn't actually changed (based on equality check), skip everything
    if (equalityFn(previousValue.current, value)) {
      return;
    }

    // Update stored reference to the new value
    previousValue.current = value;

    // Mark that we're waiting to apply a new value
    setIsPending(true);

    const now = Date.now();

    // If this is the first call or leading is enabled, we might update immediately
    if (lastCallTime.current === null || (leading && !timeout.current)) {
      lastCallTime.current = now;

      if (leading) {
        setDebouncedValue(value);
        setIsPending(false);

        // If trailing is also enabled, schedule an update after the delay
        if (trailing) {
          timeout.current = setTimeout(() => {
            applyDebounce();
          }, delay);
        }
        return;
      }
    }

    lastCallTime.current = now;

    // Clear any previous delay timers
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Always schedule trailing update if trailing is enabled
    if (trailing) {
      timeout.current = setTimeout(() => {
        applyDebounce();
      }, delay);
    }

    // If a max wait time is set, schedule a hard deadline
    if (maxWait !== undefined && !maxWaitTimeout.current) {
      const timeSinceLastCall = now - (lastCallTime.current || 0);
      const remainingMaxWait = Math.max(0, maxWait - timeSinceLastCall);

      maxWaitTimeout.current = setTimeout(() => {
        // Apply the value either way when max wait expires
        if (trailing || (leading && timeout.current)) {
          applyDebounce();
        }
        maxWaitTimeout.current = null;
      }, remainingMaxWait);
    }

    // Clean up when value changes or component unmounts
    return () => {
      clearTimers();
    };
  }, [
    value,
    delay,
    maxWait,
    leading,
    trailing,
    equalityFn,
    applyDebounce,
    clearTimers,
  ]);

  return {
    debouncedValue,
    flush,
    cancel,
    isPending,
  };
}
