"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Eye, EyeOff, AlertCircle, BookOpen, Users, Award, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
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
            Sign in to your student account
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-100/50">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-medium"
            >
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Sign In"}
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

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext";
// import { GraduationCap, Eye, EyeOff, CircleAlert as AlertCircle } from "lucide-react";
// import Link from "next/link";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { user, login, isLoading: authLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       router.push("/dashboard");
//     }
//   }, [user, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const success = await login(username, password);
//       if (success) {
//         router.push("/dashboard");
//       } else {
//         setError("Invalid username or password");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("An error occurred during login. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Show loading state while checking authentication
//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (user) {
//     return null; // Redirect is happening
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="flex justify-center">
//             <div className="bg-blue-600 p-3 rounded-full">
//               <GraduationCap className="h-12 w-12 text-white" />
//             </div>
//           </div>
//           <h1 className="mt-6 text-3xl font-bold text-gray-900">Afdable Classes</h1>
//           <p className="mt-2 text-sm text-gray-600">Sign in to your student account</p>
//         </div>

//         <div className="bg-white p-8 rounded-xl shadow-lg">
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               <span className="text-red-700 text-sm">{error}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <input
//                 id="username"
//                 type="text"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 placeholder="Enter your username"
//                 disabled={isLoading}
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="Enter your password"
//                   disabled={isLoading}
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3" disabled={isLoading}>
//                   {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
//             >
//               {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Sign In"}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Need help?{" "}
//               <Link href="/support" className="text-blue-600 hover:text-blue-500 font-medium">
//                 Contact Support
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
