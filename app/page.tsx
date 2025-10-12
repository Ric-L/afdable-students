"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth loading timeout - redirecting to login");
        router.push("/login");
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeoutId);
  }, [isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading...</p>
        <p className="text-sm text-gray-500">{isLoading ? "Checking authentication..." : "Redirecting..."}</p>
      </div>
    </div>
  );
}
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext";

// export default function HomePage() {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     // Only run the redirection logic when loading is complete
//     if (!isLoading) {
//       // Check if user is authenticated
//       const storedUser = localStorage.getItem("student-portal-user");
//       const storedToken = localStorage.getItem("user_token");

//       // If we have a user in context OR stored data, redirect to dashboard
//       if (user || (storedUser && storedToken)) {
//         router.push("/dashboard");
//       } else {
//         // No user data found, redirect to login
//         router.push("/login");
//       }
//     }
//   }, [user, isLoading, router]);

//   // Optional: Add a timeout fallback in case of infinite loading
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (isLoading) {
//         console.warn("Auth loading timeout - forcing redirect to login");
//         router.push("/login");
//       }
//     }, 10000); // 10 second timeout

//     return () => clearTimeout(timeoutId);
//   }, [isLoading, router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="flex flex-col items-center space-y-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         <p className="text-gray-600">Loading...</p>
//         {isLoading && <p className="text-sm text-gray-500">Checking authentication...</p>}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';

// export default function HomePage() {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading) {
//       if (user) {
//         router.push('/dashboard');
//       } else {
//         router.push('/login');
//       }
//     }
//   }, [user, isLoading, router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="flex flex-col items-center space-y-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         <p className="text-gray-600">Loading...</p>
//       </div>
//     </div>
//   );
// }
