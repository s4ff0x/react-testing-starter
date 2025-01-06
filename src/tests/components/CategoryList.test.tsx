import { Category } from "../../entities.ts";
import { db } from "../mocks/db.ts";
import CategoryList from "../../components/CategoryList.tsx";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { AllProviders } from "../all-providers.tsx";
import { delayedCall, errorCall } from "../lib.ts";

describe("Category List", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    db.category.deleteMany({
      where: { id: { in: categories.map((p) => p.id) } },
    });
  });

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProviders });
  };

  it("should render data", async () => {
    renderComponent();
    await waitForElementToBeRemoved(screen.getByText(/loading/i));
    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("should show loading", async () => {
    delayedCall("/categories");
    renderComponent();
    const loading = await screen.findByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("should show error", async () => {
    errorCall("/categories");
    renderComponent();
    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  });
});
