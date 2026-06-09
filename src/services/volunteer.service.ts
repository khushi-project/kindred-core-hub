import { volunteers } from "@/mock-data/volunteers";
import type { Volunteer } from "@/types";

export const volunteerService = {
  async list(): Promise<Volunteer[]> {
    return volunteers;
  },
  async get(id: string) {
    return volunteers.find((v) => v.id === id);
  },
  async create(data: Omit<Volunteer, "id">): Promise<Volunteer> {
    return { ...(data as Volunteer), id: crypto.randomUUID() };
  },
  async update(_id: string, _data: Partial<Volunteer>): Promise<void> {},
  async remove(_id: string): Promise<void> {},
};