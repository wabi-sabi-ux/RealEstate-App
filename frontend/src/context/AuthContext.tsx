import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import type { LoginResponse, User } from "../types";

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  hasRole: (role: string) => boolean;
};

type RegisterPayload =
  | {
      role: "BROKER";
      name: string;
      email: string;
      password: string;
      city?: string;
      mobile?: string;
    }
  | {
      role: "CUSTOMER";
      name: string;
      email: string;
      password: string;
      city?: string;
      mobile?: string;
    };

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore session on refresh
  useEffect(() => {
    const cachedUser = sessionStorage.getItem("auth:user");
    if (cachedUser) setUser(JSON.parse(cachedUser));
  }, []);

  const login = async (email: string, password: string) => {
    // Store credentials in sessionStorage for api interceptor
    sessionStorage.setItem("auth:email", email);
    sessionStorage.setItem("auth:password", password);

    try {
      // Backend login endpoint returns the User object on success
      const res = await api.post<LoginResponse>("/api/users/login", null, {
        params: { email, password },
      });

      setUser(res.data);
      sessionStorage.setItem("auth:user", JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      // If login fails, don’t keep bad creds lying around
      sessionStorage.removeItem("auth:email");
      sessionStorage.removeItem("auth:password");
      throw e;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const endpoint =
        payload.role === "BROKER"
          ? "/api/auth/register/broker"
          : "/api/auth/register/customer";

      const body =
        payload.role === "BROKER"
          ? {
              brokerName: payload.name,
              email: payload.email,
              password: payload.password,
              city: payload.city,
              mobile: payload.mobile,
            }
          : {
              customerName: payload.name,
              email: payload.email,
              password: payload.password,
              city: payload.city,
              mobile: payload.mobile,
            };

      await api.post(endpoint, body);
      return await login(payload.email, payload.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("auth:email");
    sessionStorage.removeItem("auth:password");
    setUser(null);
  };

  const hasRole = (role: string) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
