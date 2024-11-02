import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import AllProviders from "../AllProviders";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProductPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    const category = db.category.create();
    [1, 2].forEach((item) => {
      categories.push(category);

      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoriesIds = categories.map((category) => category.id);
    const productsIds = products.map((product) => product.id);

    db.category.deleteMany({ where: { id: { in: categoriesIds } } });
    db.product.deleteMany({ where: { id: { in: productsIds } } });
  });

  it("should show loading skeleton when fetching categories", () => {
    simulateDelay("/categories");

    renderComponent();

    screen.debug();

    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched"),
    async () => {
      const { getCategoriesSkeleton } = renderComponent();
      await waitForElementToBeRemoved(getCategoriesSkeleton);
    };

  it("should show loading skeleton when fetching products", () => {
    simulateDelay("/categories");

    const { getProductSkeleton } = renderComponent();

    screen.debug();

    expect(getProductSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched"),
    async () => {
      const { getProductSkeleton } = renderComponent();
      await waitForElementToBeRemoved(getProductSkeleton());
    };

  it("should not render an error if the categories cannot fetched", async () => {
    simulateError("/categories");

    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsTobeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsTobeInTheDocument(products);
  });

  it("should render all products if all category is selected", async () => {
    const { selectCategory, expectProductsTobeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsTobeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProviders });

  const getCategoriesSkeleton = () =>
    screen.queryByRole("progressbar", { name: /categories/i });

  const getProductSkeleton = () =>
    screen.queryByRole("progressbar", { name: /products/i });

  const getCategoriesCombobox = () => screen.queryByRole("combobox");

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesCombobox();
    const user = userEvent.setup();
    await user.click(combobox!);

    const option = screen.getByRole("option", {
      name,
    });
    await user.click(option);
  };

  const expectProductsTobeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(products.length + 1);
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getProductSkeleton: getProductSkeleton,
    getCategoriesSkeleton: getCategoriesSkeleton,
    getCategoriesCombobox: getCategoriesCombobox,
    selectCategory: selectCategory,
    expectProductsTobeInTheDocument: expectProductsTobeInTheDocument,
  };
};
