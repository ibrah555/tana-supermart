import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Gallery } from "@/components/product/Gallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SellerCard } from "@/components/product/SellerCard";
import { DetailTabs } from "@/components/product/DetailTabs";
import { ProductRail } from "@/components/home/ProductRail";
import { products } from "@/data/products";
import { stores } from "@/data/stores";
import { categories } from "@/data/categories";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = products.find((p) => p.id === params.id);
  return {
    title: product
      ? `${product.name.slice(0, 60)} | Tana-Supermart`
      : "Product | Tana-Supermart",
  };
}

export default function ListingPage({ params }: PageProps) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.categorySlug);
  const parent = categories.find((c) =>
    c.children?.some((child) => child.slug === product.categorySlug)
  );
  const store = stores.find((s) => s.id === product.storeId) ?? stores[0];
  const storeProducts = products.filter((p) => p.storeId === product.storeId && p.id !== product.id);
  const related = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  );

  const images = product.gallery?.length ? product.gallery : [product.image];
  const breadcrumbItems = [
    ...(parent ? [{ label: parent.name, href: `/category/${parent.slug}` }] : []),
    ...(category && category.slug !== parent?.slug
      ? [{ label: category.name, href: `/category/${category.slug}` }]
      : []),
    { label: product.name.slice(0, 40) + "…" },
  ];

  return (
    <div className="container-app py-2">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid gap-4 bg-surface p-4 shadow-card lg:grid-cols-2">
        <Gallery images={images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <SellerCard store={store} />

      {storeProducts.length > 0 && (
        <ProductRail
          title="Store Selective"
          products={storeProducts}
          viewMoreHref={`/store/${store.id}`}
        />
      )}

      <div id="reviews" className="scroll-mt-40">
        <DetailTabs product={product} related={related.slice(0, 6)} />
      </div>

      <div className="h-8" aria-hidden />
    </div>
  );
}
