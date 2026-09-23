"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatKes } from "@/lib/format";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useAuth();
  const { addItem } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-surface shadow-card rounded-md border border-border p-12 text-center">
        <Heart className="mx-auto h-12 w-12 text-sale/50" />
        <h2 className="mt-4 text-base font-bold text-foreground">Your Wishlist is Empty</h2>
        <p className="mt-1 text-xs text-muted">Save items you love to view or buy them later.</p>
        <Link href="/" className="btn-primary mt-6 inline-block">
          Explore Hot Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface shadow-card rounded-md border border-border p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Saved Wishlist</h1>
          <p className="text-xs text-muted">{wishlist.length} item(s) saved in your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-surface shadow-card rounded-md border border-border overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-background p-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Remove from wishlist"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 text-sale flex items-center justify-center shadow hover:bg-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <Link
                  href={`/listing/${product.id}`}
                  className="text-xs font-semibold text-foreground hover:text-primary line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="mt-2 text-sm font-bold text-sale">
                  {formatKes(product.price)}
                  {product.originalPrice && (
                    <span className="ml-2 text-xs text-muted line-through font-normal">
                      {formatKes(product.originalPrice)}
                    </span>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  addItem(product);
                  toggleWishlist(product);
                }}
                className="w-full btn-primary h-9 text-xs flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="h-4 w-4" />
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
