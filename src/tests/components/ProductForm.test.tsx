import ProductForm from "../../components/ProductForm.tsx";
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import { AllProviders } from "../all-providers.tsx";

describe("Product Detail", () => {
  it("should render empty form", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(screen.getByText(/loading/i));

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
