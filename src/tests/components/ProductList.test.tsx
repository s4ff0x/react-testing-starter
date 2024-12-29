import ProductList from "../../components/ProductList.tsx";
import { delay, http, HttpResponse } from "msw";
import { server } from "../mocks/server.ts";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { AllProviders } from "../all-providers.tsx";

describe("Product List", () => {
  it("should render loading", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      }),
    );
    render(<ProductList />, { wrapper: AllProviders });
    const loading = await screen.findByText(/loading/i);
    expect(loading).toBeInTheDocument();
    expect(await waitForElementToBeRemoved(loading));
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
