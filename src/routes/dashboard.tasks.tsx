import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { TaskPriority, TaskRow, TaskStatus } from "@/types";

export const Route = createFileRoute("/dashboard/tasks")({ component: TasksPage });

const COLS: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

function TasksPage() {
  const { user, isAdmin, isCoordinator } = useAuth();
  const canManage = isAdmin || isCoordinator;
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    setTasks((data ?? []) as TaskRow[]);
    const ids = Array.from(new Set((data ?? []).map((t: any) => t.assignee_id).filter(Boolean)));
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids as string[]);
      const m: Record<string, string> = {};
      (profs ?? []).forEach((p: any) => { m[p.id] = p.full_name; });
      setProfiles(m);
    }
    const { data: evs } = await supabase.from("events").select("id, title");
    setEvents((evs ?? []) as any);
  }
  useEffect(() => { void load(); }, [user?.id]);

  async function setStatus(id: string, status: TaskStatus) {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else load();
  }
  async function remove(id: string) {
    if (!confirm("Delete task?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{tasks.length} task{tasks.length === 1 ? "" : "s"}</p>
        {canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-brand-gradient shadow-glow"><Plus className="mr-1 h-4 w-4" /> New task</Button></DialogTrigger>
            <TaskForm events={events} onClose={() => { setOpen(false); load(); }} />
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map((col) => (
          <div key={col.key} className="rounded-xl border border-border/60 bg-card-gradient p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">{col.label}</div>
              <span className="text-xs text-muted-foreground">{tasks.filter((t) => t.status === col.key).length}</span>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === col.key).map((t) => (
                <div key={t.id} className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium">{t.title}</div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${t.priority === "high" ? "bg-red-500/15 text-red-400" : t.priority === "medium" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>{t.priority}</span>
                  </div>
                  {t.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.description}</p>}
                  <div className="mt-2 text-xs text-muted-foreground">
                    {t.assignee_id ? profiles[t.assignee_id] ?? "—" : "Unassigned"}
                    {t.due_date ? ` • due ${t.due_date}` : ""}
                  </div>
                  {canManage && (
                    <div className="mt-2 flex items-center gap-2">
                      <Select value={t.status} onValueChange={(v) => setStatus(t.id, v as TaskStatus)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {COLS.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                </div>
              ))}
              {tasks.filter((t) => t.status === col.key).length === 0 && (
                <div className="rounded-lg border border-dashed border-border/40 p-4 text-center text-xs text-muted-foreground">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskForm({ events, onClose }: { events: { id: string; title: string }[]; onClose: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [eventId, setEventId] = useState<string>("");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    let assignee_id: string | null = null;
    if (assigneeEmail) {
      const { data } = await supabase.from("profiles").select("id").eq("email", assigneeEmail.trim()).maybeSingle();
      if (!data) { toast.error("No user with that email"); return; }
      assignee_id = data.id;
    }
    const { error } = await supabase.from("tasks").insert({
      title, description, priority, status: "todo",
      due_date: dueDate || null,
      event_id: eventId || null,
      assignee_id,
      created_by: user?.id ?? null,
    });
    if (error) toast.error(error.message); else { toast.success("Task created"); onClose(); }
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New task</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-2"><Label>Title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>Event (optional)</Label>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>{events.map((e) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Assignee email (optional)</Label><Input type="email" value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} placeholder="user@example.com" /></div>
        <DialogFooter><Button type="submit" className="bg-brand-gradient shadow-glow">Create</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}