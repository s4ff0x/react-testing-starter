import ProductForm from "../../components/ProductForm.tsx";
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import { AllProviders } from "../all-providers.tsx";
import { db } from "../mocks/db.ts";
import { Category, Product } from "../../entities.ts";
import { userEvent } from "@testing-library/user-event";

describe("Product Detail", () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({ categoryId: category.id });
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = async (product?: Product) => {
    render(<ProductForm onSubmit={vi.fn()} product={product} />, {
      wrapper: AllProviders,
    });

    const user = userEvent.setup();

    const getInputs = async () => {
      return {
        nameInput: await screen.findByPlaceholderText(/name/i),
        priceInput: await screen.findByPlaceholderText(/price/i),
        categorySelect: await screen.findByRole("combobox"),
      };
    };

    const waitFormToLoad = async () =>
      await waitForElementToBeRemoved(screen.getByText(/loading/i));

    const submitForm = async () => {
      const button = await screen.findByRole("button");
      await user.click(button);
    };

    const checkError = async (error: string | RegExp) => {
      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(error);
    };

    const selectCategoryByIndex = async (index: number) => {
      const { categorySelect } = await getInputs();
      await user.tab();
      await user.click(categorySelect);
      const options = await screen.findAllByRole("option");
      await user.click(options[index]);
    };

    const validFormValues = {
      name: "test",
      price: "10",
      categoryIdx: 0,
    };

    const fillAndSubmitForm = async ({
      name,
      price,
      categoryIdx,
    }: {
      name?: string;
      price?: string;
      categoryIdx?: number;
    }) => {
      const { nameInput, priceInput } = await getInputs();
      if (name !== undefined) await user.type(nameInput, name);
      if (price !== undefined) await user.type(priceInput, price.toString());
      if (categoryIdx !== undefined) await selectCategoryByIndex(categoryIdx);
      await submitForm();
    };

    return {
      getInputs,
      waitFormToLoad,
      user,
      submitForm,
      checkError,
      selectCategoryByIndex,
      fillAndSubmitForm,
      validFormValues,
    };
  };

  it("should render empty form", async () => {
    const { getInputs, waitFormToLoad } = await renderComponent();

    await waitFormToLoad();
    const { nameInput, priceInput, categorySelect } = await getInputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
  });

  it("should render form with predefined values if product is passed", async () => {
    const { getInputs, waitFormToLoad } = await renderComponent(product);

    await waitFormToLoad();
    const { nameInput, priceInput, categorySelect } = await getInputs();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(String(product.price));
    expect(categorySelect).toHaveTextContent(category.name);
  });

  it("should focus name field on render", async () => {
    const { getInputs, waitFormToLoad } = await renderComponent(product);

    await waitFormToLoad();
    const { nameInput } = await getInputs();

    expect(nameInput).toHaveFocus();
  });

  it.each([
    {
      scenario: "is missing",
      error: /name is required/i,
    },
    {
      scenario: "is too long",
      error: /255/i,
      name: "a".repeat(256),
    },
  ])("should show error if name $scenario", async ({ error, name }) => {
    const { waitFormToLoad, checkError, fillAndSubmitForm, validFormValues } =
      await renderComponent();
    await waitFormToLoad();
    await fillAndSubmitForm({ ...validFormValues, name });
    await checkError(RegExp(error));
  });

  it.each([
    {
      scenario: "is missing",
      error: /is required/i,
    },
    {
      scenario: "is incorrect format",
      error: /is required/i,
      price: "a",
    },
    {
      scenario: "is too short",
      error: /greater/i,
      price: "0",
    },
    {
      scenario: "is too long",
      error: /less/i,
      price: "1111",
    },
  ])("should show error if price $scenario", async ({ error, price }) => {
    const { waitFormToLoad, checkError, fillAndSubmitForm, validFormValues } =
      await renderComponent();

    await waitFormToLoad();
    await fillAndSubmitForm({ ...validFormValues, price: price });
    await checkError(RegExp(error));
  });

  it.each([
    {
      scenario: "is missing",
      error: /is required/i,
    },
  ])("should show error if category $scenario", async ({ error }) => {
    const { waitFormToLoad, checkError, fillAndSubmitForm, validFormValues } =
      await renderComponent();

    await waitFormToLoad();
    await fillAndSubmitForm({ ...validFormValues, categoryIdx: undefined });
    await checkError(RegExp(error));
  });
});
