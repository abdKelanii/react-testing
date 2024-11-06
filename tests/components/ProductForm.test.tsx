import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderForm = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    return {
      waitForFormToLoad: async () => {
        await screen.findByRole("form");
        return {
          nameInput: screen.getByPlaceholderText(/name/i) as HTMLInputElement,
          priceInput: screen.getByPlaceholderText(/price/i) as HTMLInputElement,
          categoryInput: screen.getByRole("combobox", {
            name: /category/i,
          }) as HTMLSelectElement,
          submitButton: screen.getByRole("button"),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderForm();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const product = {
      id: 1,
      name: "Product 1",
      price: 100,
      categoryId: category.id,
    };

    const { waitForFormToLoad } = renderForm(product);
    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  it("should put focus on the name field", async () => {
    const { waitForFormToLoad } = renderForm();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  it("should display an error if name is missing", async () => {
    const { waitForFormToLoad } = renderForm();
    const form = await waitForFormToLoad();

    const user = userEvent.setup();
    await user.type(form.priceInput, "10");
    await user.click(form.categoryInput);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(form.submitButton);

    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i);
  });
});
