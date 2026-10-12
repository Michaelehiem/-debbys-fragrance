"use client";

import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center border border-ink/15 bg-white ${className}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="p-2.5 text-ink-soft hover:text-ink disabled:opacity-30 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span
        className="w-10 py-2 text-center text-sm font-semibold text-ink tabular-nums border-x border-ink/15"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="p-2.5 text-ink-soft hover:text-ink disabled:opacity-30 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
