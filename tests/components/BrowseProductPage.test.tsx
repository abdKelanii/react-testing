import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { http, delay, HttpResponse } from "msw";
import { server } from "../mocks/server";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";

describe("BrowseProductPage", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
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
});