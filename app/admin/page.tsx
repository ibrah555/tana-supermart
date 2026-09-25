"use client";

import Link from "next/link";
import {
  TrendingUp,
  Package,
  CreditCard,
  Store,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminOverviewPage() {
  const { orders, products, mpesaLedger, stores, countyRates } = useAdmin();

  const safeOrders = orders || [];
  const safeProducts = products || [];
  const safeMpesaLedger = mpesaLedger || [];
  const safeStores = stores || [];

  // Metrics calculations
  const totalGmv = safeOrders.reduce((sum, o) => sum + (o?.totalAmount || 0), 0);
  const paidOrders = safeOrders.filter((o) => o && o.status !== "Cancelled");
  const completedMpesa = safeMpesaLedger.filter((t) => t && t.status === "COMPLETED");
  const pendingMpesa = safeMpesaLedger.filter((t) => t && t.status === "PENDING");
  const outOfStockProducts = safeProducts.filter((p) => p && !p.inStock);
  const flashSaleItems = safeProducts.filter((p) => p && p.isFlashSale);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-[#24dcac] text-slate-900 flex items-center justify-center font-bold">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Platform Master Console Active
            </h2>
            <p className="text-xs text-slate-600">
              Controlling 47 Kenya County routes, Safaricom Daraja payments, and vendor catalog.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/reports"
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-800 rounded hover:bg-slate-100 transition-colors"
          >
            Financial Reports
          </Link>
          <Link
            href="/admin/users"
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-800 rounded hover:bg-slate-100 transition-colors"
          >
            Users & Roles
          </Link>
          <Link
            href="/admin/settings"
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-800 rounded hover:bg-slate-100 transition-colors"
          >
            Adjust Presets
          </Link>
          <Link
            href="/admin/orders"
            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards - Clean, Flat, Solid White */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Gross Platform GMV</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            KES {totalGmv.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">{paidOrders.length} orders</span>
            <span>settled via M-PESA & Cash</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>M-PESA Daraja Volume</span>
            <CreditCard className="h-4 w-4 text-[#24dcac]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {completedMpesa.length} Paid
          </div>
          <div className="mt-2 text-[11px] text-slate-600">
            {pendingMpesa.length > 0 ? (
              <span className="text-amber-700 font-semibold">{pendingMpesa.length} STK Pushes awaiting PIN</span>
            ) : (
              <span className="text-emerald-700 font-semibold">100% Transactions Reconciled</span>
            )}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Catalog Items</span>
            <Package className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {products.length} Products
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
            <span className="font-semibold text-slate-900">{flashSaleItems.length} on Flash Sale</span>
            {outOfStockProducts.length > 0 && (
              <span className="text-rose-600 font-semibold">({outOfStockProducts.length} low stock)</span>
            )}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Stores</span>
            <Store className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {stores.length} Vendors
          </div>
          <div className="mt-2 text-[11px] text-slate-600">
            <span className="font-semibold text-emerald-700">
              {stores.filter((s) => s.status === "Active").length} Approved
            </span>{" "}
            • {stores.filter((s) => s.status === "Pending KYC").length} Pending KYC
          </div>
        </div>
      </div>

      {/* Orders Table & Quick Kenyan County Logistics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - 2 Cols */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Live order queue ready for dispatch</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#189e7c] hover:underline flex items-center gap-1"
            >
              View all {orders.length}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Customer & County</th>
                  <th className="pb-2.5">Items</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeOrders.slice(0, 5).map((order) => {
                  if (!order) return null;
                  const total = Number(order.totalAmount || 0);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-semibold text-slate-900">
                        {order.id}
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-slate-900">
                          {order.shippingAddress?.fullName || "Customer"}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {order.shippingAddress?.city || "Kenya"},{" "}
                          {order.shippingAddress?.county || "Nairobi"}
                        </div>
                      </td>
                      <td className="py-3 text-slate-600">
                        {order.items?.length || 1} item(s)
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        KES {total.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-sky-100 text-sky-800"
                              : order.status === "Processing"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {order.status || "Processing"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kenya County Quick Presets Card - 1 Col */}
        <div className="bg-white border border-slate-200 rounded p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delivery Rates Matrix</h3>
                <p className="text-xs text-slate-500">Customizable Kenya county fees</p>
              </div>
              <Link
                href="/admin/settings"
                className="text-xs font-semibold text-[#189e7c] hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {countyRates.slice(0, 6).map((rate) => (
                <div
                  key={rate.id}
                  className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs">{rate.county}</span>
                    <span className="text-[10px] text-slate-500">{rate.deliveryDays}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    KES {rate.fee}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/admin/settings"
              className="w-full block text-center py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Configure all 47 Counties →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
