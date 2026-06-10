import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/format";
import type { NotificationRow } from "@/types";

export const Route = createFileRoute("/dashboard/notifications")({ component: NotificationsPage });

function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationRow[]>([]);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems((data ?? []) as NotificationRow[]);
  }
  useEffect(() => { void load(); }, [user?.id]);

  async function markAllRead() {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    load();
  }
  async function toggleRead(n: NotificationRow) {
    await supabase.from("notifications").update({ read: !n.read }).eq("id", n.id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={markAllRead}><CheckCircle2 className="mr-1 h-4 w-4" /> Mark all read</Button>
      </div>
      <div className="rounded-xl border border-border/60 bg-card-gradient divide-y divide-border/40">
        {items.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">No notifications yet.</div>
        )}
        {items.map((n) => (
          <button key={n.id} onClick={() => toggleRead(n)} className={`flex w-full items-start gap-3 p-4 text-left hover:bg-accent ${n.read ? "opacity-70" : ""}`}>
            <Bell className={`mt-0.5 h-4 w-4 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
            <div className="flex-1">
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-muted-foreground">{n.description}</div>
              <div className="mt-1 text-xs text-muted-foreground">{timeAgo(n.created_at)}</div>
            </div>
            {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}