"use client";

import { loginUser, signUpUser, setAuthHeader, clearAuthHeader } from "@/lib/api";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// Storage keys constants
const STORAGE_KEYS = {
  USER: "student-portal-user",
  TOKEN: "user_token",
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const storedToken = getStoredToken();

        if (storedUser && storedToken && validateUserData(storedUser)) {
          // Verify token is still valid by making a simple API call
          // or just set the auth header and assume it's valid
          setAuthHeader(storedToken);
          setUser(storedUser);
          setIsAuthenticated(true);
          console.log("User session restored successfully");
        } else {
          // Clear invalid or incomplete stored data
          if (storedUser || storedToken) {
            console.warn("Invalid stored auth data, clearing...");
            clearStoredAuth();
          }
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
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
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

        // Validate the received data
        if (!validateUserData(userData)) {
          console.error("Invalid user data received from server");
          setIsLoading(false);
          return false;
        }

        // Set auth header and update state
        setAuthHeader(userData.token);
        setUser(userData);
        setIsAuthenticated(true);

        // Store in localStorage
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

      // Provide more specific error messages
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

        // Validate the received data
        if (!validateUserData(newUser)) {
          const errorMsg = "Invalid user data received during signup";
          console.error(errorMsg);
          setIsLoading(false);
          return { success: false, message: errorMsg };
        }

        // Set auth header and update state
        setAuthHeader(newUser.token);
        setUser(newUser);
        setIsAuthenticated(true);

        // Store in localStorage
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
    // Clear state
    setUser(null);
    setIsAuthenticated(false);

    // Remove auth header
    clearAuthHeader();

    // Clear storage
    clearStoredAuth();

    console.log("User logged out successfully");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() };
      setUser(updatedUser);

      // Update localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error updating user in localStorage:", error);
      }
    }
  };

  // Optional: Auto-logout on token expiration (if you have expiry info)
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (user?.token) {
        // You can implement token expiry check here if your tokens have expiry
        // For example, decode JWT and check expiry
        // const decoded = jwtDecode(user.token);
        // if (decoded.exp * 1000 < Date.now()) {
        //   logout();
        // }
      }
    };

    // Check every minute
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

// Helper hook for components that require authentication
export const useRequireAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    requireAuth: !isLoading && !isAuthenticated,
  };
};

// "use client";

// import { loginUser, signUpUser, setAuthHeader } from "@/lib/api";
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   full_name: string;
//   phone: string;
//   grade: string;
//   board_type: string;
//   is_active: boolean;
//   last_login: string;
//   created_on: string;
//   updated_at: string;
//   token: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string) => Promise<boolean>;
//   signup: (userData: TStudentSignup) => Promise<{ success: boolean; message?: string }>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored auth on mount
//     const storedUser = localStorage.getItem("student-portal-user");
//     const storedToken = localStorage.getItem("user_token");

//     if (storedUser && storedToken) {
//       const userData = JSON.parse(storedUser);
//       const token = JSON.parse(storedToken);

//       setAuthHeader(token);
//       setUser(userData);
//     }

//     setIsLoading(false);
//   }, []);

//   const login = async (username: string, password: string): Promise<boolean> => {
//     setIsLoading(true);

//     try {
//       const response = await loginUser({ username, password });

//       if (response.success && response.result) {
//         const userData: User = {
//           id: response.result.id,
//           username: response.result.username,
//           email: response.result.email,
//           full_name: response.result.full_name,
//           phone: response.result.phone,
//           grade: response.result.grade,
//           board_type: response.result.board_type,
//           is_active: response.result.is_active,
//           last_login: response.result.last_login,
//           created_on: response.result.created_on,
//           updated_at: response.result.updated_at,
//           token: response.result.token,
//         };

//         // Set auth header with the token
//         setAuthHeader(response.result.token);
//         setUser(userData);

//         // Store both user data and token separately
//         localStorage.setItem("student-portal-user", JSON.stringify(userData));
//         localStorage.setItem("user_token", JSON.stringify(response.result.token));

//         setIsLoading(false);
//         return true;
//       }

//       setIsLoading(false);
//       return false;
//     } catch (error) {
//       console.error("Login error:", error);
//       setIsLoading(false);
//       return false;
//     }
//   };

//   const signup = async (userData: TStudentSignup): Promise<{ success: boolean; message?: string }> => {
//     setIsLoading(true);

//     try {
//       const response = await signUpUser(userData);

//       if (response.success && response.result) {
//         const newUser: User = {
//           id: response.result.id,
//           username: response.result.username,
//           email: response.result.email,
//           full_name: response.result.full_name,
//           phone: response.result.phone,
//           grade: response.result.grade,
//           board_type: response.result.board_type,
//           is_active: response.result.is_active,
//           last_login: response.result.last_login,
//           created_on: response.result.created_on,
//           updated_at: response.result.updated_at,
//           token: response.result.token,
//         };

//         // Set auth header with the token
//         setAuthHeader(response.result.token);
//         setUser(newUser);

//         // Store both user data and token separately
//         localStorage.setItem("student-portal-user", JSON.stringify(newUser));
//         localStorage.setItem("user_token", JSON.stringify(response.result.token));

//         setIsLoading(false);
//         return { success: true };
//       }

//       setIsLoading(false);
//       return {
//         success: false,
//         message: response.message || "Signup failed",
//       };
//     } catch (error: any) {
//       console.error("Signup error:", error);
//       setIsLoading(false);
//       return {
//         success: false,
//         message: error.response?.data?.message || "Signup failed. Please try again.",
//       };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setAuthHeader(""); // Clear the auth header
//     localStorage.removeItem("student-portal-user");
//     localStorage.removeItem("user_token");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         signup,
//         logout,
//         isLoading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // Add the TStudentSignup type definition
// export type TStudentSignup = {
//   username: string;
//   password: string;
//   email: string;
//   full_name?: string;
//   phone?: string;
//   grade?: string;
//   board_type?: string;
// };
