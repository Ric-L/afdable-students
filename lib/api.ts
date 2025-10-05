import axios, { AxiosError } from "axios";
import { TLoginBody, TQueryParams } from "./types";

// import { store } from "./redux/store";
// import { logOut } from "./redux/features/authSlice";
// import { clearAdminCredentials } from "./components/utils/utils";

export type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://127.0.0.1:8110/api/v1/students";
  // axios.defaults.baseURL = 'http://192.168.1.15:8100/api/v1/admin';
  // axios.defaults.baseURL = 'https://tomthin.in/api/v1/admin';
} else {
  // axios.defaults.baseURL = "https://tomthin.in/api/v1/admin";
  axios.defaults.baseURL = "https://afdableclasses.in/api/v1/students";
}

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

export const setAuthHeader = (token: string) => {
  axios.defaults.headers["Authorization"] = token;
  return true;
};

export const clearAuthHeader = () => {
  axios.defaults.headers["Authorization"] = null;
  return true;
};
export const loginUser = (body: TLoginBody) => _callApi("/login", "post", body);
export const logoutUser = () => _callApi("/logout", "post", "");

export const getProfile = () => _callApi(`/profile`, "get");

export const getEnrolledCourses = () => _callApi(`/courses`, "get");
export const getEnrolledCoursebyID = (id: number) => _callApi(`/courses/${id}`, "get");

export const getClassLinks = () => _callApi(`/classlinks`, "get");

const _callApi = async (url: string, method: Methods = "get", body = {}) => {
  try {
    const response = await axios[method](url, body);
    const { status, data } = response;
    if (status === 401) {
      if (data?.message === "Access Denied") {
        // store.dispatch(logOut());
        // clearAdminCredentials();
        return { success: false, message: "Access Denied" };
      }
      return { success: false };
    }
    if (status === 200 || status === 201) {
      return data;
    }
    return { success: false };
  } catch (error) {
    const err = error as AxiosError;
    return err.response?.data || { success: false, message: "Network Error" };
  }
};
