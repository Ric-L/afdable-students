import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { setAuthHeader, clearAuthHeader } from "../../api"; // Import from your API file
import type { RootState } from "../types";

type User = {
  id: number;
  username: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
  token: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
};

const getInitialState = (): AuthState => {
  const savedData = localStorage.getItem("studentData");
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      if (parsedData && parsedData.token) {
        setAuthHeader(parsedData.token); // Set header on initial load too
        return { user: parsedData, token: parsedData.token };
      }
    } catch (error) {
      console.error("Failed to parse studentData from localStorage:", error);
      localStorage.removeItem("studentData");
    }
  }
  return { user: null, token: null };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.token = action.payload.token;
      setAuthHeader(action.payload.token);
      localStorage.setItem("studentData", JSON.stringify(action.payload));
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      clearAuthHeader();
      localStorage.removeItem("studentData");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentAuth = (state: RootState) => state.auth;
