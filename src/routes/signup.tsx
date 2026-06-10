import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Users, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Volunc" }] }),
  component: SignupPage,
});

const ADMIN_EMAIL = "tom@gmail.com";

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role>("volunteer");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      toast.error("Admin accounts cannot sign up. Please sign in instead.");
      return;
    }
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (password !== confirm) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await signUp(email.trim(), password, full_name.trim(), { role, phone: phone.trim() || undefined });
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success(`Account created as ${role}. Please sign in to continue.`);
    navigate({ to: "/login" });
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join as a Volunteer or Coordinator."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label>Role</Label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { v: "volunteer" as Role, icon: Users, label: "Volunteer", body: "Join events and earn certificates" },
              { v: "coordinator" as Role, icon: UserCog, label: "Coordinator", body: "Manage events and volunteers" },
            ]).map((o) => (
              <button
                type="button"
                key={o.v}
                onClick={() => setRole(o.v)}
                className={cn(
                  "rounded-lg border p-3 text-left transition",
                  role === o.v ? "border-primary bg-primary/10 shadow-glow" : "border-border/60 hover:border-border"
                )}
              >
                <o.icon className="h-4 w-4 text-primary" />
                <div className="mt-2 text-sm font-semibold">{o.label}</div>
                <div className="text-[11px] text-muted-foreground">{o.body}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={full_name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile number <span className="text-xs text-muted-foreground">(optional)</span></Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-brand-gradient shadow-glow hover:opacity-90">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create account
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Admin access is restricted to the organization owner.
        </p>
      </form>
    </AuthShell>
  );
}
