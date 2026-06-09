import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { hoursTrend, programDistribution } from "@/mock-data/stats";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

const COLORS = ["oklch(0.65 0.18 258)", "oklch(0.72 0.14 200)", "oklch(0.68 0.16 290)", "oklch(0.78 0.15 160)", "oklch(0.75 0.18 50)"];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">Generate impact reports for stakeholders, board, and grant applications.</p>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border/60"><FileSpreadsheet className="h-4 w-4" /> Export CSV</Button>
          <Button className="bg-brand-gradient shadow-glow hover:opacity-90"><FileText className="h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { l: "Reports generated", v: "128" },
          { l: "Hours tracked", v: "24,650" },
          { l: "Events completed", v: "47" },
          { l: "Funds raised", v: "$184K" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border/60 bg-card-gradient p-5 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="mt-2 font-display text-3xl font-bold">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">Hours by month</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursTrend}>
                <CartesianGrid stroke="oklch(0.32 0.04 262 / 30%)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.72 0.03 255)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 255)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 262)", border: "1px solid oklch(0.32 0.04 262 / 60%)", borderRadius: 8 }} />
                <Bar dataKey="hours" fill="oklch(0.65 0.18 258)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">Program impact</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={programDistribution} dataKey="value" nameKey="name" outerRadius={100} label>
                  {programDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 262)", border: "1px solid oklch(0.32 0.04 262 / 60%)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Recent reports</h3>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <ul className="mt-4 divide-y divide-border/40">
          {["May 2026 Impact Report", "Q1 Volunteer Engagement", "Annual Hours Summary 2025", "Grant: Education Outcomes"].map((n) => (
            <li key={n} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary"><FileText className="h-5 w-5 text-primary" /></div>
                <div>
                  <div className="text-sm font-medium">{n}</div>
                  <div className="text-xs text-muted-foreground">Generated 3 days ago</div>
                </div>
              </div>
              <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}