import { tasks } from "@/mock-data/tasks";
export const taskService = {
  async list() {
    return tasks;
  },
};