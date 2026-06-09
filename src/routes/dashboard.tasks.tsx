import { createFileRoute } from "@tanstack/react-router";
import { tasks } from "@/mock-data/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/tasks")({
  component: TasksPage,
});

const columns: { id: "todo" | "in-progress" | "done"; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "in-progress", label: "In progress" },
  { id: "done", label: "Done" },
];

function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Coordinate operational tasks across your team.</p>
        <Button className="bg-brand-gradient shadow-glow hover:opacity-90"><Plus className="h-4 w-4" /> New Task</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="rounded-xl border border-border/60 bg-card-gradient p-4 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{col.label}</h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{colTasks.length}</span>
              </div>
              <div className="space-y-3">
                {colTasks.map((t) => (
                  <div key={t.id} className="rounded-lg border border-border/40 bg-background/40 p-3 transition-all hover:border-primary/40">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium leading-snug">{t.title}</h4>
                      <PriorityDot p={t.priority} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={t.avatar} alt="" className="h-6 w-6 rounded-full bg-muted" />
                        <span className="text-xs text-muted-foreground">{t.assignee}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t.dueDate.slice(5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriorityDot({ p }: { p: "low" | "medium" | "high" }) {
  const map = { low: "bg-muted-foreground", medium: "bg-amber-400", high: "bg-destructive" } as const;
  return <span className={`h-2 w-2 rounded-full ${map[p]}`} title={p} />;
}