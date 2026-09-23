"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    expired: false,
  };
}

function Cell({ value }: { value: number }) {
  return (
    <span className="flex h-6 min-w-6 items-center justify-center bg-sale px-1 text-xs font-bold text-white tabular-nums">
      {String(value).padStart(2, "0")}
    </span>
  );
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const [time, setTime] = useState<TimeLeft>(() =>
    getTimeLeft(new Date(endsAt))
  );

  useEffect(() => {
    const target = new Date(endsAt);
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (time.expired) {
    return (
      <span className="bg-sale px-2 py-0.5 text-xs font-bold text-white">
        ENDED
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1" aria-live="off">
      <Cell value={time.hours} />
      <span className="text-xs font-bold text-sale">:</span>
      <Cell value={time.minutes} />
      <span className="text-xs font-bold text-sale">:</span>
      <Cell value={time.seconds} />
    </span>
  );
}
