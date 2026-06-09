import { createFileRoute } from "@tanstack/react-router";
import { events } from "@/mock-data/events";
import { volunteers } from "@/mock-data/volunteers";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar as CalIcon, Users } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard/events")({
  component: EventsPage,
});

function EventsPage() {
  const [selected, setSelected] = useState(events[0].id);
  const selectedEvent = events.find((e) => e.id === selected)!;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">Plan, staff, and track events across all your programs.</p>
        <CreateEventDialog />
      </div>

      <Tabs defaultValue="grid">
        <TabsList className="bg-card">
          <TabsTrigger value="grid">Events</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((e) => (
              <button key={e.id} onClick={() => setSelected(e.id)} className="group overflow-hidden rounded-xl border border-border/60 bg-card-gradient text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="relative h-40 overflow-hidden">
                  <img src={e.banner} alt={e.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-0.5 text-xs backdrop-blur">{e.category}</span>
                  <span className="absolute right-3 top-3 rounded-full bg-primary/80 px-2.5 py-0.5 text-xs text-primary-foreground backdrop-blur capitalize">{e.status}</span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-display text-base font-semibold">{e.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CalIcon className="h-3 w-3" /> {formatDate(e.date)}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location.split(",")[0]}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-brand-gradient" style={{ width: `${(e.volunteersAssigned / e.capacity) * 100}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{e.volunteersAssigned} / {e.capacity} volunteers</div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
            <CalendarMock />
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <EventDetails event={selectedEvent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventDetails({ event }: { event: typeof events[number] }) {
  const assigned = volunteers.slice(0, event.volunteersAssigned > 8 ? 8 : event.volunteersAssigned);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card-gradient shadow-card lg:col-span-2">
        <img src={event.banner} alt={event.title} className="h-56 w-full object-cover" />
        <div className="p-6">
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs text-primary">{event.category}</span>
          <h2 className="mt-3 font-display text-2xl font-bold">{event.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><CalIcon className="h-4 w-4" /> {formatDate(event.date)}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {event.location}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {event.volunteersAssigned} / {event.capacity}</span>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">{event.description}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold">Assigned volunteers</h3>
        <ul className="mt-4 space-y-3">
          {assigned.map((v) => (
            <li key={v.id} className="flex items-center gap-3">
              <img src={v.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="text-sm font-medium">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.skills[0]}</div>
              </div>
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full bg-brand-gradient shadow-glow hover:opacity-90">Assign more</Button>
      </div>
    </div>
  );
}

function CalendarMock() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const eventDays = [12, 21, 28];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">June 2026</h3>
        <div className="flex gap-1"><Button variant="ghost" size="sm">‹</Button><Button variant="ghost" size="sm">›</Button></div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const valid = d > 0 && d <= 30;
          const has = eventDays.includes(d);
          return (
            <div key={i} className={`aspect-square rounded-lg border p-2 text-left text-xs ${valid ? "border-border/40 bg-background/30" : "border-transparent text-muted-foreground/30"} ${has ? "ring-1 ring-primary" : ""}`}>
              {valid && <div className="font-medium">{d}</div>}
              {has && <div className="mt-1 truncate text-[10px] text-primary">Event</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreateEventDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-brand-gradient shadow-glow hover:opacity-90"><Plus className="h-4 w-4" /> Create Event</Button>
      </DialogTrigger>
      <DialogContent className="bg-card-gradient border-border/60">
        <DialogHeader><DialogTitle>Create new event</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2"><Label>Title</Label><Input placeholder="Community Food Drive" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea rows={3} placeholder="Tell volunteers what they'll be doing…" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Capacity</Label><Input type="number" placeholder="50" /></div>
          </div>
          <div className="space-y-2"><Label>Location</Label><Input placeholder="Address or venue" /></div>
        </form>
        <DialogFooter>
          <Button variant="outline" className="border-border/60">Cancel</Button>
          <Button className="bg-brand-gradient">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}