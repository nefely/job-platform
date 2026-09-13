import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test/renderWithIntl";
import { RetryBlock } from "./RetryBlock";

describe("RetryBlock", () => {
  it("renders the provided title and message", () => {
    renderWithIntl(
      <RetryBlock title="Couldn't load vacancies" message="Network error" onRetry={() => {}} />,
    );

    expect(screen.getByText("Couldn't load vacancies")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderWithIntl(<RetryBlock message="Network error" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
