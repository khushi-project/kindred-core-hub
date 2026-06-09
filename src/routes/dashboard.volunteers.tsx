import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { volunteers } from "@/mock-data/volunteers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/utils/format";

export const Route = createFileRoute("/dashboard/volunteers")({
  component: VolunteersPage,
});

function VolunteersPage() {
  const [query, setQuery] = useState("");
  const filtered = volunteers.filter((v) =>
    `${v.name} ${v.email} ${v.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Manage your organization's volunteer database.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search volunteers…" className="w-64 border-border/60 bg-card pl-9" />
          </div>
          <Button variant="outline" className="border-border/60"><Filter className="h-4 w-4" /> Filter</Button>
          <AddVolunteerDialog />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card-gradient shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/40 bg-background/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Volunteer</th>
              <th className="px-6 py-3">Skills</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Hours</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map((v) => (
              <tr key={v.id} className="transition-colors hover:bg-accent/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={v.avatar} alt={v.name} className="h-9 w-9 rounded-full bg-muted" />
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-xs text-muted-foreground">{v.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {v.skills.map((s) => <Badge key={s} variant="secondary" className="bg-secondary/60">{s}</Badge>)}
                  </div>
                </td>
                <td className="px-6 py-4"><StatusBadge status={v.status} /></td>
                <td className="px-6 py-4 font-medium">{formatNumber(v.hours)}</td>
                <td className="px-6 py-4 text-muted-foreground">{v.location}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border/40 px-6 py-3 text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {volunteers.length} volunteers</span>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="px-2">Page 1 of 4</span>
            <Button size="icon" variant="ghost"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "inactive" | "pending" }) {
  const map = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    inactive: "bg-muted text-muted-foreground border-border",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  } as const;
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>{status}</span>;
}

function AddVolunteerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-brand-gradient shadow-glow hover:opacity-90"><Plus className="h-4 w-4" /> Add Volunteer</Button>
      </DialogTrigger>
      <DialogContent className="bg-card-gradient border-border/60">
        <DialogHeader>
          <DialogTitle>Add new volunteer</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Full name</Label><Input placeholder="Jane Doe" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="jane@org.org" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+1 555-0000" /></div>
            <div className="space-y-2"><Label>Location</Label><Input placeholder="City, State" /></div>
          </div>
          <div className="space-y-2"><Label>Skills (comma-separated)</Label><Input placeholder="Teaching, First Aid" /></div>
        </form>
        <DialogFooter>
          <Button variant="outline" className="border-border/60">Cancel</Button>
          <Button className="bg-brand-gradient">Add Volunteer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}