import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpanableText", () => {
  const limit = 255;
  const longTexgt = "a".repeat(limit + 1);
  const truncatedText = longTexgt.substring(0, limit) + "...";

  it("should render the full text if it is less than 255", () => {
    const text = "Lorem ipsum dolor sit amet,amet, adipisicing elitelit";

    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should truncate the text if longer than 255 characters", () => {
    render(<ExpandableText text={longTexgt} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/show more/i);
  });

  it("should expand the text when the show more button is clicked", async () => {
    render(<ExpandableText text={longTexgt} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.queryByText(longTexgt)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it("should collapse text when show less button is clicked", async () => {
    render(<ExpandableText text={longTexgt} />);
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(screen.queryByText(truncatedText)).toBeInTheDocument();
    expect(showLessButton).toHaveTextContent(/more/i);
  });
});
