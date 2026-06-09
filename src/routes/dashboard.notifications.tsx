import { createFileRoute } from "@tanstack/react-router";
import { notifications } from "@/mock-data/notifications";
import { recentActivities } from "@/mock-data/stats";
import { AlertTriangle, CheckCircle2, Info, Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

const iconMap = { info: Info, success: CheckCircle2, warning: AlertTriangle, alert: Bell };
const toneMap = {
  info: "text-primary bg-primary/15",
  success: "text-emerald-400 bg-emerald-500/15",
  warning: "text-amber-400 bg-amber-500/15",
  alert: "text-destructive bg-destructive/15",
};

function NotificationsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card lg:col-span-2">
        <h3 className="font-display text-lg font-semibold">Notifications</h3>
        <ul className="mt-4 space-y-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <li key={n.id} className={`flex items-start gap-3 rounded-lg border border-border/40 p-4 ${!n.read ? "bg-background/40" : ""}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneMap[n.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{n.title}</h4>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold">Activity feed</h3>
        <ol className="mt-4 space-y-4">
          {recentActivities.map((a) => (
            <li key={a.id} className="relative pl-6">
              <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm"><span className="font-medium">{a.actor}</span> <span className="text-muted-foreground">{a.action}</span> <span className="font-medium">{a.target}</span></p>
              <p className="text-xs text-muted-foreground">{a.time}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}