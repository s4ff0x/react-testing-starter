import {
  render,
  renderHook,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import { Test, useTest } from "../../pages/Test.tsx";
import { AllProviders } from "../all-providers.tsx";
import { useQuery } from "react-query";

export function useCustomHook() {
  return useQuery({ queryKey: ["customHook"], queryFn: () => "Hello" });
}

describe("Test", () => {
  it.skip("should render", async () => {
    // render(<Test />, { wrapper: AllProviders });
    // const loading = screen.getByText(/loading/i);
    // expect(loading).toBeInTheDocument();
    // await waitForElementToBeRemoved(screen.getByText(/loading/i));
    // expect(screen.findByText(/react-testing-vite/i)).toBeInTheDocument();
    // expect(screen.findByText(/this is a test repository/i)).toBeInTheDocument();

    const { result } = renderHook(() => useTest(), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.name).toEqual("react-testing-vite");
  });
  it("should render", async () => {
    // render(<Test />, { wrapper: AllProviders });
    // const loading = screen.getByText(/loading/i);
    // expect(loading).toBeInTheDocument();
    // await waitForElementToBeRemoved(screen.getByText(/loading/i));
    // expect(screen.findByText(/react-testing-vite/i)).toBeInTheDocument();
    // expect(screen.findByText(/this is a test repository/i)).toBeInTheDocument();

    const { result } = renderHook(() => useTest(), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(123);
  });
});
