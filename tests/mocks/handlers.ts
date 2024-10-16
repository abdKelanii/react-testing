import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Books" },
      { id: 3, name: "Home & Kitchen" },
    ]);
  }),

  http.get("/products", () => {
    return HttpResponse.json([
      { id: 1, name: "Laptop" },
      { id: 2, name: "Book" },
      { id: 3, name: "Sofa" },
    ]);
  }),
];
