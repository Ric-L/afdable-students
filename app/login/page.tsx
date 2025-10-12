"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Eye, EyeOff, AlertCircle, BookOpen, Users, Award, Sparkles } from "lucide-react";
import Link from "next/link";

export type TStudentSignup = {
  username: string;
  password: string;
  email: string;
  full_name?: string;
  phone?: string;
  grade?: string;
  board_type?: string;
};

export default function AuthPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Common fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Signup specific fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [boardType, setBoardType] = useState("");

  const { user, login, signup, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const signupData: TStudentSignup = {
        username,
        password,
        email,
        full_name: fullName || undefined,
        phone: phone || undefined,
        grade: grade || undefined,
        board_type: boardType || undefined,
      };

      const success = await signup(signupData);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (activeTab === "login") {
      return handleLogin(e);
    } else {
      return handleSignup(e);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setFullName("");
    setPhone("");
    setGrade("");
    setBoardType("");
    setError("");
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Redirect is happening
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating shapes animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large circle - top right */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float"></div>

        {/* Medium circle - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl animate-float-delayed"></div>

        {/* Small circle - top left */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-pulse-slow"></div>

        {/* Decorative icons floating */}
        <div className="absolute top-20 right-1/4 animate-float-slow">
          <BookOpen className="w-8 h-8 text-purple-300/40" />
        </div>
        <div className="absolute bottom-32 right-1/3 animate-float-delayed">
          <Award className="w-10 h-10 text-teal-300/40" />
        </div>
        <div className="absolute top-1/3 left-1/4 animate-float">
          <Users className="w-6 h-6 text-blue-300/40" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-pulse-slow">
          <Sparkles className="w-7 h-7 text-purple-300/40" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative">
              {/* Main logo with gradient background */}
              <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <GraduationCap className="h-14 w-14 text-white" />
              </div>
              {/* Sparkle accent */}
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">Afdable Classes</h1>
          <p className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-500" />
            {activeTab === "login" ? "Sign in to your student account" : "Create your student account"}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-100/50">
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                resetForm();
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === "login" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                resetForm();
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === "signup" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            {activeTab === "signup" && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="Enter your full name (optional)"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3" disabled={isLoading}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Additional Signup Fields */}
            {activeTab === "signup" && (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="Enter your phone number (optional)"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <option value="">Select Grade</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="boardType" className="block text-sm font-medium text-gray-700 mb-2">
                      Board Type
                    </label>
                    <select
                      id="boardType"
                      value={boardType}
                      onChange={(e) => setBoardType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IGCSE">IGCSE</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-medium"
            >
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : activeTab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <Link href="/support" className="text-purple-600 hover:text-purple-500 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-100/50">
            <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-medium">Learn</p>
          </div>
          <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-100/50">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-medium">Connect</p>
          </div>
          <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-teal-100/50">
            <Award className="w-6 h-6 text-teal-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-medium">Achieve</p>
          </div>
        </div>
      </div>
    </div>
  );
}
