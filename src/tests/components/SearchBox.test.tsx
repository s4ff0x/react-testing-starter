import { render, screen } from "@testing-library/react";
import SearchBox from "../../components/SearchBox";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

describe("SearchBox", () => {
  const renderComponent = () => {
    const f = vi.fn();
    render(<SearchBox onChange={f} />);
    const input = screen.getByRole("textbox");
    const typeString = "123";
    const user = userEvent.setup();

    return { input, typeString, user, f };
  };

  it("should render", () => {
    renderComponent();
  });
  it("should type", async () => {
    const { input, typeString, user } = renderComponent();

    await user.type(input!, typeString);
    expect(input).toHaveValue(typeString);
  });
  it("should call f on enter", async () => {
    const { f, input, typeString, user } = renderComponent();

    await user.type(input!, `${typeString}{enter}`);
    expect(input).toHaveValue(typeString);
    expect(f).toHaveBeenCalledWith(typeString);
  });
  it("should not call f on enter if no value in input", async () => {
    const { f, input, user } = renderComponent();

    await user.type(input!, `{enter}`);
    expect(input).toHaveValue("");
    expect(f).not.toHaveBeenCalled();
  });
});
