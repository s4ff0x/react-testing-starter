import { render, screen } from "@testing-library/react";
import BrowseProducts from "../../pages/BrowseProductsPage.tsx";
import { AllProviders } from "../all-providers.tsx";
import { userEvent } from "@testing-library/user-event";
import { Product } from "../../entities.ts";

export const renderComponent = () => {
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
