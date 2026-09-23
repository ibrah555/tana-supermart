import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Cart", "Fill in your details", "Payment", "Complete"] as const;

export function CheckoutStepper({ current }: { current: number }) {
  return (
    <nav aria-label="Checkout progress" className="bg-surface px-4 py-4 shadow-card">
      <ol className="mx-auto flex max-w-2xl items-center">
        {STEPS.map((label, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <li key={label} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
              <span className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    state === "done" && "bg-primary text-white",
                    state === "active" && "bg-sale text-white",
                    state === "todo" && "border border-border bg-surface text-muted"
                  )}
                >
                  {state === "done" ? (
                    <Check className="h-3 w-3" aria-hidden />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-xs",
                    state === "active" ? "font-semibold text-sale" : "text-muted"
                  )}
                >
                  {label}
                </span>
              </span>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "mx-2 mb-5 h-px flex-1",
                    i < current ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
