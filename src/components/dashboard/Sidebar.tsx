import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Heart, LayoutDashboard, Users, Calendar, ClipboardCheck, Bell, User, Award, LogOut, UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";
import { toast } from "sonner";

interface Item {
  to: string;
  label: string;
  icon: typeof Heart;
  exact?: boolean;
  roles?: Role[]; // undefined = all
}

const items: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/events", label: "Events", icon: Calendar },
  { to: "/dashboard/certificates", label: "Certificates", icon: Award, roles: ["volunteer"] },
  { to: "/dashboard/volunteers", label: "Volunteers", icon: Users, roles: ["admin"] },
  { to: "/dashboard/volunteers", label: "Coordinators", icon: UserCog, roles: ["admin"] },
  { to: "/dashboard/attendance", label: "Attendance", icon: ClipboardCheck, roles: ["admin", "coordinator"] },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/settings", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { roles, signOut } = useAuth();
  const navigate = useNavigate();

  // Dedup by label per active role set
  const visible = items.filter((it) => !it.roles || it.roles.some((r) => roles.includes(r)));

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/40 bg-sidebar-gradient lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold tracking-wide">VMS</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {visible.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          return (
            <Link
              key={it.to + it.label}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                active
                  ? "bg-brand-gradient text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/40 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
