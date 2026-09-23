"use client";

import Link from "next/link";
import { formatKes } from "@/lib/format";
import { MoneyBackStrip } from "./MoneyBackStrip";

export function CartSummaryBar({
  selectedTotal,
  selectedCount,
}: {
  selectedTotal: number;
  selectedCount: number;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-4 border-t border-border bg-surface px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="container-app flex flex-wrap items-center justify-between gap-3">
        <MoneyBackStrip />

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted">
              Total ({selectedCount} item{selectedCount === 1 ? "" : "s"})
            </p>
            <p className="text-lg font-bold text-sale">
              {formatKes(selectedTotal)}
            </p>
          </div>
          <Link
            href="/checkout"
            aria-disabled={selectedCount === 0}
            className="btn-primary h-11 px-8 text-base aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Proceed to Check out
          </Link>
        </div>
      </div>
    </div>
  );
}
