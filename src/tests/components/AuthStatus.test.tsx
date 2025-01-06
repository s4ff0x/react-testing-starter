import AuthStatus from "../../components/AuthStatus.tsx";
import { render, screen } from "@testing-library/react";
import { mockUseAuth0 } from "../lib.ts";

describe("AuthStatus", () => {
  it("should show loading state", () => {
    mockUseAuth0({
      isLoading: true,
      user: undefined,
      isAuthenticated: false,
    });
    render(<AuthStatus />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should show logged out state", () => {
    mockUseAuth0({
      isLoading: false,
      user: undefined,
      isAuthenticated: false,
    });
    render(<AuthStatus />);
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it("should show logged in state", () => {
    mockUseAuth0({
      isLoading: false,
      user: { name: "anton" },
      isAuthenticated: true,
    });
    render(<AuthStatus />);
    expect(screen.getByText(/anton/i)).toBeInTheDocument();
  });
});
