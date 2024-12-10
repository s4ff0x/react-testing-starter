import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../components/OrderStatusSelector";
import { userEvent } from "@testing-library/user-event";
import { expect, vi } from "vitest";
import { Theme } from "@radix-ui/themes";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const f = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={f} />
      </Theme>,
    );
    const combobox = screen.getByRole("combobox");
    const user = userEvent.setup();

    return { combobox, user, f };
  };

  it("should render", () => {
    renderComponent();
    screen.getByText(/new/i);
  });

  it("should set value", async () => {
    const { combobox, user, f } = renderComponent();
    await user.click(combobox);

    let options = await screen.findAllByRole("option");
    expect(options).toHaveLength(3);
    await user.click(options[1]);
    expect(f).toHaveBeenCalledWith("processed");
    options = screen.queryAllByRole("option");
    expect(options).toHaveLength(0);
    expect(combobox).toHaveTextContent(/processed/i);
  });
});
