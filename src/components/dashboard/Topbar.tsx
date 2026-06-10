import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/format";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function Topbar({ title }: { title: string }) {
  const { profile, user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const name = profile?.full_name || user?.email || "User";
  const primaryRole = roles[0] ?? "volunteer";

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur">
      <h1 className="font-display text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/notifications"
          className="relative rounded-lg border border-border/60 bg-card p-2 hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Link>
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-1.5 hover:bg-accent"
          aria-label="Profile"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">
            {initials(name)}
          </div>
          <div className="hidden text-left md:block">
            <div className="text-sm font-medium leading-tight">{name}</div>
            <div className="text-[10px] uppercase tracking-wider text-primary leading-tight">{primaryRole}</div>
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card p-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
