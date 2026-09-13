import { useEffect, useState } from "react";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export interface UseAsyncResult<T> {
  state: AsyncState<T>;
  retry: () => void;
}

interface StoredResult<T> {
  key: string;
  state: AsyncState<T>;
}

// Generic loading/error/retry для будь-якого async-виклику (Supabase-фетч
// через lib/mockApi/*). "loading" — не окремий setState у тілі ефекту (React
// застерігає від синхронного setState там, react-hooks/set-state-in-effect),
// а похідний стан: показуємо його, поки збережений результат належить
// старому requestKey. `retry()` інкрементує internal `attempt`, який входить
// у requestKey — це заново викликає той самий `fn` з новою випадковою
// затримкою/результатом (і новим реальним запитом до Supabase).
export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
): UseAsyncResult<T> {
  const [attempt, setAttempt] = useState(0);
  // Cheap string ops, no need to memoize; keeps the useEffect deps array a
  // plain literal (required by react-hooks/use-memo) instead of a spread.
  const requestKey = JSON.stringify([...deps, attempt]);
  const [result, setResult] = useState<StoredResult<T> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, state: { status: "success", data } });
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            key: requestKey,
            state: {
              status: "error",
              error: err instanceof Error ? err.message : "Сталася помилка",
            },
          });
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fn is expected to be stable (useCallback at the call site)
  }, [requestKey]);

  const state: AsyncState<T> =
    result && result.key === requestKey ? result.state : { status: "loading" };

  return { state, retry: () => setAttempt((a) => a + 1) };
}
