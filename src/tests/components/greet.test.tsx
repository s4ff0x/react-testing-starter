import Greet from "../../components/Greet";
import { render, screen } from "@testing-library/react";

describe("Greet", () => {
  it("should greet with name", () => {
    render(<Greet name="anton" />);

    const heading = screen.getByRole("heading");
    screen.debug();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/anton/);
  });
  it("should render with button if no name", () => {
    render(<Greet name="" />);

    const heading = screen.queryByRole("heading");
    const button = screen.getByRole("button");
    expect(heading).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();
    // expect(heading).toHaveTextContent(/anton/);
  });
});
