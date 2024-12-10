import UserAccount from "../../components/UserAccount";
import { render, screen } from "@testing-library/react";

describe("UserAccount", () => {
  it("should render with name", () => {
    render(
      <UserAccount
        user={{
          id: 1,
          name: "anton",
          isAdmin: true,
        }}
      />,
    );

    const name = screen.queryByText("anton");
    expect(name).toBeInTheDocument();
  });
  it("should render with button if admin", () => {
    render(<UserAccount user={{ id: 1, name: "", isAdmin: true }} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
  it("should render without button if no admin", () => {
    render(<UserAccount user={{ id: 1, name: "", isAdmin: false }} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
