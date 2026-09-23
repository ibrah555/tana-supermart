"use client";

import { useState, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Printer,
  Percent,
  AlertOctagon,
  ArrowUpRight,
  PackageCheck,
  ShoppingBag,
  Clock,
} from "lucide-react";

export default function AdminReportsPage() {
  const { orders, products } = useAdmin();

  // Date Filter State
  const [timeframe, setTimeframe] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM">("WEEKLY");
  const [customStartDate, setCustomStartDate] = useState("2026-09-01");
  const [customEndDate, setCustomEndDate] = useState("2026-09-23");

  // Filter orders based on selected timeframe
  const filteredOrders = useMemo(() => {
    const now = new Date("2026-09-23T23:59:59Z").getTime(); // anchored to current simulated date

    return orders.filter((o) => {
      const orderTime = new Date(o.date).getTime();

      if (timeframe === "DAILY") {
        // Within last 24 hours
        return now - orderTime <= 24 * 60 * 60 * 1000;
      }
      if (timeframe === "WEEKLY") {
        // Within last 7 days
        return now - orderTime <= 7 * 24 * 60 * 60 * 1000;
      }
      if (timeframe === "MONTHLY") {
        // Within last 30 days
        return now - orderTime <= 30 * 24 * 60 * 60 * 1000;
      }
      if (timeframe === "CUSTOM") {
        const start = new Date(customStartDate).getTime();
        const end = new Date(customEndDate + "T23:59:59").getTime();
        return orderTime >= start && orderTime <= end;
      }
      return true;
    });
  }, [orders, timeframe, customStartDate, customEndDate]);

  // Aggregate financial metrics
  const financialSummary = useMemo(() => {
    let grossRevenue = 0;
    let totalCogs = 0;
    let totalLosses = 0;
    let successfulOrdersCount = 0;

    filteredOrders.forEach((o) => {
      if (o.status === "Cancelled") {
        totalLosses += (o.cogs || 1500) * 0.25; // return handling loss
      } else {
        grossRevenue += o.totalAmount;
        totalCogs += o.cogs || Math.round(o.totalAmount * 0.65);
        successfulOrdersCount += 1;
      }
    });

    const grossProfit = grossRevenue - totalCogs - totalLosses;
    const profitMargin = grossRevenue > 0 ? ((grossProfit / grossRevenue) * 100).toFixed(1) : "0.0";
    const commissionRevenue = Math.round(grossRevenue * 0.085); // 8.5% platform fee
    const aov = successfulOrdersCount > 0 ? Math.round(grossRevenue / successfulOrdersCount) : 0;

    return {
      grossRevenue,
      totalCogs,
      grossProfit,
      profitMargin,
      totalLosses,
      commissionRevenue,
      successfulOrdersCount,
      aov,
    };
  }, [filteredOrders]);

  // Product Analysis Breakdown
  const productAnalysis = useMemo(() => {
    const map = new Map<
      string,
      {
        product: (typeof products)[0];
        unitsSold: number;
        revenue: number;
        cogs: number;
        profit: number;
      }
    >();

    // Seed map with all products
    products.forEach((p) => {
      map.set(p.id, {
        product: p,
        unitsSold: 0,
        revenue: 0,
        cogs: 0,
        profit: 0,
      });
    });

    // Accumulate from filtered orders
    filteredOrders.forEach((order) => {
      if (order.status !== "Cancelled") {
        order.items.forEach((item) => {
          const entry = map.get(item.product.id);
          const itemCost = item.product.costPrice || Math.round(item.price * 0.65);
          if (entry) {
            entry.unitsSold += item.quantity;
            entry.revenue += item.price * item.quantity;
            entry.cogs += itemCost * item.quantity;
            entry.profit += (item.price - itemCost) * item.quantity;
          }
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  const handleExportCSV = () => {
    const headers = "Product SKU,Product Name,Category,Units Sold,Units Left,Revenue (KES),COGS (KES),Gross Profit (KES),Margin (%)\n";
    const rows = productAnalysis
      .map((p) => {
        const margin = p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(1) : "0.0";
        return `"${p.product.id}","${p.product.name.replace(/"/g, '""')}","${p.product.categorySlug}",${p.unitsSold},${p.product.stockQuantity || 0},${p.revenue},${p.cogs},${p.profit},${margin}%`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tana-performance-report-${timeframe.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial & Products Performance Reports
          </h2>
          <p className="text-xs text-slate-500">
            Real-time accounting of revenue, cost of goods, net profit, losses, and catalog performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 text-slate-800 font-semibold text-xs rounded transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Summary
          </button>
        </div>
      </div>

      {/* Date Range Selector Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#24dcac]" />
          <span className="text-xs font-bold text-slate-900">Reporting Timeframe:</span>
          <div className="flex items-center gap-1.5 ml-2">
            {(["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                  timeframe === t
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {t === "DAILY" ? "Daily (24h)" : t === "WEEKLY" ? "Weekly (7d)" : t === "MONTHLY" ? "Monthly (30d)" : "Custom Range"}
              </button>
            ))}
          </div>
        </div>

        {timeframe === "CUSTOM" && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded font-mono text-slate-900 bg-white"
            />
            <span className="text-slate-500">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded font-mono text-slate-900 bg-white"
            />
          </div>
        )}
      </div>

      {/* Primary Financial Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Gross Revenue (Settled)</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-900">
            KES {financialSummary.grossRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Across {financialSummary.successfulOrdersCount} orders • AOV: KES {financialSummary.aov.toLocaleString()}
          </div>
        </div>

        {/* Cost of Goods Sold (COGS) */}
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Product Costs (COGS)</span>
            <PackageCheck className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-800">
            KES {financialSummary.totalCogs.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Wholesale inventory acquisition cost
          </div>
        </div>

        {/* Gross Profit & Margin */}
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Net Gross Profit</span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-indigo-700">
            KES {financialSummary.grossProfit.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-indigo-800 font-semibold flex items-center gap-1">
            <Percent className="h-3 w-3" />
            <span>{financialSummary.profitMargin}% Profit Margin</span>
          </div>
        </div>

        {/* Losses, Returns & Platform Cut */}
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Platform Take / Fees</span>
            <Percent className="h-4 w-4 text-[#24dcac]" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-slate-900">
            KES {financialSummary.commissionRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Losses/Refunds:{" "}
            <span className="text-rose-600 font-semibold">
              KES {financialSummary.totalLosses.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Comprehensive Products Analysis Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs text-slate-900">
              Product Analysis & Inventory Velocity Breakdown
            </h3>
            <p className="text-[11px] text-slate-500">
              Ranked by revenue contribution during this reporting period
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
            {productAnalysis.length} Total SKUs analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Stock Left</th>
                <th className="py-3 px-4">Revenue (KES)</th>
                <th className="py-3 px-4">COGS (KES)</th>
                <th className="py-3 px-4">Gross Profit (KES)</th>
                <th className="py-3 px-4 text-center">Margin</th>
                <th className="py-3 px-4 text-right">Velocity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productAnalysis.map((row) => {
                const margin = row.revenue > 0 ? ((row.profit / row.revenue) * 100).toFixed(1) : "0.0";
                const isTopSeller = row.unitsSold >= 2;
                const isOut = (row.product.stockQuantity || 0) === 0;

                return (
                  <tr key={row.product.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.product.image}
                          alt={row.product.name}
                          className="h-8 w-8 object-cover rounded border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                            {row.product.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {row.product.id} • {row.product.categorySlug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      {row.unitsSold} units
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`font-mono font-bold ${
                          isOut
                            ? "text-rose-600"
                            : (row.product.stockQuantity || 0) <= 10
                            ? "text-amber-600"
                            : "text-slate-800"
                        }`}
                      >
                        {row.product.stockQuantity ?? 0} left
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      KES {row.revenue.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      KES {row.cogs.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-bold text-indigo-700">
                      KES {row.profit.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        {margin}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isTopSeller
                            ? "bg-emerald-100 text-emerald-800"
                            : row.unitsSold > 0
                            ? "bg-sky-100 text-sky-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isTopSeller ? "Top Performer" : row.unitsSold > 0 ? "Moderate" : "Low Movement"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
