import ExpandableText from "../../components/ExpandableText";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("ExpandableText", () => {
  it("should render short text", () => {
    const text = "abc";
    render(<ExpandableText text={text} />);

    const shortTextNode = screen.getByRole("article");

    expect(shortTextNode).toHaveTextContent(text);
  });
  it("should render long text", () => {
    const text =
      "loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk eloremwef wef wemfkwmk evмloremwef wef wemfkwmk e";
    render(<ExpandableText text={text} />);

    const shortTextNode = screen.queryByRole("article");

    expect(shortTextNode).not.toHaveTextContent(text);
  });

  it("should test expand", async () => {
    const text = `loremwef wef wemfkwmk e loremwef wef wefwefw wefwefwefwef wemfkwmk e loremwef wef wemfkwmk f wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk f wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk f wemfkwmk e loremwef wef wemfkwmk e loremwef wef wemfkwmk f we`;
    render(<ExpandableText text={text} />);

    const shortText = text.substring(0, 255) + "...";
    const article = screen.queryByRole("article");
    expect(article).toHaveTextContent(shortText);

    const btn = screen.queryByRole("button");
    expect(btn).toHaveTextContent(/show more/i);

    const user = userEvent.setup();
    await user.click(btn!);

    expect(btn).toHaveTextContent(/show less/i);
    expect(article).toHaveTextContent(text);

    await user.click(btn!);
    expect(article).toHaveTextContent(shortText);
    expect(btn).toHaveTextContent(/show more/i);
  });
});
