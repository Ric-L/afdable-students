"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";

import { BookOpen } from "lucide-react";
import { getEnrolledCourses } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Define the course type based on your API response
interface EnrolledCourse {
  enrollment_id: string;
  student_id: number;
  course_id: number;
  enrolled_at: string;
  status: string;
  attendance_percentage: number;
  course_title: string;
  course_description?: string;
  subject: string;
  board_type: string;
  grade_level?: string;
  start_date: string;
  end_date: string;
  current_students: number;
  price: number;
  instructor_name?: string;
  thumbnail_url?: string;
  is_active: boolean;
  course_created_at: string;
  course_updated_at: string;
}

export default function CourseHistoryPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEnrolledCourses();

      if (res.success) {
        setEnrolledCourses(res.result.list);
      } else {
        setError("Failed to fetch enrolled courses");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setError("An error occurred while fetching your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Calculate stats based on the actual data
  const activeCourses = enrolledCourses.filter((course) => course.status === "active" && course.attendance_percentage < 100);
  const completedCourses = enrolledCourses.filter((course) => course.attendance_percentage === 100);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error && enrolledCourses.length === 0) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course History</h1>
              <p className="text-gray-600">View and manage all your enrolled courses</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={fetchEnrolledCourses} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course History</h1>
            <p className="text-gray-600">View and manage all your enrolled courses</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCourses.length}</p>
                </div>
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedCourses.length}</p>
                </div>
                <div className="bg-green-500 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Course List */}
          <div>
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.enrollment_id} course={course} showProgress={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No courses enrolled yet</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
