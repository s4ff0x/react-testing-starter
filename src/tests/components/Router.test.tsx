import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../routes.tsx";
import { render, screen } from "@testing-library/react";
import { db } from "../mocks/db.ts";

describe("Router", () => {
  const renderAndNavigate = (route: string) => {
    const router = createMemoryRouter(routes, {
      initialEntries: [route],
    });
    render(<RouterProvider router={router} />);
  };
  it.each([
    {
      route: "/",
      text: /home/i,
    },
    {
      route: "/products",
      text: /products/i,
    },
  ])("should render the home page for /", ({ route, text }) => {
    renderAndNavigate(route);
    screen.getByRole("heading", { name: text });
  });

  it("should show product", async () => {
    const product = db.product.create();
    renderAndNavigate(`/products/${product.id}`);
    await screen.findByText(product.name);
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should show error if route is not found", async () => {
    renderAndNavigate("/not-found-route");
    await screen.findByText(/oops/i);
  });
});
