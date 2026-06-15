import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart, ArrowRight, Users, Calendar, ClipboardCheck, Award, ShieldCheck, BarChart3,
  Bell, UserCog, UserPlus, CheckCircle2, Mail, Phone, MapPin, Loader2, Facebook, Twitter, Linkedin, Instagram, Menu, X,
  Sparkles, Sprout, HandHeart, Globe2, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroVolunteers from "@/assets/hero-volunteers.jpg";

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
      <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Join 10,000+ changemakers worldwide
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
              Be the reason <span className="text-gradient">someone smiles</span> today.
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Volunc connects passionate volunteers with meaningful causes. Plant trees, mentor kids,
              feed communities — every hour you give writes a story worth telling.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button size="lg" className="bg-brand-gradient shadow-glow transition hover:scale-[1.02] hover:opacity-95">
                  <HandHeart className="mr-2 h-5 w-5" />
                  {user ? "Open dashboard" : "Start volunteering"} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how"><Button size="lg" variant="outline" className="border-border/60">See how it works</Button></a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Free forever</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 2-min signup</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Real impact</div>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute -inset-6 rounded-3xl bg-brand-gradient opacity-30 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-elegant">
              <img
                src={heroVolunteers}
                alt="Diverse volunteers planting a tree together at golden hour"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl glass p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient shadow-glow">
                    <Sprout className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">12,438 trees planted</div>
                    <div className="text-xs text-muted-foreground">by volunteers this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOTIVATIONAL QUOTE */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="relative rounded-3xl border border-border/60 bg-card-gradient p-8 text-center shadow-card md:p-12">
          <Quote className="mx-auto h-8 w-8 text-primary opacity-70" />
          <p className="mx-auto mt-4 max-w-3xl font-display text-xl font-medium leading-relaxed md:text-2xl">
            "The best way to find yourself is to lose yourself in the service of others."
          </p>
          <div className="mt-3 text-sm text-muted-foreground">— Mahatma Gandhi</div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-elegant sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: Users, label: "Volunteers joined", value: stats.volunteers },
            { icon: Calendar, label: "Events organized", value: stats.events },
            { icon: Sprout, label: "Active right now", value: stats.active },
            { icon: Award, label: "Lives touched", value: stats.certs },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 font-display text-3xl font-bold text-gradient md:text-4xl">{s.value.toLocaleString()}+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY VOLUNTEER */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <HandHeart className="h-3.5 w-3.5" /> Why volunteer with us
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Small actions. <span className="text-gradient">Massive ripples.</span></h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">Every event you join, every hour you give — multiplied across a community of thousands.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Globe2, title: "Real impact", body: "Not just hours logged — trees planted, meals served, kids mentored. Track the difference you make." },
            { icon: Users, title: "Find your people", body: "Meet humans who care. Build friendships around causes you both believe in." },
            { icon: Award, title: "Grow & be recognized", body: "Earn verifiable certificates, build a portfolio of impact, and unlock new opportunities." },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient shadow-glow transition group-hover:scale-110">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
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

      {/* JOIN THE MOVEMENT CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-brand-gradient p-10 text-center shadow-elegant md:p-16">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" aria-hidden />
          <div className="relative">
            <HandHeart className="mx-auto h-10 w-10 text-primary-foreground" />
            <h2 className="mt-4 font-display text-3xl font-bold text-primary-foreground md:text-5xl">
              Your community is waiting for you.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/90 md:text-lg">
              Join thousands of volunteers turning everyday hours into extraordinary change.
              It starts with one click.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button size="lg" variant="secondary" className="shadow-glow transition hover:scale-[1.03]">
                  {user ? "Open my dashboard" : "Join the movement"} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
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
