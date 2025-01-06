import QuantitySelector from "../../components/QuantitySelector.tsx";
import { render, screen } from "@testing-library/react";
import { AllProviders } from "../all-providers.tsx";
import { Product } from "../../entities.ts";
import { userEvent } from "@testing-library/user-event";

describe("QuantitySelector", () => {
  const product: Product = {
    id: 1,
    name: "Apple",
    price: 100,
    categoryId: 1,
  };

  const renderComponent = () => {
    const getControls = () => {
      const incrementButton = screen.queryByText("+");
      const decrementButton = screen.queryByText("-");
      const addToCartButton = screen.queryByText(/add to cart/i);
      return { incrementButton, decrementButton, addToCartButton };
    };

    const user = userEvent.setup();

    const addToCart = async () => {
      const { addToCartButton } = getControls();
      await user.click(addToCartButton!);
    };

    const decrement = async () => {
      const { decrementButton } = getControls();
      await user.click(decrementButton!);
    };

    const increment = async () => {
      const { incrementButton } = getControls();
      await user.click(incrementButton!);
    };

    render(<QuantitySelector product={product} />, { wrapper: AllProviders });
    return { getControls, addToCart, decrement, increment };
  };

  it("should add product if no product in cart", async () => {
    const { addToCart, getControls } = renderComponent();
    const { addToCartButton } = getControls();
    expect(addToCartButton).toBeInTheDocument();
    await addToCart();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  it("should increment product", async () => {
    const { addToCart, increment } = renderComponent();
    await addToCart();
    await increment();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  it("should decrement product", async () => {
    const { addToCart, decrement, increment } = renderComponent();
    await addToCart();
    await increment();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
    await decrement();
    expect(screen.queryByText(/1/i)).toBeInTheDocument();
  });

  it("should remove product", async () => {
    const { addToCart, decrement, getControls } = renderComponent();
    await addToCart();
    await decrement();
    const { addToCartButton } = getControls();
    expect(addToCartButton).toBeInTheDocument();
  });
});
