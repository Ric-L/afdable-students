import axios, { AxiosError } from "axios";
import { TCreateEnrollmentRequest, TEnrollmentRequest, TLoginBody, TQueryParams, TStudentSignup, TUpdateEnrollmentRequest } from "./types";

// import { store } from "./redux/store";
// import { logOut } from "./redux/features/authSlice";
// import { clearAdminCredentials } from "./components/utils/utils";

export type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://127.0.0.1:8110/api/v1/students";

  // axios.defaults.baseURL = 'http://192.168.1.15:8100/api/v1/admin';
  // axios.defaults.baseURL = "https://afdableclasses.in/api/v1/students";
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
// Authentication
export const loginUser = (body: TLoginBody) => _callApi("/login", "post", body);
export const signUpUser = (body: TStudentSignup) => _callApi("/signup", "post", body);
export const logoutUser = () => _callApi("/logout", "post", "");

// Profile
export const getProfile = () => _callApi(`/profile`, "get");

// Class Links
export const getClassLinks = () => _callApi(`/classlinks`, "get");

// Courses
export const getEnrolledCourses = () => _callApi(`/courses`, "get");
export const getEnrolledCoursebyID = (id: number) => _callApi(`/courses/${id}`, "get");
export const getEnrolledCourseByID = (id: number) => _callApi(`/courses/courses/${id}`, "get");

// activecourses := authStudents.Group("/active-courses")
// activecourses.Get("/", handlers.StudentGetActiveCourses) // Get all activecourses
// activecourses.Get("/:id", handlers.StudentGetCourseByID)
// activecourses.Get("/feature-courses", handlers.StudentGetFeaturedCourses)

export const getActiveaCourses = () => _callApi(`/active-courses`, "get");
export const getActiveCoursebyID = (id: number) => _callApi(`/active-courses/${id}`, "get");
export const getActiveFeatureCourseByID = () => _callApi(`/active-courses/feature-courses`, "get");
// Enrollment Requests
export const getEnrollmentRequests = () => _callApi(`/enrollment-requests`, "get");
export const getEnrollmentRequestStats = () => _callApi(`/enrollment-requests/stats`, "get");
export const getEnrollmentRequestById = (id: number) => _callApi(`/enrollment-requests/${id}`, "get");
export const addEnrollmentRequest = (body: TCreateEnrollmentRequest) => _callApi(`/enrollment-requests`, "post", body);
export const updateEnrollmentRequest = (id: number, body: TUpdateEnrollmentRequest) => _callApi(`/enrollment-requests/${id}`, "put", body);
export const cancelEnrollmentRequest = (id: number) => _callApi(`/enrollment-requests/${id}`, "delete");

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
