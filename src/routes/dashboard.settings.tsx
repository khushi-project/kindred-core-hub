import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { initials } from "@/lib/format";

export const Route = createFileRoute("/dashboard/settings")({ component: ProfilePage });

function ProfilePage() {
  const { user, profile, refresh, roles } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile?.id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: name.trim(),
      phone: phone.trim() || null,
    }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Profile updated"); refresh(); }
  }

  const primaryRole = roles[0] ?? "volunteer";
  const display = profile?.full_name || user?.email || "User";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-border/60 bg-card-gradient p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-primary-foreground shadow-glow">
            {initials(display)}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">{display}</h2>
            <div className="mt-1 inline-flex items-center gap-2">
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {primaryRole}
              </span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={save} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Phone number</Label>
            <Input type="tel" value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Email <span className="text-xs text-muted-foreground">(read-only)</span></Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role <span className="text-xs text-muted-foreground">(read-only)</span></Label>
              <Input value={primaryRole} disabled className="capitalize" />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="bg-brand-gradient shadow-glow">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
