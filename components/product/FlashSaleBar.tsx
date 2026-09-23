"use client";

import { Zap } from "lucide-react";
import { Countdown } from "@/components/ui/Countdown";

export function FlashSaleBar({ endsAt }: { endsAt: string }) {
  return (
    <div className="flex h-9 items-center justify-between bg-sale-gradient px-3 text-white">
      <span className="flex items-center gap-1.5 text-sm font-bold">
        <Zap className="h-4 w-4" aria-hidden />
        Flash Sales
      </span>
      <span className="flex items-center gap-1.5 text-xs">
        Closing in <Countdown endsAt={endsAt} />
      </span>
    </div>
  );
}
