import { notifications } from "@/mock-data/notifications";
export const notificationService = {
  async list() {
    return notifications;
  },
};