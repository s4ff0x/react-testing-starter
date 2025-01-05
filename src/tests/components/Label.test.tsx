import Label from "../../components/Label.tsx";
import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "../../providers/language/LanguageProvider.tsx";
import { Language } from "../../providers/language/type.ts";

describe("Label", () => {
  const renderComponent = (language: Language, labelId: string) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>,
    );
  };
  it.each([
    {
      labelId: "welcome",
      text: "Welcome",
    },
    {
      labelId: "new_product",
      text: "New Product",
    },
    {
      labelId: "edit_product",
      text: "Edit Product",
    },
  ])("should render label in English", ({ labelId, text }) => {
    renderComponent("en", labelId);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it.each([
    {
      labelId: "welcome",
      text: "Bienvenidos",
    },
    {
      labelId: "new_product",
      text: "Nuevo Producto",
    },
    {
      labelId: "edit_product",
      text: "Editar Producto",
    },
  ])("should render label in Spanish", ({ labelId, text }) => {
    renderComponent("es", labelId);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should render error if incorrect labelId is passed", () => {
    expect(() => renderComponent("en", "incorrect_label_id")).toThrow();
  });
});
