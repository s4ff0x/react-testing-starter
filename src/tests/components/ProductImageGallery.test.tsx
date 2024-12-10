import ProductImageGallery from "../../components/ProductImageGallery";
import { render, screen } from "@testing-library/react";

describe("ProductImageGallery", () => {
  it("should render with null", () => {
    const imageUrls: string[] = [];
    const { container } = render(<ProductImageGallery imageUrls={imageUrls} />);

    expect(container).toBeEmptyDOMElement();
  });
  it("should render with array", () => {
    const imageUrls: string[] = [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ];
    render(<ProductImageGallery imageUrls={imageUrls} />);

    imageUrls.forEach((imageUrl) => {
      const image = screen.getByTestId(`img-${imageUrl}`);
      expect(image).toHaveAttribute("src", imageUrl);
    });
  });
});
