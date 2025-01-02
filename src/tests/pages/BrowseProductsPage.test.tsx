import { waitForElementToBeRemoved } from "@testing-library/react";
import { db } from "../mocks/db.ts";
import { Category, Product } from "../../entities.ts";
import { delayedCall, errorCall } from "../lib.ts";
import { renderComponent } from "./lib.tsx";

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
