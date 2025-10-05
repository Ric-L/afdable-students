"use client";

import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookOpen, Clock, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getEnrolledCourses } from "@/lib/api";

interface EnrolledCourse {
  enrollment_id: string;
  student_id: number;
  course_id: number;
  enrolled_at: string;
  status: string;
  attendance_percentage: number;
  course_title: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEnrolledCourses();

      if (res.success && res.result) {
        setEnrolledCourses(res.result.list);
      } else {
        setError("Failed to fetch enrolled courses");
      }
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      setError("An error occurred while fetching your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Stats calculations
  const activeCourses = enrolledCourses.filter((course) => course.status === "active" && course.attendance_percentage < 100);
  const completedCourses = enrolledCourses.filter((course) => course.attendance_percentage === 100);
  const liveCourses = enrolledCourses.filter((course) => course.is_active);

  const stats = [
    {
      title: "Total Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Active Courses",
      value: activeCourses.length,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: completedCourses.length,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Live Classes",
      value: liveCourses.length,
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
            <p className="text-gray-600">Overview of your learning progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/dashboard/live-classes" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block">
                <Users className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Join Live Classes</h3>
                <p className="text-sm text-gray-600">Access your ongoing live sessions</p>
              </a>

              <a href="/dashboard/course-history" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block">
                <BookOpen className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Course History</h3>
                <p className="text-sm text-gray-600">View all your enrolled courses</p>
              </a>

              <a href="/dashboard/profile" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block">
                <Users className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Update Profile</h3>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
