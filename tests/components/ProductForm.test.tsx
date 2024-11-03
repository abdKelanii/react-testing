import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";

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
      waitForFormToLoad: () => screen.findByRole("form"),
      getInputs: () => {
        return {
          nameInput: screen.getByPlaceholderText(/name/i) as HTMLInputElement,
          priceInput: screen.getByPlaceholderText(/price/i) as HTMLInputElement,
          categoryInput: screen.getByRole("combobox", {
            name: /category/i,
          }) as HTMLSelectElement,
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderForm();

    await waitForFormToLoad();

    const { nameInput, priceInput, categoryInput } = getInputs();

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

    const { waitForFormToLoad, getInputs } = renderForm(product);

    await waitForFormToLoad();

    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });
});
