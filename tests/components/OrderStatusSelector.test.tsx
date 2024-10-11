import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      button: screen.getByRole("combobox"),
      onChange: onChange,
      user: userEvent.setup(),
      getOption: () => screen.findAllByRole("option"),
    };
  };

  it("should render New as the default value", () => {
    const { button } = renderComponent();
    expect(button).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    const { button, user, getOption } = renderComponent();

    await user.click(button);
    const options = await getOption();
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);

    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
});
