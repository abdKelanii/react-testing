import { it, describe } from "vitest";
import { db } from "./mocks/db";

describe("group", () => {
  it("should", () => {
    const product: any = db.product.create({ name: "Apple" });
    console.log(db.product.delete({ where: { id: { equals: product.id } } }));
  });
});
