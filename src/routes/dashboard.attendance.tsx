import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { initials, formatDateTime } from "@/lib/format";
import type { AttendanceStatus } from "@/types";

export const Route = createFileRoute("/dashboard/attendance")({ component: AttendancePage });

function AttendancePage() {
  const { user, isAdmin, isCoordinator } = useAuth();
  const canMark = isAdmin || isCoordinator;
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { name: string; email: string }>>({});
  const [attendance, setAttendance] = useState<Record<string, { status: AttendanceStatus; hours: number }>>({});
  const [myHistory, setMyHistory] = useState<any[]>([]);

  async function loadEvents() {
    const { data } = await supabase.from("events").select("id, title, event_date, status").order("event_date", { ascending: false });
    setEvents(data ?? []);
    if (data?.length && !selected) setSelected(data[0].id);
  }
  async function loadVolunteers(eventId: string) {
    if (!eventId) return;
    const [{ data: ev }, { data: att }] = await Promise.all([
      supabase.from("event_volunteers").select("volunteer_id").eq("event_id", eventId),
      supabase.from("attendance").select("volunteer_id, status, hours").eq("event_id", eventId),
    ]);
    setVolunteers(ev ?? []);
    const ids = (ev ?? []).map((r: any) => r.volunteer_id);
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
      const m: Record<string, { name: string; email: string }> = {};
      (profs ?? []).forEach((p: any) => { m[p.id] = { name: p.full_name, email: p.email }; });
      setProfiles(m);
    }
    const ma: Record<string, { status: AttendanceStatus; hours: number }> = {};
    (att ?? []).forEach((a: any) => { ma[a.volunteer_id] = { status: a.status, hours: Number(a.hours) }; });
    setAttendance(ma);
  }
  async function loadMyHistory() {
    if (!user) return;
    const { data } = await supabase
      .from("attendance")
      .select("id, status, hours, marked_at, event_id, events(title, event_date)")
      .eq("volunteer_id", user.id)
      .order("marked_at", { ascending: false });
    setMyHistory(data ?? []);
  }

  useEffect(() => { void loadEvents(); void loadMyHistory(); }, [user?.id]);
  useEffect(() => { if (selected) void loadVolunteers(selected); }, [selected]);

  async function mark(volId: string, status: AttendanceStatus, hours: number) {
    if (!user || !selected) return;
    const { error } = await supabase.from("attendance").upsert({
      event_id: selected, volunteer_id: volId, status, hours, marked_by: user.id, marked_at: new Date().toISOString(),
    }, { onConflict: "event_id,volunteer_id" });
    if (error) toast.error(error.message);
    else { toast.success("Attendance saved"); setAttendance((p) => ({ ...p, [volId]: { status, hours } })); }
  }

  if (!canMark) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold">My attendance history</h2>
        <div className="rounded-xl border border-border/60 bg-card-gradient">
          <Table>
            <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Hours</TableHead></TableRow></TableHeader>
            <TableBody>
              {myHistory.length === 0 && <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No attendance records yet.</TableCell></TableRow>}
              {myHistory.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.events?.title ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.events?.event_date ? formatDateTime(r.events.event_date) : "—"}</TableCell>
                  <TableCell className="capitalize">{r.status}</TableCell>
                  <TableCell>{r.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label className="text-sm text-muted-foreground">Event</Label>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="max-w-md"><SelectValue placeholder="Select an event" /></SelectTrigger>
          <SelectContent>
            {events.map((e) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-gradient">
        <Table>
          <TableHeader><TableRow><TableHead>Volunteer</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Hours</TableHead><TableHead className="text-right">Save</TableHead></TableRow></TableHeader>
          <TableBody>
            {volunteers.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No volunteers assigned to this event yet.</TableCell></TableRow>}
            {volunteers.map((v: any) => (
              <AttendanceRow key={v.volunteer_id} volunteerId={v.volunteer_id} profile={profiles[v.volunteer_id]} current={attendance[v.volunteer_id]} onSave={mark} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AttendanceRow({ volunteerId, profile, current, onSave }: {
  volunteerId: string; profile?: { name: string; email: string }; current?: { status: AttendanceStatus; hours: number };
  onSave: (id: string, s: AttendanceStatus, h: number) => void;
}) {
  const [status, setStatus] = useState<AttendanceStatus>(current?.status ?? "present");
  const [hours, setHours] = useState<string>(String(current?.hours ?? 4));
  useEffect(() => { if (current) { setStatus(current.status); setHours(String(current.hours)); } }, [current?.status, current?.hours]);

  return (
    <TableRow>
      <TableCell><div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">{initials(profile?.name ?? "?")}</div>
        <div className="font-medium">{profile?.name ?? "—"}</div>
      </div></TableCell>
      <TableCell className="text-muted-foreground">{profile?.email ?? "—"}</TableCell>
      <TableCell>
        <Select value={status} onValueChange={(v) => setStatus(v as AttendanceStatus)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell><Input type="number" min={0} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} /></TableCell>
      <TableCell className="text-right"><Button size="sm" className="bg-brand-gradient" onClick={() => onSave(volunteerId, status, parseFloat(hours) || 0)}>Save</Button></TableCell>
    </TableRow>
  );
}