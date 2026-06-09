import { useCallback, useState } from "react";
import type { Role, User } from "@/types";
import { authService } from "@/services/auth.service";

/**
 * Placeholder auth hook. Wire to Convex later.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await authService.login(email, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: Role) => {
    setLoading(true);
    try {
      const u = await authService.signup(name, email, password, role);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout };
}