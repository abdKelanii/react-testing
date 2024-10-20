import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import { QueryClient, QueryClientProvider } from "react-query";

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

  const renderComponent = () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <QueryClientProvider client={client}>
        <ProductList />
      </QueryClientProvider>
    );
  };

  it("should render the list of products", async () => {
    renderComponent();
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products availabe if there is no products", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));
    renderComponent();

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

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
    renderComponent();

    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("should remove the loading indicator when the data is fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
