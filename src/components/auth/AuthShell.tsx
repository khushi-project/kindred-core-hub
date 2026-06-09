import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-hero lg:grid-cols-2">
      <div className="hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Volunc</span>
        </Link>
        <div className="max-w-md">
          <blockquote className="font-display text-3xl font-semibold leading-tight">
            "Volunc gave us the visibility and structure to grow from 50 to 800 volunteers in a year."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— Sarah Mitchell, Director, Hope Foundation</p>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 Volunc</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Volunc</span>
          </div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}