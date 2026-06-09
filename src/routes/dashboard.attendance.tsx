import { createFileRoute } from "@tanstack/react-router";
import { attendance } from "@/mock-data/attendance";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";

export const Route = createFileRoute("/dashboard/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const totalHours = attendance.reduce((s, a) => s + a.hours, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Present today" value="124" />
        <Metric label="Total hours logged" value={`${totalHours}h`} />
        <Metric label="Attendance rate" value="91.4%" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card-gradient shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <h3 className="font-display text-lg font-semibold">Attendance log</h3>
            <Button variant="outline" size="sm" className="border-border/60"><Download className="h-4 w-4" /> Export</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-border/40 bg-background/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Volunteer</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {attendance.map((a) => (
                <tr key={a.id} className="hover:bg-accent/30">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={a.avatar} alt="" className="h-8 w-8 rounded-full bg-muted" />
                      <span className="font-medium">{a.volunteerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{a.eventTitle}</td>
                  <td className="px-6 py-3 text-muted-foreground">{a.date}</td>
                  <td className="px-6 py-3"><AttBadge status={a.status} /></td>
                  <td className="px-6 py-3 font-medium">{a.hours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">QR check-in</h3>
          <p className="mt-1 text-xs text-muted-foreground">Volunteers scan to log attendance.</p>
          <div className="mt-6 flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-background/40">
            <QrCode className="h-32 w-32 text-primary" strokeWidth={1} />
          </div>
          <Button className="mt-4 w-full bg-brand-gradient shadow-glow hover:opacity-90">Generate new code</Button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card-gradient p-5 shadow-card">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function AttBadge({ status }: { status: "present" | "absent" | "late" }) {
  const m = {
    present: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    late: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    absent: "bg-destructive/15 text-destructive border-destructive/30",
  } as const;
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs capitalize ${m[status]}`}>{status}</span>;
}