import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user, profile, refresh, roles } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [skills, setSkills] = useState((profile?.skills ?? []).join(", "));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setLocation(profile.location ?? "");
      setSkills((profile.skills ?? []).join(", "));
    }
  }, [profile?.id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: name,
      phone: phone || null,
      location: location || null,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Profile saved"); refresh(); }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-border/60 bg-card-gradient p-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {user?.email}. Role{roles.length > 1 ? "s" : ""}: <span className="capitalize text-foreground">{roles.join(", ") || "—"}</span></p>
        <form onSubmit={save} className="mt-5 space-y-4">
          <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Phone</Label><Input value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={location ?? ""} onChange={(e) => setLocation(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Skills (comma-separated)</Label><Textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Teaching, First Aid, Logistics" /></div>
          <Button type="submit" disabled={saving} className="bg-brand-gradient shadow-glow">{saving ? "Saving…" : "Save changes"}</Button>
        </form>
      </div>
    </div>
  );
}