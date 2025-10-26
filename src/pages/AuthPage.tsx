import React, { useState } from "react";
import { Box, Container, Typography, Tabs, Tab, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton, Card, CardContent, MenuItem } from "@mui/material";
import { School, Visibility, VisibilityOff, Warning, Book, People, EmojiEvents, AutoAwesome } from "@mui/icons-material";
import { loginUser, signUpUser } from "../api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../react-redux/features/authSlice";

export type TStudentSignup = {
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  grade: string;
  board_type: string;
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
    grade: "",
    board_type: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Common validation for both login and signup
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Signup specific validation
    if (activeTab === "signup") {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }

      if (!formData.full_name.trim()) {
        errors.full_name = "Full name is required";
      } else if (formData.full_name.length < 2) {
        errors.full_name = "Full name must be at least 2 characters";
      }

      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        errors.phone = "Please enter a valid 10-digit phone number";
      }

      if (!formData.grade) {
        errors.grade = "Grade is required";
      } else if (!["9", "10"].includes(formData.grade)) {
        errors.grade = "Grade must be either 9 or 10";
      }

      if (!formData.board_type) {
        errors.board_type = "Board type is required";
      } else if (!["CBSE", "COHSEM"].includes(formData.board_type)) {
        errors.board_type = "Board type must be either CBSE or COHSEM";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      full_name: "",
      phone: "",
      grade: "",
      board_type: "",
    });
    setError("");
    setFieldErrors({});
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form before submission
    if (!validateForm()) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (activeTab === "login") {
        response = await loginUser({
          username: formData.username,
          password: formData.password,
        });
        console.log("Login Response:", response);
      } else {
        const signupData: TStudentSignup = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          grade: formData.grade,
          board_type: formData.board_type,
        };
        response = await signUpUser(signupData);
        console.log("Signup Response:", response);
      }

      if (response?.success && response.result) {
        const userData = {
          id: response.result.id,
          username: response.result.username,
          fullname: response.result.full_name || "",
          address: "", // not in API response
          phone: response.result.phone || "",
          email: response.result.email,
          token: response.result.token,
        };

        // 1️⃣ Store in Redux
        dispatch(setCredentials(userData));

        // 2️⃣ Store in localStorage
        localStorage.setItem("studentData", JSON.stringify(userData));

        // 3️⃣ Redirect
        window.location.href = "/dashboard";
      } else {
        setError("Invalid credentials or failed to authenticate.");
      }
    } catch (err) {
      const error = err as Error;
      console.error("Auth Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #f3e5f5, #e3f2fd, #e0f7fa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
        px: { xs: 2, sm: 3, lg: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating shapes */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Box
          sx={{
            position: "absolute",
            top: "-6rem",
            right: "-6rem",
            width: "24rem",
            height: "24rem",
            bgcolor: "rgba(156, 39, 176, 0.2)",
            borderRadius: "50%",
            filter: "blur(48px)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-8rem",
            left: "-8rem",
            width: "20rem",
            height: "20rem",
            bgcolor: "rgba(0, 150, 136, 0.2)",
            borderRadius: "50%",
            filter: "blur(48px)",
            animation: "float 8s ease-in-out infinite 2s",
          }}
        />
        <School
          sx={{
            position: "absolute",
            top: "5rem",
            right: "25%",
            width: "2rem",
            height: "2rem",
            color: "rgba(156, 39, 176, 0.3)",
            animation: "float 7s ease-in-out infinite",
          }}
        />
        <EmojiEvents
          sx={{
            position: "absolute",
            bottom: "8rem",
            right: "33%",
            width: "2.5rem",
            height: "2.5rem",
            color: "rgba(0, 150, 136, 0.3)",
            animation: "float 9s ease-in-out infinite 3s",
          }}
        />
      </Box>

      <Container maxWidth="sm" sx={{ zIndex: 10 }}>
        <Box textAlign="center" mb={4}>
          <Box display="flex" justifyContent="center">
            <Box
              sx={{
                p: 2,
                bgcolor: "linear-gradient(135deg, #8e24aa, #0288d1, #009688)",
                borderRadius: 3,
                boxShadow: 3,
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s",
                },
              }}
            >
              <School sx={{ fontSize: 56, color: "white" }} />
              <AutoAwesome
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  fontSize: 20,
                  color: "#fbc02d",
                  animation: "pulse 2s infinite",
                }}
              />
            </Box>
          </Box>
          <Typography
            variant="h3"
            sx={{
              mt: 3,
              fontWeight: "bold",
              background: "linear-gradient(to right, #8e24aa, #0288d1, #009688)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Afdable Classes
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {activeTab === "login" ? "Sign in to your student account" : "Create your student account"}
          </Typography>
        </Box>

        <Card
          sx={{
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => {
              setActiveTab(val);
              resetForm();
            }}
            centered
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Login" value="login" />
            <Tab label="Sign Up" value="signup" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Warning fontSize="small" /> {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
              fullWidth
              disabled={isLoading}
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
            />

            {activeTab === "signup" && (
              <>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />

                <TextField
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                  error={!!fieldErrors.full_name}
                  helperText={fieldErrors.full_name}
                />

                <TextField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                  error={!!fieldErrors.phone}
                  helperText={fieldErrors.phone}
                  placeholder="10-digit phone number"
                />

                <TextField
                  select
                  label="Grade"
                  value={formData.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                  error={!!fieldErrors.grade}
                  helperText={fieldErrors.grade}
                >
                  <MenuItem value="9">Grade 9</MenuItem>
                  <MenuItem value="10">Grade 10</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Board Type"
                  value={formData.board_type}
                  onChange={(e) => handleChange("board_type", e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                  error={!!fieldErrors.board_type}
                  helperText={fieldErrors.board_type}
                >
                  <MenuItem value="CBSE">CBSE</MenuItem>
                  <MenuItem value="COHSEM">COHSEM</MenuItem>
                </TextField>
              </>
            )}

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              fullWidth
              disabled={isLoading}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={isLoading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                bgcolor: "linear-gradient(135deg, #8e24aa, #0288d1, #009688)",
                "&:hover": { transform: "scale(1.02)" },
                transition: "all 0.2s",
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : activeTab === "login" ? "Sign In" : "Create Account"}
            </Button>
          </Box>
        </Card>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            textAlign: "center",
          }}
        >
          <Card
            sx={{
              flex: 1,
              mx: 1,
              bgcolor: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Book sx={{ fontSize: 24, color: "primary.main", mb: 1 }} />
              <Typography variant="caption">Learn</Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              mx: 1,
              bgcolor: "rgba(255,255,255,0.7)",
              textAlign: "center",
            }}
          >
            <CardContent>
              <People sx={{ fontSize: 24, color: "info.main", mb: 1 }} />
              <Typography variant="caption">Connect</Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              mx: 1,
              bgcolor: "rgba(255,255,255,0.7)",
              textAlign: "center",
            }}
          >
            <CardContent>
              <EmojiEvents sx={{ fontSize: 24, color: "success.main", mb: 1 }} />
              <Typography variant="caption">Achieve</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
}
