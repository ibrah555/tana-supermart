import { PromoTiles } from "@/components/home/PromoTiles";
import { FlashSaleStrip } from "@/components/home/FlashSaleStrip";
import { HotCategories } from "@/components/home/HotCategories";
import { ProductRail } from "@/components/home/ProductRail";
import { RecommendGrid } from "@/components/home/RecommendGrid";
import { newArrivals, recommendedProducts } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <PromoTiles />
      <FlashSaleStrip />
      <HotCategories />
      <ProductRail
        title="What's New"
        products={newArrivals}
        viewMoreHref="/new-arrivals"
      />
      <RecommendGrid />
      <ProductRail
        title="Recommended For You"
        products={recommendedProducts}
        viewMoreHref="/products"
      />
      <div className="h-8" aria-hidden />
    </>
  );
}
