"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Phone,
  ShieldCheck,
  ArrowDownToLine,
  Zap,
} from "lucide-react";

export default function AdminFinancePage() {
  const { mpesaLedger, mpesaSettings, queryDarajaStatus } = useAdmin();
  const [queryInput, setQueryInput] = useState("");
  const [queryResult, setQueryResult] = useState<{ status: string; message: string } | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const completedTransactions = mpesaLedger.filter((t) => t.status === "COMPLETED");
  const totalVolume = completedTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleManualQuery = (reqId: string) => {
    setIsQuerying(true);
    setQueryResult(null);
    setTimeout(() => {
      const res = queryDarajaStatus(reqId);
      setQueryResult(res);
      setIsQuerying(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            M-PESA Daraja Financial Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Real-time Safaricom STK Push transactions, reconciliation, and queries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800">
            Shortcode: <span className="font-mono text-slate-950 font-bold">{mpesaSettings.businessShortCode}</span>
          </div>
          <div className="px-3 py-1.5 bg-[#24dcac]/20 border border-[#24dcac] rounded text-xs font-bold text-slate-950 uppercase">
            {mpesaSettings.environment} Mode
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium">Reconciled M-PESA Volume</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            KES {totalVolume.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
            {completedTransactions.length} successful transactions
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium">Pending STK Responses</div>
          <div className="mt-1 text-2xl font-bold text-amber-700">
            {mpesaLedger.filter((t) => t.status === "PENDING").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Awaiting customer M-PESA handset PIN
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded">
          <div className="text-xs text-slate-500 font-medium">Platform Commissions (Est. 8.5%)</div>
          <div className="mt-1 text-2xl font-bold text-indigo-700">
            KES {Math.round(totalVolume * 0.085).toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Retained platform revenue
          </div>
        </div>
      </div>

      {/* Daraja Status Query Tool */}
      <div className="p-5 bg-white border border-slate-200 rounded space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#24dcac]" />
          <h3 className="font-bold text-sm text-slate-900">
            Safaricom Daraja Status Query Tool
          </h3>
        </div>
        <p className="text-xs text-slate-600">
          Query Safaricom Daraja API in real-time to reconcile stuck or unconfirmed customer payments using their CheckoutRequestID.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste CheckoutRequestID (e.g. ws_CO_23092026114510394812)..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 bg-white font-mono"
          />
          <button
            onClick={() => handleManualQuery(queryInput || "ws_CO_23092026114510394812")}
            disabled={isQuerying}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isQuerying ? "animate-spin" : ""}`} />
            {isQuerying ? "Querying Daraja..." : "Query Daraja Status"}
          </button>
        </div>

        {queryResult && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>{queryResult.message}</span>
          </div>
        )}
      </div>

      {/* Live M-PESA Ledger Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="font-bold text-xs text-slate-900">
            Live Safaricom Transaction Log
          </div>
          <div className="text-[11px] text-slate-500">
            Automatic Daraja Callback Handshake
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Receipt / Reference</th>
                <th className="py-3 px-4">Customer Handset</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Amount (KES)</th>
                <th className="py-3 px-4">Checkout Request ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mpesaLedger.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900">
                      {tx.mpesaReceiptNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {tx.timestamp}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">
                      {tx.customerName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      +{tx.phone}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700">
                    {tx.orderId}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    KES {tx.amount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[140px]" title={tx.checkoutRequestId}>
                    {tx.checkoutRequestId}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : tx.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleManualQuery(tx.checkoutRequestId)}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:border-slate-900 text-slate-800 rounded transition-colors"
                    >
                      Reconcile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
