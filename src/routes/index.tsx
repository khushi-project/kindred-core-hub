import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Users, Calendar, BarChart3, Sparkles, Heart, Globe2, ShieldCheck, Quote } from "lucide-react";
import { events } from "@/mock-data/events";
import { dashboardStats } from "@/mock-data/stats";
import { formatNumber, formatDate } from "@/utils/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Volunc — Volunteer Management Platform for Modern NGOs" },
      { name: "description", content: "Volunc helps NGOs and organizations manage volunteers, events, attendance, and impact in one premium platform." },
      { property: "og:title", content: "Volunc — Volunteer Management Platform" },
      { property: "og:description", content: "Premium volunteer management for modern organizations." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-hero">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Programs />
      <Events />
      <Stories />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 glass px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Trusted by 36+ NGOs across 12 countries
        </div>
        <h1 className="mx-auto mt-8 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          The platform <span className="text-gradient">powering</span> volunteer movements.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Volunc unifies volunteer onboarding, event coordination, attendance, and impact reporting into one elegant operating system for mission-driven teams.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-brand-gradient shadow-glow hover:opacity-90">
            <Link to="/signup">Become a Volunteer <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border/60 glass hover:bg-accent">
            <a href="#events">Explore Events</a>
          </Button>
        </div>

        {/* Dashboard preview */}
        <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-border/60 bg-card-gradient p-2 shadow-elegant">
          <div className="rounded-xl border border-border/40 bg-background/40 p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <PreviewStat label="Active volunteers" value="892" />
              <PreviewStat label="Events this month" value="14" />
              <PreviewStat label="Volunteer hours" value="24,650" />
              <PreviewStat label="Attendance" value="91.4%" />
            </div>
            <div className="mt-6 h-40 rounded-lg bg-gradient-to-tr from-primary/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-4 text-left">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Stats() {
  const items = [
    { label: "Volunteers Activated", value: formatNumber(dashboardStats.totalVolunteers) + "+" },
    { label: "Hours Contributed", value: formatNumber(dashboardStats.volunteerHours) + "+" },
    { label: "Events Hosted", value: dashboardStats.events + "+" },
    { label: "Partner Organizations", value: dashboardStats.partnerOrgs + "+" },
  ];
  return (
    <section className="border-y border-border/40 bg-card/20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl font-bold text-gradient">{s.value}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  const features = [
    { icon: Users, title: "Volunteer Lifecycle", desc: "Onboard, train, and retain volunteers with a streamlined workflow built for scale." },
    { icon: Calendar, title: "Event Orchestration", desc: "Plan, staff, and run events with smart scheduling and attendance tracking." },
    { icon: BarChart3, title: "Impact Reporting", desc: "Generate board-ready reports showing real outcomes — not just outputs." },
    { icon: ShieldCheck, title: "Compliance Built-in", desc: "Background checks, waivers, and certifications tracked automatically." },
    { icon: Globe2, title: "Multi-program Support", desc: "Run dozens of programs across regions from a single command center." },
    { icon: Heart, title: "Volunteer-first UX", desc: "A mobile-friendly experience your volunteers will actually love using." },
  ];
  return (
    <section id="programs" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">About the platform</p>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Everything your organization needs.</h2>
        <p className="mt-4 text-muted-foreground">Built with the rigor of enterprise software, designed for the warmth of human work.</p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="group rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Programs() {
  const programs = [
    { name: "Education for All", img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80", count: 240 },
    { name: "Climate Action", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80", count: 180 },
    { name: "Community Health", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80", count: 312 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Featured programs</p>
          <h2 className="mt-3 font-display text-4xl font-bold">Where we're making a dent.</h2>
        </div>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {programs.map((p) => (
          <div key={p.name} className="group overflow-hidden rounded-2xl border border-border/60 bg-card-gradient shadow-card">
            <div className="relative h-52 overflow-hidden">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.count} active volunteers</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Events() {
  return (
    <section id="events" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Upcoming events</p>
          <h2 className="mt-3 font-display text-4xl font-bold">Join us this season.</h2>
        </div>
        <Button asChild variant="outline" className="hidden md:inline-flex border-border/60 glass">
          <Link to="/dashboard/events">View all</Link>
        </Button>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {events.filter((e) => e.status === "upcoming").slice(0, 3).map((e) => (
          <article key={e.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card-gradient shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="relative h-44 overflow-hidden">
              <img src={e.banner} alt={e.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur">{e.category}</div>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground">{formatDate(e.date)} · {e.location}</p>
              <h3 className="mt-2 line-clamp-1 font-display text-lg font-semibold">{e.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{e.volunteersAssigned}/{e.capacity} volunteers</span>
                <span className="text-primary">Join →</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stories() {
  const stories = [
    { quote: "Volunc transformed how we coordinate our 400+ volunteers. We finally have the visibility we needed.", name: "Sarah Mitchell", role: "Director, Hope Foundation" },
    { quote: "The reporting alone saved our team 20 hours a month. It feels like having a full-time operations manager.", name: "Daniel Okafor", role: "Programs Lead, BrightFuture" },
    { quote: "Our volunteers love the experience. Sign-ups doubled in the first quarter.", name: "Mei Tanaka", role: "Founder, GreenTide" },
  ];
  return (
    <section id="stories" className="border-y border-border/40 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Success stories</p>
          <h2 className="mt-3 font-display text-4xl font-bold">Built with organizations like yours.</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <figure key={s.name} className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-card">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 text-sm leading-relaxed">{s.quote}</blockquote>
              <figcaption className="mt-6 text-sm">
                <div className="font-semibold">{s.name}</div>
                <div className="text-muted-foreground">{s.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-brand-gradient p-12 text-center shadow-elegant md:p-20">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold text-primary-foreground md:text-5xl">
          Ready to scale your mission?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Join hundreds of organizations bringing volunteers and impact together.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link to="/signup">Get started free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/dashboard">View live demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
