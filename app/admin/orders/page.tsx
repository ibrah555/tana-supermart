"use client";

import { useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Calendar,
} from "lucide-react";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, assignCourier } = useAdmin();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewReceiptOrder, setViewReceiptOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState("Sendy Express Kenya");
  const [customTracking, setCustomTracking] = useState("");
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = filterStatus === "ALL" || o.status.toUpperCase() === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.county?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, searchQuery]);

  // Pagination calculations
  const totalOrders = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAssignRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const tracking = customTracking || `KE-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    assignCourier(selectedOrder.id, courierName, tracking);
    updateOrderStatus(selectedOrder.id, "Shipped");
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setSelectedOrder(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Orders Archive & Logistics Records
          </h2>
          <p className="text-xs text-slate-500">
            Complete records of all orders with status tracking, pagination, and courier dispatch
          </p>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setFilterStatus(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                filterStatus === st
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Page Size Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded p-3">
        <div className="sm:col-span-3 flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search all order records by ID, customer name, county, phone, or waybill number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs text-slate-900 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 text-xs text-slate-600">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold focus:outline-none"
          >
            <option value={5}>5 orders</option>
            <option value={10}>10 orders</option>
            <option value={20}>20 orders</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & Contact</th>
                <th className="py-3 px-4">Destination County</th>
                <th className="py-3 px-4">Total (KES)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Courier / Waybill</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No orders matching your search or filter.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {order.id}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {new Date(order.date).toLocaleDateString("en-KE", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {order.shippingAddress?.fullName}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {order.shippingAddress?.phone || "+254 700 000 000"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        {order.shippingAddress?.county}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                        {order.shippingAddress?.city}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        KES {order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.items?.length || 1} item(s) • M-PESA
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                        className={`text-[11px] font-bold uppercase rounded px-2 py-1 border focus:outline-none cursor-pointer ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : order.status === "Shipped"
                            ? "bg-sky-50 text-sky-800 border-sky-300"
                            : order.status === "Processing"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[11px] font-mono text-slate-700">
                        {order.trackingNumber ? (
                          <span className="font-bold text-slate-900">{order.trackingNumber}</span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {order.estimatedDelivery || "Standard Courier"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewReceiptOrder(order)}
                          className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors"
                          title="View order invoice slip"
                        >
                          Invoice
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:border-slate-900 text-slate-900 rounded transition-colors"
                        >
                          Dispatch
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS BELOW TABLE */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 font-medium">
            Showing <span className="font-bold text-slate-900">{totalOrders === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="font-bold text-slate-900">
              {Math.min(startIndex + pageSize, totalOrders)}
            </span>{" "}
            of <span className="font-bold text-slate-900">{totalOrders}</span> recorded orders
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(1)}
              disabled={safePage === 1}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="First Page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => handlePageChange(pg)}
                className={`h-8 w-8 rounded text-xs font-bold transition-colors ${
                  safePage === pg
                    ? "bg-slate-900 text-white border border-slate-900"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={safePage === totalPages}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Last Page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Invoice Slip Modal */}
      {viewReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Order Invoice: {viewReceiptOrder.id}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Placed on {new Date(viewReceiptOrder.date).toLocaleString("en-KE")}
                </span>
              </div>
              <button
                onClick={() => setViewReceiptOrder(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <div>
                <span className="text-slate-500">Recipient:</span>{" "}
                <span className="font-bold text-slate-900">{viewReceiptOrder.shippingAddress?.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500">Contact:</span>{" "}
                <span className="font-mono text-slate-800">{viewReceiptOrder.shippingAddress?.phone}</span>
              </div>
              <div>
                <span className="text-slate-500">Delivery Address:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {viewReceiptOrder.shippingAddress?.addressLines?.join(", ")}, {viewReceiptOrder.shippingAddress?.city},{" "}
                  {viewReceiptOrder.shippingAddress?.county}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Payment:</span>{" "}
                <span className="font-bold text-emerald-700">{viewReceiptOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="border border-slate-200 rounded overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewReceiptOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium text-slate-900">{item.product.name}</td>
                      <td className="p-2 text-center font-bold text-slate-800">{item.quantity}</td>
                      <td className="p-2 text-right font-mono text-slate-700">KES {item.price.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Total Settled (KES):</span>
              <span className="text-base font-bold text-slate-950 font-mono">
                KES {viewReceiptOrder.totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setViewReceiptOrder(null)}
              className="w-full py-2 bg-slate-900 text-white font-bold rounded text-xs"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

      {/* Courier / Waybill Assignment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#24dcac]" />
                <h3 className="font-bold text-sm text-slate-900">
                  Assign Courier / Dispatch Slip
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <div>
                <span className="text-slate-500">Order:</span>{" "}
                <span className="font-mono font-bold text-slate-900">{selectedOrder.id}</span>
              </div>
              <div>
                <span className="text-slate-500">Recipient:</span>{" "}
                <span className="font-bold text-slate-900">{selectedOrder.shippingAddress?.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500">Destination:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.county}
                </span>
              </div>
            </div>

            {assignSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Courier Assigned & Order status set to Shipped!
              </div>
            ) : (
              <form onSubmit={handleAssignRider} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Select Kenyan Courier / Rider Partner
                  </label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  >
                    <option value="Sendy Express Kenya">Sendy Express Kenya (Same day / 24h)</option>
                    <option value="Fargo Courier Kenya">Fargo Courier (Nationwide 47 Counties)</option>
                    <option value="Wells Fargo Courier">Wells Fargo Courier Kenya</option>
                    <option value="G4S Express Kenya">G4S Logistics</option>
                    <option value="Tana Supermart Direct Rider #1">Tana Supermart In-house Rider #1 (Nairobi)</option>
                    <option value="Tana Supermart Direct Rider #2">Tana Supermart In-house Rider #2 (Nairobi)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Waybill / Tracking Code (Auto-generated if blank)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KE-EXP-849201"
                    value={customTracking}
                    onChange={(e) => setCustomTracking(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-slate-950 bg-[#24dcac] hover:bg-[#1ebf95] rounded border border-slate-900/10 transition-colors"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
