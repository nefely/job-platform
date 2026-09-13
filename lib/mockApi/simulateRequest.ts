// Дані реальні (Supabase), але бриф вимагає fetch-обгортку, що симулює
// реальний API: 300-800мс затримки і ~1/5 випадкова помилка. Це — додатковий
// шар над справжнім запитом: без нього skeleton/retry ніколи не було б видно
// під час рев'ю, бо Supabase зазвичай відповідає швидко й рідко падає.
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export interface SimulateRequestOptions {
  minDelayMs?: number;
  maxDelayMs?: number;
  failureRate?: number;
  signal?: AbortSignal;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const timeoutId = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export async function simulateRequest<T>(
  resolve: () => Promise<T> | T,
  options: SimulateRequestOptions = {},
): Promise<T> {
  const { minDelayMs = 300, maxDelayMs = 800, failureRate = 0.2, signal } = options;

  await wait(minDelayMs + Math.random() * (maxDelayMs - minDelayMs), signal);

  if (Math.random() < failureRate) {
    throw new ApiError("Не вдалося виконати запит. Спробуйте ще раз.");
  }

  return resolve();
}
