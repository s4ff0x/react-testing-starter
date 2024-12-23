import ProductDetail from "../../components/ProductDetail.tsx";
import { render, screen } from "@testing-library/react";

describe("Product Detail", () => {
  it("should render product detail", async () => {
    render(<ProductDetail productId={1} />);

    const name = await screen.findByText("Name: Apple");
    expect(name).toBeInTheDocument();
  });
  it("should render product not found", async () => {
    render(<ProductDetail productId={100} />);

    expect(await screen.findByTestId("not-found")).toBeInTheDocument();
  });
});
