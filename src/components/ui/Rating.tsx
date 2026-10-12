import { Star } from "lucide-react";

export function Rating({
  value,
  reviews,
  className = "",
}: {
  value: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i <= Math.round(value) ? "text-gold-500 fill-gold-500" : "text-ink/15"
            }`}
          />
        ))}
      </span>
      <span className="font-serif text-xs font-bold text-ink">{value.toFixed(1)}</span>
      {reviews != null && (
        <span className="text-xs text-ink-soft/50">({reviews.toLocaleString()})</span>
      )}
    </span>
  );
}
