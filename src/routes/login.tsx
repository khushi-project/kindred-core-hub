import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Volunc" }, { name: "description", content: "Sign in to your Volunc account." }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your organization workspace."
      footer={<>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@organization.org" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full bg-brand-gradient shadow-glow hover:opacity-90">Sign in</Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or</span></div>
        </div>
        <Button type="button" variant="outline" className="w-full border-border/60">Continue with Google</Button>
      </form>
    </AuthShell>
  );
}