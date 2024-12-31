import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Theme } from "@radix-ui/themes";
import { CartProvider } from "../providers/CartProvider.tsx";

export const AllProviders = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={client}>
      <CartProvider>
        <Theme>{children}</Theme>
      </CartProvider>
    </QueryClientProvider>
  );
};
