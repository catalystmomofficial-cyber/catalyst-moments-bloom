import { useState, useEffect } from 'react';

/**
 * Custom hook to auto-save long form inputs to localStorage
 * so users never lose form progress if a submit fails or tab reloads.
 */
export function useFormDraft<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(`draft_${key}`);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`draft_${key}`, JSON.stringify(value));
    } catch {
      // Ignore storage write errors
    }
  }, [key, value]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(`draft_${key}`);
      setValue(initialValue);
    } catch {
      // Ignore storage removal errors
    }
  };

  return [value, setValue, clearDraft];
}
