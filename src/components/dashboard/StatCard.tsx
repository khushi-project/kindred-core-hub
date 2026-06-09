import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card-gradient p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      {delta && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400">
          <ArrowUpRight className="h-3 w-3" /> {delta}
        </div>
      )}
    </div>
  );
}