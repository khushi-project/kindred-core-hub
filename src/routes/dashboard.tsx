import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Volunc" }] }),
  component: DashboardLayout,
});

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/events": "Events",
  "/dashboard/volunteers": "Volunteers",
  "/dashboard/attendance": "Attendance",
  "/dashboard/tasks": "Tasks",
  "/dashboard/certificates": "Certificates",
  "/dashboard/reports": "Reports",
  "/dashboard/notifications": "Notifications",
  "/dashboard/settings": "Settings",
};

function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const title = titles[pathname] ?? "Dashboard";
  return (
    <div className="flex min-h-screen bg-hero">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}