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
    const getProductsNames = async () =>
      await screen.findAllByTestId("product-name");
    const getCategoriesSkeleton = async () =>
      await screen.findByTestId("categories-skeleton");
    const getCategoriesError = async () =>
      await screen.findByTestId("categories-error");
    const getCategoriesTrigger = async () =>
      await screen.findByTestId("category-trigger");
    const getCategoriesItems = async () =>
      await screen.findAllByTestId("category-item");

    const user = userEvent.setup();

    const clickCategoryTrigger = async () => {
      const categoriesTrigger = await getCategoriesTrigger();
      await user.click(categoriesTrigger);
    };

    const selectCategory = async (categoryName: string) => {
      await clickCategoryTrigger();
      const categoriesItems = await getCategoriesItems();
      await user.click(
        categoriesItems.find((el) => el.textContent === categoryName)!,
      );
    };

    const expectProductsToBePresent = async (products: Product[]) => {
      const productsData = await getProductsData();
      const productsNames = await getProductsNames();
      expect(productsData).toHaveLength(products.length);
      productsNames.forEach((name) => {
        expect(name).toBeInTheDocument();
        expect(products.find((p) => p.name === name.textContent)).toBeDefined();
      });
    };

    return {
      getProductsSkeletons,
      getProductsError,
      getProductsData,
      getCategoriesSkeleton,
      getCategoriesError,
      getCategoriesTrigger,
      getCategoriesItems,
      user,
      clickCategoryTrigger,
      selectCategory,
      expectProductsToBePresent,
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

  it("should show all options in category filter (including all)", async () => {
    const { getCategoriesItems, clickCategoryTrigger } = renderComponent();

    await clickCategoryTrigger();

    const categoriesItems = await getCategoriesItems();
    expect(categoriesItems).toHaveLength(4);
    expect(categoriesItems[0]).toHaveTextContent(/all/i);
    for (let i = 1; i < categoriesItems.length; i++) {
      expect(categoriesItems[i]).toHaveTextContent(categories[i - 1].name);
    }
  });

  it("should show correct data for selected category", async () => {
    const { selectCategory, expectProductsToBePresent } = renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = db.product.findMany({
      where: { categoryId: { equals: selectedCategory.id } },
    });

    await expectProductsToBePresent(products);
  });

  it("should show all products", async () => {
    const { selectCategory, expectProductsToBePresent } = renderComponent();
    await selectCategory("All");
    await expectProductsToBePresent(products);
  });
});
