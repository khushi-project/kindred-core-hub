import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur">
      <div>
        <h1 className="font-display text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search…" className="w-72 border-border/60 bg-card pl-9" />
        </div>
        <button className="relative rounded-lg border border-border/60 bg-card p-2 hover:bg-accent" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-1.5">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="" className="h-7 w-7 rounded-full" />
          <div className="hidden text-left md:block">
            <div className="text-sm font-medium leading-tight">Admin User</div>
            <div className="text-xs text-muted-foreground leading-tight">admin@volunc.org</div>
          </div>
        </div>
      </div>
    </header>
  );
}