import { db } from "../mocks/db.ts";
import { Product } from "../../entities.ts";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../routes.tsx";
import useProduct from "../../hooks/useProduct.ts";
import { errorCall } from "../lib.ts";
import { AllProviders } from "../all-providers.tsx";

describe("Product Detail Page", () => {
  let product: Product;
  const renderAndNavigate = (route: string) => {
    const router = createMemoryRouter(routes, {
      initialEntries: [route],
    });
    render(<RouterProvider router={router} />);
  };
  beforeAll(() => {
    product = db.product.create();
  });
  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });
  it("should render loading state", () => {
    renderAndNavigate(`/products/${product.id}`);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  it("should render product detail", async () => {
    renderAndNavigate(`/products/${product.id}`);
    await screen.findByText(product.name);
  });
  it("should render not found product", async () => {
    renderAndNavigate(`/products/not-found`);
    await screen.findByText(/the given product was not found/i);
  });
  it("should render error", async () => {
    errorCall(`/products/${product.id}`);
    const { result } = renderHook(() => useProduct(product.id), {
      wrapper: AllProviders,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
