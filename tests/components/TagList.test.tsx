import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render at least on list item", async () => {
    render(<TagList />);
    await waitFor(() => {
      const listItem = screen.getAllByRole("listitem");
      expect(listItem.length).toBeGreaterThan(0);
    });
    // const listItem = await screen.findAllByRole("listitem");
    // expect(listItem.length).toBeGreaterThan(0);
  });
});
