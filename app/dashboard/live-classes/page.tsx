"use client";

import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import ClassLinkCard from "@/components/ClassLinkCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Video, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getClassLinks } from "@/lib/api";

// Define the course interface based on your API response
interface ClassLinkCourse {
  course_id: number;
  live_link: string;
  topic: string;
  created_on: string;
  course_title: string;
  subject: string;
  board_type: string;
  start_date: string;
  end_date: string;
  enrollment_id: string;
  enrolled_at: string;
  status: string;
  grade_level?: string;
  instructor_name?: string;
  thumbnail_url?: string;
}

interface ClassLinkResponse {
  result: {
    count: number;
    list: ClassLinkCourse[];
  };
  success: boolean;
}

export default function LiveClassesPage() {
  const [classLinks, setClassLinks] = useState<ClassLinkCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to check if a course is currently live
  const isCourseLive = (course: ClassLinkCourse) => {
    const now = new Date();
    const startDate = new Date(course.start_date);
    const endDate = new Date(course.end_date);
    // for testing, consider the course live if it's active and start date is in the past
    return course.status === "active" && now >= startDate;
  };

  // Function to check if a course is upcoming
  const isCourseUpcoming = (course: ClassLinkCourse) => {
    const now = new Date();
    const startDate = new Date(course.start_date);
    return startDate > now && course.status === "active";
  };

  const fetchClassLink = async () => {
    try {
      setLoading(true);
      setError(null);
      const classLinkData = await getClassLinks();

      if (classLinkData.success) {
        setClassLinks(classLinkData.result.list);
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
    fetchClassLink();
  }, []);

  // Filter courses based on live/upcoming status
  const liveCourses = classLinks.filter(isCourseLive);
  const upcomingCourses = classLinks.filter(isCourseUpcoming);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-64">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading your live classes...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={fetchClassLink} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
            <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
            <p className="text-gray-600">Join your live classes and interactive sessions</p>
          </div>

          {/* Live Now */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Video className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Live Now</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                {liveCourses.length} Active
              </span>
            </div>

            {liveCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {liveCourses.map((course) => (
                  <ClassLinkCard key={course.course_id} course={course} showJoinButton={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-8">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No live classes at the moment</p>
                <p className="text-sm text-gray-500 mt-2">Check back later or view your upcoming classes below</p>
              </div>
            )}
          </div>

          {/* Upcoming Classes */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Classes</h2>
            </div>

            {upcomingCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingCourses.map((course) => (
                  <ClassLinkCard key={course.course_id} course={course} showJoinButton={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming classes scheduled</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
