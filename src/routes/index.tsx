import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowRight, Users, Calendar, ClipboardCheck, Award, ShieldCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Volunc — Volunteer Management Platform" },
      { name: "description", content: "The professional volunteer management platform for modern NGOs. Coordinate events, track attendance, and reward your volunteers." },
      { property: "og:title", content: "Volunc — Volunteer Management Platform" },
      { property: "og:description", content: "Professional volunteer management for modern NGOs." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-hero text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/60 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Volunc</span>
          </Link>
          <nav className="hidden gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#roles" className="text-sm text-muted-foreground hover:text-foreground">Roles</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard"><Button className="bg-brand-gradient shadow-glow">Open dashboard <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
                <Link to="/signup"><Button className="bg-brand-gradient shadow-glow">Get started</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Built for professional NGOs and organizations
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-bold leading-tight md:text-6xl">
          Run your volunteer programs <span className="text-gradient">like a real organization.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Volunc gives Admins, Coordinators, and Volunteers one polished workspace to manage events, track attendance, assign tasks, and automatically issue participation certificates.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to={user ? "/dashboard" : "/signup"}>
            <Button size="lg" className="bg-brand-gradient shadow-glow hover:opacity-90">
              {user ? "Open dashboard" : "Start volunteering"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login"><Button size="lg" variant="outline" className="border-border/60">Organization sign-in</Button></Link>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-3">
        {[
          { icon: Calendar, title: "Event coordination", body: "Create events, assign coordinators, manage capacity. Volunteers join in one click." },
          { icon: ClipboardCheck, title: "Attendance tracking", body: "Coordinators mark presence and hours. Everything is logged permanently." },
          { icon: Award, title: "Auto certificates", body: "Branded PDF certificates are issued instantly when an event completes." },
          { icon: Users, title: "Role-based access", body: "Admin, Coordinator, and Volunteer roles with secure, separated permissions." },
          { icon: BarChart3, title: "Live analytics", body: "See active events, participation, and volunteer engagement in real time." },
          { icon: ShieldCheck, title: "Secure by default", body: "Database row-level security keeps every organization's data isolated." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-elegant">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>

      <section id="roles" className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-center font-display text-3xl font-bold">Designed for every role</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "Admin", desc: "Create events, assign coordinators, manage volunteers, view full analytics." },
            { title: "Coordinator", desc: "Manage assigned events, mark attendance, and track your volunteer team." },
            { title: "Volunteer", desc: "Discover events, join in one click, track your history, and download certificates." },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center shadow-elegant">
              <h3 className="font-display text-xl font-bold">{r.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Volunc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-primary" /> Made for changemakers
          </div>
        </div>
      </footer>
    </div>
  );
}