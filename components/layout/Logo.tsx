import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Tana-Supermart home"
      className="flex shrink-0 items-center gap-2"
    >
      <span className="flex h-9 w-9 items-center justify-center bg-sale">
        <span className="text-lg font-extrabold italic text-white">T</span>
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-extrabold tracking-tight text-foreground">
          Tana<span className="text-sale">-Supermart</span>
        </span>
        <span className="block text-[10px] font-medium tracking-wide text-muted">
          Affordable online shopping
        </span>
      </span>
    </Link>
  );
}
