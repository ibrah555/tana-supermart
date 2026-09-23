import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Rated ${rating} out of 5`}
      role="img"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "h-3 w-3",
            i <= Math.round(rating)
              ? "fill-accent-yellow text-accent-yellow"
              : "fill-border text-border"
          )}
        />
      ))}
    </span>
  );
}
