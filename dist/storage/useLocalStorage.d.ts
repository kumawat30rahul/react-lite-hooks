type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string) => T;
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
declare function useLocalStorage<T>(key: string, options?: UseLocalStorageOptions<T>): {
    setInLocalStorage: (value: T | null) => void;
    getFromLocalStorage: () => T | null;
    error: Error | null;
};
export default useLocalStorage;
