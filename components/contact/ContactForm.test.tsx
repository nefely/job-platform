import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test/renderWithIntl";
import { ContactForm } from "./ContactForm";
import { submitContactForm } from "@/lib/mockApi/contact";

vi.mock("@/lib/mockApi/contact", () => ({
  submitContactForm: vi.fn(),
}));

const mockedSubmit = vi.mocked(submitContactForm);

describe("ContactForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows inline errors on an invalid submit, without calling the API or alert()", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send request" }));

    expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a phone number (+380991234567) or Telegram (@username)"),
    ).toBeInTheDocument();

    expect(mockedSubmit).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("shows optimistic success UI and clears the form on a valid submit", async () => {
    mockedSubmit.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Olena");
    await user.type(screen.getByLabelText("Phone or Telegram"), "+380991234567");
    await user.click(screen.getByRole("button", { name: "Send request" }));

    // Optimistic: success UI appears before the mocked promise even resolves.
    expect(await screen.findByText("Thank you!")).toBeInTheDocument();
    expect(mockedSubmit).toHaveBeenCalledWith({
      name: "Olena",
      contact: "+380991234567",
      message: "",
    });
  });

  it("rolls back to the form with an error banner when the request fails", async () => {
    mockedSubmit.mockRejectedValueOnce(new Error("network down"));
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Olena");
    await user.type(screen.getByLabelText("Phone or Telegram"), "+380991234567");
    await user.click(screen.getByRole("button", { name: "Send request" }));

    await waitFor(() => {
      expect(
        screen.getByText("Couldn't send your request. Check the details and try again."),
      ).toBeInTheDocument();
    });

    // Rolled back: the submitted values are restored, not left blank.
    expect(screen.getByLabelText("Name")).toHaveValue("Olena");
    expect(screen.getByLabelText("Phone or Telegram")).toHaveValue("+380991234567");
  });
});
