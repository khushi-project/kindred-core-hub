import { attendance } from "@/mock-data/attendance";
export const attendanceService = {
  async list() {
    return attendance;
  },
};