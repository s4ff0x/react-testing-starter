import { AllProviders } from "../all-providers.tsx";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../pages/BrowseProductsPage.tsx";
import { db } from "../mocks/db.ts";
import { Category, Product } from "../../entities.ts";
import { userEvent } from "@testing-library/user-event";
import { delayedCall, errorCall } from "../lib.ts";

describe("Browse Products Page", () => {
  const products: Product[] = [];
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const category = db.category.create();
      [1, 2].forEach(() => {
        const product = db.product.create({ categoryId: category.id });
        products.push(product);
      });
      categories.push(category);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: products.map((p) => p.id) } } });
    db.category.deleteMany({
      where: { id: { in: categories.map((p) => p.id) } },
    });
  });

  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    const getProductsSkeletons = async () =>
      await screen.findAllByTestId("products-skeleton");
    const getProductsError = async () =>
      await screen.findByTestId("products-error");
    const getProductsData = async () =>
      await screen.findAllByTestId("products-data");
    const getCategoriesSkeleton = async () =>
      await screen.findByTestId("categories-skeleton");
    const getCategoriesError = async () =>
      await screen.findByTestId("categories-error");
    const getCategoriesTrigger = async () =>
      await screen.findByTestId("category-trigger");
    const getCategoriesItems = async () =>
      await screen.findAllByTestId("category-item");

    const user = userEvent.setup();

    return {
      getProductsSkeletons,
      getProductsError,
      getProductsData,
      getCategoriesSkeleton,
      getCategoriesError,
      getCategoriesTrigger,
      getCategoriesItems,
      user,
    };
  };

  it("should render products skeleton", async () => {
    delayedCall("/products");
    const { getProductsSkeletons } = renderComponent();
    const productsSkeletons = await getProductsSkeletons();
    expect(productsSkeletons).not.toHaveLength(0);
    expect(await waitForElementToBeRemoved(productsSkeletons));
  });
  it("should render products error", async () => {
    errorCall("/products");
    const { getProductsError } = renderComponent();
    const error = await getProductsError();
    expect(error).toBeInTheDocument();
  });
  it("should render products data", async () => {
    const { getProductsData } = renderComponent();
    const data = await getProductsData();
    expect(data).not.toHaveLength(0);
  });

  it("should render categories skeleton", async () => {
    delayedCall("/categories");
    const { getCategoriesSkeleton } = renderComponent();
    const skeleton = await getCategoriesSkeleton();
    expect(skeleton).toBeInTheDocument();
    expect(await waitForElementToBeRemoved(skeleton));
  });
  it("should render categories error", async () => {
    errorCall("/categories");
    const { getCategoriesError } = renderComponent();
    const error = await getCategoriesError();
    expect(error).toBeInTheDocument();
  });
  it("should render categories data", async () => {
    const { getCategoriesTrigger, getCategoriesItems, user } =
      renderComponent();
    const categoriesTrigger = await getCategoriesTrigger();

    await user.click(categoriesTrigger);

    const categoriesItems = await getCategoriesItems();

    expect(categoriesItems).toHaveLength(4);
    expect(categoriesItems[0]).toHaveTextContent(/all/i);
    for (let i = 1; i < categoriesItems.length; i++) {
      expect(categoriesItems[i]).toHaveTextContent(categories[i - 1].name);
    }
  });

  it("should filter by category", async () => {
    const { getCategoriesTrigger, getCategoriesItems, getProductsData, user } =
      renderComponent();

    const categoriesTrigger = await getCategoriesTrigger();
    await user.click(categoriesTrigger);

    let categoriesItems = await getCategoriesItems();

    expect(categoriesItems).toHaveLength(4);

    expect(categoriesItems[0]).toHaveTextContent(/all/i);

    for (let i = 1; i < categoriesItems.length; i++) {
      expect(categoriesItems[i]).toHaveTextContent(categories[i - 1].name);
    }

    const selectedCategory = categories[0];
    await user.click(
      categoriesItems.find((el) => el.textContent === selectedCategory.name)!,
    );
    const products = db.product.findMany({
      where: { categoryId: { equals: selectedCategory.id } },
    });
    expect(await getProductsData()).toHaveLength(products.length);

    await user.click(categoriesTrigger);
    await user.click((await getCategoriesItems())[0]);

    expect(await getProductsData()).toHaveLength(6);
  });
});
