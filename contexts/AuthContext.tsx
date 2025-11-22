"use client";

import { loginUser, signUpUser, setAuthHeader, clearAuthHeader } from "@/lib/api";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
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

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: TStudentSignup) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

export type TStudentSignup = {
  username: string;
  password: string;
  email: string;
  full_name?: string;
  phone?: string;
  grade?: string;
  board_type?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "student-portal-user",
  TOKEN: "user_token",
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Helper functions for localStorage operations
  const getStoredUser = (): User | null => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error reading stored user:", error);
      return null;
    }
  };

  const getStoredToken = (): string | null => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      return storedToken ? JSON.parse(storedToken) : null;
    } catch (error) {
      console.error("Error reading stored token:", error);
      return null;
    }
  };

  const setStoredAuth = (userData: User, token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));
    } catch (error) {
      console.error("Error storing auth data:", error);
      throw new Error("Failed to save authentication data");
    }
  };

  const clearStoredAuth = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  const validateUserData = (userData: any): userData is User => {
    return userData && typeof userData === "object" && userData.id && userData.token && userData.username;
  };

  // Verify token with the server
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // Replace with your actual API endpoint to verify token
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = getStoredUser();
        const storedToken = getStoredToken();

        if (storedUser && storedToken && validateUserData(storedUser)) {
          // Verify token validity with the server
          const isTokenValid = await verifyToken(storedToken);
          if (isTokenValid) {
            setAuthHeader(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);
            console.log("User session restored successfully");
          } else {
            console.warn("Stored token is invalid or expired, clearing...");
            clearStoredAuth();
            clearAuthHeader();
            setUser(null);
            setIsAuthenticated(false);
            router.push("/login"); // Redirect to login if token is invalid
          }
        } else {
          console.warn("No valid stored auth data found, clearing...");
          clearStoredAuth();
          clearAuthHeader();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearStoredAuth();
        clearAuthHeader();
        setUser(null);
        setIsAuthenticated(false);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

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

        if (!validateUserData(userData)) {
          console.error("Invalid user data received from server");
          setIsLoading(false);
          return false;
        }

        setAuthHeader(userData.token);
        setUser(userData);
        setIsAuthenticated(true);
        setStoredAuth(userData, userData.token);
        setIsLoading(false);
        return true;
      } else {
        console.error("Login failed:", response.message);
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (!navigator.onLine) {
        errorMessage = "Network error. Please check your connection.";
      }
      console.error("Login error details:", errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: TStudentSignup): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await signUpUser(userData);
      if (response.success && response.result) {
        const newUser: User = {
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

        if (!validateUserData(newUser)) {
          const errorMsg = "Invalid user data received during signup";
          console.error(errorMsg);
          setIsLoading(false);
          return { success: false, message: errorMsg };
        }

        setAuthHeader(newUser.token);
        setUser(newUser);
        setIsAuthenticated(true);
        setStoredAuth(newUser, newUser.token);
        setIsLoading(false);
        return { success: true };
      } else {
        const errorMsg = response.message || "Signup failed. Please try again.";
        console.error("Signup failed:", errorMsg);
        setIsLoading(false);
        return { success: false, message: errorMsg };
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Signup failed. Please try again.";
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid data provided";
      } else if (error.response?.status === 409) {
        errorMessage = "Username or email already exists";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (!navigator.onLine) {
        errorMessage = "Network error. Please check your connection.";
      }
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearAuthHeader();
    clearStoredAuth();
    console.log("User logged out successfully");
    router.push("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error updating user in localStorage:", error);
      }
    }
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (user?.token) {
        // Implement token expiry check if your tokens have expiry
        // Example: Decode JWT and check expiry
        // const decoded = jwtDecode(user.token);
        // if (decoded.exp * 1000 < Date.now()) {
        //   logout();
        // }
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useRequireAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  return {
    user,
    isAuthenticated,
    isLoading,
    requireAuth: !isLoading && !isAuthenticated,
  };
};
