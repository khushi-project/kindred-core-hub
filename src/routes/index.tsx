import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart, ArrowRight, Users, Calendar, ClipboardCheck, Award, ShieldCheck, BarChart3,
  Bell, UserCog, UserPlus, CheckCircle2, Mail, Phone, MapPin, Loader2, Facebook, Twitter, Linkedin, Instagram, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Volunc — Volunteer Management Platform" },
      { name: "description", content: "Smart volunteer management to organize events, track volunteers, assign coordinators, and auto-generate certificates." },
      { property: "og:title", content: "Volunc — Volunteer Management Platform" },
      { property: "og:description", content: "Run volunteer programs like a real organization." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({ volunteers: 0, events: 0, active: 0, certs: 0 });

  useEffect(() => {
    (async () => {
      const [vol, ev, act, cert] = await Promise.all([
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "volunteer"),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }).in("status", ["upcoming", "ongoing"]),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        volunteers: vol.count ?? 0,
        events: ev.count ?? 0,
        active: act.count ?? 0,
        certs: cert.count ?? 0,
      });
    })();
  }, []);

  const navLinks = [
    { label: "Home", href: "#top" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div id="top" className="min-h-screen bg-hero text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Volunc</span>
          </Link>
          <nav className="hidden gap-7 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">{l.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/dashboard"><Button className="bg-brand-gradient shadow-glow">Open dashboard <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
                <Link to="/signup"><Button variant="outline" className="border-border/60">Sign up</Button></Link>
                <Link to="/signup"><Button className="bg-brand-gradient shadow-glow">Get started</Button></Link>
              </>
            )}
          </div>
          <button className="md:hidden" aria-label="Toggle menu" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-border/40 bg-background/95 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">{l.label}</a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}><Button className="w-full bg-brand-gradient shadow-glow">Open dashboard</Button></Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full border-border/60">Sign in</Button></Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)}><Button className="w-full bg-brand-gradient shadow-glow">Get started</Button></Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center md:py-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Built for professional NGOs and organizations
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl">
          Manage Volunteers, Events & Coordination <span className="text-gradient">Efficiently.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          A smart volunteer management platform to organize events, track volunteers, assign coordinators,
          generate certificates, and manage everything seamlessly.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to={user ? "/dashboard" : "/signup"}>
            <Button size="lg" className="bg-brand-gradient shadow-glow hover:opacity-90">
              {user ? "Open dashboard" : "Get started"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <a href="#features"><Button size="lg" variant="outline" className="border-border/60">Explore features</Button></a>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-elegant sm:grid-cols-2 md:grid-cols-4">
          {[
            { label: "Total volunteers", value: stats.volunteers },
            { label: "Total events", value: stats.events },
            { label: "Active events", value: stats.active },
            { label: "Certificates issued", value: stats.certs },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient md:text-4xl">{s.value.toLocaleString()}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Everything you need to run programs well</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">A complete toolkit for admins, coordinators, and volunteers — no spreadsheets, no chaos.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calendar, title: "Event management", body: "Create, edit, and manage events with categories, capacity, and status." },
            { icon: UserPlus, title: "Volunteer registration", body: "Easy self-signup and one-click event joining for volunteers." },
            { icon: UserCog, title: "Coordinator management", body: "Promote volunteers and assign coordinators to specific events." },
            { icon: ClipboardCheck, title: "Volunteer tracking", body: "Mark attendance, log hours, and track every participation." },
            { icon: Bell, title: "Notifications", body: "In-app alerts for event updates, assignments, and certificates." },
            { icon: Award, title: "Auto certificates", body: "Branded PDF certificates are issued automatically on completion." },
            { icon: BarChart3, title: "Dashboard analytics", body: "Live charts for engagement, completion, and impact." },
            { icon: ShieldCheck, title: "Role-based access", body: "Admin, Coordinator, Volunteer — each sees exactly what they should." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-card transition hover:border-primary/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">How it works</h2>
          <p className="mt-3 text-sm text-muted-foreground">From signup to certificate — in four simple steps.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { icon: UserPlus, step: "01", title: "Sign up", body: "Create your free volunteer account in seconds." },
            { icon: Calendar, step: "02", title: "Join events", body: "Browse upcoming events and join in one click." },
            { icon: ClipboardCheck, step: "03", title: "Participate", body: "Attend the event and get marked present by the coordinator." },
            { icon: Award, step: "04", title: "Get certificate", body: "Download your branded participation certificate as PDF." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-card">
              <div className="text-xs font-bold tracking-wider text-primary">STEP {s.step}</div>
              <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Loved by volunteer-driven teams</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { name: "Aisha Khan", role: "Program Director, GreenHands NGO", quote: "Volunc replaced three spreadsheets and a WhatsApp group. Our coordinators finally have a single source of truth." },
            { name: "Daniel Park", role: "Volunteer Coordinator", quote: "Marking attendance and issuing certificates used to take a full day. Now it's automatic the moment an event completes." },
            { name: "Priya Menon", role: "Long-term volunteer", quote: "I love seeing my history and certificates in one place. It feels respectful of my time and contribution." },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-card">
              <div className="flex gap-1 text-primary">{"★★★★★"}</div>
              <p className="mt-3 text-sm text-muted-foreground">"{t.quote}"</p>
              <div className="mt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Built for the changemakers</h2>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              Volunc is a volunteer management platform crafted specifically for non-profits, student clubs,
              and community organizations. Our mission is to remove operational friction so your team can spend
              more time on impact and less on admin.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Role-based dashboards for Admin, Coordinator, and Volunteer",
                "Permanent data storage with row-level security",
                "Automatic certificate generation on event completion",
                "Real-time analytics across your organization",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Users, label: "Roles" , value: "3" },
                { icon: Calendar, label: "Modules", value: "8" },
                { icon: Award, label: "Auto certs", value: "Yes" },
              ].map((b) => (
                <div key={b.label} className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <b.icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-2 font-display text-xl font-bold">{b.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{b.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
              "We believe volunteer programs deserve the same operational quality as the for-profit world."
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-10 rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Get in touch</h2>
            <p className="mt-3 text-sm text-muted-foreground">Have a question or want a demo? Send us a message and we'll get back to you.</p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><span>hello@volunc.app</span></div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><span>+1 (555) 010-2468</span></div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /><span>221B Impact Street, Remote-first</span></div>
            </div>
            <div className="mt-6 flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((I, i) => (
                <a key={i} href="#" aria-label="social" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-base font-bold">Volunc</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Run your volunteer programs like a real organization.</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">Quick links</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#how" className="hover:text-foreground">How it works</a></li>
              <li><a href="#about" className="hover:text-foreground">About</a></li>
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">Account</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
              <li><Link to="/signup" className="hover:text-foreground">Create account</Link></li>
              <li><Link to="/forgot-password" className="hover:text-foreground">Forgot password</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">Legal</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy policy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms & conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-muted-foreground">
            <div>© {new Date().getFullYear()} Volunc. All rights reserved.</div>
            <div className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-primary" /> Made for changemakers</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 5) {
      toast.error("Please complete all fields."); return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 200),
      message: message.trim().slice(0, 2000),
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Message sent — we'll be in touch.");
    setName(""); setEmail(""); setMessage("");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="c-name">Name</Label>
        <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-email">Email</Label>
        <Input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-msg">Message</Label>
        <Textarea id="c-msg" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-brand-gradient shadow-glow hover:opacity-90">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send message
      </Button>
    </form>
  );
}
