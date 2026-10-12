"use client";

import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Primitive number so the snapshot is referentially stable (a fresh Date each
// call would make useSyncExternalStore re-render in a loop).
function getSnapshot() {
  return Date.now();
}

// No clock on the server: server and first client render must match, so
// hydration renders nothing and the first browser tick fills it in.
function getServerSnapshot() {
  return null;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function DigitalClock({ className = "" }: { className?: string }) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (now === null) return null;

  const date = new Date(now);
  const hours = date.getHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const meridiem = hours < 12 ? "AM" : "PM";

  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" aria-hidden />
      <span className="tabular-nums">
        {pad(hour12)}:{pad(date.getMinutes())}:{pad(date.getSeconds())}
        <span className="ml-1 text-paper/50">{meridiem}</span>
      </span>
    </span>
  );
}
