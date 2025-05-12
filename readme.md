# react-lite-hooks

A collection of lightweight, reusable React hooks to simplify your development workflow. ⚛️  
No dependencies. Easy to plug and play in any React project.

[![NPM version](https://img.shields.io/npm/v/react-lite-hooks.svg)](https://www.npmjs.com/package/react-lite-hooks)
[![License](https://img.shields.io/npm/l/react-lite-hooks.svg)](./LICENSE)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/react-lite-hooks)](https://bundlephobia.com/result?p=react-lite-hooks)

---

## 🚀 Features

- ✅ Super lightweight – no external dependencies
- ✅ Modern React (Hooks only)
- ✅ TypeScript support
- ✅ Plug-n-play simplicity
- ✅ Actively maintained with new hooks in development

---

## 📦 Installation

```bash
npm install react-lite-hooks
```

## 📝 Documentation

Documentation is currently under development and will be available soon!
Stay tuned for comprehensive guides, examples, and API references to help you make the most of react-lite-hooks.

---

## 🛠️ Development Status

This project is actively under development. New hooks, optimizations, and features are being added regularly. Contributions and feedback are welcome! See our Contributing Guide for more details.

# useDebounce

A powerful and flexible debounce hook for React applications.

## Features

- 🔄 **Flexible API**: Works with primitive values and complex objects
- ⚡ **Leading & Trailing Edge Execution**: Control when the debounced function fires
- ⏱️ **Maximum Wait Time**: Ensure updates happen within a set timeframe
- 🎮 **Control Functions**: Easily flush or cancel pending debounce operations
- 🔍 **Status Tracking**: Monitor when a debounce is in progress
- 🧪 **Custom Equality**: Define your own conditions for when values have changed
- 📦 **Lightweight**: Small bundle size with zero dependencies
- 💪 **TypeScript Ready**: Fully typed with generics support

## Basic Usage

```tsx
import { useDebounce } from "use-debounce-hook";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue } = useDebounce(searchTerm, 300);

  useEffect(() => {
    // API call with debouncedValue
    fetchSearchResults(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## Advanced Usage

### With Full Options

```tsx
import { useDebounce } from "react-lite-hooks";

function FormComponent() {
  const [formState, setFormState] = useState(initialState);

  const {
    debouncedValue: debouncedForm,
    isPending,
    flush,
    cancel,
  } = useDebounce(formState, {
    delay: 500, // 500ms delay
    maxWait: 2000, // Force update after 2 seconds max
    leading: true, // Execute on leading edge
    trailing: true, // Also execute on trailing edge
    equalityFn: customCompare, // Custom comparison function
  });

  // Custom comparison for complex objects
  function customCompare(prev, curr) {
    return JSON.stringify(prev) === JSON.stringify(curr);
  }

  useEffect(() => {
    if (!isPending) {
      saveFormToLocalStorage(debouncedForm);
    }
  }, [debouncedForm, isPending]);

  const handleSubmit = () => {
    // Flush any pending updates before submit
    flush();
    submitForm(debouncedForm);
  };

  const handleCancel = () => {
    // Cancel any pending updates
    cancel();
    resetForm();
  };

  return (
    <form>
      {/* Form fields */}
      <div className="actions">
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        {isPending && <span className="saving-indicator">Saving...</span>}
      </div>
    </form>
  );
}
```

### Custom Equality Function

```tsx
import { useDebounce } from "use-debounce-hook";

// Only update when selected IDs change, ignoring other properties
function UserSelection() {
  const [selection, setSelection] = useState({
    ids: [1, 2, 3],
    timestamp: Date.now(),
  });

  const { debouncedValue } = useDebounce(selection, {
    delay: 400,
    equalityFn: (prev, curr) => {
      // Only consider a real change when the IDs array changes
      return JSON.stringify(prev.ids) === JSON.stringify(curr.ids);
    },
  });

  // Rest of component...
}
```

## API Reference

### useDebounce

```typescript
function useDebounce<T>(
  value: T,
  options: number | DebounceOptions
): DebounceReturn<T>;
```

#### Parameters

- `value` - The value to debounce
- `options` - Either a number (delay in ms) or an options object

#### Options Object

```typescript
interface DebounceOptions {
  delay: number; // Delay in milliseconds
  maxWait?: number; // Maximum time before forced update
  leading?: boolean; // Whether to update on leading edge (default: false)
  trailing?: boolean; // Whether to update on trailing edge (default: true)
  equalityFn?: <T>(previous: T, current: T) => boolean; // Custom equality function
}
```

#### Return Value

```typescript
interface DebounceReturn<T> {
  debouncedValue: T; // The debounced value
  flush: () => void; // Function to immediately apply pending updates
  cancel: () => void; // Function to cancel pending updates
  isPending: boolean; // Whether a debounce is currently pending
}
```

## When to Use Custom Equality Functions

The `equalityFn` parameter allows you to define custom comparison logic between the previous and current values. This is particularly useful when:

1. Working with complex objects where reference equality isn't sufficient
2. You want to ignore certain properties when determining if a value has changed
3. You need special handling for arrays, maps, sets, or other data structures
4. You want to debounce only on meaningful changes to improve performance

## Browser Support

This hook is compatible with all modern browsers and React environments that support React Hooks (React 16.8+).

## TypeScript Support

This package includes TypeScript declarations and supports generic types, allowing you to maintain type safety throughout your application.

```typescript
// Example with TypeScript
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User>({
  id: 1,
  name: "John",
  email: "john@example.com",
});
const { debouncedValue } = useDebounce<User>(user, 500);
```

## Performance Considerations

- Using the `equalityFn` can improve performance by avoiding unnecessary debounce cycles
- The `maxWait` option prevents infinite delays when continuous changes occur
- For very frequent updates, consider increasing the delay value
