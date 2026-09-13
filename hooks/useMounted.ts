import { useSyncExternalStore } from "react";

// Чи вже гідратувався клієнтський JS. Моделюється як зовнішній стор (а не
// effect + setState), щоб читання ніколи не потребувало зайвого рендеру.
function subscribe() {
  return () => {};
}

export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
