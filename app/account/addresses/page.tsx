"use client";

import { useState } from "react";
import { MapPin, Plus, Check, Edit2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Address } from "@/types";

const KENYA_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Uasin Gishu (Eldoret)",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Kilifi",
  "Meru",
  "Nyeri",
  "Garissa",
];

export default function AddressesPage() {
  const { user, updateAddress } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Address>(user.defaultAddress);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateAddress(form);
    setEditing(false);
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface shadow-card rounded-md border border-border p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Delivery Addresses</h1>
          <p className="text-xs text-muted">Manage your preferred shipping locations across Kenya</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="btn-outline h-8 text-xs flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Address
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-surface shadow-card rounded-md border border-border p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Update Default Address</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <label className="space-y-1">
              <span className="font-semibold text-foreground">Full Recipient Name</span>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="h-9 w-full rounded border border-border px-3 text-foreground outline-none focus:border-primary"
              />
            </label>

            <label className="space-y-1">
              <span className="font-semibold text-foreground">Phone Number (M-PESA)</span>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-9 w-full rounded border border-border px-3 text-foreground outline-none focus:border-primary"
              />
            </label>

            <label className="space-y-1">
              <span className="font-semibold text-foreground">County</span>
              <select
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value })}
                className="h-9 w-full rounded border border-border px-2 text-foreground outline-none focus:border-primary bg-surface"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="font-semibold text-foreground">City / Town</span>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="h-9 w-full rounded border border-border px-3 text-foreground outline-none focus:border-primary"
              />
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="font-semibold text-foreground">Building, Street & House Number</span>
              <input
                type="text"
                required
                value={form.addressLines[0] || ""}
                onChange={(e) =>
                  setForm({ ...form, addressLines: [e.target.value] })
                }
                className="h-9 w-full rounded border border-border px-3 text-foreground outline-none focus:border-primary"
              />
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-outline h-9 px-4 text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary h-9 px-6 text-xs">
              Save Address
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-surface shadow-card rounded-md border border-border p-5 relative">
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
            <Check className="h-3 w-3" /> Default Address
          </span>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5" />
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-sm font-bold text-foreground">{user.defaultAddress.fullName}</p>
              <p className="text-muted">{user.defaultAddress.phone}</p>
              <p className="text-foreground pt-1">
                {user.defaultAddress.addressLines.join(", ")}
              </p>
              <p className="text-muted">
                {user.defaultAddress.city}, {user.defaultAddress.county}, Kenya
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
