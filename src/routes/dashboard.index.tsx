import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, UserCheck, Calendar, TrendingUp, Clock, Activity } from "lucide-react";
import { dashboardStats, hoursTrend, programDistribution, recentActivities } from "@/mock-data/stats";
import { events } from "@/mock-data/events";
import { formatNumber, formatDate } from "@/utils/format";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

const COLORS = ["oklch(0.65 0.18 258)", "oklch(0.72 0.14 200)", "oklch(0.68 0.16 290)", "oklch(0.78 0.15 160)", "oklch(0.75 0.18 50)"];

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Volunteers" value={formatNumber(dashboardStats.totalVolunteers)} delta="+12.4% MoM" icon={Users} />
        <StatCard label="Active Volunteers" value={formatNumber(dashboardStats.activeVolunteers)} delta="+8.1% MoM" icon={UserCheck} />
        <StatCard label="Events" value={String(dashboardStats.events)} delta="+3 this month" icon={Calendar} />
        <StatCard label="Attendance Rate" value={`${dashboardStats.attendanceRate}%`} delta="+1.2 pts" icon={TrendingUp} />
        <StatCard label="Volunteer Hours" value={formatNumber(dashboardStats.volunteerHours)} delta="+1,820 this month" icon={Clock} />
        <StatCard label="Partner Orgs" value={String(dashboardStats.partnerOrgs)} delta="+2 new" icon={Activity} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Volunteer hours</h3>
              <p className="text-xs text-muted-foreground">Monthly trend over the past 8 months</p>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hoursTrend}>
                <defs>
                  <linearGradient id="hours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.18 258)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="oklch(0.65 0.18 258)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="oklch(0.72 0.03 255)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 255)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 262)", border: "1px solid oklch(0.32 0.04 262 / 60%)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="hours" stroke="oklch(0.72 0.18 250)" strokeWidth={2} fill="url(#hours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">Program distribution</h3>
          <p className="text-xs text-muted-foreground">By active volunteers</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={programDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {programDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 262)", border: "1px solid oklch(0.32 0.04 262 / 60%)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {programDistribution.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{p.name}</span>
                </div>
                <span className="font-medium">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Recent activity</h3>
          <ul className="mt-4 divide-y divide-border/40">
            {recentActivities.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium">{a.actor}</span>
                  <span className="text-muted-foreground"> {a.action} </span>
                  <span className="font-medium">{a.target}</span>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">Upcoming events</h3>
          <ul className="mt-4 space-y-3">
            {events.filter(e => e.status === "upcoming").slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/30 p-3">
                <img src={e.banner} alt="" className="h-10 w-10 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(e.date)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}