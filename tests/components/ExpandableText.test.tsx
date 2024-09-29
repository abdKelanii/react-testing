import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";

describe("ExpanableText", () => {
  it("should render the full text if it is less than 255", () => {
    const text =
      "Lorem ipsum dolor sit amet, adipisicing elit. Lorem ipsum dolor sit amet, adipisicing elitLorem ipsum dolor sit amet, adipisicing elitLorem ipsum dolor sit amet, adipisicing elitLorem ipsum dolor sit amet, adipisicing elitelit elit elit elit elitelit elit";

    render(<ExpandableText text={text} />);

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveTextContent(text);
  });
});
