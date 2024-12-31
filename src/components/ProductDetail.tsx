import { Product } from "../entities";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";

const ProductDetail = ({ productId }: { productId?: number }) => {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product, AxiosError>({
    queryKey: ["products", productId],
    queryFn: () =>
      axios.get<Product>("/products/" + productId).then((res) => {
        console.log("res", res);
        return res.data;
      }),
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    console.log("error", error);
    if (error?.response?.status === 404)
      return (
        <div data-testid={"not-found"}>The given product was not found.</div>
      );
    return <div data-testid={"error"}>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Product Detail</h1>
      <div data-testid="name">Name: {product?.name}</div>
      <div>Price: ${product?.price}</div>
    </div>
  );
};

export default ProductDetail;
