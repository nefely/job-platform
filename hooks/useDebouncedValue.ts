import { useEffect, useState } from "react";

// Ручний debounce-хук (без бібліотек): повертає `value`, оновлений лише
// після того, як минуло `delayMs` без нових змін.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
