import { events } from "@/mock-data/events";
import type { Event } from "@/types";

export const eventService = {
  async list(): Promise<Event[]> {
    return events;
  },
  async get(id: string) {
    return events.find((e) => e.id === id);
  },
  async create(data: Omit<Event, "id">) {
    return { ...(data as Event), id: crypto.randomUUID() };
  },
};