import Link from "next/link";
import { BadgeCheck, Store } from "lucide-react";
import type { Product } from "@/types";
import { formatKes, discountPercent } from "@/lib/format";
import { RatingStars } from "./RatingStars";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <Link
      href={`/listing/${product.id}`}
      className="group relative flex w-40 shrink-0 flex-col bg-surface transition-shadow hover:shadow-pop sm:w-44"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isFlashSale && (
          <span className="badge-flash absolute left-0 top-2">Flash Sale</span>
        )}
        {discount && (
          <span className="badge-off absolute right-0 top-2">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2">
        <h3 className="line-clamp-2 min-h-8 text-xs leading-4 text-foreground">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1.5">
          <span className="price text-sm">{formatKes(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-muted line-through">
              {formatKes(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <RatingStars rating={product.rating} />
          <span className="text-[11px] text-muted">({product.reviews})</span>
        </div>

        {product.fulfilledByPlatform && (
          <span className="mt-auto flex items-center gap-1 text-[10px] text-muted">
            <BadgeCheck className="h-3 w-3 text-primary" aria-hidden />
            Fulfilled by Tana-Supermart
          </span>
        )}
        {product.brandOfficial && (
          <span className="mt-auto flex items-center gap-1 text-[10px] text-muted">
            <Store className="h-3 w-3 text-primary" aria-hidden />
            Brand Official
          </span>
        )}
      </div>
    </Link>
  );
}
