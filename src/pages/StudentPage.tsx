import { Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentAuth, setCredentials } from "../react-redux/features/authSlice";
import Sidebar from "../components/Sidebar";
import ActiveCourses from "./StudentPages/ActiveCourses";
import CourseHistory from "./StudentPages/CourseHistory";

import EnrollmentRequest from "./StudentPages/EnrollmentRequest";
import LiveClasses from "./StudentPages/LiveClasses";
import Profile from "./StudentPages/Profile";
import Dashboard from "./StudentPages/Dashboard";
import { useEffect } from "react";

const StudentPage = () => {
  const auth = useSelector(selectCurrentAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth and attempt to restore from localStorage
  useEffect(() => {
    if (!auth.user) {
      const savedData = localStorage.getItem("studentData");
      if (savedData) {
        try {
          const user = JSON.parse(savedData);
          if (user && user.token) {
            dispatch(setCredentials(user)); // Restore session
            return; // Allow access to StudentPage if credentials are set
          }
        } catch (error) {
          console.error("Failed to parse studentData from localStorage:", error);
          localStorage.removeItem("studentData"); // Clean up corrupted data
        }
      }
      // Redirect unauthenticated users to login
      console.warn("Unauthenticated user attempted to access StudentPage");
      navigate("/login", {
        state: { from: location, error: "Please login to access student portal" },
        replace: true,
      });
    }
  }, [auth.user, dispatch, navigate, location]);

  // Render only if authenticated
  if (!auth.user) {
    return null; // Prevent rendering until redirect occurs
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3, marginLeft: { xs: 0, md: "16rem" }, minHeight: "100vh", mt: 8 }}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="active-courses" element={<ActiveCourses />} />
          <Route path="course-history" element={<CourseHistory />} />
          {/* <Route path="enrolled-courses" element={<EnrolledCourses />} /> */}
          <Route path="enrollment-request" element={<EnrollmentRequest />} />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
        <Outlet />
      </Box>
    </Box>
  );
};

export default StudentPage;
