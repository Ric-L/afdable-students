"use client";

import DashboardLayout from "@/components/DashboardLayout";

import React, { useEffect, useState } from "react";

import { BookOpen, Users, Star, Calendar } from "lucide-react";
import { getActiveaCourses, getActiveFeatureCourseByID } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Define the types based on the Go struct
export type TCourse = {
  id: number | null;
  title: string | null;
  description: string | null;
  subject: string | null;
  board_type: string | null;
  grade_level: string | null;
  start_date: string | null;
  end_date: string | null;
  current_students: number | null;
  price: number | null;
  instructor_name: string | null;
  thumbnail_url: string | null;
  is_active: boolean | null;
  class_time: string | null;
  live_link: string | null;
  last_link_update: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TActiveCoursesResponse = {
  success: boolean;
  result?: {
    list: TCourse[];
    total: number;
    offset: number;
    limit: number;
  };
  error?: string;
  message?: string;
};

const ActiveCoursesPage = () => {
  const [activeCourses, setActiveCourses] = useState<TCourse[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<TCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "featured">("all");

  const fetchActiveCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData: TActiveCoursesResponse = await getActiveaCourses();

      if (coursesData.success && coursesData.result) {
        setActiveCourses(coursesData.result.list);
      } else {
        setError(coursesData.error || "Failed to fetch active courses");
      }
    } catch (error) {
      console.error("Error fetching active courses:", error);
      setError("An error occurred while fetching active courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCourses = async () => {
    try {
      const featuredData: TActiveCoursesResponse = await getActiveFeatureCourseByID();
      if (featuredData.success && featuredData.result) {
        setFeaturedCourses(featuredData.result.list);
      }
    } catch (error) {
      console.error("Error fetching featured courses:", error);
    }
  };

  useEffect(() => {
    fetchActiveCourses();
    fetchFeaturedCourses();
  }, []);

  // Calculate stats based on the actual data
  const mathCourses = activeCourses.filter((course) => course.subject?.toLowerCase().includes("math"));
  const scienceCourses = activeCourses.filter((course) => course.subject?.toLowerCase().includes("science"));
  const cbseCourses = activeCourses.filter((course) => course.board_type === "CBSE");
  const icseCourses = activeCourses.filter((course) => course.board_type === "ICSE");

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

  if (error && activeCourses.length === 0) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Active Courses</h1>
              <p className="text-gray-600">Browse and explore all available courses</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={fetchActiveCourses} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "Free";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSubjectColor = (subject: string | null) => {
    const colors: { [key: string]: string } = {
      mathematics: "bg-blue-100 text-blue-800",
      science: "bg-green-100 text-green-800",
      physics: "bg-purple-100 text-purple-800",
      chemistry: "bg-orange-100 text-orange-800",
      biology: "bg-pink-100 text-pink-800",
      english: "bg-red-100 text-red-800",
      hindi: "bg-yellow-100 text-yellow-800",
      social: "bg-indigo-100 text-indigo-800",
    };

    const subjectKey = subject?.toLowerCase() || "default";
    return colors[subjectKey] || "bg-gray-100 text-gray-800";
  };

  const CourseCard = ({ course }: { course: TCourse }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* {course.thumbnail_url && <img src={course.thumbnail_url} alt={course.title || "Course"} className="w-full h-48 object-cover" />} */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(course.subject)}`}>{course.subject || "General"}</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(course.price)}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description || "No description available"}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Instructor</span>
            <span className="font-medium">{course.instructor_name || "TBA"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Board</span>
            <span className="font-medium">{course.board_type || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Grade</span>
            <span className="font-medium">{course.grade_level || "All"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Students</span>
            <span className="font-medium">{course.current_students || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Starts</span>
            <span className="font-medium">{formatDate(course.start_date)}</span>
          </div>
        </div>

        {course.class_time && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Class Time: {course.class_time}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Courses</h1>
            <p className="text-gray-600">Browse and explore all available courses</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCourses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Math Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{mathCourses.length}</p>
                </div>
                <div className="bg-blue-500 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Science Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{scienceCourses.length}</p>
                </div>
                <div className="bg-green-500 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">CBSE Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{cbseCourses.length}</p>
                </div>
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Courses ({activeCourses.length})
              </button>
              <button
                onClick={() => setActiveTab("featured")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "featured" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Star className="h-4 w-4 inline mr-1" />
                Featured ({featuredCourses.length})
              </button>
            </nav>
          </div>

          {/* Course List */}
          <div>
            {activeTab === "all" ? (
              activeCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active courses found</p>
                </div>
              )
            ) : featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No featured courses available</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ActiveCoursesPage;
