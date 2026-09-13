"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/types/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (payload: {
    email?: string;
    phone?: string;
    address?: Partial<User["address"]>;
  }) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const session = await api.getSession();
      if (session.data.authenticated && session.data.user) {
        const me = await api.me();
        setUser(me.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login({ email, password });
    setUser(result.data.user);
    return result.data.user;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const result = await api.signup({ name, email, password });
    setUser(result.data.user);
    return result.data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (payload: {
      email?: string;
      phone?: string;
      address?: Partial<User["address"]>;
    }) => {
      const result = await api.updateProfile(payload);
      setUser(result.data.user);
      return result.data.user;
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [user, loading, refreshUser, login, signup, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useAuthOptional() {
  return useContext(AuthContext);
}

export { ApiError };
