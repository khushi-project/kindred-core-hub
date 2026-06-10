import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/format";
import { Link } from "@tanstack/react-router";

export function Topbar({ title }: { title: string }) {
  const { profile, user, roles } = useAuth();
  const name = profile?.full_name || user?.email || "User";
  const primaryRole = roles[0] ?? "volunteer";
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/dashboard/notifications" className="relative rounded-lg border border-border/60 bg-card p-2 hover:bg-accent" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">
            {initials(name)}
          </div>
          <div className="hidden text-left md:block">
            <div className="text-sm font-medium leading-tight">{name}</div>
            <div className="text-xs capitalize text-muted-foreground leading-tight">{primaryRole}</div>
          </div>
        </div>
      </div>
    </header>
  );
}