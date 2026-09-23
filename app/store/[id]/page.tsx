"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { Store, Star, Users, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { stores } from "@/data/stores";
import { products } from "@/data/products";
import { ListingClient } from "@/components/listing/ListingClient";

export default function StorePage({ params }: { params: { id: string } }) {
  const store = stores.find((s) => s.id === params.id);
  const [following, setFollowing] = useState(false);

  if (!store) {
    notFound();
  }

  const storeProducts = products.filter((p) => p.storeId === store.id);

  return (
    <div className="space-y-4">
      {/* Store Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6 shadow-card border-b border-zinc-700">
        <div className="container-app flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0">
              {store.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{store.name}</h1>
                <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Verified Seller
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <strong className="text-white">{store.score.toFixed(1)}</strong> Seller Rating
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-zinc-400" />
                  <strong className="text-white">{store.followers + (following ? 1 : 0)}</strong> Followers
                </span>
                <span className="flex items-center gap-1">
                  <Store className="h-4 w-4 text-zinc-400" />
                  <strong className="text-white">{storeProducts.length}</strong> Items Listed
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFollowing((v) => !v)}
            className={`btn h-10 px-6 text-xs font-bold transition-all ${
              following
                ? "bg-zinc-700 text-white hover:bg-zinc-600"
                : "bg-sale text-white hover:bg-sale-dark shadow-lg"
            }`}
          >
            {following ? "Following Store" : "+ Follow Store"}
          </button>
        </div>
      </div>

      {/* Store Products */}
      <ListingClient
        categoryName={`${store.name} Storefront`}
        products={storeProducts}
      />
    </div>
  );
}
