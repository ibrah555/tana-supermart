"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle2, ShoppingBag, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatKes } from "@/lib/format";
import type { Order } from "@/types";

export default function OrdersPage() {
  const { orders } = useAuth();
  const { addItem } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  function handleReorder(order: Order) {
    order.items.forEach((item) => {
      addItem(item.product, item.quantity);
    });
  }

  if (orders.length === 0) {
    return (
      <div className="bg-surface shadow-card rounded-md border border-border p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-muted" />
        <h2 className="mt-4 text-base font-bold text-foreground">No Orders Yet</h2>
        <p className="mt-1 text-xs text-muted">You haven&apos;t placed any orders on Tana-Supermart.</p>
        <Link href="/" className="btn-primary mt-6 inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface shadow-card rounded-md border border-border p-4">
        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
        <p className="text-xs text-muted">Track past & current shipments delivered across Kenya</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-surface shadow-card rounded-md border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-muted">Order ID: </span>
                  <span className="font-mono font-bold text-foreground">{order.id}</span>
                </div>
                <div>
                  <span className="text-muted">Date: </span>
                  <span className="font-semibold text-foreground">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Product Items List */}
            <div className="p-4 divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="h-16 w-16 shrink-0 rounded border border-border overflow-hidden bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/listing/${item.product.id}`}
                      className="text-xs font-semibold text-foreground hover:text-primary line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      Qty: {item.quantity} × {formatKes(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-sale">
                      {formatKes(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3">
              <div>
                <p className="text-xs text-muted">
                  Total Paid: <span className="font-bold text-foreground">{formatKes(order.totalAmount)}</span>
                </p>
                <p className="text-[11px] text-muted">Tracking: {order.trackingNumber}</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="btn-outline h-8 text-xs flex items-center gap-1.5"
                >
                  <Truck className="h-3.5 w-3.5" />
                  Track Order
                </button>

                <button
                  type="button"
                  onClick={() => handleReorder(order)}
                  className="btn-primary h-8 text-xs flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Re-order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface rounded-lg shadow-pop border border-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Shipment Tracking · {selectedOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-bold text-muted hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 bg-background p-3 rounded text-xs">
                <Truck className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Estimated Delivery</p>
                  <p className="text-muted">{selectedOrder.estimatedDelivery}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4 pl-4 border-l-2 border-primary/30 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-primary/20" />
                  <p className="font-bold text-foreground">Order Processed & Paid</p>
                  <p className="text-muted">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-primary/20" />
                  <p className="font-bold text-foreground">Dispatched from Warehouse</p>
                  <p className="text-muted">Courier: Fargo Courier / G4S Kenya</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  <p className="font-bold text-emerald-700">Out for Final Delivery</p>
                  <p className="text-muted">Destination: {selectedOrder.shippingAddress.city}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="w-full btn-primary h-9 text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
