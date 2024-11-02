import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductLists", () => {
  const productsIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productsIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productsIds } } });
  });

  it("should render the list of products", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  
  it("should render no products availabe if there is no products", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));
    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    render(<ProductList />, { wrapper: AllProviders });

    const errorMessage = await screen.findByText(/error/i);

    expect(errorMessage).toBeInTheDocument();
  });

  it("should render loading indicator if data is fetching", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProviders });

    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("should remove the loading indicator when the data is fetched", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
