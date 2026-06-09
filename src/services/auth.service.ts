import type { Role, User } from "@/types";

export const authService = {
  async login(email: string, _password: string): Promise<User> {
    await delay();
    return { id: "u1", name: "Admin User", email, role: "admin" };
  },
  async signup(name: string, email: string, _password: string, role: Role): Promise<User> {
    await delay();
    return { id: "u1", name, email, role };
  },
  async logout(): Promise<void> {
    await delay();
  },
  async requestPasswordReset(_email: string): Promise<void> {
    await delay();
  },
  async getSession(): Promise<User | null> {
    return null;
  },
};

function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms));
}