import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { http, delay, HttpResponse } from "msw";
import { server } from "../mocks/server";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("BrowseProductPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(db.category.create({ name: "Category" + item }));
    });

    [1, 2].forEach(() => {
      products.push(db.product.create());
    });
  });

  afterAll(() => {
    const categoriesIds = categories.map((category) => category.id);
    const productsIds = products.map((product) => product.id);

    db.category.deleteMany({ where: { id: { in: categoriesIds } } });
    db.product.deleteMany({ where: { id: { in: productsIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
  };

  it("should show loading skeleton when fetching categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    screen.debug();

    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched"),
    async () => {
      renderComponent();
      await waitForElementToBeRemoved(() =>
        screen.getByRole("progressbar", { name: /categories/i })
      );
    };

  it("should show loading skeleton when fetching products", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    screen.debug();

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched"),
    async () => {
      renderComponent();
      await waitForElementToBeRemoved(() =>
        screen.getByRole("progressbar", { name: /products/i })
      );
    };

  it("should not render an error if the categories cannot fetched", async () => {
    server.use(
      http.get("/categories", async () => {
        return HttpResponse.error();
      })
    );

    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/i })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });
  it("should render an error if products cannot be fetched", async () => {
    server.use(
      http.get("/products", async () => {
        return HttpResponse.error();
      })
    );
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
