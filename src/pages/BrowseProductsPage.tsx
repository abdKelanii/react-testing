import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CategorySelect from "../components/CategorySelect";
import ProductTable from "../components/ProductTable";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <CategorySelect onChange={setSelectedCategoryId} />
      <ProductTable selectedCategoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
