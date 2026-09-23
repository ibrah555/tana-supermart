import Link from "next/link";
import { Store, MessageSquare } from "lucide-react";
import type { Store as StoreType } from "@/types";

export function SellerCard({ store }: { store: StoreType }) {
  return (
    <section
      aria-label={`Seller: ${store.name}`}
      className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 bg-surface px-4 py-3 shadow-card"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center bg-foreground text-sm font-bold text-white">
          {store.name.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <p className="text-sm font-bold text-foreground">{store.name}</p>
          <p className="text-xs text-muted">{store.productCount} products</p>
        </div>
      </div>

      <dl className="flex items-center gap-8 text-xs text-muted">
        <div>
          <dt className="sr-only">Store score</dt>
          <dd>
            Score{" "}
            <strong className="block text-sm text-sale">{store.score.toFixed(1)}</strong>
          </dd>
        </div>
        <div>
          <dt className="sr-only">Followers</dt>
          <dd>
            Followers{" "}
            <strong className="block text-sm text-foreground">
              {store.followers.toLocaleString()}
            </strong>
          </dd>
        </div>
      </dl>

      <div className="ml-auto flex gap-2">
        <Link
          href={`/store/${store.id}`}
          className="btn-outline h-9 px-4 text-xs"
        >
          <Store className="h-4 w-4" aria-hidden />
          Visit Store
        </Link>
        <Link
          href={`/store/${store.id}/chat`}
          className="btn-outline h-9 px-4 text-xs"
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          Chat Seller
        </Link>
      </div>
    </section>
  );
}
