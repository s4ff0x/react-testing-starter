import { render, screen } from "@testing-library/react";
import ToastDemo from "../../components/ToastDemo";
import { userEvent } from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
describe("ToastDemo", () => {
  it("should render and show toast", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>,
    );

    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("Show Toast");
    const user = userEvent.setup();
    user.click(btn);
    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
