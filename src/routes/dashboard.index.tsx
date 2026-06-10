import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, Users, ClipboardCheck, Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { user, isAdmin, isCoordinator, isVolunteer, refresh, roles } = useAuth();
  const [stats, setStats] = useState({ events: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0, volunteers: 0, coordinators: 0, myEvents: 0, certs: 0, active: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [hasAdmin, setHasAdmin] = useState<boolean>(true);

  async function load() {
    if (!user) return;
    const [{ data: events }, { data: roleRows }, { data: myJoins }, { data: certs }] = await Promise.all([
      supabase.from("events").select("id, title, event_date, status, location").order("event_date", { ascending: true }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("event_volunteers").select("event_id").eq("volunteer_id", user.id),
      supabase.from("certificates").select("id").eq("volunteer_id", user.id),
    ]);
    const volIds = new Set((roleRows ?? []).filter((r: any) => r.role === "volunteer").map((r: any) => r.user_id));
    const coordIds = new Set((roleRows ?? []).filter((r: any) => r.role === "coordinator").map((r: any) => r.user_id));
    const adminIds = (roleRows ?? []).filter((r: any) => r.role === "admin");
    setStats({
      events: events?.length ?? 0,
      upcoming: events?.filter((e) => e.status === "upcoming").length ?? 0,
      ongoing: events?.filter((e) => e.status === "ongoing").length ?? 0,
      completed: events?.filter((e) => e.status === "completed").length ?? 0,
      cancelled: events?.filter((e) => e.status === "cancelled").length ?? 0,
      active: events?.filter((e) => e.status === "upcoming" || e.status === "ongoing").length ?? 0,
      volunteers: volIds.size,
      coordinators: coordIds.size,
      myEvents: myJoins?.length ?? 0,
      certs: certs?.length ?? 0,
    });
    setUpcoming((events ?? []).filter((e) => e.status !== "completed" && e.status !== "cancelled").slice(0, 5));
    setHasAdmin(adminIds.length > 0);
  }

  useEffect(() => { void load(); }, [user?.id]);

  async function claimAdmin() {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) { toast.error(error.message); return; }
    if (data) { toast.success("You are now Admin"); await refresh(); await load(); }
    else toast.error("An admin already exists.");
  }

  return (
    <div className="space-y-6">
      {!hasAdmin && !isAdmin && (
        <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-semibold">No admin exists yet</div>
              <div className="text-xs text-muted-foreground">Claim Admin to bootstrap your organization workspace.</div>
            </div>
          </div>
          <Button onClick={claimAdmin} className="bg-brand-gradient shadow-glow">Claim Admin</Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(isAdmin || isCoordinator) && (
          <>
            <StatCard label="Total events" value={String(stats.events)} icon={Calendar} />
            <StatCard label="Active events" value={String(stats.active)} icon={Calendar} />
            <StatCard label="Completed" value={String(stats.completed)} icon={ClipboardCheck} />
            <StatCard label="Volunteers" value={String(stats.volunteers)} icon={Users} />
          </>
        )}
        {isVolunteer && !isAdmin && !isCoordinator && (
          <>
            <StatCard label="Events joined" value={String(stats.myEvents)} icon={Calendar} />
            <StatCard label="Certificates" value={String(stats.certs)} icon={Award} />
            <StatCard label="Open events" value={String(stats.active)} icon={Calendar} />
            <StatCard label="Community" value={String(stats.volunteers)} icon={Users} />
          </>
        )}
      </div>

      <div className="rounded-xl border border-border/60 bg-card-gradient p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Upcoming events</h2>
          <Link to="/dashboard/events"><Button variant="ghost" size="sm">View all</Button></Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events yet.</p>
        ) : (
          <div className="divide-y divide-border/40">
            {upcoming.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{formatDateTime(e.event_date)} • {e.location}</div>
                </div>
                <span className="rounded-full border border-border/60 px-2 py-0.5 text-xs capitalize">{e.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">Signed in as <span className="capitalize text-foreground">{roles.join(", ") || "member"}</span></div>
    </div>
  );
}