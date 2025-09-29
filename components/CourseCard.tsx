'use client';

import { Clock, User, Calendar, Play, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  duration: string;
  isLive?: boolean;
  progress?: number;
  enrolledDate: string;
}

interface CourseCardProps {
  course: Course;
  showJoinButton?: boolean;
  showProgress?: boolean;
}

export default function CourseCard({ course, showJoinButton = false, showProgress = false }: CourseCardProps) {
  const handleJoinClass = () => {
    // In a real application, this would open the video conference
    alert(`Joining ${course.name} class...`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User className="h-4 w-4 mr-2" />
            <span>{course.instructor}</span>
          </div>
        </div>
        {course.isLive && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
            Live
          </span>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{course.schedule}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{course.duration}</span>
        </div>
        {!showJoinButton && (
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Enrolled: {new Date(course.enrolledDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {showProgress && course.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {showJoinButton && course.isLive && (
        <button
          onClick={handleJoinClass}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Join Now</span>
        </button>
      )}
      
      {showJoinButton && !course.isLive && (
        <button
          disabled
          className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Clock className="h-4 w-4" />
          <span>Not Available</span>
        </button>
      )}
    </div>
  );
}