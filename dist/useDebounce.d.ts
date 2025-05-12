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
export declare function useDebounce<T>(value: T, options: number | DebounceOptions): DebounceReturn<T>;
