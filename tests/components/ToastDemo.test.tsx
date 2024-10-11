import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import { Toaster } from "react-hot-toast";
import userEvent from "@testing-library/user-event";

describe("ToastDemo", () => {
  it("should render the toast when the button clicked.", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    const toast = await screen.findByText(/success/i);

    expect(toast).toBeInTheDocument();
  });
});
