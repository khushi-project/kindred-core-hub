import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Volunc" }] }),
  component: DashboardLayout,
});

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/volunteers": "Volunteers",
  "/dashboard/events": "Events",
  "/dashboard/attendance": "Attendance",
  "/dashboard/tasks": "Tasks",
  "/dashboard/reports": "Reports",
  "/dashboard/notifications": "Notifications",
  "/dashboard/settings": "Settings",
};

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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