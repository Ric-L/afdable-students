// types.ts
export type User = {
  id: number;
  username: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
  token: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionId?: number | null; // optional, if you still use it elsewhere
};

export type RootState = {
  auth: AuthState;
};
