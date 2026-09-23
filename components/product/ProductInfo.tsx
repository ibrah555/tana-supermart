"use client";

import { useState } from "react";
import { Heart, Share2, ChevronDown, Info } from "lucide-react";
import type { Product } from "@/types";
import { formatKes, discountPercent } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { RatingStars } from "@/components/ui/RatingStars";
import { FlashSaleBar } from "./FlashSaleBar";
import { QuantityStepper } from "./QuantityStepper";
import { cn } from "@/lib/utils";

function VariantSwatches({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          onClick={() => onChange(opt)}
          className={cn(
            "flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors",
            value === opt
              ? "border-primary bg-primary-light font-semibold text-primary"
              : "border-border text-foreground hover:border-primary"
          )}
        >
          <span className="h-3.5 w-3.5 rounded-full border border-black/20 bg-gradient-to-br from-gray-700 to-gray-900" />
          {opt}
        </button>
      ))}
    </div>
  );
}

export function ProductInfo({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState(product.variants?.options[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const discount = discountPercent(product.price, product.originalPrice);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-semibold leading-6 text-foreground">
        {product.name}
      </h1>

      <div className="flex items-center gap-2 text-sm">
        <RatingStars rating={product.rating} />
        <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
        <a href="#reviews" className="text-primary hover:underline">
          {product.reviews.toLocaleString()} Customer reviews
        </a>
      </div>

      {product.isFlashSale && product.flashSaleEndsAt && (
        <FlashSaleBar endsAt={product.flashSaleEndsAt} />
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">
          {formatKes(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-sm text-muted line-through">
              {formatKes(product.originalPrice)}
            </span>
            {discount && <span className="badge-off">-{discount}%</span>}
          </>
        )}
      </div>

      {product.variants && (
        <div className="flex items-start gap-3 text-sm">
          <span className="w-28 shrink-0 pt-1.5 text-muted">Color:</span>
          <VariantSwatches
            options={product.variants.options}
            value={variant}
            onChange={setVariant}
          />
        </div>
      )}

      <div className="flex items-start gap-3 text-sm">
        <span className="w-28 shrink-0 text-muted">Delivery Information:</span>
        <span className={cn(!product.inStock && "text-sale")}>
          {product.inStock
            ? "Ready for dispatch. Estimated delivery to your area: 1–3 working days."
            : "This variant is out of stock. Delivery time unavailable. Try switching to a different variant."}
        </span>
      </div>

      <div className="flex items-start gap-3 text-sm">
        <span className="w-28 shrink-0 pt-1 text-muted">Promotions:</span>
        <div>
          <button
            type="button"
            onClick={() => setPromoOpen((v) => !v)}
            aria-expanded={promoOpen}
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            {promoOpen ? "Hide" : "Claim Now"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", promoOpen && "rotate-180")}
              aria-hidden
            />
          </button>
          <div className="mt-1.5 flex gap-2">
            {["KSh 19", "KSh 159"].map((p) => (
              <span
                key={p}
                className="border border-dashed border-sale px-2 py-1 text-xs font-semibold text-sale"
              >
                {p}
              </span>
            ))}
          </div>
          {promoOpen && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-muted">
              <Info className="h-3.5 w-3.5" aria-hidden />
              Voucher discounts applied automatically at checkout.
            </p>
          )}
        </div>
      </div>

      {/* Automated Stock Inventory Status Badge */}
      <div className="flex items-center gap-3 text-xs pt-1">
        <span className="w-28 shrink-0 text-muted font-medium">Availability:</span>
        {product.stockQuantity === 0 || !product.inStock ? (
          <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            Out of Stock (0 units left)
          </span>
        ) : product.stockQuantity <= (product.lowStockThreshold || 10) ? (
          <span className="font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded animate-pulse">
            ⚠️ Only {product.stockQuantity} left in stock — order soon!
          </span>
        ) : (
          <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
            ✓ In Stock ({product.stockQuantity} units available)
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="w-28 shrink-0 text-muted">Quantity:</span>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => addItem(product, quantity)}
          className="btn-primary h-11 flex-1 sm:flex-none sm:px-10"
        >
          Add to Cart
        </button>
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => {
            addItem(product, quantity);
            window.location.href = "/shopping-cart";
          }}
          className="btn-sale h-11 flex-1 sm:flex-none sm:px-10"
        >
          Buy at Original Price
        </button>
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((v) => !v)}
          className={cn(
            "flex h-11 w-11 items-center justify-center border transition-colors",
            wishlisted
              ? "border-sale text-sale"
              : "border-border text-muted hover:border-sale hover:text-sale"
          )}
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-sale")} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Share product"
          onClick={handleShare}
          className="flex h-11 w-11 items-center justify-center border border-border text-muted transition-colors hover:border-primary hover:text-primary"
        >
          <Share2 className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {!product.inStock && (
        <p className="flex items-center gap-1.5 text-xs text-sale">
          <Info className="h-3.5 w-3.5" aria-hidden />
          This flash sales product is out of stock right now.
        </p>
      )}
    </div>
  );
}
