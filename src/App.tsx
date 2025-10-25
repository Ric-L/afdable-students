import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import AuthPage from "./pages/AuthPage";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentAuth, setCredentials } from "./react-redux/features/authSlice";
import PrivateRoute from "./components/PrivateRoute";
import StudentPage from "./pages/StudentPage";

const App = () => {
  const auth = useSelector(selectCurrentAuth);
  const dispatch = useDispatch();

  // Auto-login from localStorage if auth.user is not set
  useEffect(() => {
    if (!auth.user) {
      const savedData = localStorage.getItem("studentData");
      if (savedData) {
        try {
          const user = JSON.parse(savedData);
          if (user && user.token) {
            dispatch(setCredentials(user));
          }
        } catch (error) {
          console.error("Failed to parse studentData from localStorage:", error);
          localStorage.removeItem("studentData"); // Clean up corrupted data
        }
      }
    }
  }, [dispatch, auth.user]);

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/student/*"
        element={
          <PrivateRoute>
            <StudentPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={auth.user ? "/student" : "/login"} replace />} />
    </Routes>
  );
};

export default App;
