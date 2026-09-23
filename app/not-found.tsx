import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-app py-20 text-center">
      <SearchX className="mx-auto h-14 w-14 text-muted" aria-hidden />
      <h1 className="mt-4 text-xl font-bold text-foreground">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/products" className="btn-outline">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
