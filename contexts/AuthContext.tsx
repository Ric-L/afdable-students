"use client";

import { loginUser, setAuthHeader } from "@/lib/api";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  grade: string;
  board_type: string;
  is_active: boolean;
  last_login: string;
  created_on: string;
  updated_at: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("student-portal-user");
    const storedToken = localStorage.getItem("user_token");

    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      const token = JSON.parse(storedToken);

      setAuthHeader(token);
      setUser(userData);
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await loginUser({ username, password });

      if (response.success && response.result) {
        const userData: User = {
          id: response.result.id,
          username: response.result.username,
          email: response.result.email,
          full_name: response.result.full_name,
          phone: response.result.phone,
          grade: response.result.grade,
          board_type: response.result.board_type,
          is_active: response.result.is_active,
          last_login: response.result.last_login,
          created_on: response.result.created_on,
          updated_at: response.result.updated_at,
          token: response.result.token,
        };

        // Set auth header with the token
        setAuthHeader(response.result.token);
        setUser(userData);

        // Store both user data and token separately
        localStorage.setItem("student-portal-user", JSON.stringify(userData));
        localStorage.setItem("user_token", JSON.stringify(response.result.token));

        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthHeader(""); // Clear the auth header
    localStorage.removeItem("student-portal-user");
    localStorage.removeItem("user_token");
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
