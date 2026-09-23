import { ListingClient } from "@/components/listing/ListingClient";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <ListingClient
      categoryName="All Products"
      products={products}
    />
  );
}
