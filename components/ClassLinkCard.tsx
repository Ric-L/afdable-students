"use client";

import { Clock, User, Calendar, Play, BookOpen, Target, School, ExternalLink } from "lucide-react";

export interface ClassLinkCourse {
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

interface ClassLinkCardProps {
  course: ClassLinkCourse;
  showJoinButton?: boolean;
}

export default function ClassLinkCard({ course, showJoinButton = false }: ClassLinkCardProps) {
  const handleJoinClass = () => {
    if (course.live_link) {
      window.open(course.live_link, "_blank");
    } else {
      alert("No live link available for this class");
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate course duration
  const getCourseDuration = () => {
    const start = new Date(course.start_date);
    const end = new Date(course.end_date);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${months} month${months !== 1 ? "s" : ""}`;
  };

  // Format schedule based on course dates
  const getSchedule = () => {
    return `${formatDate(course.start_date)} - ${formatDate(course.end_date)}`;
  };

  // Check if course is currently active (live)
  const isCourseLive = () => {
    const now = new Date();
    const start = new Date(course.start_date);
    const end = new Date(course.end_date);
    return now >= start && now <= end && course.status === "active";
  };

  // Check if course is upcoming
  const isCourseUpcoming = () => {
    const now = new Date();
    const start = new Date(course.start_date);
    return start > now && course.status === "active";
  };

  // Check if course has ended
  const isCourseEnded = () => {
    const now = new Date();
    const end = new Date(course.end_date);
    return end < now || course.status !== "active";
  };

  // Get status badge color
  const getStatusColor = () => {
    if (isCourseLive()) {
      return "bg-green-100 text-green-800";
    } else if (isCourseUpcoming()) {
      return "bg-blue-100 text-blue-800";
    } else if (isCourseEnded()) {
      return "bg-gray-100 text-gray-800";
    }

    switch (course.status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = () => {
    if (isCourseLive()) return "Live Now";
    if (isCourseUpcoming()) return "Upcoming";
    if (isCourseEnded()) return "Completed";
    return course.status.charAt(0).toUpperCase() + course.status.slice(1);
  };

  // Get button text based on course status
  const getButtonText = () => {
    if (isCourseLive()) return "Join Class";
    if (isCourseUpcoming()) return "Starts Soon";
    if (isCourseEnded()) return "Class Ended";
    return "View Details";
  };

  // Check if button should be disabled
  const isButtonDisabled = () => {
    return !isCourseLive() || !course.live_link;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.course_title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User className="h-4 w-4 mr-2" />
            <span>{course.instructor_name || "Instructor"}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {isCourseLive() && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
              Live
            </span>
          )}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
      </div>

      {/* Topic Section */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-900 mb-2">Current Topic</h4>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">{course.topic}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <School className="h-4 w-4 mr-2" />
          <span>
            {course.subject} • {course.board_type}
          </span>
        </div>

        {course.grade_level && (
          <div className="flex items-center text-sm text-gray-600">
            <Target className="h-4 w-4 mr-2" />
            <span>Grade {course.grade_level}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{getSchedule()}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Duration: {getCourseDuration()}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Enrolled: {formatDate(course.enrolled_at)}</span>
        </div>
      </div>

      {/* Live Link Preview */}
      {/* {course.live_link && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium truncate mr-2">Live Class Link</span>
            <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0" />
          </div>
          <p className="text-xs text-blue-600 truncate mt-1">{course.live_link}</p>
        </div>
      )} */}

      <div className="flex items-center justify-between mt-4">
        {showJoinButton && (
          <button
            onClick={handleJoinClass}
            disabled={isButtonDisabled()}
            className={`py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
              isCourseLive() ? "bg-green-600 text-white hover:bg-green-700" : isCourseUpcoming() ? "bg-blue-100 text-blue-700 cursor-not-allowed" : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isCourseLive() ? <Play className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            <span>{getButtonText()}</span>
          </button>
        )}
      </div>
    </div>
  );
}
