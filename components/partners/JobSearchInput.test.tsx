import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test/renderWithIntl";
import { JobSearchInput } from "./JobSearchInput";

describe("JobSearchInput", () => {
  it("calls onDebouncedChange once with the final value, not per keystroke", async () => {
    const user = userEvent.setup({ delay: null });
    const onDebouncedChange = vi.fn();

    renderWithIntl(<JobSearchInput onDebouncedChange={onDebouncedChange} delay={300} />);

    // Mount fires once with the initial (empty) value.
    expect(onDebouncedChange).toHaveBeenCalledTimes(1);
    expect(onDebouncedChange).toHaveBeenLastCalledWith("");

    const input = screen.getByRole("searchbox");
    await user.type(input, "driver");

    // Immediately after typing, the debounce hasn't fired for "driver" yet.
    expect(onDebouncedChange).not.toHaveBeenCalledWith("driver");

    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(onDebouncedChange).toHaveBeenLastCalledWith("driver");
    // Exactly one additional call for the settled value, not one per keystroke.
    expect(onDebouncedChange).toHaveBeenCalledTimes(2);
  });
});
