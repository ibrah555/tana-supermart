"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square w-full overflow-hidden border border-border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Product images"
        >
          {images.map((src, i) => (
            <button
              key={src}
              role="tab"
              aria-selected={i === active}
              aria-label={`Image ${i + 1}`}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setActive((i + 1) % images.length);
                if (e.key === "ArrowLeft")
                  setActive((i - 1 + images.length) % images.length);
              }}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden border-2 bg-white transition-colors",
                i === active
                  ? "border-primary"
                  : "border-border hover:border-muted"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
