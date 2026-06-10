import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { initials } from "@/lib/format";
import { ShieldCheck, ShieldOff, UserPlus } from "lucide-react";
import type { Role } from "@/types";

export const Route = createFileRoute("/dashboard/volunteers")({
  component: VolunteersPage,
});

interface Row { id: string; full_name: string; email: string; roles: Role[]; }

function VolunteersPage() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const map = new Map<string, Role[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = map.get(r.user_id) ?? [];
      arr.push(r.role);
      map.set(r.user_id, arr);
    });
    setRows((profs ?? []).map((p: any) => ({ id: p.id, full_name: p.full_name, email: p.email, roles: map.get(p.id) ?? [] })));
  }
  useEffect(() => { void load(); }, []);

  async function setRole(email: string, role: Role) {
    const { error } = await supabase.rpc("admin_set_role", { _email: email, _role: role });
    if (error) toast.error(error.message); else { toast.success(`Granted ${role}`); load(); }
  }
  async function removeRole(uid: string, role: Role) {
    if (!confirm(`Remove ${role} role?`)) return;
    const { error } = await supabase.rpc("admin_remove_role", { _user_id: uid, _role: role });
    if (error) toast.error(error.message); else { toast.success("Role removed"); load(); }
  }

  const filtered = rows.filter((r) =>
    !q || r.full_name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Search by name or email…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        {isAdmin && <PromoteDialog onDone={load} />}
      </div>

      <div className="rounded-xl border border-border/60 bg-card-gradient">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">{initials(r.full_name || r.email)}</div>
                    <div className="font-medium">{r.full_name || "—"}</div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{r.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {r.roles.map((role) => (
                      <span key={role} className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] capitalize">{role}</span>
                    ))}
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    {!r.roles.includes("coordinator") ? (
                      <Button size="sm" variant="outline" onClick={() => setRole(r.email, "coordinator")}>
                        <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Make coordinator
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => removeRole(r.id, "coordinator")}>
                        <ShieldOff className="mr-1 h-3.5 w-3.5" /> Revoke coordinator
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No people found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PromoteDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("coordinator");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.rpc("admin_set_role", { _email: email.trim(), _role: role });
    if (error) toast.error(error.message);
    else { toast.success(`Granted ${role} to ${email}`); setOpen(false); setEmail(""); onDone(); }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-gradient shadow-glow"><UserPlus className="mr-1 h-4 w-4" /> Assign role</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Assign a role</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>User email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" /></div>
          <div className="space-y-2"><Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="coordinator">Coordinator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter><Button type="submit" className="bg-brand-gradient shadow-glow">Grant</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}