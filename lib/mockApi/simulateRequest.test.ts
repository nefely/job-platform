import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, simulateRequest } from "./simulateRequest";

describe("simulateRequest", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("resolves with the resolver's value when the random roll succeeds", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9); // above any failureRate, and delay factor
    const promise = simulateRequest(() => "ok", { minDelayMs: 300, maxDelayMs: 800 });

    await vi.advanceTimersByTimeAsync(800);

    await expect(promise).resolves.toBe("ok");
  });

  it("waits within the configured 300-800ms window before resolving", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5); // delay factor + above failureRate
    const resolve = vi.fn(() => "value");
    const promise = simulateRequest(resolve, { minDelayMs: 300, maxDelayMs: 800, failureRate: 0.2 });

    await vi.advanceTimersByTimeAsync(299);
    expect(resolve).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(300);
    await expect(promise).resolves.toBe("value");
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it("rejects with an ApiError when the random roll is below the failure rate", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0); // always below failureRate
    const promise = simulateRequest(() => "unused", { minDelayMs: 0, maxDelayMs: 0, failureRate: 0.2 });
    // Attach the rejection assertion before advancing timers, otherwise the
    // promise can reject during the advance while nothing is listening yet.
    const assertion = expect(promise).rejects.toBeInstanceOf(ApiError);

    await vi.advanceTimersByTimeAsync(1);

    await assertion;
  });

  it("rejects immediately if the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort(new Error("cancelled"));

    await expect(
      simulateRequest(() => "unused", { signal: controller.signal }),
    ).rejects.toThrow("cancelled");
  });
});
