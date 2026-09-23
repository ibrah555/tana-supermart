"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Address } from "@/types";

export function ShippingInfoCard({ address }: { address: Address }) {
  const [editing, setEditing] = useState(false);

  return (
    <section aria-labelledby="shipping-heading" className="bg-surface shadow-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 id="shipping-heading" className="text-sm font-bold text-foreground">
          Shipping Information
        </h2>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          aria-expanded={editing}
          className="btn-outline h-8 px-4 text-xs"
        >
          Edit
        </button>
      </header>

      <div className="px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          {address.fullName}
          <span className="ml-4 font-normal text-muted">{address.phone}</span>
        </p>
        <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-5 text-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>
            {address.addressLines.join(", ")} · {address.city}, {address.county}
          </span>
        </p>
      </div>

      {editing && (
        <form
          className="grid gap-3 border-t border-border px-4 py-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setEditing(false);
          }}
        >
          <label className="text-xs font-medium text-muted">
            Full name
            <input
              defaultValue={address.fullName}
              className="mt-1 h-9 w-full border border-border px-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="text-xs font-medium text-muted">
            Phone number
            <input
              defaultValue={address.phone}
              className="mt-1 h-9 w-full border border-border px-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="text-xs font-medium text-muted sm:col-span-2">
            Delivery address
            <textarea
              defaultValue={address.addressLines.join("\n")}
              rows={2}
              className="mt-1 w-full border border-border px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary h-9 px-6 text-xs">
              Save Address
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
