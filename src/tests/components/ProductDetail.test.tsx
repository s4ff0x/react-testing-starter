import ProductDetail from "../../components/ProductDetail.tsx";
import { render, screen } from "@testing-library/react";
import { db } from "../mocks/db.ts";
import { Product } from "../../entities.ts";
import { server } from "../mocks/server.ts";
import { http, HttpResponse } from "msw";
import { AllProviders } from "../all-providers.tsx";

describe("Product Detail", () => {
  const products: Product[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      products.push(product);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: products.map((p) => p.id) } } });
  });

  it("should render product detail", async () => {
    render(<ProductDetail productId={products[0].id} />, {
      wrapper: AllProviders,
    });

    const name = await screen.findByText(`Name: ${products[0].name}`);
    expect(name).toBeInTheDocument();
  });
  it("should render product not found", async () => {
    render(<ProductDetail productId={1000} />, { wrapper: AllProviders });

    expect(await screen.findByTestId("not-found")).toBeInTheDocument();
  });

  it("should render error", async () => {
    server.use(http.get("/products/:id", HttpResponse.error));
    render(<ProductDetail />, { wrapper: AllProviders });

    expect(await screen.findByTestId("error")).toBeInTheDocument();
  });
});
