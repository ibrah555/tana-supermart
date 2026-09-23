import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

export function RecommendGrid() {
  return (
    <section aria-labelledby="recommend-heading" className="mt-4 bg-surface py-3 shadow-card">
      <div className="container-app">
        <h2 id="recommend-heading" className="mb-3 text-base font-bold text-foreground">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((p) => (
            <div key={p.id} className="border border-border">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
