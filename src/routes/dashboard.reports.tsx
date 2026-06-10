import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart3, Users, Calendar, Award } from "lucide-react";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });

function ReportsPage() {
  const [stats, setStats] = useState({ events: 0, ongoing: 0, completed: 0, vols: 0, coords: 0, certs: 0, hours: 0 });
  const [byCategory, setByCategory] = useState<Record<string, number>>({});
  const [topVols, setTopVols] = useState<{ id: string; name: string; hours: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: events }, { data: roles }, { data: vols }, { data: certs }, { data: att }, { data: profs }] = await Promise.all([
        supabase.from("events").select("id, status, category"),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("event_volunteers").select("volunteer_id"),
        supabase.from("certificates").select("id"),
        supabase.from("attendance").select("volunteer_id, hours, status"),
        supabase.from("profiles").select("id, full_name"),
      ]);
      const uniqueVols = new Set((vols ?? []).map((v: any) => v.volunteer_id)).size;
      const coords = new Set((roles ?? []).filter((r: any) => r.role === "coordinator").map((r: any) => r.user_id)).size;
      const totalHours = (att ?? []).reduce((s: number, a: any) => s + Number(a.hours || 0), 0);
      setStats({
        events: events?.length ?? 0,
        ongoing: events?.filter((e: any) => e.status === "upcoming" || e.status === "ongoing").length ?? 0,
        completed: events?.filter((e: any) => e.status === "completed").length ?? 0,
        vols: uniqueVols, coords, certs: certs?.length ?? 0, hours: totalHours,
      });
      const cat: Record<string, number> = {};
      (events ?? []).forEach((e: any) => { cat[e.category] = (cat[e.category] ?? 0) + 1; });
      setByCategory(cat);
      const hoursMap: Record<string, number> = {};
      (att ?? []).filter((a: any) => a.status === "present").forEach((a: any) => {
        hoursMap[a.volunteer_id] = (hoursMap[a.volunteer_id] ?? 0) + Number(a.hours || 0);
      });
      const nameMap = new Map((profs ?? []).map((p: any) => [p.id, p.full_name]));
      const top = Object.entries(hoursMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, hours]) => ({ id, name: (nameMap.get(id) as string) ?? "Volunteer", hours }));
      setTopVols(top);
    })();
  }, []);

  const maxCat = Math.max(1, ...Object.values(byCategory));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Events" value={String(stats.events)} icon={Calendar} />
        <StatCard label="Active" value={String(stats.ongoing)} icon={BarChart3} />
        <StatCard label="Volunteers" value={String(stats.vols)} icon={Users} />
        <StatCard label="Certificates" value={String(stats.certs)} icon={Award} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card-gradient p-6">
          <h3 className="font-display text-lg font-semibold">Events by category</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(byCategory).length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
            {Object.entries(byCategory).map(([k, v]) => (
              <div key={k}>
                <div className="mb-1 flex justify-between text-xs"><span>{k}</span><span className="text-muted-foreground">{v}</span></div>
                <div className="h-2 rounded-full bg-background/60"><div className="h-full rounded-full bg-brand-gradient" style={{ width: `${(v / maxCat) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card-gradient p-6">
          <h3 className="font-display text-lg font-semibold">Top volunteers by hours</h3>
          <div className="mt-4 space-y-3">
            {topVols.length === 0 && <p className="text-sm text-muted-foreground">No attendance recorded yet.</p>}
            {topVols.map((v, i) => (
              <div key={v.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">{i + 1}</span>
                  <span className="font-medium">{v.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{v.hours} h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-gradient p-6 text-sm text-muted-foreground">
        <span className="text-foreground font-medium">Summary:</span> {stats.coords} coordinator{stats.coords === 1 ? "" : "s"} are managing {stats.events} event{stats.events === 1 ? "" : "s"}, with {stats.hours.toFixed(1)} total volunteer hours logged.
      </div>
    </div>
  );
}