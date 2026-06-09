import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, User, Users } from "lucide-react";
import { useState } from "react";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Volunc" }, { name: "description", content: "Create your Volunc account." }] }),
  component: SignupPage,
});

const roles: { id: Role; label: string; desc: string; icon: typeof User }[] = [
  { id: "admin", label: "Admin", desc: "Manage your organization", icon: Shield },
  { id: "coordinator", label: "Coordinator", desc: "Run programs & events", icon: Users },
  { id: "volunteer", label: "Volunteer", desc: "Contribute your time", icon: User },
];

function SignupPage() {
  const [role, setRole] = useState<Role>("volunteer");
  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started with Volunc in under a minute."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <Label className="mb-3 block">I am joining as</Label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all",
                  role === r.id ? "border-primary bg-primary/10 shadow-glow" : "border-border/60 hover:border-border"
                )}>
                <r.icon className="h-4 w-4 text-primary" />
                <div className="mt-2 text-sm font-semibold">{r.label}</div>
                <div className="text-[11px] text-muted-foreground">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@organization.org" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" />
        </div>
        <Button type="submit" className="w-full bg-brand-gradient shadow-glow hover:opacity-90">Create account</Button>
      </form>
    </AuthShell>
  );
}