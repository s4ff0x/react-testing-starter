import { Select, Table } from "@radix-ui/themes";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QuantitySelector from "../components/QuantitySelector";
import { Category, Product } from "../entities";
import { useQuery } from "react-query";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: errorProducts,
  } = useQuery<Product[], AxiosError>("products", async () => {
    const { data } = await axios.get<Product[]>("/products");
    return data;
  });
  const products = productsData || [];

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: errorCategories,
  } = useQuery<Category[], AxiosError>("categories", async () => {
    const { data } = await axios.get<Category[]>("/categories");
    return data;
  });
  const categories = categoriesData || [];

  if (errorProducts)
    return (
      <div data-testid="products-error">Error: {errorProducts.message}</div>
    );

  const renderCategories = () => {
    if (isCategoriesLoading)
      return (
        <div data-testid="categories-skeleton">
          <Skeleton />
        </div>
      );
    if (errorCategories)
      return (
        <div data-testid="categories-error">
          Error: {errorCategories.message}
        </div>
      );

    return (
      <Select.Root
        onValueChange={(categoryId) =>
          setSelectedCategoryId(parseInt(categoryId))
        }
      >
        <Select.Trigger
          placeholder="Filter by Category"
          data-testid="category-trigger"
        />
        <Select.Content>
          <Select.Group>
            <Select.Label>Category</Select.Label>
            <Select.Item value="all" data-testid="category-item">
              All
            </Select.Item>
            {categories?.map((category) => (
              <Select.Item
                key={category.id}
                value={category.id.toString()}
                data-testid="category-item"
              >
                {category.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  };

  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];

    if (errorProducts) return <div>Error: {errorProducts}</div>;

    const visibleProducts = selectedCategoryId
      ? products.filter((p) => p.categoryId === selectedCategoryId)
      : products;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isProductsLoading &&
            skeletons.map((skeleton) => (
              <Table.Row key={skeleton} data-testid="products-skeleton">
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
              </Table.Row>
            ))}
          {!isProductsLoading &&
            visibleProducts.map((product) => (
              <Table.Row key={product.id} data-testid="products-data">
                <Table.Cell data-testid="product-name">
                  {product.name}
                </Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">{renderCategories()}</div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
