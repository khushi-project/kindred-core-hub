import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Volunc" }] }),
  component: LoginPage,
});

const ADMIN_EMAIL = "tom@gmail.com";
const ADMIN_PASSWORD = "Tom123pro";

function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    let { error } = await signIn(cleanEmail, password);

    // First-time admin bootstrap with predefined credentials
    if (
      error &&
      cleanEmail === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD &&
      /invalid/i.test(error)
    ) {
      const up = await signUp(ADMIN_EMAIL, ADMIN_PASSWORD, "Tom (Admin)");
      if (!up.error) {
        const retry = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
        error = retry.error;
      } else {
        error = up.error;
      }
    }

    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Volunc workspace."
      footer={<>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.org" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-brand-gradient shadow-glow hover:opacity-90">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
