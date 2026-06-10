import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Pencil, Calendar, MapPin, Users, Eye, UserCog } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format";
import type { EventRow, EventStatus } from "@/types";

export const Route = createFileRoute("/dashboard/events")({
  component: EventsPage,
});

type EventWithCounts = EventRow & {
  coordinator_ids: string[];
  volunteer_ids: string[];
  coordinators: number;
  volunteers: number;
  joined: boolean;
};

function EventsPage() {
  const { user, isAdmin, isCoordinator, isVolunteer } = useAuth();
  const [events, setEvents] = useState<EventWithCounts[]>([]);
  const [filter, setFilter] = useState<"all" | EventStatus>("all");
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<EventWithCounts | null>(null);
  const [assigning, setAssigning] = useState<EventWithCounts | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [{ data: evs }, { data: ec }, { data: ev }] = await Promise.all([
      supabase.from("events").select("*").order("event_date", { ascending: true }),
      supabase.from("event_coordinators").select("event_id, coordinator_id"),
      supabase.from("event_volunteers").select("event_id, volunteer_id"),
    ]);
    let list: EventWithCounts[] = (evs ?? []).map((e: any) => {
      const cids = (ec ?? []).filter((c: any) => c.event_id === e.id).map((c: any) => c.coordinator_id);
      const vids = (ev ?? []).filter((v: any) => v.event_id === e.id).map((v: any) => v.volunteer_id);
      return {
        ...(e as EventRow),
        coordinator_ids: cids,
        volunteer_ids: vids,
        coordinators: cids.length,
        volunteers: vids.length,
        joined: !!user && vids.includes(user.id),
      };
    });
    // Coordinators (non-admin) only see events assigned to them
    if (isCoordinator && !isAdmin) {
      list = list.filter((e) => user && e.coordinator_ids.includes(user.id));
    }
    setEvents(list);
    setLoading(false);
  }
  useEffect(() => { void load(); }, [user?.id, isAdmin, isCoordinator]);

  const visible = filter === "all" ? events : events.filter((e) => e.status === filter);

  async function remove(id: string) {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Event deleted"); load(); }
  }

  async function toggleJoin(e: EventWithCounts) {
    if (!user) return;
    if (e.joined) {
      const { error } = await supabase.from("event_volunteers").delete().eq("event_id", e.id).eq("volunteer_id", user.id);
      if (error) toast.error(error.message); else { toast.success("Left event"); load(); }
    } else {
      if (e.volunteers >= e.capacity) { toast.error("Event is full"); return; }
      const { error } = await supabase.from("event_volunteers").insert({ event_id: e.id, volunteer_id: user.id });
      if (error) toast.error(error.message); else { toast.success("Joined event"); load(); }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "upcoming", "ongoing", "completed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`rounded-full border px-3 py-1 text-xs capitalize ${filter === s ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:border-border"}`}
            >{s}</button>
          ))}
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-brand-gradient shadow-glow"><Plus className="mr-1 h-4 w-4" /> New event</Button>
            </DialogTrigger>
            <EventForm key={editing?.id ?? "new"} event={editing} onClose={() => { setOpen(false); setEditing(null); load(); }} />
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          {isCoordinator && !isAdmin
            ? "No events assigned to you yet. Ask an admin to assign you."
            : `No events ${filter !== "all" ? `with status "${filter}"` : "yet"}.`}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((e) => (
            <div key={e.id} className="rounded-xl border border-border/60 bg-card-gradient p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary">{e.category}</div>
                  <h3 className="mt-1 font-display text-lg font-semibold">{e.title}</h3>
                </div>
                <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] capitalize">{e.status}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {formatDateTime(e.event_date)}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.location}</div>
                <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {e.volunteers}/{e.capacity} volunteers • {e.coordinators} coordinator{e.coordinators === 1 ? "" : "s"}</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setDetails(e)}>
                  <Eye className="mr-1 h-3.5 w-3.5" /> Details
                </Button>
                {isVolunteer && !isAdmin && !isCoordinator && e.status === "upcoming" && (
                  <Button size="sm" onClick={() => toggleJoin(e)} className={e.joined ? "" : "bg-brand-gradient shadow-glow"}>
                    {e.joined ? "Leave" : "Join event"}
                  </Button>
                )}
                {isAdmin && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setAssigning(e)}>
                      <UserCog className="mr-1 h-3.5 w-3.5" /> Coordinators
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(e); setOpen(true); }}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(e.id)}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {details && (
        <Dialog open onOpenChange={(o) => !o && setDetails(null)}>
          <EventDetails event={details} onClose={() => setDetails(null)} />
        </Dialog>
      )}
      {assigning && (
        <Dialog open onOpenChange={(o) => !o && setAssigning(null)}>
          <AssignCoordinators event={assigning} onClose={() => { setAssigning(null); load(); }} />
        </Dialog>
      )}
    </div>
  );
}

function EventForm({ event, onClose }: { event: EventRow | null; onClose: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [category, setCategory] = useState(event?.category ?? "Community");
  const [location, setLocation] = useState(event?.location ?? "");
  const [capacity, setCapacity] = useState(String(event?.capacity ?? 30));
  const [date, setDate] = useState(event ? new Date(event.event_date).toISOString().slice(0, 16) : "");
  const [status, setStatus] = useState<EventStatus>(event?.status ?? "upcoming");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title, description, category, location,
      capacity: parseInt(capacity, 10) || 30,
      event_date: new Date(date).toISOString(),
      status,
      created_by: user?.id ?? null,
    };
    const { error } = event
      ? await supabase.from("events").update(payload).eq("id", event.id)
      : await supabase.from("events").insert(payload);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success(event ? "Event updated" : "Event created"); onClose(); }
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>{event ? "Edit event" : "New event"}</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label>Title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea required value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Category</Label><Input required value={category} onChange={(e) => setCategory(e.target.value)} /></div>
          <div className="space-y-2"><Label>Capacity</Label><Input type="number" min={1} required value={capacity} onChange={(e) => setCapacity(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>Location</Label><Input required value={location} onChange={(e) => setLocation(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Date & time</Label><Input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as EventStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saving} className="bg-brand-gradient shadow-glow">{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function EventDetails({ event, onClose }: { event: EventWithCounts; onClose: () => void }) {
  const [vols, setVols] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [coords, setCoords] = useState<{ id: string; full_name: string; email: string }[]>([]);

  useEffect(() => {
    (async () => {
      const ids = [...event.volunteer_ids, ...event.coordinator_ids];
      if (ids.length === 0) return;
      const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
      setVols((data ?? []).filter((p: any) => event.volunteer_ids.includes(p.id)));
      setCoords((data ?? []).filter((p: any) => event.coordinator_ids.includes(p.id)));
    })();
  }, [event.id]);

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>{event.title}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">{event.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-muted-foreground">Date:</span> {formatDateTime(event.event_date)}</div>
          <div><span className="text-muted-foreground">Location:</span> {event.location}</div>
          <div><span className="text-muted-foreground">Status:</span> <span className="capitalize">{event.status}</span></div>
          <div><span className="text-muted-foreground">Capacity:</span> {event.volunteers}/{event.capacity}</div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coordinators ({coords.length})</div>
          {coords.length === 0 ? <div className="text-xs text-muted-foreground">None assigned.</div> : (
            <ul className="space-y-1">
              {coords.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded border border-border/60 px-2 py-1 text-xs">
                  <span>{p.full_name || p.email}</span>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">Coordinator</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Volunteers joined ({vols.length})</div>
          {vols.length === 0 ? <div className="text-xs text-muted-foreground">No volunteers yet.</div> : (
            <ul className="max-h-48 space-y-1 overflow-auto">
              {vols.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded border border-border/60 px-2 py-1 text-xs">
                  <span>{p.full_name || p.email}</span>
                  <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Volunteer</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
    </DialogContent>
  );
}

function AssignCoordinators({ event, onClose }: { event: EventWithCounts; onClose: () => void }) {
  const [people, setPeople] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(event.coordinator_ids));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "coordinator");
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (ids.length === 0) { setPeople([]); return; }
      const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
      setPeople((profs ?? []) as any);
    })();
  }, []);

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function save() {
    setSaving(true);
    const current = new Set(event.coordinator_ids);
    const toAdd = [...selected].filter((id) => !current.has(id));
    const toRemove = [...current].filter((id) => !selected.has(id));
    if (toRemove.length) {
      await supabase.from("event_coordinators").delete().eq("event_id", event.id).in("coordinator_id", toRemove);
    }
    if (toAdd.length) {
      await supabase.from("event_coordinators").insert(toAdd.map((cid) => ({ event_id: event.id, coordinator_id: cid })));
    }
    setSaving(false);
    toast.success("Coordinators updated");
    onClose();
  }

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Assign coordinators to "{event.title}"</DialogTitle></DialogHeader>
      <div className="max-h-64 overflow-auto rounded border border-border/60">
        {people.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No coordinators exist yet. Promote a user from the Volunteers page.</div>
        ) : people.map((p) => (
          <label key={p.id} className="flex cursor-pointer items-center justify-between border-b border-border/40 px-3 py-2 text-sm last:border-0 hover:bg-accent">
            <span>
              <span className="font-medium">{p.full_name || p.email}</span>
              <span className="ml-2 text-xs text-muted-foreground">{p.email}</span>
            </span>
            <input
              type="checkbox"
              checked={selected.has(p.id)}
              onChange={() => toggle(p.id)}
              className="h-4 w-4 accent-primary"
            />
          </label>
        ))}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving} className="bg-brand-gradient shadow-glow">{saving ? "Saving…" : "Save"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
