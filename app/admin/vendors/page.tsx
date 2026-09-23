"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Store, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminVendorsPage() {
  const { stores, toggleStoreStatus, updateStoreCommission } = useAdmin();
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [customRate, setCustomRate] = useState<number>(8.5);

  const handleSaveCommission = (storeId: string) => {
    updateStoreCommission(storeId, customRate);
    setEditingStoreId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Vendors & Multi-Store Oversight
          </h2>
          <p className="text-xs text-slate-500">
            KYC compliance, store status, and custom vendor commission agreements
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Store Identity</th>
                <th className="py-3 px-4">KYC / Compliance</th>
                <th className="py-3 px-4">Platform Commission</th>
                <th className="py-3 px-4">Catalog & Ratings</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                        <Store className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {store.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: {store.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        store.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : store.status === "Pending KYC"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {store.status === "Active" && <CheckCircle2 className="h-3 w-3" />}
                      {store.status === "Pending KYC" && <AlertTriangle className="h-3 w-3" />}
                      {store.status === "Suspended" && <XCircle className="h-3 w-3" />}
                      {store.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {editingStoreId === store.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.5"
                          value={customRate}
                          onChange={(e) => setCustomRate(Number(e.target.value))}
                          className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs"
                        />
                        <span className="text-slate-600">%</span>
                        <button
                          onClick={() => handleSaveCommission(store.id)}
                          className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">
                          {store.commissionRate}%
                        </span>
                        <button
                          onClick={() => {
                            setEditingStoreId(store.id);
                            setCustomRate(store.commissionRate);
                          }}
                          className="text-[11px] text-slate-400 hover:text-slate-700 underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {store.productCount} Products
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Score: {store.score}% • {store.followers} followers
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 text-[11px]">{store.contactEmail}</div>
                    <div className="text-slate-500 text-[10px]">{store.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/store/${store.id}`}
                        target="_blank"
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="View storefront"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>

                      {store.status === "Active" ? (
                        <button
                          onClick={() => toggleStoreStatus(store.id, "Suspended")}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStoreStatus(store.id, "Active")}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded"
                        >
                          Approve KYC
                        </button>
                      )}
                    </div>
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
