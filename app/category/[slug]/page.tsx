import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ListingClient } from "@/components/listing/ListingClient";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { sharedFacets } from "@/data/facets";

interface PageProps {
  params: { slug: string };
}

function resolveCategory(slug: string) {
  for (const cat of categories) {
    if (cat.slug === slug) return { category: cat, parent: null, children: cat.children ?? [] };
    const child = cat.children?.find((c) => c.slug === slug);
    if (child) return { category: child, parent: cat, children: [] };
  }
  return null;
}

export function generateStaticParams() {
  return categories.flatMap((c) => [
    { slug: c.slug },
    ...(c.children ?? []).map((child) => ({ slug: child.slug })),
  ]);
}

export function generateMetadata({ params }: PageProps): Metadata {
  const resolved = resolveCategory(params.slug);
  const name = resolved?.category.name ?? "Products";
  return { title: `${name} | Tana-Supermart` };
}

export default function CategoryPage({ params }: PageProps) {
  const resolved = resolveCategory(params.slug);
  if (!resolved) notFound();

  const { category, parent, children } = resolved;
  const targetSlugs = [category.slug, ...children.map((c) => c.slug)];

  let categoryProducts = products.filter(
    (p) =>
      targetSlugs.includes(p.categorySlug) ||
      (p.subCategorySlug && targetSlugs.includes(p.subCategorySlug))
  );

  // Fallback to parent category items if specific subcategory has no items tagged
  if (categoryProducts.length === 0 && parent) {
    categoryProducts = products.filter((p) => p.categorySlug === parent.slug);
  }

  const suggestions = children.map((c) => c.name);

  const breadcrumbItems = parent
    ? [
        { label: parent.name, href: `/category/${parent.slug}` },
        { label: category.name },
      ]
    : [{ label: category.name }];

  return (
    <div className="container-app py-2">
      <Breadcrumb items={breadcrumbItems} />
      <ListingClient
        categoryName={category.name}
        products={categoryProducts}
        suggestions={suggestions}
        categoryLinks={children.map((c) => ({ name: c.name, slug: c.slug }))}
        facets={sharedFacets}
      />
    </div>
  );
}
