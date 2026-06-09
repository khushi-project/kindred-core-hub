import { Link } from "@tanstack/react-router";
import { Heart, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">Volunc</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The operating system for modern volunteer organizations. Manage people, programs, and impact in one place.
            </p>
          </div>

          <FooterCol title="Platform" items={["Dashboard", "Volunteers", "Events", "Reports"]} />
          <FooterCol title="Organization" items={["About", "Careers", "Partners", "Contact"]} />
          <FooterCol title="Legal" items={["Privacy", "Terms", "Security", "Accessibility"]} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">© 2026 Volunc Foundation. All rights reserved.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4 hover:text-foreground" /></a>
            <a href="#" aria-label="GitHub"><Github className="h-4 w-4 hover:text-foreground" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin className="h-4 w-4 hover:text-foreground" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">{i}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}