import { useCallback, useEffect, useRef, useState } from "react";

// Type definitions for flexibility and type safety
type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string) => T;
type StorageEventListener<T> = (newValue: T | null) => void;

interface UseLocalStorageOptions<T> {
  serializer?: Serializer<T>;
  deserializer?: Deserializer<T>;
  defaultValue?: T | (() => T);
  storageSync?: boolean;
}

/**
 * Optimized useLocalStorage hook for managing localStorage
 * @param key - The key to store the value under in localStorage
 * @param options - Configuration options
 * @returns An object with setInLocalStorage, getFromLocalStorage, and error properties
 */
function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): {
  setInLocalStorage: (value: T | null) => void;
  getFromLocalStorage: () => T | null;
  error: Error | null;
} {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    defaultValue = null,
    storageSync = true,
  } = options;

  // State for error tracking
  const [error, setError] = useState<Error | null>(null);

  // Refs for memoization and preventing unnecessary re-renders
  const keyRef = useRef(key);
  const serializerRef = useRef(serializer);
  const deserializerRef = useRef(deserializer);
  const defaultValueRef = useRef(defaultValue);

  // Use Set for more efficient listener handling
  const listenersRef = useRef<Set<StorageEventListener<T>>>(new Set());

  // Update refs when dependencies change
  useEffect(() => {
    keyRef.current = key;
    serializerRef.current = serializer;
    deserializerRef.current = deserializer;
    defaultValueRef.current = defaultValue;
  }, [key, serializer, deserializer, defaultValue]);

  // Get value from localStorage
  const getFromLocalStorage = useCallback(() => {
    try {
      const item = window.localStorage.getItem(keyRef.current);
      if (item !== null) {
        return deserializerRef.current(item);
      }

      // Handle defaultValue - either call function or return value directly
      const currentDefault = defaultValueRef.current;
      return typeof currentDefault === "function"
        ? (currentDefault as () => T)()
        : currentDefault;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Error reading from localStorage");
      setError(error);
      console.error(
        `Error reading localStorage key "${keyRef.current}":`,
        error
      );

      // Return default value on error
      const currentDefault = defaultValueRef.current;
      return typeof currentDefault === "function"
        ? (currentDefault as () => T)()
        : currentDefault;
    }
  }, []);

  // Set or remove value in localStorage
  const setInLocalStorage = useCallback((value: T | null) => {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(keyRef.current);
      } else {
        const serialized = serializerRef.current(value);
        window.localStorage.setItem(keyRef.current, serialized);
      }

      // Clear any previous errors
      setError(null);

      // Notify listeners with error protection
      listenersRef.current.forEach((listener) => {
        try {
          listener(value);
        } catch (listenerErr) {
          console.error("Error in storage listener:", listenerErr);
        }
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error writing to localStorage");
      setError(error);
      console.error(
        `Error setting localStorage key "${keyRef.current}":`,
        error
      );
    }
  }, []);

  // Handle storage events for cross-tab sync
  useEffect(() => {
    if (!storageSync) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== keyRef.current) return;

      try {
        const newValue =
          event.newValue !== null
            ? deserializerRef.current(event.newValue)
            : null;

        // Clear any previous errors when successful sync occurs
        setError(null);

        // Notify listeners with error protection
        listenersRef.current.forEach((listener) => {
          try {
            listener(newValue);
          } catch (listenerErr) {
            console.error("Error in storage event listener:", listenerErr);
          }
        });
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Error processing storage event");
        setError(error);
        console.error(
          `Error processing storage event for key "${keyRef.current}":`,
          error
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageSync]);

  return { setInLocalStorage, getFromLocalStorage, error };
}

export default useLocalStorage;
