import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAsync } from "./useAsync";

describe("useAsync", () => {
  it("starts in the loading state and transitions to success", async () => {
    const { result } = renderHook(() => useAsync(async () => "data", []));

    expect(result.current.state.status).toBe("loading");

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: "success", data: "data" });
    });
  });

  it("transitions to the error state with the thrown message", async () => {
    const { result } = renderHook(() =>
      useAsync(async () => {
        throw new Error("boom");
      }, []),
    );

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: "error", error: "boom" });
    });
  });

  it("retry() re-invokes the function and can flip error to success", async () => {
    let callCount = 0;
    const fn = vi.fn(async () => {
      callCount += 1;
      if (callCount === 1) {
        throw new Error("first attempt failed");
      }
      return "recovered";
    });

    const { result } = renderHook(() => useAsync(fn, []));

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: "error", error: "first attempt failed" });
    });

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: "success", data: "recovered" });
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("ignores a stale response when deps change before it resolves (abort guard)", async () => {
    const resolvers: Array<(value: string) => void> = [];
    const fn = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolvers.push(resolve);
        }),
    );

    const { result, rerender } = renderHook(({ id }) => useAsync(fn, [id]), {
      initialProps: { id: 1 },
    });

    // Change deps before the first call resolves, triggering a second call.
    rerender({ id: 2 });

    expect(resolvers).toHaveLength(2);

    // Resolve the second (current) call first, then the stale first call.
    act(() => {
      resolvers[1]("second");
    });
    await waitFor(() => {
      expect(result.current.state).toEqual({ status: "success", data: "second" });
    });

    act(() => {
      resolvers[0]("stale-first");
    });

    // The stale response must not clobber the newer state.
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.state).toEqual({ status: "success", data: "second" });
  });
});
