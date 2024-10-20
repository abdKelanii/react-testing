import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { http, HttpResponse, delay } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetails", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render the product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />);

    const name = await screen.findByText(new RegExp(product!.name));
    const price = await screen.findByText(
      new RegExp(product!.price.toString())
    );

    expect(name).toBeInTheDocument();
    expect(price).toBeInTheDocument();
  });

  it("should render a message if the product is not found", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error for invalid product id", async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message when there is an error", async () => {
    server.use(http.get(`/products/${productId}`, () => HttpResponse.error()));
    render(<ProductDetail productId={productId} />);

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
    render(<ProductDetail productId={productId} />);

    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("should remove the loading indicator when the data is fetched", async () => {
    render(<ProductDetail productId={productId} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    render(<ProductDetail productId={productId} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  
});
