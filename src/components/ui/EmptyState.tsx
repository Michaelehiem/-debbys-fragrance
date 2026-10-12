import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-ink/15 bg-white/50 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/10 bg-paper text-gold-700">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-serif text-xl font-bold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
