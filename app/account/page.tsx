"use client";

import Link from "next/link";
import { Package, Heart, MapPin, ChevronRight, Phone, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatKes } from "@/lib/format";

export default function AccountDashboardPage() {
  const { user, orders, wishlist } = useAuth();
  const recentOrder = orders[0];

  return (
    <div className="space-y-6">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="bg-surface p-4 shadow-card rounded-md border border-border transition-all hover:border-primary flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-foreground mt-1">{orders.length}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
        </Link>

        <Link
          href="/account/wishlist"
          className="bg-surface p-4 shadow-card rounded-md border border-border transition-all hover:border-primary flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted font-medium">Saved Items</p>
            <p className="text-2xl font-bold text-foreground mt-1">{wishlist.length}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-sale/10 text-sale flex items-center justify-center">
            <Heart className="h-5 w-5" />
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="bg-surface p-4 shadow-card rounded-md border border-border transition-all hover:border-primary flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted font-medium">Default Location</p>
            <p className="text-sm font-bold text-foreground mt-1 truncate max-w-[120px]">
              {user.defaultAddress.city}, {user.defaultAddress.county}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
        </Link>
      </div>

      {/* Account Info Details */}
      <div className="bg-surface shadow-card rounded-md border border-border p-5">
        <h3 className="text-base font-bold text-foreground mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          <div className="flex items-center gap-3 p-3 bg-background rounded-md">
            <User className="h-4 w-4 text-muted" />
            <div>
              <p className="text-xs text-muted">Full Name</p>
              <p className="font-semibold text-foreground">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-md">
            <Mail className="h-4 w-4 text-muted" />
            <div>
              <p className="text-xs text-muted">Email Address</p>
              <p className="font-semibold text-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-md">
            <Phone className="h-4 w-4 text-muted" />
            <div>
              <p className="text-xs text-muted">Phone Number</p>
              <p className="font-semibold text-foreground">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-md">
            <MapPin className="h-4 w-4 text-muted" />
            <div>
              <p className="text-xs text-muted">Default Shipping Address</p>
              <p className="font-semibold text-foreground">
                {user.defaultAddress.addressLines[0]}, {user.defaultAddress.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Order Preview */}
      {recentOrder && (
        <div className="bg-surface shadow-card rounded-md border border-border p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h3 className="text-base font-bold text-foreground">Recent Order</h3>
            <Link
              href="/account/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All Orders
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm bg-background p-4 rounded-md">
            <div>
              <p className="font-bold text-foreground">{recentOrder.id}</p>
              <p className="text-xs text-muted">
                Placed on {new Date(recentOrder.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="inline-block rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {recentOrder.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Total Amount</p>
              <p className="font-bold text-sale">{formatKes(recentOrder.totalAmount)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
