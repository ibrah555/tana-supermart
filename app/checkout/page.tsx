"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { stores } from "@/data/stores";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { ShippingInfoCard } from "@/components/checkout/ShippingInfoCard";
import { PaymentMethodCard } from "@/components/checkout/PaymentMethodCard";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { MpesaStkModal } from "@/components/checkout/MpesaStkModal";
import type { Order } from "@/types";

const FLAT_SHIPPING_FEE = 729;

export default function CheckoutPage() {
  const { items, selectedTotal, selectedCount, clear } = useCart();
  const { user, addOrder } = useAuth();

  const [stkModalOpen, setStkModalOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [activeDbOrder, setActiveDbOrder] = useState<{ id: string; orderNumber: string } | null>(null);

  const selectedItems = useMemo(
    () => items.filter((i) => i.selected),
    [items]
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof selectedItems>();
    for (const item of selectedItems) {
      const list = map.get(item.product.storeId) ?? [];
      list.push(item);
      map.set(item.product.storeId, list);
    }
    return [...map.entries()].map(([storeId, storeItems]) => ({
      store:
        stores.find((s) => s.id === storeId) ?? {
          id: storeId,
          name: storeId,
          score: 0,
          productCount: 0,
          followers: 0,
        },
      items: storeItems,
    }));
  }, [selectedItems]);

  const shippingFee = selectedCount > 0 ? FLAT_SHIPPING_FEE : 0;
  const grandTotal = selectedTotal + shippingFee;

  async function triggerCheckout() {
    setPlacing(true);

    try {
      // 1. Create order in PostgreSQL database via live API route
      const orderPayload = {
        userId: user.id || null,
        customerName: user.name || "Customer",
        customerEmail: user.email || "",
        customerPhone: user.phone || "+254 700 000 000",
        county: user.defaultAddress?.county || "Nairobi",
        addressLine: user.defaultAddress?.addressLines?.join(", ") || "Nairobi, Kenya",
        subtotal: selectedTotal,
        deliveryFee: shippingFee,
        discount: 0,
        total: grandTotal,
        paymentMethod: "MPESA",
        items: selectedItems.map((i) => ({
          productId: i.product.id,
          title: i.product.name,
          price: i.product.price,
          costPrice: i.product.costPrice || i.product.price * 0.7,
          quantity: i.quantity,
          image: i.product.image || "",
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setActiveDbOrder({ id: data.order.id, orderNumber: data.order.orderNumber });

          // 2. Initiate M-PESA STK Push prompt via Daraja API
          fetch("/api/payments/mpesa/stkpush", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: user.phone || "+254700000000",
              amount: grandTotal,
              orderId: data.order.id,
            }),
          }).catch(console.warn);
        }
      }
    } catch (e) {
      console.warn("Order creation notice, using client fallback:", e);
    } finally {
      setPlacing(false);
      setStkModalOpen(true);
    }
  }

  async function handlePaymentSuccess(txnId: string) {
    setStkModalOpen(false);
    setPlacing(true);

    const orderNumber = activeDbOrder?.orderNumber || "TS-2026-" + Math.floor(1000 + Math.random() * 9000);
    const orderDbId = activeDbOrder?.id;

    // 3. Mark order as PAID in PostgreSQL with the Safaricom receipt
    if (orderDbId) {
      fetch(`/api/orders/${orderDbId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PAID",
          mpesaReceipt: txnId,
        }),
      }).catch(console.error);
    }

    const newOrder: Order = {
      id: orderNumber,
      date: new Date().toISOString(),
      status: "Processing",
      items: selectedItems.map((i) => ({
        product: i.product,
        quantity: i.quantity,
        price: i.product.price,
      })),
      totalAmount: grandTotal,
      paymentMethod: `M-PESA (${txnId})`,
      shippingAddress: user.defaultAddress,
      trackingNumber: "KE-EXP-" + Math.floor(1000000 + Math.random() * 9000000),
      estimatedDelivery: "2-3 Business Days",
    };

    addOrder(newOrder);

    setTimeout(() => {
      clear();
      setPlacing(false);
      setPlacedOrder(newOrder);
      window.scrollTo({ top: 0 });
    }, 600);
  }

  if (placedOrder) {
    return (
      <div className="container-app py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
        <p className="mt-2 text-sm text-muted">
          Order ID: <span className="font-mono font-semibold text-foreground">{placedOrder.id}</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          Payment confirmed via {placedOrder.paymentMethod}. Tracking updates will be sent to {user.phone}.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account/orders" className="btn-primary flex items-center gap-2">
            <PackageCheck className="h-4 w-4" />
            Track My Order
          </Link>
          <Link href="/" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-lg font-bold text-foreground">Checkout</h1>
        <p className="mt-2 text-sm text-muted">
          You have no selected items to check out.
        </p>
        <Link href="/shopping-cart" className="btn-primary mt-6">
          Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app space-y-3 py-3">
      <CheckoutStepper current={1} />
      <ShippingInfoCard address={user.defaultAddress} />
      <PaymentMethodCard />
      <OrderSummary
        groups={groups}
        productAmount={selectedTotal}
        shippingFee={shippingFee}
        placing={placing}
        onPlaceOrder={triggerCheckout}
      />

      <MpesaStkModal
        isOpen={stkModalOpen}
        amount={grandTotal}
        phone={user.phone}
        onCancel={() => setStkModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
      <div className="h-8" aria-hidden />
    </div>
  );
}
