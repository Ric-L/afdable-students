import {
  loginUser,
  signUpUser,
  logoutUser,
  getProfile,
  getClassLinks,
  getEnrolledCourses,
  getEnrolledCoursebyID,
  getActiveaCourses,
  getActiveCoursebyID,
  getActiveFeatureCourseByID,
  getEnrollmentRequests,
  getEnrollmentRequestStats,
  getEnrollmentRequestById,
  addEnrollmentRequest,
  updateEnrollmentRequest,
  cancelEnrollmentRequest,
} from "../api";
import { keys } from "./keys";

export const queryConfig = {
  // Authentication
  useGetProfile: { queryFn: getProfile, queryKeys: [keys.profile] },

  // Class Links
  useGetClassLinks: { queryFn: getClassLinks, queryKeys: [keys.classLinks] },

  // Enrolled Courses
  useGetEnrolledCourses: { queryFn: getEnrolledCourses, queryKeys: [keys.enrolledCourses] },
  useGetEnrolledCourseByID: { queryFn: getEnrolledCoursebyID, queryKeys: [keys.enrolledCourse] },

  // Active Courses
  useGetActiveCourses: { queryFn: getActiveaCourses, queryKeys: [keys.activeCourses] },
  useGetActiveCourseByID: { queryFn: getActiveCoursebyID, queryKeys: [keys.activeCourse] },
  useGetActiveFeatureCourse: { queryFn: getActiveFeatureCourseByID, queryKeys: [keys.activeFeatureCourse] },

  // Enrollment Requests
  useGetEnrollmentRequests: { queryFn: getEnrollmentRequests, queryKeys: [keys.enrollmentRequests] },
  useGetEnrollmentRequestByID: { queryFn: getEnrollmentRequestById, queryKeys: [keys.enrollmentRequest] },
  useGetEnrollmentRequestStats: { queryFn: getEnrollmentRequestStats, queryKeys: [keys.enrollmentRequestStats] },
};

export const mutationConfig = {
  // Authentication
  useLoginUser: { mutationFn: loginUser, queryKey: [keys.auth] },
  useSignUpUser: { mutationFn: signUpUser, queryKey: [keys.auth] },
  useLogoutUser: { mutationFn: logoutUser, queryKey: [keys.auth] },

  // Enrollment Requests
  useAddEnrollmentRequest: { mutationFn: addEnrollmentRequest, queryKey: [keys.enrollmentRequests] },
  useUpdateEnrollmentRequest: { mutationFn: updateEnrollmentRequest, queryKey: [keys.enrollmentRequest] },
  useCancelEnrollmentRequest: { mutationFn: cancelEnrollmentRequest, queryKey: [keys.enrollmentRequest] },
};
