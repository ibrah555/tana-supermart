"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Tag, Plus, Zap, CheckCircle2, Trash2, Calendar, Clock } from "lucide-react";
import { initialVouchers } from "@/data/user";
import type { Voucher } from "@/types";

export default function AdminPromotionsPage() {
  const { products, toggleFlashSale } = useAdmin();
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("KES 500 OFF");
  const [newMinSpend, setNewMinSpend] = useState(2500);
  const [newValidUntil, setNewValidUntil] = useState("2026-12-31");
  const [isSuccess, setIsSuccess] = useState(false);

  const flashSaleItems = products.filter((p) => p.isFlashSale);

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    const v: Voucher = {
      id: `v-${Date.now()}`,
      code: newCode.toUpperCase().replace(/\s+/g, ""),
      discountText: newDiscount,
      minSpend: Number(newMinSpend),
      validUntil: newValidUntil,
      claimed: false,
    };
    setVouchers([v, ...vouchers]);
    setIsSuccess(true);
    setNewCode("");
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const handleDeleteVoucher = (id: string) => {
    setVouchers(vouchers.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Vouchers & Flash Campaigns
          </h2>
          <p className="text-xs text-slate-500">
            Configure promo discount codes, minimum basket spends, and flash deals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vouchers Table - 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded p-5">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#24dcac]" />
              Active Discount Coupons ({vouchers.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2.5">Coupon Code</th>
                    <th className="pb-2.5">Discount Benefit</th>
                    <th className="pb-2.5">Min Basket Spend</th>
                    <th className="pb-2.5">Expiry Date</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {v.code}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-emerald-700">
                        {v.discountText}
                      </td>
                      <td className="py-3 text-slate-700">
                        KES {v.minSpend.toLocaleString()}
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">
                        {v.validUntil}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteVoucher(v.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Flash Sale Active Deals Table */}
          <div className="bg-white border border-slate-200 rounded p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                Live Flash Sale Catalog ({flashSaleItems.length} items)
              </h3>
              <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 font-semibold px-2 py-0.5 rounded">
                Live on Homepage
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {flashSaleItems.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-8 w-8 object-cover rounded border border-slate-200"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 line-clamp-1">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Flash Price: <span className="font-bold text-slate-900">KES {item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="line-through text-slate-400 ml-1.5">
                            KES {item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFlashSale(item.id, false)}
                    className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded"
                  >
                    Remove Deal
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Voucher Form - 1 Col */}
        <div className="bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#24dcac]" />
            Generate New Voucher
          </h3>

          {isSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Voucher coupon generated!
            </div>
          )}

          <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FLASH500"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono uppercase font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Discount Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KES 500 OFF or 15% OFF"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Minimum Basket Spend (KES)
              </label>
              <input
                type="number"
                required
                value={newMinSpend}
                onChange={(e) => setNewMinSpend(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                required
                value={newValidUntil}
                onChange={(e) => setNewValidUntil(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-bold text-xs text-slate-950 bg-[#24dcac] hover:bg-[#1ebf95] rounded border border-slate-900/10 transition-colors mt-2"
            >
              Issue Promotion Coupon
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
