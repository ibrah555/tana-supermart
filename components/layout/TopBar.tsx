import Link from "next/link";
import { Store, Smartphone, ShieldCheck } from "lucide-react";

function KenyaFlag({ className = "h-3.5 w-5" }: { className?: string }) {
  return (
    <span
      aria-label="Kenya"
      role="img"
      className={`inline-block overflow-hidden rounded-[2px] border border-black/10 ${className}`}
    >
      <span className="block h-1/3 bg-black" />
      <span className="block h-[8%] bg-white" />
      <span className="block h-1/4 bg-[#A12C2C]" />
      <span className="block h-[8%] bg-white" />
      <span className="block h-[30.6%] bg-[#2E7D32]" />
    </span>
  );
}

export function TopBar() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="container-app flex h-8 items-center justify-between text-xs text-foreground">
        <div className="flex items-center gap-5">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 font-medium text-slate-800 transition-colors hover:text-[#24dcac]"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#24dcac]" aria-hidden />
            Admin Portal
          </Link>
          <a
            href="/seller-center"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <Store className="h-3.5 w-3.5" aria-hidden />
            Seller Center
          </a>
          <a
            href="/download-app"
            className="flex items-center gap-1.5 border-b border-dashed border-muted transition-colors hover:text-primary"
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden />
            Download App
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a href="/help" className="transition-colors hover:text-primary">
            Help Center
          </a>
          <span className="flex items-center gap-1.5">
            <KenyaFlag />
            Kenya
          </span>
        </div>
      </div>
    </div>
  );
}
